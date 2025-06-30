const MOOD_TYPES = [
  'happy',
  'sad', 
  'anxious',
  'calm',
  'excited',
  'angry',
  'confused',
  'grateful',
  'hopeful',
  'neutral'
];

const COMPANION_TYPES = [
  'cat',
  'plant', 
  'cloud',
  'bunny',
  'bird'
];

const COMPANION_MOODS = [
  'happy',
  'sad',
  'calm', 
  'anxious',
  'excited',
  'neutral'
];

const SUGGESTION_TYPES = [
  'reflection',
  'coping',
  'motivation',
  'resource'
];

const THEME_TYPES = [
  'pastel',
  'nature',
  'space',
  'ocean'
];

const TAG_KEYWORDS = {
  anxiety: ['anxious', 'worry', 'nervous', 'stress', 'panic'],
  gratitude: ['grateful', 'thankful', 'appreciate', 'blessed'],
  family: ['family', 'mom', 'dad', 'sibling', 'parents'],
  work: ['work', 'job', 'boss', 'colleague', 'meeting'],
  school: ['school', 'exam', 'study', 'homework', 'class'],
  friendship: ['friend', 'friendship', 'social', 'hang out'],
  health: ['health', 'exercise', 'tired', 'energy', 'sleep'],
  relationship: ['relationship', 'partner', 'love', 'date']
};

const VALIDATION_RULES = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  JOURNAL_TEXT_MAX: 5000,
  FIRST_NAME_MAX: 50,
  AGE_MIN: 13,
  AGE_MAX: 120,
  ENCRYPTION_KEY_LENGTH: 32
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};

module.exports = {
  MOOD_TYPES,
  COMPANION_TYPES,
  COMPANION_MOODS,
  SUGGESTION_TYPES,
  THEME_TYPES,
  TAG_KEYWORDS,
  VALIDATION_RULES,
  HTTP_STATUS
}; 