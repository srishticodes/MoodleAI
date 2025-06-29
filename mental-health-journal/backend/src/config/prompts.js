const MENTAL_HEALTH_PROMPTS = {
  // Reflection prompts based on mood
  reflection: {
    happy: [
      "What specific moment today brought you the most joy? How can you create more moments like this?",
      "Your happiness is wonderful! What do you think contributed to this positive feeling?",
      "It's beautiful to see you feeling happy. What would you like to remember about today?"
    ],
    sad: [
      "I notice you're feeling sad. Would you like to explore what might be contributing to these feelings?",
      "It's okay to feel sad sometimes. What would bring you a small bit of comfort right now?",
      "Your feelings are valid. Is there something specific weighing on your heart today?"
    ],
    anxious: [
      "I can sense your anxiety. Let's take this one step at a time. What's one thing that feels manageable right now?",
      "Anxiety can feel overwhelming. What would help you feel just a little bit safer in this moment?",
      "You're not alone in feeling anxious. What's one small thing you can control in this situation?"
    ],
    calm: [
      "I love that you're feeling calm. What helped you find this peaceful state?",
      "This sense of calm is precious. How might you cultivate more moments like this?",
      "Your inner peace shines through. What wisdom does this calm feeling offer you?"
    ],
    grateful: [
      "Gratitude is such a healing practice. What else in your life brings you appreciation?",
      "Your grateful heart is beautiful. How has this gratitude changed your perspective today?",
      "Thank you for sharing your gratitude. What small blessing surprised you recently?"
    ]
  },

  // Coping strategy suggestions
  coping: {
    stress: [
      "Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. Repeat 3 times.",
      "Ground yourself by naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
      "Take a 5-minute walk, even if it's just around your room. Movement can help shift your energy."
    ],
    overwhelm: [
      "Break down your tasks into tiny, manageable steps. What's the smallest thing you can do right now?",
      "It's okay to ask for help. Who in your life might be able to support you today?",
      "Remember: you don't have to do everything at once. What's the most important thing for today?"
    ],
    sadness: [
      "Allow yourself to feel this sadness - it's a valid emotion. What would comfort you right now?",
      "Consider reaching out to a trusted friend or family member. Connection can help with difficult feelings.",
      "Practice self-compassion. What would you say to a good friend feeling the way you do?"
    ],
    anxiety: [
      "Try progressive muscle relaxation: tense and release each muscle group, starting from your toes.",
      "Focus on what you can control right now. Make a list of 3 things within your power.",
      "Use the STOP technique: Stop, Take a breath, Observe your thoughts, Proceed mindfully."
    ]
  },

  // Motivational messages
  motivation: {
    streak: [
      "You're building such a beautiful habit of self-reflection. Every entry matters.",
      "Your commitment to understanding yourself is inspiring. Keep going!",
      "Each day you journal is a gift to your future self. You're doing amazing."
    ],
    growth: [
      "I can see your emotional growth through your writing. You're becoming more self-aware.",
      "The way you're processing your experiences shows real wisdom and maturity.",
      "Your willingness to explore your feelings is a sign of strength, not weakness."
    ],
    difficult_times: [
      "You're navigating challenging times with such courage. That takes real strength.",
      "Even in difficult moments, you're choosing to reflect and grow. That's remarkable.",
      "Your resilience shines through your words. You're stronger than you know."
    ]
  },

  // Resource suggestions
  resources: {
    professional_help: [
      "If these feelings persist or feel overwhelming, consider speaking with a counselor or therapist.",
      "Remember that seeking professional support is a sign of strength and self-care.",
      "Your mental health matters. Don't hesitate to reach out to a mental health professional if needed."
    ],
    crisis: [
      "If you're having thoughts of self-harm, please reach out immediately to a crisis helpline or emergency services.",
      "You matter and you're not alone. Crisis Text Line: Text HOME to 741741",
      "Please consider contacting the National Suicide Prevention Lifeline: 988"
    ],
    self_care: [
      "Remember to take care of your basic needs: sleep, nutrition, and hydration.",
      "Consider incorporating mindfulness or meditation into your daily routine.",
      "Physical activity, even gentle movement, can support your mental wellbeing."
    ]
  },

  // System prompts for AI responses
  system: {
    guidelines: `You are a compassionate AI mental health companion. Your role is to:
- Provide supportive, non-judgmental responses
- Suggest evidence-based coping strategies  
- Encourage healthy self-reflection
- Recognize when professional help may be needed
- Use warm, empathetic language
- Focus on strengths and resilience
- Promote self-care and healthy habits

Guidelines:
- Never provide medical advice or diagnosis
- Always encourage professional help for serious concerns
- Keep responses under 150 words
- Be culturally sensitive and inclusive
- Validate emotions while offering hope`,

    safety_keywords: [
      'suicide', 'kill myself', 'end it all', 'self-harm', 'hurt myself',
      'not worth living', 'give up', 'hopeless', 'cut myself'
    ],

    crisis_response: `I'm concerned about what you've shared. Your life has value and you matter. Please consider reaching out for immediate support:
- Crisis Text Line: Text HOME to 741741
- National Suicide Prevention Lifeline: 988
- Emergency services: 911
You don't have to go through this alone.`
  }
};

const generateContextualPrompt = (mood, content, userHistory = {}) => {
  const reflectionPrompts = MENTAL_HEALTH_PROMPTS.reflection[mood] || MENTAL_HEALTH_PROMPTS.reflection.calm;
  const selectedPrompt = reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
  
  return `${MENTAL_HEALTH_PROMPTS.system.guidelines}

User's current mood: ${mood}
User's journal entry: "${content}"

Respond with empathy and provide a thoughtful reflection question. ${selectedPrompt}`;
};

const getCopingStrategy = (detectedEmotion) => {
  const strategies = MENTAL_HEALTH_PROMPTS.coping[detectedEmotion] || MENTAL_HEALTH_PROMPTS.coping.stress;
  return strategies[Math.floor(Math.random() * strategies.length)];
};

const getMotivationalMessage = (context) => {
  let category = 'growth';
  if (context.streak >= 7) category = 'streak';
  if (context.difficultMood) category = 'difficult_times';
  
  const messages = MENTAL_HEALTH_PROMPTS.motivation[category];
  return messages[Math.floor(Math.random() * messages.length)];
};

const checkForCrisisKeywords = (text) => {
  const lowerText = text.toLowerCase();
  return MENTAL_HEALTH_PROMPTS.system.safety_keywords.some(keyword => 
    lowerText.includes(keyword)
  );
};

module.exports = {
  MENTAL_HEALTH_PROMPTS,
  generateContextualPrompt,
  getCopingStrategy,
  getMotivationalMessage,
  checkForCrisisKeywords
}; 