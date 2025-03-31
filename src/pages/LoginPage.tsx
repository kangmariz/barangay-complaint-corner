
import React from 'react';
import { LoginForm } from '@/components';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return <LoginForm />;
};

export default LoginPage;
