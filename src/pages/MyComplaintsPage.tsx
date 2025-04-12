
import React, { useState, useEffect } from 'react';
import { Layout, ComplaintTable } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Complaint } from '@/types';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const MyComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const { userComplaints, searchComplaints } = useComplaints();
  const [searchResults, setSearchResults] = useState<Complaint[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize search results with user complaints
  useEffect(() => {
    if (userComplaints) {
      setSearchResults(userComplaints);
    }
  }, [userComplaints]);
  
  // Listen for status updates
  useEffect(() => {
    const handleStatusUpdate = (event: CustomEvent) => {
      const detail = event.detail;
      if (detail?.status) {
        setNotification(`Complaint status updated to ${detail.status}`);
        toast({
          title: "Status Updated",
          description: `Complaint status changed to ${detail.status}`,
        });
        setTimeout(() => setNotification(null), 3000);
      }
    };
    
    window.addEventListener('complaintStatusUpdated', handleStatusUpdate as EventListener);
    return () => {
      window.removeEventListener('complaintStatusUpdated', handleStatusUpdate as EventListener);
    };
  }, [toast]);
  
  const handleSearch = (query: string) => {
    const results = searchComplaints(query);
    setSearchResults(results);
  };
  
  // Function to check if complaint is editable
  const canEdit = (complaint: Complaint): boolean => {
    return complaint.status === 'Pending';
  };

  const handleCreateNew = () => {
    navigate('/submit-complaint');
  };
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Layout onSearch={handleSearch}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-black text-2xl font-bold">My Complaints</h1>
          <Button 
            onClick={handleCreateNew}
            className="bg-barangay-blue hover:bg-blue-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> New Complaint
          </Button>
        </div>
        
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
