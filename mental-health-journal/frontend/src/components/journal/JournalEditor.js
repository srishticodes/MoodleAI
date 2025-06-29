import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Sparkles, 
  Heart, 
  Lightbulb,
  RefreshCw,
  Send,
  Smile,
  BookOpen
} from 'lucide-react';
import axios from 'axios';
import MoodSelector from './MoodSelector';

const JournalEditor = ({ onSave }) => {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Therapeutic prompts based on mood
  const prompts = {
    'very-happy': [
      "What made today so wonderful? Let's capture these beautiful moments! ✨",
      "Describe the joy you're feeling - what does happiness look like for you today?",
      "What are you most grateful for in this moment of happiness?"
    ],
    'happy': [
      "What brought a smile to your face today? 😊",
      "Share something positive that happened recently.",
      "How did you create or find joy today?"
    ],
    'neutral': [
      "How are you feeling right now? Let's explore what's on your mind.",
      "What's been occupying your thoughts today?",
      "Describe your day - the ordinary moments matter too."
    ],
    'sad': [
      "It's okay to feel sad. What's weighing on your heart today? 💙",
      "Sometimes writing helps us process difficult emotions. What's troubling you?",
      "You're not alone in this feeling. What support do you need right now?"
    ],
    'very-sad': [
      "I'm here with you through this difficult time. What would help you feel a little better? 🤗",
      "Your feelings are valid. What's been the hardest part of today?",
      "Remember: this feeling is temporary. What gives you even the smallest bit of hope?"
    ],
    'anxious': [
      "Let's take a deep breath together. What's making you feel anxious right now? 🌸",
      "Sometimes naming our worries helps. What's on your mind?",
      "What would make you feel more grounded and calm?"
    ],
    'calm': [
      "This peaceful feeling is beautiful. What's helping you feel so centered? 🌿",
      "Describe this sense of calm - how does it feel in your body and mind?",
      "What practices or thoughts brought you this tranquility?"
    ],
    'excited': [
      "Your excitement is wonderful! What's got you feeling so energized? 🎉",
      "Tell me about what you're looking forward to!",
      "How does this excitement feel, and what's inspiring it?"
    ],
    'tired': [
      "Rest is so important. What's been draining your energy lately? 😴",
      "Sometimes tiredness tells us what we need. What would restore you?",
      "Be gentle with yourself today. What small comfort would help?"
    ],
    'angry': [
      "Anger often signals something important. What's bothering you? 🔥",
      "It's okay to feel angry. What triggered this emotion?",
      "How can you honor this feeling while also caring for yourself?"
    ]
  };

  const defaultPrompts = [
    "How are you feeling today? Let's explore what's on your mind and heart.",
    "What's been the most meaningful part of your day so far?",
    "Describe a moment today when you felt most like yourself.",
    "What thoughts or feelings would you like to release or explore?",
    "What are you grateful for right now, big or small?"
  ];

  // Update word count when content changes
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  // Get current prompt based on mood
  const getCurrentPrompts = () => {
    if (selectedMood && prompts[selectedMood]) {
      return prompts[selectedMood];
    }
    return defaultPrompts;
  };

  // Generate AI suggestion (placeholder for now)
  const generateAISuggestion = async () => {
    setIsGeneratingAI(true);
    try {
      // This would normally call your AI service
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const suggestions = [
        "Consider exploring how this feeling connects to your values and what matters most to you.",
        "What would you tell a dear friend experiencing the same situation?",
        "Notice any patterns in your thoughts - are there themes that keep coming up?",
        "How might this experience be teaching you something about yourself?",
        "What small step could you take today to honor how you're feeling?"
      ];
      
      setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    } catch (error) {
      console.error('Error generating AI suggestion:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Save journal entry
  const handleSave = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const entryData = {
        content: content.trim(),
        mood: selectedMood,
        wordCount,
        tags: [], // Could extract keywords here
        aiSuggestion: aiSuggestion
      };

      const response = await axios.post('/api/journal/entries', entryData);
      
      if (onSave) {
        onSave(response.data.entry);
      }

      // Reset form
      setContent('');
      setSelectedMood('');
      setAiSuggestion('');
      setWordCount(0);
      setShowPrompts(true);

      // Success feedback could be added here
      
    } catch (error) {
      console.error('Error saving journal entry:', error);
      // Error handling could be added here
    } finally {
      setIsLoading(false);
    }
  };

  const currentPrompts = getCurrentPrompts();
  const randomPrompt = currentPrompts[Math.floor(Math.random() * currentPrompts.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-800">Your Journal</h2>
        </div>
        <div className="text-sm text-gray-500">
          {wordCount} words
        </div>
      </div>

      {/* Main Editor Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 overflow-hidden">
        
        {/* Mood Selection */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Smile className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-800">How are you feeling?</h3>
          </div>
          <MoodSelector 
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
        </div>

        {/* Writing Prompts */}
        <AnimatePresence>
          {showPrompts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold text-gray-800">Writing Prompt</h4>
                </div>
                <button
                  onClick={() => setShowPrompts(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Hide
                </button>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                {randomPrompt}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                New prompt
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Editor */}
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={showPrompts ? "Start writing your thoughts..." : randomPrompt}
            className="w-full h-64 p-4 border-0 resize-none focus:outline-none bg-transparent text-gray-800 placeholder-gray-400 text-lg leading-relaxed"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>

        {/* AI Suggestion Section */}
        {content.length > 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h4 className="font-semibold text-gray-800">AI Reflection</h4>
              </div>
              {!aiSuggestion && (
                <button
                  onClick={generateAISuggestion}
                  disabled={isGeneratingAI}
                  className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-2xl hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Get suggestion
                    </>
                  )}
                </button>
              )}
            </div>
            
            {aiSuggestion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/60 rounded-2xl"
              >
                <p className="text-gray-700 italic leading-relaxed">
                  {aiSuggestion}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Save Button */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!showPrompts && (
                <button
                  onClick={() => setShowPrompts(true)}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <Lightbulb className="w-4 h-4" />
                  Show prompt
                </button>
              )}
            </div>
            
            <button
              onClick={handleSave}
              disabled={!content.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl"
      >
        <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
        <p className="text-gray-700 text-sm">
          Remember: There's no right or wrong way to journal. This is your safe space. 💜
        </p>
      </motion.div>
    </motion.div>
  );
};

export default JournalEditor; 