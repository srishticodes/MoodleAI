import React from 'react';
import { motion } from 'framer-motion';

const MoodSelector = ({ selectedMood, onMoodSelect, compact = false }) => {
  const moods = [
    {
      id: 'very-happy',
      emoji: '😄',
      label: 'Very Happy',
      color: 'from-yellow-400 to-orange-400',
      description: 'Fantastic!'
    },
    {
      id: 'happy',
      emoji: '😊',
      label: 'Happy',
      color: 'from-green-400 to-emerald-400',
      description: 'Great'
    },
    {
      id: 'excited',
      emoji: '🤩',
      label: 'Excited',
      color: 'from-purple-400 to-pink-400',
      description: 'Energized'
    },
    {
      id: 'calm',
      emoji: '😌',
      label: 'Calm',
      color: 'from-blue-400 to-cyan-400',
      description: 'Peaceful'
    },
    {
      id: 'neutral',
      emoji: '😐',
      label: 'Neutral',
      color: 'from-gray-400 to-gray-500',
      description: 'Okay'
    },
    {
      id: 'tired',
      emoji: '😴',
      label: 'Tired',
      color: 'from-indigo-400 to-purple-400',
      description: 'Sleepy'
    },
    {
      id: 'anxious',
      emoji: '😰',
      label: 'Anxious',
      color: 'from-yellow-500 to-orange-500',
      description: 'Worried'
    },
    {
      id: 'sad',
      emoji: '😢',
      label: 'Sad',
      color: 'from-blue-500 to-indigo-500',
      description: 'Down'
    },
    {
      id: 'very-sad',
      emoji: '😭',
      label: 'Very Sad',
      color: 'from-blue-600 to-purple-600',
      description: 'Struggling'
    },
    {
      id: 'angry',
      emoji: '😠',
      label: 'Angry',
      color: 'from-red-500 to-pink-500',
      description: 'Frustrated'
    }
  ];

  const handleMoodSelect = (moodId) => {
    onMoodSelect(moodId === selectedMood ? '' : moodId);
  };

  if (compact) {
    return (
      <div className="grid grid-cols-5 gap-2">
        {moods.slice(0, 5).map((mood, index) => (
          <motion.button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`aspect-square p-3 rounded-2xl border-2 transition-all duration-200 ${
              selectedMood === mood.id
                ? 'border-purple-400 bg-purple-50 scale-105'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-xl mb-1">{mood.emoji}</div>
            <div className="text-xs font-medium text-gray-700">{mood.description}</div>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Primary moods - larger buttons */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {moods.slice(0, 5).map((mood, index) => (
          <motion.button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-4 rounded-3xl border-2 transition-all duration-200 group ${
              selectedMood === mood.id
                ? 'border-purple-400 shadow-lg transform scale-105'
                : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
            }`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-10 rounded-3xl transition-opacity group-hover:opacity-20 ${
              selectedMood === mood.id ? 'opacity-25' : ''
            }`} />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className="text-sm font-medium text-gray-800">{mood.label}</div>
            </div>

            {/* Selected indicator */}
            {selectedMood === mood.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Secondary moods - smaller buttons */}
      <div className="grid grid-cols-5 gap-2">
        {moods.slice(5).map((mood, index) => (
          <motion.button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 5) * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-3 rounded-2xl border-2 transition-all duration-200 group ${
              selectedMood === mood.id
                ? 'border-purple-400 bg-purple-50 shadow-md'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-10 rounded-2xl transition-opacity group-hover:opacity-20 ${
              selectedMood === mood.id ? 'opacity-25' : ''
            }`} />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="text-xl mb-1">{mood.emoji}</div>
              <div className="text-xs font-medium text-gray-700">{mood.description}</div>
            </div>

            {/* Selected indicator */}
            {selectedMood === mood.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected mood display */}
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
        >
          <span className="text-2xl">
            {moods.find(m => m.id === selectedMood)?.emoji}
          </span>
          <div>
            <div className="font-semibold text-gray-800">
              Feeling {moods.find(m => m.id === selectedMood)?.label}
            </div>
            <div className="text-sm text-gray-600">
              Your emotions are valid and important ✨
            </div>
          </div>
        </motion.div>
      )}

      {/* Mood description */}
      <div className="text-center text-sm text-gray-500">
        Tap to select how you're feeling right now. You can change this anytime.
      </div>
    </div>
  );
};

export default MoodSelector; 