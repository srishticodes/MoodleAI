const validator = require('validator');

const sanitizeInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return validator.escape(str.trim());
  };

  const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? sanitizeString(item) : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  next();
};

const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.length < 3 || username.length > 20) {
    errors.push('Username must be between 3 and 20 characters');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateJournalEntry = (req, res, next) => {
  const { text, mood } = req.body;
  const errors = [];

  if (!text || text.trim().length === 0) {
    errors.push('Journal entry text is required');
  }

  if (text && text.length > 5000) {
    errors.push('Journal entry text must be less than 5000 characters');
  }

  const validMoods = ['happy', 'sad', 'anxious', 'calm', 'excited', 'angry', 'confused', 'grateful', 'hopeful', 'neutral'];
  if (!mood || !validMoods.includes(mood)) {
    errors.push('Please select a valid mood');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateProfileUpdate = (req, res, next) => {
  const { firstName, age, companionType } = req.body;
  const errors = [];

  if (firstName && firstName.length > 50) {
    errors.push('First name must be less than 50 characters');
  }

  if (age && (age < 13 || age > 120)) {
    errors.push('Age must be between 13 and 120');
  }

  const validCompanionTypes = ['cat', 'plant', 'cloud', 'bunny', 'bird'];
  if (companionType && !validCompanionTypes.includes(companionType)) {
    errors.push('Please select a valid companion type');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = {
  sanitizeInput,
  validateRegistration,
  validateJournalEntry,
  validateProfileUpdate
}; 