const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

const calculateDaysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

const generateUsername = (email) => {
  return email.split('@')[0].toLowerCase() + Math.floor(Math.random() * 1000);
};

const calculateStreakLevel = (currentStreak) => {
  return Math.min(10, Math.floor(currentStreak / 7) + 1);
};

const getMoodEmoji = (mood) => {
  const moodEmojis = {
    happy: '😊',
    sad: '😢', 
    anxious: '😰',
    calm: '😌',
    excited: '🤩',
    angry: '😠',
    confused: '😕',
    grateful: '🙏',
    hopeful: '🌟',
    neutral: '😐'
  };
  return moodEmojis[mood] || '😐';
};

const getCompanionEmoji = (companionType) => {
  const companionEmojis = {
    cat: '🐱',
    plant: '🌱',
    cloud: '☁️',
    bunny: '🐰',
    bird: '🐦'
  };
  return companionEmojis[companionType] || '🐱';
};

const generateEncouragingMessage = (streak, mood) => {
  const streakMessages = {
    1: "Great start! You've begun your journaling journey.",
    3: "Amazing! Three days of reflection in a row.",
    7: "Incredible! A whole week of journaling!",
    14: "Fantastic! Two weeks of consistent self-reflection.",
    30: "Outstanding! A full month of journaling!",
    100: "Legendary! 100 days of self-discovery!"
  };
  
  const moodMessages = {
    happy: "Your positive energy is contagious!",
    grateful: "Gratitude is a beautiful practice.",
    calm: "Your inner peace is inspiring.",
    hopeful: "Hope is a powerful force for healing."
  };
  
  return streakMessages[streak] || moodMessages[mood] || "Keep up the great work with your journaling!";
};

const formatWordCount = (wordCount) => {
  if (wordCount < 1000) return `${wordCount} words`;
  return `${(wordCount / 1000).toFixed(1)}k words`;
};

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  formatDate,
  calculateDaysBetween,
  isValidEmail,
  sanitizeString,
  generateUsername,
  calculateStreakLevel,
  getMoodEmoji,
  getCompanionEmoji,
  generateEncouragingMessage,
  formatWordCount,
  getTimeGreeting,
  shuffleArray,
  delay
}; 