import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Check, Loader, ArrowRight } from 'lucide-react';

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    const result = await registerUser(data);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sage-800 mb-3 font-display">Start Your Journey</h2>
        <p className="text-sage-600 text-sm">Create your safe space for growth and reflection</p>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl"
        >
          <p className="text-red-600 text-sm text-center">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">Username</label>
          <div className="relative">
            <input
              {...register('username', { 
                required: 'Username is required', 
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                }
              })}
              className="w-full px-4 py-3 bg-sage-50 border border-sage-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all duration-300 placeholder-sage-400"
              placeholder="Choose a username"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <User size={18} className="text-sage-400" />
            </div>
          </div>
          {errors.username && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs mt-2 ml-1"
            >
              {errors.username.message}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">Email</label>
          <div className="relative">
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email'
                }
              })}
              className="w-full px-4 py-3 bg-sage-50 border border-sage-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all duration-300 placeholder-sage-400"
              placeholder="Enter your email"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-sage-400" />
            </div>
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs mt-2 ml-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">Password</label>
          <div className="relative">
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required', 
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="w-full px-4 py-3 bg-sage-50 border border-sage-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all duration-300 placeholder-sage-400"
              placeholder="Create a password"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-sage-400" />
            </div>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs mt-2 ml-1"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className="w-full px-4 py-3 bg-sage-50 border border-sage-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all duration-300 placeholder-sage-400"
              placeholder="Confirm your password"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Check size={18} className="text-sage-400" />
            </div>
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-xs mt-2 ml-1"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </div>

        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 font-semibold text-white bg-gradient-to-r from-lavender-500 to-lavender-600 rounded-2xl hover:from-lavender-600 hover:to-lavender-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform"
          >
            <span className="flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating your space...</span>
                </>
              ) : (
                <>
                  <span className="flex items-center space-x-1"><span>Begin Your Journey</span><ArrowRight size={16}/></span>
                </>
              )}
            </span>
          </motion.button>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-sage-600 leading-relaxed">
            By creating an account, you're taking the first step towards better mental wellness. 
            <br />
            Your privacy and security are our priority.
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 