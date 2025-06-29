import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  Heart, 
  Sparkles, 
  Moon, 
  Sun, 
  Cloud, 
  Smile,
  LogOut,
  Calendar,
  TrendingUp,
  Star
} from 'lucide-react';
import { useAuth } from '../../App';
import VirtualCompanion from '../companion/VirtualCompanion';
import JournalEditor from '../journal/JournalEditor';
import MoodSelector from '../journal/MoodSelector';
import StreakDisplay from '../common/StreakDisplay';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('journal');
  const [userStats, setUserStats] = useState({
    currentStreak: 0,
    totalEntries: 0,
    achievements: []
  });
  const [recentEntries, setRecentEntries] = useState([]);
  const [companion, setCompanion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user profile and companion
        const profileResponse = await axios.get('/api/auth/profile');
        setCompanion(profileResponse.data.user.companion);
        
        // Fetch journal entries
        const entriesResponse = await axios.get('/api/journal/entries?limit=5');
        setRecentEntries(entriesResponse.data.entries || []);
        
        // Fetch analytics
        const analyticsResponse = await axios.get('/api/journal/analytics');
        setUserStats(analyticsResponse.data);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun };
    if (hour < 17) return { text: 'Good Afternoon', icon: Sun };
    return { text: 'Good Evening', icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading your peaceful space...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-white/50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Greeting */}
          <div className="flex items-center space-x-3">
            <GreetingIcon className="w-6 h-6 text-yellow-500" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {greeting.text}, {user?.name}! 
              </h1>
              <p className="text-sm text-gray-600">How are you feeling today?</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <StreakDisplay streak={userStats.currentStreak} />
            
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{userStats.totalEntries}</div>
              <div className="text-xs text-gray-500">Entries</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-pink-600">{userStats.achievements?.length || 0}</div>
              <div className="text-xs text-gray-500">Achievements</div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors text-gray-700"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Virtual Companion - Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <VirtualCompanion 
              companion={companion} 
              streak={userStats.currentStreak}
              mood={user?.lastMoodEntry}
            />
          </motion.div>

          {/* Main Journal Area */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-2xl">
              {[
                { id: 'journal', label: 'Write', icon: PenTool },
                { id: 'entries', label: 'Entries', icon: Calendar },
                { id: 'insights', label: 'Insights', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentView(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                      currentView === tab.id
                        ? 'bg-white shadow-md text-purple-600'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              {currentView === 'journal' && (
                <motion.div
                  key="journal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <JournalEditor onSave={(entry) => {
                    setRecentEntries(prev => [entry, ...prev.slice(0, 4)]);
                    setUserStats(prev => ({
                      ...prev,
                      totalEntries: prev.totalEntries + 1
                    }));
                  }} />
                </motion.div>
              )}

              {currentView === 'entries' && (
                <motion.div
                  key="entries"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      Recent Entries
                    </h3>
                    
                    {recentEntries.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Cloud className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No entries yet. Start writing your first entry!</p>
                        <button
                          onClick={() => setCurrentView('journal')}
                          className="mt-4 px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all"
                        >
                          Write Now ✨
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentEntries.map((entry, index) => (
                          <motion.div
                            key={entry._id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-purple-100"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-purple-600">
                                {new Date(entry.createdAt).toLocaleDateString()}
                              </span>
                              {entry.mood && (
                                <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm line-clamp-2">
                              {entry.content?.slice(0, 150)}...
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentView === 'insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                      Your Journey Insights
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Heart className="w-5 h-5 text-pink-500" />
                          <span className="font-medium text-gray-800">Streak Power</span>
                        </div>
                        <p className="text-2xl font-bold text-pink-600">{userStats.currentStreak} days</p>
                        <p className="text-sm text-gray-600">Keep it going! 🔥</p>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Star className="w-5 h-5 text-purple-500" />
                          <span className="font-medium text-gray-800">Achievements</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">{userStats.achievements?.length || 0}</p>
                        <p className="text-sm text-gray-600">Unlocked badges 🏆</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
                      <p className="text-center text-gray-700">
                        <Sparkles className="w-5 h-5 inline mr-2 text-yellow-500" />
                        You're on a wonderful journey of self-discovery!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Sidebar - Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Mood Quick Selector */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Smile className="w-5 h-5 text-yellow-500" />
                How are you feeling?
              </h3>
              <MoodSelector 
                onMoodSelect={(mood) => {
                  // Handle mood selection
                  console.log('Selected mood:', mood);
                }}
                compact={true}
              />
            </div>

            {/* Daily Affirmation */}
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-6 border border-white/50">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Daily Affirmation
              </h3>
              <p className="text-gray-700 text-center italic">
                "You are capable of amazing things. Take it one day at a time. 💜"
              </p>
            </div>

            {/* Mobile Stats */}
            <div className="md:hidden bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-purple-600">{userStats.currentStreak}</div>
                  <div className="text-xs text-gray-500">Day Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-pink-600">{userStats.totalEntries}</div>
                  <div className="text-xs text-gray-500">Entries</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-indigo-600">{userStats.achievements?.length || 0}</div>
                  <div className="text-xs text-gray-500">Badges</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Helper function for mood emojis
const getMoodEmoji = (mood) => {
  const moodEmojis = {
    'very-happy': '😄',
    'happy': '😊',
    'neutral': '😐',
    'sad': '😢',
    'very-sad': '😭',
    'anxious': '😰',
    'calm': '😌',
    'excited': '🤩',
    'tired': '😴',
    'angry': '😠'
  };
  return moodEmojis[mood] || '😊';
};

export default Dashboard; 