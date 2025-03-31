
import React, { useState } from 'react';
import { Layout } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
        
        {/* Total Complaints Card */}
        <Card className="bg-white rounded-lg shadow-md p-6 mb-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold">Complaint Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-right">
              <h3 className="text-lg font-semibold">Total Number of Complaints:</h3>
              <p className="text-4xl font-bold text-barangay-blue">{userComplaints.length}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Complaints Card with Table */}
        <Card className="bg-white rounded-lg shadow-md p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold">Your Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {(searchResults.length > 0 ? searchResults : userComplaints.slice(0, 5)).length > 0 ? (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(searchResults.length > 0 ? searchResults : userComplaints.slice(0, 5)).map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.title}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          className={
                            complaint.status === "Pending" ? "bg-orange-500" : 
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
