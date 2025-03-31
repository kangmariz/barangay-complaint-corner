
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Log for debugging
    console.log('Index page loaded, user:', user);
  }, [user]);
  
  // Redirect based on authentication state
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  if (user.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/home" replace />;
};

export default Index;
