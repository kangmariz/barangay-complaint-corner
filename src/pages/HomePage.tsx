
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { userComplaints, searchComplaints } = useComplaints();
  const [searchResults, setSearchResults] = useState([]);
  
  useEffect(() => {
    // Initialize search results with user complaints when component mounts
    if (userComplaints) {
      setSearchResults(userComplaints);
    }
  }, [userComplaints]);
  
  const handleSearch = (query: string) => {
    const results = searchComplaints(query);
    setSearchResults(results);
  };
  
  // Calculate complaint stats
  const pendingComplaints = userComplaints?.filter(c => c.status === 'Pending').length || 0;
  const inProgressComplaints = userComplaints?.filter(c => c.status === 'In Progress').length || 0;
  const resolvedComplaints = userComplaints?.filter(c => c.status === 'Resolved').length || 0;
  
  if (!user) return null;
  
  return (
    <Layout onSearch={handleSearch}>
      <div className="container mx-auto p-6">
        <h1 className="text-black font-bold mb-6">
          Easily submit and track your complaints with Barangay Nabuad's Complaint Management System.
        </h1>
        
        {/* Complaint Overview Card */}
        <Card className="bg-white rounded-lg shadow-md p-6 mb-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold">Complaint Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Total Complaints:</h3>
                <p className="text-4xl font-bold text-barangay-blue">{userComplaints?.length || 0}</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-500">Pending:</h3>
                <p className="text-4xl font-bold text-red-500">{pendingComplaints}</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-500">In Progress:</h3>
                <p className="text-4xl font-bold text-blue-500">{inProgressComplaints}</p>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-500">Resolved:</h3>
                <p className="text-4xl font-bold text-green-500">{resolvedComplaints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Complaints Card with Table */}
        <Card className="bg-white rounded-lg shadow-md p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold">Your Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {(searchResults && searchResults.length > 0) ? (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.title}</TableCell>
                      <TableCell>{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          className={
                            complaint.status === "Pending" ? "bg-red-500" : 
                            complaint.status === "In Progress" ? "bg-blue-500" : 
                            "bg-green-500"
                          }
                        >
                          {complaint.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-4">No complaints found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HomePage;
