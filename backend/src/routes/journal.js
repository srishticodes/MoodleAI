const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getMoodAnalytics,
  addAISuggestion
} = require('../controllers/journalController');

router.post('/', auth, createEntry);
router.get('/', auth, getEntries);
router.get('/analytics', auth, getMoodAnalytics);
router.get('/:id', auth, getEntry);
router.put('/:id', auth, updateEntry);
router.delete('/:id', auth, deleteEntry);
router.post('/:id/ai-suggestion', auth, addAISuggestion);

module.exports = router; 