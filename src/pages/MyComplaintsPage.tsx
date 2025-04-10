
import React, { useState, useEffect } from 'react';
import { Layout, ComplaintTable } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Complaint } from '@/types';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from 'lucide-react';

const MyComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const { userComplaints, searchComplaints } = useComplaints();
  const [searchResults, setSearchResults] = useState(userComplaints);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Listen for status updates
  useEffect(() => {
    const handleStatusUpdate = (detail: any) => {
      if (detail?.status) {
        setNotification(`Complaint status updated to ${detail.status}`);
        setTimeout(() => setNotification(null), 3000);
      }
    };
    
    window.addEventListener('complaintStatusUpdated', handleStatusUpdate as EventListener);
    return () => {
      window.removeEventListener('complaintStatusUpdated', handleStatusUpdate as EventListener);
    };
  }, []);
  
  const handleSearch = (query: string) => {
    const results = searchComplaints(query);
    setSearchResults(results);
  };
  
  // Function to check if complaint is editable
  const canEdit = (complaint: Complaint): boolean => {
    return complaint.status === 'Pending';
  };
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Layout onSearch={handleSearch}>
      <div className="container mx-auto p-6">
        <h1 className="text-black text-2xl font-bold mb-6">My Complaints</h1>
        
        {notification && (
          <Alert className="bg-green-50 border-green-200 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <AlertDescription className="text-green-700">
              {notification}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ComplaintTable 
            complaints={searchResults} 
            isEditable={canEdit} 
          />
          <div className="mt-4 text-sm text-gray-600">
            <p>Note: You can only edit complaints with "Pending" status.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyComplaintsPage;
