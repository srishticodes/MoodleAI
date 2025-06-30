import React, { useState, useEffect, useRef } from 'react';
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
import { useAuth } from '../../context/AuthContext';
import VirtualCompanion from '../companion/VirtualCompanion';
import MoodSelector from '../journal/MoodSelector';
import StreakDisplay from '../common/StreakDisplay';
import axios from 'axios';
import JournalCanvas from '../journal/JournalCanvas';

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

  // Add a simple confetti animation for celebration
  const confettiRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  // Add a button in the dashboard header to open the key modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [encryptionKeyInput, setEncryptionKeyInput] = useState(localStorage.getItem('journal_encryption_key') || '');
  const [keySaved, setKeySaved] = useState(false);

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

  // Helper: trigger confetti
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  // Helper: show toast for new achievement
  const showAchievementToast = (achievement) => {
    setNewAchievement(achievement);
    setTimeout(() => setNewAchievement(null), 4000);
  };

  // Optional: simple AES-GCM encryption using Web Crypto API
  async function encryptText(text, keyStr) {
    const enc = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(keyStr.padEnd(32, '0').slice(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(text)
    );
    return {
      data: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
      iv: Array.from(iv)
    };
  }

  // Update handleSaveEntry to optionally encrypt text
  const handleSaveEntry = async ({ text, doodle }) => {
    try {
      let encryptedText = text;
      const encryptionKey = localStorage.getItem('journal_encryption_key') || 'demo_journal_key_1234567890';
      if (window.crypto && window.crypto.subtle) {
        const encrypted = await encryptText(text, encryptionKey);
        encryptedText = JSON.stringify(encrypted);
      }
      const response = await axios.post('/api/journal/entries', {
        text: encryptedText,
        doodle,
        mood: user?.lastMoodEntry || 'neutral',
        isPrivate: true
      });
      setUserStats(stats => ({
        ...stats,
        currentStreak: response.data.streakUpdated?.current || stats.currentStreak,
        totalEntries: stats.totalEntries + 1,
        achievements: response.data.achievements || stats.achievements
      }));
      // Confetti/celebration for streaks
      if (response.data.streakUpdated?.celebrate) triggerConfetti();
      // Toast for new achievement
      if (response.data.newAchievement) showAchievementToast(response.data.newAchievement);
    } catch (error) {
      alert('Failed to save entry.');
    }
  };

  // Add handler for AI chat
  const handleCompanionSend = async (message, callback) => {
    try {
      const response = await axios.post('/api/ai/companion', { message });
      callback(response.data.reply || 'I am here for you!');
    } catch (error) {
      callback('Sorry, I could not process that right now.');
    }
  };

  const handleSaveKey = () => {
    if (encryptionKeyInput.length < 8) {
      alert('Encryption key should be at least 8 characters.');
      return;
    }
    localStorage.setItem('journal_encryption_key', encryptionKeyInput);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
    setShowKeyModal(false);
  };

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

          {/* Encryption Key */}
          <button
            onClick={() => setShowKeyModal(true)}
            className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-semibold border border-yellow-300 hover:bg-yellow-200"
            title="Set/Change Encryption Key"
          >
            Encryption Key
          </button>

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
              onSend={handleCompanionSend}
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
                  <JournalCanvas onSave={handleSaveEntry} />
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
                    {/* Achievements List */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {(userStats.achievements || []).map((ach, idx) => (
                        <div key={ach.id || idx} className="flex flex-col items-center bg-white rounded-xl shadow p-3 border border-purple-100">
                          <span className="text-3xl mb-2">{ach.icon || '🏅'}</span>
                          <span className="font-bold text-purple-700">{ach.name}</span>
                          <span className="text-xs text-gray-500 text-center">{ach.description}</span>
                        </div>
                      ))}
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

      {/* Confetti animation overlay */}
      {showConfetti && (
        <div ref={confettiRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
          {/* Simple confetti effect (could use a library for more advanced) */}
          <div style={{ width: '100%', height: '100%' }}>
            {[...Array(60)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                opacity: 0.8,
                animation: 'fall 2s linear',
              }} />
            ))}
          </div>
          <style>{`@keyframes fall { to { transform: translateY(100vh); opacity: 0; } }`}</style>
        </div>
      )}

      {/* Achievement toast notification */}
      {newAchievement && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 10000 }} className="bg-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
          <span className="text-2xl">{newAchievement.icon || '🏅'}</span>
          <div>
            <div className="font-bold">Achievement Unlocked!</div>
            <div>{newAchievement.name}</div>
            <div className="text-xs text-purple-100">{newAchievement.description}</div>
          </div>
        </div>
      )}

      {/* Modal for setting/changing encryption key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2 text-purple-700">Set Your Journal Encryption Key</h2>
            <p className="text-xs text-gray-500 mb-4">This key is used to encrypt and decrypt your journal entries <b>in your browser</b>. <span className="text-red-500 font-semibold">If you lose this key, you will not be able to read your encrypted entries.</span></p>
            <input
              type="password"
              value={encryptionKeyInput}
              onChange={e => setEncryptionKeyInput(e.target.value)}
              className="w-full border border-purple-200 rounded-lg px-3 py-2 mb-4"
              placeholder="Enter a strong key (min 8 chars)"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >Cancel</button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold"
              >Save Key</button>
            </div>
            {keySaved && <div className="mt-2 text-green-600 text-sm">Key saved!</div>}
          </div>
        </div>
      )}
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