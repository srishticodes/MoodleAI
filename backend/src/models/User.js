const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    age: {
      type: Number,
      min: 13,
      max: 120
    },
    preferences: {
      reminderTime: {
        type: String,
        default: '20:00'
      },
      companionName: {
        type: String,
        default: 'Buddy'
      },
      theme: {
        type: String,
        enum: ['pastel', 'nature', 'space', 'ocean'],
        default: 'pastel'
      }
    }
  },
  streaks: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastEntry: {
      type: Date,
      default: null
    }
  },
  companion: {
    type: {
      type: String,
      enum: ['cat', 'plant', 'cloud', 'bunny', 'bird'],
      default: 'cat'
    },
    mood: {
      type: String,
      enum: ['happy', 'sad', 'calm', 'anxious', 'excited', 'neutral'],
      default: 'neutral'
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateStreak = function() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (!this.streaks.lastEntry) {
    this.streaks.current = 1;
  } else {
    const lastEntryDate = new Date(this.streaks.lastEntry);
    const diffDays = Math.floor((today - lastEntryDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      this.streaks.current += 1;
    } else if (diffDays > 1) {
      this.streaks.current = 1;
    }
  }
  
  this.streaks.lastEntry = today;
  this.streaks.longest = Math.max(this.streaks.longest, this.streaks.current);
  
  this.companion.level = Math.min(10, Math.floor(this.streaks.current / 7) + 1);
};

userSchema.methods.updateCompanionMood = function(recentMoods) {
  if (!recentMoods || recentMoods.length === 0) {
    this.companion.mood = 'neutral';
    return;
  }
  
  const moodCounts = recentMoods.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});
  
  this.companion.mood = Object.keys(moodCounts).reduce((a, b) => 
    moodCounts[a] > moodCounts[b] ? a : b
  );
};

module.exports = mongoose.model('User', userSchema); 