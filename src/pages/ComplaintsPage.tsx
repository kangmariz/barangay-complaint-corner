
import React, { useState } from 'react';
import { Layout, ComplaintTable } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const ComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const { complaints, searchComplaints } = useComplaints();
  const [searchResults, setSearchResults] = useState(complaints);
  const { toast } = useToast();
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // Listen for status updates
  React.useEffect(() => {
    const handleStatusUpdate = (detail: any) => {
      if (detail?.status) {
        setShowNotification(`Complaint has been marked as ${detail.status}`);
        setTimeout(() => setShowNotification(null), 3000);
      }
    };
    
    window.addEventListener('complaintStatusUpdated', handleStatusUpdate as EventListener);
    return () => {
      window.removeEventListener('complaintStatusUpdated', handleStatusUpdate as EventListener);
    };
  }, []);
  
  const handleSearch = (query: string) => {
    const results = searchComplaints(query);
    setSearchResults(applyStatusFilter(results, statusFilter));
  };
  
  const applyStatusFilter = (complaintsToFilter: any[], status: string) => {
    if (status === "All") {
      return complaintsToFilter;
    }
    return complaintsToFilter.filter(complaint => complaint.status === status);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setSearchResults(applyStatusFilter(complaints, value));
  };
  
  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }
  
  return (
    <Layout onSearch={handleSearch}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Complaints Management</h1>
        
        {showNotification && (
          <Alert className="bg-green-50 border-green-200 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <AlertDescription className="text-green-700">
              {showNotification}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end mb-4">
          <div className="w-48">
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Complaints</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ComplaintTable complaints={searchResults} readOnly={false} />
        </div>
      </div>
    </Layout>
  );
};

export default ComplaintsPage;
