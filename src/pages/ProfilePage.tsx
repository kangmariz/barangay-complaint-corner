
import React from 'react';
import { Layout, ProfileForm } from '@/components';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        <ProfileForm />
      </div>
    </Layout>
  );
};

export default ProfilePage;
