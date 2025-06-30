const { generateEncouragingMessage } = require('../utils/helpers');

class AchievementService {
  constructor() {
    this.achievements = {
      // Writing streaks
      'first-entry': {
        name: 'First Steps',
        description: 'Wrote your very first journal entry',
        icon: '🌟',
        type: 'milestone',
        requirement: { type: 'entries', count: 1 }
      },
      'week-warrior': {
        name: 'Week Warrior',
        description: 'Journaled for 7 days in a row',
        icon: '🔥',
        type: 'streak',
        requirement: { type: 'streak', count: 7 }
      },
      'month-master': {
        name: 'Month Master',
        description: 'Maintained a 30-day journaling streak',
        icon: '👑',
        type: 'streak',
        requirement: { type: 'streak', count: 30 }
      },
      'century-scholar': {
        name: 'Century Scholar',
        description: 'Incredible! 100 days of journaling',
        icon: '💎',
        type: 'streak',
        requirement: { type: 'streak', count: 100 }
      },
      
      // Word count achievements
      'wordsmith': {
        name: 'Wordsmith',
        description: 'Wrote over 1000 words in total',
        icon: '📝',
        type: 'milestone',
        requirement: { type: 'totalWords', count: 1000 }
      },
      'novelist': {
        name: 'Novelist',
        description: 'Reached 10,000 words across all entries',
        icon: '📚',
        type: 'milestone',
        requirement: { type: 'totalWords', count: 10000 }
      },
      
      // Mood tracking achievements
      'emotion-explorer': {
        name: 'Emotion Explorer',
        description: 'Logged 5 different moods',
        icon: '🎭',
        type: 'variety',
        requirement: { type: 'uniqueMoods', count: 5 }
      },
      'gratitude-guru': {
        name: 'Gratitude Guru',
        description: 'Expressed gratitude in 10 entries',
        icon: '🙏',
        type: 'mood',
        requirement: { type: 'moodCount', mood: 'grateful', count: 10 }
      },
      'calm-collector': {
        name: 'Calm Collector',
        description: 'Found calm in 15 journal sessions',
        icon: '🧘',
        type: 'mood',
        requirement: { type: 'moodCount', mood: 'calm', count: 15 }
      },
      
      // Companion achievements
      'companion-bond': {
        name: 'Companion Bond',
        description: 'Your companion reached level 3',
        icon: '💕',
        type: 'companion',
        requirement: { type: 'companionLevel', level: 3 }
      },
      'companion-master': {
        name: 'Companion Master',
        description: 'Your companion reached maximum level',
        icon: '🌈',
        type: 'companion',
        requirement: { type: 'companionLevel', level: 10 }
      },
      
      // Special achievements
      'night-owl': {
        name: 'Night Owl',
        description: 'Journaled after 10 PM',
        icon: '🦉',
        type: 'special',
        requirement: { type: 'timeOfDay', hour: 22 }
      },
      'early-bird': {
        name: 'Early Bird',
        description: 'Journaled before 6 AM',
        icon: '🐦',
        type: 'special',
        requirement: { type: 'timeOfDay', hour: 6 }
      },
      'reflection-master': {
        name: 'Reflection Master',
        description: 'Used 50 AI suggestions',
        icon: '🤖',
        type: 'ai',
        requirement: { type: 'aiSuggestions', count: 50 }
      }
    };
  }

  checkNewAchievements(user, stats) {
    const newAchievements = [];
    const userAchievements = user.achievements || [];

    for (const [achievementId, achievement] of Object.entries(this.achievements)) {
      // Skip if user already has this achievement
      if (userAchievements.includes(achievementId)) continue;

      // Check if achievement requirement is met
      if (this.isAchievementUnlocked(achievement, user, stats)) {
        newAchievements.push({
          id: achievementId,
          ...achievement,
          unlockedAt: new Date()
        });
      }
    }

    return newAchievements;
  }

  isAchievementUnlocked(achievement, user, stats) {
    const { requirement } = achievement;

    switch (requirement.type) {
      case 'entries':
        return stats.totalEntries >= requirement.count;
      
      case 'streak':
        return user.streaks.current >= requirement.count;
      
      case 'totalWords':
        return stats.totalWords >= requirement.count;
      
      case 'uniqueMoods':
        return stats.uniqueMoods?.length >= requirement.count;
      
      case 'moodCount':
        const moodStats = stats.moodDistribution?.find(m => m._id === requirement.mood);
        return moodStats?.count >= requirement.count;
      
      case 'companionLevel':
        return user.companion.level >= requirement.level;
      
      case 'timeOfDay':
        return stats.hasJournaledAt?.[requirement.hour] === true;
      
      case 'aiSuggestions':
        return stats.totalAISuggestions >= requirement.count;
      
      default:
        return false;
    }
  }

  getAchievementProgress(achievementId, user, stats) {
    const achievement = this.achievements[achievementId];
    if (!achievement) return null;

    const { requirement } = achievement;
    let current = 0;
    let target = requirement.count || requirement.level;

    switch (requirement.type) {
      case 'entries':
        current = stats.totalEntries;
        break;
      case 'streak':
        current = user.streaks.current;
        break;
      case 'totalWords':
        current = stats.totalWords;
        break;
      case 'uniqueMoods':
        current = stats.uniqueMoods?.length || 0;
        break;
      case 'moodCount':
        const moodStats = stats.moodDistribution?.find(m => m._id === requirement.mood);
        current = moodStats?.count || 0;
        break;
      case 'companionLevel':
        current = user.companion.level;
        break;
      default:
        return null;
    }

    return {
      current,
      target,
      percentage: Math.min((current / target) * 100, 100),
      completed: current >= target
    };
  }

  generateCelebrationMessage(achievement) {
    const messages = [
      `Congratulations! You've unlocked the "${achievement.name}" achievement!`,
      `Amazing work! You earned the "${achievement.name}" badge!`,
      `Well done! The "${achievement.name}" achievement is now yours!`,
      `Fantastic! You've achieved "${achievement.name}"!`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  getCompanionReaction(achievementType) {
    const reactions = {
      streak: ['so proud of you!', 'you\'re on fire!', 'amazing consistency!'],
      milestone: ['what an achievement!', 'you\'re incredible!', 'so inspiring!'],
      mood: ['beautiful emotional growth!', 'your feelings matter!', 'such self-awareness!'],
      companion: ['our bond grows stronger!', 'we make a great team!', 'level up together!']
    };
    
    const typeReactions = reactions[achievementType] || reactions.milestone;
    return typeReactions[Math.floor(Math.random() * typeReactions.length)];
  }

  getUpcomingAchievements(user, stats, limit = 3) {
    const upcoming = [];
    
    for (const [achievementId, achievement] of Object.entries(this.achievements)) {
      const userAchievements = user.achievements || [];
      if (userAchievements.includes(achievementId)) continue;
      
      const progress = this.getAchievementProgress(achievementId, user, stats);
      if (progress && progress.percentage > 0 && progress.percentage < 100) {
        upcoming.push({
          id: achievementId,
          ...achievement,
          progress
        });
      }
    }
    
    return upcoming
      .sort((a, b) => b.progress.percentage - a.progress.percentage)
      .slice(0, limit);
  }
}

module.exports = AchievementService; 