
import React, { useState, useEffect } from 'react';
import { Layout, ComplaintTable } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Complaint } from '@/types';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

const MyComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const { userComplaints, searchComplaints } = useComplaints();
  const [searchResults, setSearchResults] = useState<Complaint[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
    applyFilters(results);
  };
  
  // Function to filter complaints by status
  const applyFilters = (complaints: Complaint[]) => {
    if (statusFilter === "all") {
      setSearchResults(complaints);
    } else {
      const filtered = complaints.filter(
        complaint => complaint.status.toLowerCase() === statusFilter.toLowerCase()
      );
      setSearchResults(filtered);
    }
  };
  
  // Handle status filter change
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    if (userComplaints) {
      if (value === "all") {
        setSearchResults(userComplaints);
      } else {
        const filtered = userComplaints.filter(
          complaint => complaint.status.toLowerCase() === value.toLowerCase()
        );
        setSearchResults(filtered);
      }
    }
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
      <div className="container mx-auto px-4 sm:px-6 lg:p-6">
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'} mb-6`}>
          <h1 className="text-black text-2xl font-bold">My Complaints</h1>
          <div className={`flex ${isMobile ? 'flex-col w-full gap-2' : 'gap-4'}`}>
            <Select value={statusFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'}`}>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Complaints</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleCreateNew}
              className="bg-barangay-blue hover:bg-blue-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> New Complaint
            </Button>
          </div>
        </div>
        
        {notification && (
          <Alert className="bg-green-50 border-green-200 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <AlertDescription className="text-green-700">
              {notification}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
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
