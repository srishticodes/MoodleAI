const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');
const { generateToken } = require('../middleware/auth');

const register = async (req, res) => {
  try {
    const { username, email, password, firstName, age, companionType } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    const user = new User({
      username,
      email,
      password,
      profile: {
        firstName: firstName || '',
        age: age || null
      },
      companion: {
        type: companionType || 'cat',
        mood: 'neutral',
        level: 1
      }
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        companion: user.companion,
        streaks: user.streaks
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const recentMoods = await JournalEntry.getRecentMoods(user._id);
    user.updateCompanionMood(recentMoods);
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        companion: user.companion,
        streaks: user.streaks
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const stats = await JournalEntry.getUserStats(user._id);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        companion: user.companion,
        streaks: user.streaks
      },
      stats
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, age, preferences, companionType, companionName } = req.body;
    const user = req.user;

    if (firstName !== undefined) user.profile.firstName = firstName;
    if (age !== undefined) user.profile.age = age;
    if (preferences) {
      if (preferences.reminderTime) user.profile.preferences.reminderTime = preferences.reminderTime;
      if (preferences.theme) user.profile.preferences.theme = preferences.theme;
    }
    if (companionType) user.companion.type = companionType;
    if (companionName) user.profile.preferences.companionName = companionName;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        companion: user.companion,
        streaks: user.streaks
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

const getCompanionStatus = async (req, res) => {
  try {
    const user = req.user;
    const recentMoods = await JournalEntry.getRecentMoods(user._id, 3);
    
    user.updateCompanionMood(recentMoods);
    await user.save();

    res.json({
      companion: user.companion,
      companionName: user.profile.preferences.companionName,
      streaks: user.streaks,
      recentMoodTrend: recentMoods
    });
  } catch (error) {
    console.error('Get companion status error:', error);
    res.status(500).json({ message: 'Server error fetching companion status' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getCompanionStatus
}; 