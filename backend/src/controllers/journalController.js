const JournalEntry = require('../models/JournalEntry');
const User = require('../models/User');

const createEntry = async (req, res) => {
  try {
    const { text, mood, doodle, tags, isPrivate } = req.body;
    const userId = req.user._id;

    if (!text || !mood) {
      return res.status(400).json({ message: 'Text content and mood are required' });
    }

    const entry = new JournalEntry({
      userId,
      content: {
        text,
        mood,
        doodle: doodle || null
      },
      tags: tags || [],
      isPrivate: isPrivate !== undefined ? isPrivate : true
    });

    entry.extractTags();
    await entry.save();

    const user = await User.findById(userId);
    user.updateStreak();
    await user.save();

    const populatedEntry = await JournalEntry.findById(entry._id)
      .populate('userId', 'username profile.firstName');

    res.status(201).json({
      message: 'Journal entry created successfully',
      entry: populatedEntry,
      streakUpdated: user.streaks,
      companionLevelUp: user.companion.level > req.user.companion.level
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ message: 'Server error creating journal entry' });
  }
};

const getEntries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, mood, tag, startDate, endDate } = req.query;

    const query = { userId };

    if (mood) query['content.mood'] = mood;
    if (tag) query.tags = { $in: [tag] };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const entries = await JournalEntry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username profile.firstName');

    const total = await JournalEntry.countDocuments(query);

    res.json({
      entries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEntries: total,
        hasNext: skip + entries.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Server error fetching journal entries' });
  }
};

const getEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const entry = await JournalEntry.findOne({ _id: id, userId })
      .populate('userId', 'username profile.firstName');

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json({ entry });
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({ message: 'Server error fetching journal entry' });
  }
};

const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, mood, doodle, tags, isPrivate } = req.body;
    const userId = req.user._id;

    const entry = await JournalEntry.findOne({ _id: id, userId });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    if (text !== undefined) entry.content.text = text;
    if (mood !== undefined) entry.content.mood = mood;
    if (doodle !== undefined) entry.content.doodle = doodle;
    if (tags !== undefined) entry.tags = tags;
    if (isPrivate !== undefined) entry.isPrivate = isPrivate;

    entry.extractTags();
    await entry.save();

    const populatedEntry = await JournalEntry.findById(entry._id)
      .populate('userId', 'username profile.firstName');

    res.json({
      message: 'Journal entry updated successfully',
      entry: populatedEntry
    });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ message: 'Server error updating journal entry' });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const entry = await JournalEntry.findOneAndDelete({ _id: id, userId });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ message: 'Server error deleting journal entry' });
  }
};

const getMoodAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const moodTrends = await JournalEntry.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            mood: '$content.mood'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          moods: {
            $push: {
              mood: '$_id.mood',
              count: '$count'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const moodDistribution = await JournalEntry.aggregate([
      { $match: { userId: userId, createdAt: { $gte: startDate } } },
      { $group: { _id: '$content.mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const writingFrequency = await JournalEntry.aggregate([
      { $match: { userId: userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          entries: { $sum: 1 },
          totalWords: { $sum: '$wordCount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      moodTrends,
      moodDistribution,
      writingFrequency,
      period: {
        days: parseInt(days),
        startDate,
        endDate: new Date()
      }
    });
  } catch (error) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({ message: 'Server error fetching mood analytics' });
  }
};

const addAISuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, content } = req.body;
    const userId = req.user._id;

    if (!['reflection', 'coping', 'motivation', 'resource'].includes(type)) {
      return res.status(400).json({ message: 'Invalid suggestion type' });
    }

    const entry = await JournalEntry.findOne({ _id: id, userId });

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    entry.addAISuggestion(type, content);
    await entry.save();

    res.json({
      message: 'AI suggestion added successfully',
      suggestion: entry.aiSuggestions[entry.aiSuggestions.length - 1]
    });
  } catch (error) {
    console.error('Add AI suggestion error:', error);
    res.status(500).json({ message: 'Server error adding AI suggestion' });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getMoodAnalytics,
  addAISuggestion
}; 