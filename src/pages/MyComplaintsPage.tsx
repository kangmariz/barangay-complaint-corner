
import React, { useState } from 'react';
import { Layout, ComplaintTable } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Complaint } from '@/types';

const MyComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const { userComplaints, searchComplaints } = useComplaints();
  const [searchResults, setSearchResults] = useState(userComplaints);
  
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
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ComplaintTable 
            complaints={searchResults} 
            isEditable={(complaint) => canEdit(complaint)} 
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
