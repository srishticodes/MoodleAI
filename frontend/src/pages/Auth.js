import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

// Therapeutic illustration component inspired by Mental Mantra design
const AuthIllustration = () => (
  <div className="relative w-full h-80 rounded-3xl overflow-hidden gradient-therapeutic flex items-center justify-center">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-12 left-12 w-20 h-20 bg-sage-200 rounded-full opacity-60 animate-float"></div>
      <div className="absolute bottom-16 right-16 w-16 h-16 bg-lavender-200 rounded-full opacity-40 animate-bounce-gentle"></div>
      <div className="absolute top-1/3 right-12 w-8 h-8 bg-primary-200 rounded-full opacity-50"></div>
      <div className="absolute bottom-1/3 left-16 w-12 h-12 bg-secondary-200 rounded-full opacity-30"></div>
    </div>
    
    {/* Central illustration placeholder */}
    <div className="relative z-10 text-center">
      <div className="w-32 h-32 mx-auto mb-6 bg-sage-300 rounded-full flex items-center justify-center shadow-lg animate-breathe">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
          <span className="text-3xl">🌱</span>
        </div>
      </div>
      <span className="text-sage-700 text-lg font-medium opacity-80">Your companion awaits...</span>
    </div>
  </div>
);

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen gradient-calm flex items-center justify-center p-6 overflow-hidden">
      {/* Background gradient */}
      <style>{`body { background: linear-gradient(to bottom, #f6fbfa 0%, #f5f4ff 50%, #ffffff 100%); }`}</style>

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-sage-100 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-lavender-100 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute top-3/4 left-1/6 w-24 h-24 bg-primary-100 rounded-full opacity-25"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left side: Illustration and Welcome Text */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            <AuthIllustration />
            
            <div className="mt-10 space-y-4">
              <h1 className="font-bold text-sage-800 font-display leading-tight text-4xl sm:text-4xl lg:text-5xl max-w-lg mx-auto">
                A safe space for your thoughts
              </h1>
              <p className="text-sage-600 text-xl leading-relaxed max-w-md mx-auto">
                Journaling helps you reflect, understand, and grow. Your companion is here to listen.
              </p>
              
              {/* Feature highlights */}
              <div className="mt-8 space-y-3 text-left max-w-sm mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sage-700 text-sm">Private & secure journaling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-lavender-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sage-700 text-sm">AI-powered insights & support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sage-700 text-sm">Track your wellness journey</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right side: Form */}
        <div className="w-full max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-lg shadow-[#cfe7e3]/40 border border-white/20"
          >
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <h2 className="text-3xl font-bold text-sage-800 font-display mb-2">
                Welcome Back!
              </h2>
              <p className="text-sage-600">
                {isLoginView ? 'Continue your wellness journey' : 'Start your healing journey'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isLoginView ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <LoginForm />
                  <div className="text-center mt-8">
                    <p className="text-sm text-gray-600 mb-4">
                      Don't have an account?
                    </p>
                    <button
                      onClick={() => setIsLoginView(false)}
                      className="w-full py-3 px-6 bg-gradient-to-r from-sage-100 to-lavender-100 text-sage-700 font-semibold rounded-2xl hover:from-sage-200 hover:to-lavender-200 transition-all duration-300 transform hover:scale-105 border border-sage-200"
                    >
                      Create New Account
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <RegisterForm />
                  <div className="text-center mt-8">
                    <p className="text-sm text-gray-600 mb-4">
                      Already have an account?
                    </p>
                    <button
                      onClick={() => setIsLoginView(true)}
                      className="w-full py-3 px-6 bg-gradient-to-r from-sage-100 to-lavender-100 text-sage-700 font-semibold rounded-2xl hover:from-sage-200 hover:to-lavender-200 transition-all duration-300 transform hover:scale-105 border border-sage-200"
                    >
                      Sign In Instead
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 