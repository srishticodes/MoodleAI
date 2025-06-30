const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    doodle: {
      type: String,
      default: null
    },
    mood: {
      type: String,
      required: true,
      enum: ['happy', 'sad', 'anxious', 'calm', 'excited', 'angry', 'confused', 'grateful', 'hopeful', 'neutral']
    }
  },
  aiSuggestions: [{
    type: {
      type: String,
      enum: ['reflection', 'coping', 'motivation', 'resource'],
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  wordCount: {
    type: Number,
    default: 0
  },
  sentiment: {
    score: {
      type: Number,
      min: -1,
      max: 1,
      default: 0
    },
    analysis: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral'
    }
  }
}, {
  timestamps: true
});

journalEntrySchema.pre('save', function(next) {
  if (this.content.text) {
    this.wordCount = this.content.text.trim().split(/\s+/).length;
  }
  next();
});

journalEntrySchema.methods.addAISuggestion = function(type, content) {
  this.aiSuggestions.push({
    type,
    content,
    timestamp: new Date()
  });
  
  if (this.aiSuggestions.length > 10) {
    this.aiSuggestions = this.aiSuggestions.slice(-10);
  }
};

journalEntrySchema.methods.extractTags = function() {
  const text = this.content.text.toLowerCase();
  const potentialTags = [];
  
  const keywords = {
    anxiety: ['anxious', 'worry', 'nervous', 'stress', 'panic'],
    gratitude: ['grateful', 'thankful', 'appreciate', 'blessed'],
    family: ['family', 'mom', 'dad', 'sibling', 'parents'],
    work: ['work', 'job', 'boss', 'colleague', 'meeting'],
    school: ['school', 'exam', 'study', 'homework', 'class'],
    friendship: ['friend', 'friendship', 'social', 'hang out'],
    health: ['health', 'exercise', 'tired', 'energy', 'sleep'],
    relationship: ['relationship', 'partner', 'love', 'date']
  };
  
  Object.keys(keywords).forEach(tag => {
    if (keywords[tag].some(keyword => text.includes(keyword))) {
      potentialTags.push(tag);
    }
  });
  
  this.tags = [...new Set([...this.tags, ...potentialTags])];
};

journalEntrySchema.statics.getRecentMoods = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const entries = await this.find({
    userId,
    createdAt: { $gte: startDate }
  }).select('content.mood');
  
  return entries.map(entry => entry.content.mood);
};

journalEntrySchema.statics.getUserStats = async function(userId) {
  const totalEntries = await this.countDocuments({ userId });
  const totalWords = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalWords: { $sum: '$wordCount' } } }
  ]);
  
  const moodDistribution = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$content.mood', count: { $sum: 1 } } }
  ]);
  
  return {
    totalEntries,
    totalWords: totalWords[0]?.totalWords || 0,
    moodDistribution
  };
};

module.exports = mongoose.model('JournalEntry', journalEntrySchema); 