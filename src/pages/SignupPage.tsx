
import React from 'react';
import { SignupForm } from '@/components';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const SignupPage: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return <SignupForm />;
};

export default SignupPage;
