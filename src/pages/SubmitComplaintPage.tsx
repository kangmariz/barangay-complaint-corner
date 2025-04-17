
import React from 'react';
import { Layout, ComplaintForm } from '@/components';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

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
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 mb-6">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <AlertDescription className="text-amber-700 font-medium">
            IMPORTANT: Please review your complaint details carefully before submitting. 
            You will not be able to edit your complaint after submission.
          </AlertDescription>
        </Alert>
        
        <ComplaintForm />
      </div>
    </Layout>
  );
};

export default SubmitComplaintPage;
