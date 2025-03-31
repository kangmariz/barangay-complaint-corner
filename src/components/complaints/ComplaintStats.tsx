
import React from 'react';
import { Complaint } from '@/types';

interface ComplaintStatsProps {
  complaints: Complaint[];
}

const ComplaintStats: React.FC<ComplaintStatsProps> = ({ complaints }) => {
  const totalComplaints = complaints.length;
  
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-center mb-2">Total Complaints:</h3>
        <p className="text-5xl font-bold text-barangay-blue text-center">{totalComplaints}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-center text-red-500 mb-2">Pending:</h3>
        <p className="text-5xl font-bold text-red-500 text-center">{pendingComplaints}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-center text-blue-500 mb-2">In Progress:</h3>
        <p className="text-5xl font-bold text-blue-500 text-center">{inProgressComplaints}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-center text-green-500 mb-2">Resolved:</h3>
        <p className="text-5xl font-bold text-green-500 text-center">{resolvedComplaints}</p>
      </div>
    </div>
  );
};

export default ComplaintStats;
