import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} />
    </Routes>
  );
};

export default App;
