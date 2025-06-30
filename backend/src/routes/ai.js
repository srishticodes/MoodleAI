const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

router.get('/health', (req, res) => {
  res.json({ 
    message: 'AI service ready for future integration',
    features: ['Browser-based AI with Transformers.js', 'Future server-side AI fallback']
  });
});

router.post('/generate-suggestion', auth, (req, res) => {
  res.json({
    message: 'AI suggestions are currently handled client-side for privacy and reliability',
    suggestion: 'Use the browser-based AI in the frontend for real-time suggestions'
  });
});

module.exports = router; 