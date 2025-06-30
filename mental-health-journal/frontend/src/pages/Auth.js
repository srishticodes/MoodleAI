import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

// Replace with a real illustration or import from assets
const AuthIllustration = () => (
  <div className="w-full h-64 bg-secondary-200 rounded-2xl flex items-center justify-center shadow-inner">
    <span className="text-secondary-600 text-lg font-medium animate-pulse">Your companion awaits...</span>
  </div>
);

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left side: Illustration and Welcome Text */}
        <div className="hidden md:flex flex-col items-center justify-center text-center p-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <AuthIllustration />
            <h1 className="text-4xl font-bold text-primary-800 mt-8 font-display">
              A safe space for your thoughts
            </h1>
            <p className="text-primary-700 mt-3 text-lg">
              Journaling helps you reflect, understand, and grow. Your companion is here to listen.
            </p>
          </motion.div>
        </div>

        {/* Right side: Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {isLoginView ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <LoginForm />
                <p className="text-center text-sm text-gray-600 mt-6">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLoginView(false)}
                    className="font-semibold text-primary-600 hover:text-primary-500 focus:outline-none focus:underline"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <RegisterForm />
                <p className="text-center text-sm text-gray-600 mt-6">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLoginView(true)}
                    className="font-semibold text-primary-600 hover:text-primary-500 focus:outline-none focus:underline"
                  >
                    Log in
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 