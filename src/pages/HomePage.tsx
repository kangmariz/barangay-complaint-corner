
import React, { useState } from 'react';
import { Layout, ComplaintTable } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { useAuth } from '@/context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { userComplaints, searchComplaints } = useComplaints();
  const [searchResults, setSearchResults] = useState(userComplaints);
  
  const handleSearch = (query: string) => {
    const results = searchComplaints(query);
    setSearchResults(results);
  };
  
  if (!user) return null;
  
  return (
    <Layout onSearch={handleSearch}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          Easily submit and track your complaints with Barangay Nabuad's Complaint Management System.
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Recent Complaints</h2>
            <div className="text-right">
              <h3 className="text-lg font-semibold">Total Number of Complaints:</h3>
              <p className="text-4xl font-bold text-barangay-blue">{userComplaints.length}</p>
            </div>
          </div>
          <ComplaintTable complaints={searchResults.length > 0 ? searchResults : userComplaints.slice(0, 5)} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
