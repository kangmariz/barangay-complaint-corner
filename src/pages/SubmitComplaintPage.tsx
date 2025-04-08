
import React from 'react';
import { Layout, ComplaintForm } from '@/components';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const SubmitComplaintPage: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect admin users (they shouldn't submit complaints)
  if (user.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <Layout>
      <div className="container mx-full p-6">
        <ComplaintForm />
      </div>
    </Layout>
  );
};

export default SubmitComplaintPage;
