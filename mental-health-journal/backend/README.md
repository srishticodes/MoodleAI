# Mental Health Journal Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the backend root directory with:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   
   MONGODB_URI=mongodb://localhost:27017/mental-health-journal
   
   JWT_SECRET=mental-health-journal-super-secret-key-2024
   JWT_EXPIRE=24h
   
   ENCRYPTION_KEY=my-super-secret-32-character-key
   ```

3. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - The app will automatically create the database and collections

4. **Run the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/companion` - Get companion status

### Journal Entries
- `POST /api/journal` - Create journal entry
- `GET /api/journal` - Get journal entries (with pagination)
- `GET /api/journal/:id` - Get specific journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry
- `GET /api/journal/analytics` - Get mood analytics
- `POST /api/journal/:id/ai-suggestion` - Add AI suggestion

### Features
- JWT Authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Automatic streak tracking
- Virtual companion mood reflection
- Mood analytics and insights
- Tag extraction from journal content

## Models

### User
- Authentication (username, email, password)
- Profile (firstName, age, preferences)
- Streaks (current, longest, lastEntry)
- Companion (type, mood, level)

### Journal Entry
- Content (text, doodle, mood)
- AI suggestions
- Tags (auto-generated and manual)
- Privacy settings
- Word count and sentiment analysis 