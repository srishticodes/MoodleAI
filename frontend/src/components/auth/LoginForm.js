import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader, ArrowRight } from 'lucide-react';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    const result = await login(data.email, data.password);
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
        <h2 className="text-3xl font-bold text-sage-800 mb-3 font-display">Welcome Back!</h2>
        <p className="text-sage-600 text-sm">Continue your wellness journey</p>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              placeholder="Enter your password"
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

        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 font-semibold text-white bg-gradient-to-r from-sage-500 to-sage-600 rounded-2xl hover:from-sage-600 hover:to-sage-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform"
          >
            <span className="flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span className="flex items-center space-x-1"><span>Sign In</span><ArrowRight size={16}/></span>
              )}
            </span>
          </motion.button>
        </div>

        <div className="text-center pt-4">
          <button type="button" className="text-sm text-sage-600 hover:text-sage-700 transition-colors focus:outline-none">
            Forgot your password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 