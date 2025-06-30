import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800 font-display">
            Welcome, {user.username}!
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">This is your dashboard.</h2>
          <p className="mt-2 text-gray-600">
            From here, you will be able to see your companion, track your streaks, and start a new journal entry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 