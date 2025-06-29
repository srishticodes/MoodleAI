import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Zap, Sparkles } from 'lucide-react';

const VirtualCompanion = ({ companion, streak, mood }) => {
  const [companionMood, setCompanionMood] = useState('happy');
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Companion data
  const companionTypes = {
    cat: {
      name: 'Whiskers',
      emoji: '🐱',
      happyEmoji: '😸',
      sadEmoji: '😿',
      excitedEmoji: '😻',
      sleepyEmoji: '😴',
      color: 'from-orange-400 to-yellow-500'
    },
    plant: {
      name: 'Sage',
      emoji: '🌱',
      happyEmoji: '🌿',
      sadEmoji: '🥀',
      excitedEmoji: '🌺',
      sleepyEmoji: '🌙',
      color: 'from-green-400 to-emerald-500'
    },
    cloud: {
      name: 'Nimbus',
      emoji: '☁️',
      happyEmoji: '⛅',
      sadEmoji: '🌧️',
      excitedEmoji: '🌈',
      sleepyEmoji: '🌙',
      color: 'from-blue-400 to-cyan-500'
    },
    bunny: {
      name: 'Cotton',
      emoji: '🐰',
      happyEmoji: '🐰',
      sadEmoji: '😢',
      excitedEmoji: '🥕',
      sleepyEmoji: '😴',
      color: 'from-pink-400 to-rose-500'
    },
    bird: {
      name: 'Melody',
      emoji: '🐦',
      happyEmoji: '🐦',
      sadEmoji: '🐦‍⬛',
      excitedEmoji: '🦜',
      sleepyEmoji: '😴',
      color: 'from-purple-400 to-indigo-500'
    }
  };

  const currentCompanion = companionTypes[companion?.type] || companionTypes.cat;

  // Update companion mood based on user's mood and streak
  useEffect(() => {
    if (streak > 7) {
      setCompanionMood('excited');
    } else if (streak > 3) {
      setCompanionMood('happy');
    } else if (mood === 'sad' || mood === 'very-sad') {
      setCompanionMood('sad');
    } else if (mood === 'tired') {
      setCompanionMood('sleepy');
    } else {
      setCompanionMood('happy');
    }
  }, [streak, mood]);

  // Update message based on companion mood and user progress
  useEffect(() => {
    const messages = {
      excited: [
        `🎉 Wow! ${streak} days straight! I'm so proud of you!`,
        "You're absolutely amazing! Keep this energy going! ✨",
        "Look at you being consistent! I'm doing a happy dance! 💃"
      ],
      happy: [
        "You're doing great! I believe in you! 😊",
        "Every entry makes me smile! Keep it up! 🌟",
        "I love spending time with you in this peaceful space! 💕"
      ],
      sad: [
        "It's okay to have tough days. I'm here with you. 🤗",
        "You're brave for writing about how you feel. 💙",
        "Remember, storms pass and rainbows follow. 🌈"
      ],
      sleepy: [
        "Rest is important too. Take care of yourself! 😴",
        "Maybe some gentle thoughts before sleep? 🌙",
        "Your wellbeing matters most. Sweet dreams! ✨"
      ]
    };

    const moodMessages = messages[companionMood] || messages.happy;
    setMessage(moodMessages[Math.floor(Math.random() * moodMessages.length)]);
  }, [companionMood, streak]);

  // Trigger animation when companion mood changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [companionMood]);

  const getCompanionEmoji = () => {
    switch (companionMood) {
      case 'excited': return currentCompanion.excitedEmoji;
      case 'sad': return currentCompanion.sadEmoji;
      case 'sleepy': return currentCompanion.sleepyEmoji;
      default: return currentCompanion.happyEmoji;
    }
  };

  const getCompanionLevel = () => {
    if (streak >= 30) return 5;
    if (streak >= 21) return 4;
    if (streak >= 14) return 3;
    if (streak >= 7) return 2;
    return 1;
  };

  const level = getCompanionLevel();

  return (
    <div className="space-y-6">
      {/* Main Companion Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 text-center"
      >
        {/* Companion Avatar */}
        <motion.div
          animate={isAnimating ? { 
            scale: [1, 1.2, 1], 
            rotate: [0, 10, -10, 0] 
          } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${currentCompanion.color} rounded-full mb-3 shadow-lg`}>
            <span className="text-4xl">{getCompanionEmoji()}</span>
          </div>
          
          {/* Companion Name and Level */}
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {currentCompanion.name}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">Level {level}</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Companion Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-4"
          >
            <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
          </motion.div>
        </AnimatePresence>

        {/* Mood Indicators */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {companionMood === 'excited' && (
            <>
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-gray-600">Excited</span>
            </>
          )}
          {companionMood === 'happy' && (
            <>
              <Heart className="w-4 h-4 text-pink-500" />
              <span className="text-xs text-gray-600">Happy</span>
            </>
          )}
          {companionMood === 'sad' && (
            <>
              <Heart className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600">Caring</span>
            </>
          )}
          {companionMood === 'sleepy' && (
            <>
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-600">Peaceful</span>
            </>
          )}
        </div>

        {/* Progress Bar for Next Level */}
        {level < 5 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Progress to Level {level + 1}</span>
              <span className="text-xs text-gray-500">
                {Math.min(streak % 7, 7)}/7 days
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(streak % 7) * 14.28}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-2 bg-gradient-to-r ${currentCompanion.color} rounded-full`}
              />
            </div>
          </div>
        )}

        {/* Streak Celebration */}
        {streak > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-lg font-bold text-orange-600">{streak}</div>
                <div className="text-xs text-gray-600">Day Streak!</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Companion Care Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-white/50"
      >
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Companion Care
        </h4>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Write daily to keep {currentCompanion.name} happy</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Share your feelings to strengthen your bond</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Maintain streaks to level up together</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Animations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {companionMood === 'excited' && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -60, -100],
                  opacity: [1, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
              
              </motion.div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default VirtualCompanion; 