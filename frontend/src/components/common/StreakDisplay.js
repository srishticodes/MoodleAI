import React from 'react';
import { motion } from 'framer-motion';

const StreakDisplay = ({ streak }) => {
  const getStreakLevel = () => {
    if (streak >= 30) return { level: 'legendary', color: 'from-purple-500 to-pink-500', emoji: '👑' };
    if (streak >= 21) return { level: 'amazing', color: 'from-yellow-500 to-red-500', emoji: '🔥' };
    if (streak >= 14) return { level: 'great', color: 'from-orange-500 to-red-500', emoji: '🔥' };
    if (streak >= 7) return { level: 'good', color: 'from-yellow-400 to-orange-500', emoji: '⚡' };
    if (streak >= 3) return { level: 'building', color: 'from-green-400 to-yellow-400', emoji: '🌱' };
    if (streak >= 1) return { level: 'starting', color: 'from-blue-400 to-green-400', emoji: '✨' };
    return { level: 'beginning', color: 'from-gray-400 to-gray-500', emoji: '🌟' };
  };

  const streakInfo = getStreakLevel();

  const getMotivationalMessage = () => {
    if (streak === 0) return "Start your journey today!";
    if (streak === 1) return "Great start! 🎉";
    if (streak < 7) return "Keep it going! 💪";
    if (streak < 14) return "You're on fire! 🔥";
    if (streak < 21) return "Incredible consistency! ⭐";
    if (streak < 30) return "You're a journaling champion! 🏆";
    return "Legendary dedication! 👑";
  };

  return (
    <div className="text-center">
      {/* Main streak display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${streakInfo.color} text-white rounded-2xl shadow-lg`}
      >
        {/* Animated emoji */}
        <motion.span
          animate={streak > 0 ? {
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="text-lg"
        >
          {streakInfo.emoji}
        </motion.span>
        
        {/* Streak number */}
        <motion.span
          key={streak}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold"
        >
          {streak}
        </motion.span>
        
        <span className="text-sm font-medium">
          {streak === 1 ? 'day' : 'days'}
        </span>
      </motion.div>

      {/* Motivational message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-gray-600 mt-2"
      >
        {getMotivationalMessage()}
      </motion.p>

      {/* Streak level indicator */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2"
        >
          <div className={`inline-block px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${streakInfo.color} rounded-full`}>
            {streakInfo.level.charAt(0).toUpperCase() + streakInfo.level.slice(1)} Streak!
          </div>
        </motion.div>
      )}

      {/* Floating fire particles for high streaks */}
      {streak >= 7 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, -30, -50],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
              }}
            >
              🔥
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreakDisplay; 