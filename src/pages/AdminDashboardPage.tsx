
import React, { useState } from 'react';
import { Layout, ComplaintStats, ComplaintTable } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from "@/hooks/use-mobile";

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { complaints, searchComplaints } = useComplaints();
  const [searchResults, setSearchResults] = useState(complaints);
  const isMobile = useIsMobile();
  
  const handleSearch = (query: string) => {
    const results = searchComplaints(query);
    setSearchResults(results);
  };
  
  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }
  
  return (
    <Layout onSearch={handleSearch}>
      <div className="container mx-auto px-4 sm:px-6 lg:p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <ComplaintStats complaints={complaints} />
        
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>
          <ComplaintTable 
            complaints={searchResults.slice(0, 5)} 
            readOnly={true} 
            hideActions={true} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
