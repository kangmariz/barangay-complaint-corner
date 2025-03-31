
import React, { useState } from 'react';
import { Layout, ComplaintTable } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const { complaints, searchComplaints } = useComplaints();
  const [searchResults, setSearchResults] = useState(complaints);
  
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
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Complaints Management</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ComplaintTable complaints={searchResults} />
        </div>
      </div>
    </Layout>
  );
};

export default ComplaintsPage;
