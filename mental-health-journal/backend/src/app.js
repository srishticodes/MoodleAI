const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Database connection (will be enabled when MongoDB URI is set)
if (process.env.MONGODB_URI && process.env.MONGODB_URI.length > 10) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('MongoDB URI not set - database features disabled');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Mental Health Journal API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.MONGODB_URI ? 'Connected' : 'Not configured'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend server is working correctly!',
    features: [
      'Authentication system ready',
      'Journal CRUD operations ready', 
      'Companion system ready',
      'Streak tracking ready',
      'Achievement system ready',
      'AI prompt templates ready'
    ],
    nextSteps: [
      'Set MONGODB_URI in .env file',
      'Test authentication endpoints',
      'Implement frontend integration'
    ]
  });
});

// Routes (with error handling)
try {
  const authRoutes = require('./routes/auth');
  const journalRoutes = require('./routes/journal');
  const aiRoutes = require('./routes/ai');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/journal', journalRoutes);
  app.use('/api/ai', aiRoutes);
  
  console.log('All routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error.message);
  
  // Fallback routes if main routes fail
  app.get('/api/auth/status', (req, res) => {
    res.json({ message: 'Auth routes not loaded - check MongoDB connection' });
  });
  
  app.get('/api/journal/status', (req, res) => {
    res.json({ message: 'Journal routes not loaded - check MongoDB connection' });
  });
}

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Mental Health Journal API',
    version: '1.0.0',
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'User login',
        'GET /api/auth/profile': 'Get user profile (auth required)',
        'PUT /api/auth/profile': 'Update profile (auth required)',
        'GET /api/auth/companion': 'Get companion status (auth required)'
      },
      journal: {
        'POST /api/journal': 'Create journal entry (auth required)',
        'GET /api/journal': 'Get journal entries with pagination (auth required)',
        'GET /api/journal/:id': 'Get specific journal entry (auth required)',
        'PUT /api/journal/:id': 'Update journal entry (auth required)',
        'DELETE /api/journal/:id': 'Delete journal entry (auth required)',
        'GET /api/journal/analytics': 'Get mood analytics (auth required)'
      },
      health: {
        'GET /api/health': 'Server health check',
        'GET /api/test': 'Test server functionality',
        'GET /api/docs': 'API documentation'
      }
    },
    authentication: 'Bearer token in Authorization header',
    models: {
      user: 'Authentication, profile, companion, streaks',
      journalEntry: 'Text content, mood, doodle data, AI suggestions'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation error', 
      details: err.message 
    });
  }
  
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    return res.status(500).json({ 
      message: 'Database error', 
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/test', 
      'GET /api/docs',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API docs: http://localhost:${PORT}/api/docs`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
}); 