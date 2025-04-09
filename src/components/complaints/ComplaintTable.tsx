
import React from 'react';
import { Complaint } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComplaints } from '@/context/ComplaintContext';

interface ComplaintTableProps {
  complaints: Complaint[];
  readOnly?: boolean;
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({ complaints, readOnly = false }) => {
  const { user } = useAuth();
  const { updateComplaintStatus } = useComplaints();
  const isAdmin = user?.role === 'admin';
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'text-red-500';
      case 'In Progress':
        return 'text-blue-500';
      case 'Resolved':
        return 'text-green-500';
      default:
        return '';
    }
  };
  
  const handleStatusChange = (id: number, value: string) => {
    updateComplaintStatus(id, value as Complaint['status']);
  };
  
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-barangay-blue text-white">
          <TableRow>
            <TableHead className="text-white">Id</TableHead>
            <TableHead className="text-white">Title</TableHead>
            <TableHead className="text-white">Description</TableHead>
            <TableHead className="text-white">Purok Location</TableHead>
            <TableHead className="text-white">Photo (Optional)</TableHead>
            <TableHead className="text-white">Status</TableHead>
            {isAdmin && <TableHead className="text-white">Contact Info</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-gray-500">
                No complaints found
              </TableCell>
            </TableRow>
          ) : (
            complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.id}</TableCell>
                <TableCell>{complaint.title}</TableCell>
                <TableCell className="max-w-xs truncate">{complaint.description}</TableCell>
                <TableCell>{complaint.purok}</TableCell>
                <TableCell>
                  {complaint.photo ? (
                    <a href="#" className="text-blue-500 underline">View</a>
                  ) : (
                    "No photo"
                  )}
                </TableCell>
                <TableCell>
                  {isAdmin && !readOnly ? (
                    <Select 
                      defaultValue={complaint.status} 
                      onValueChange={(value) => handleStatusChange(complaint.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(complaint.status)}
                    >
                      {complaint.status}
                    </Badge>
                  )}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    {complaint.anonymous ? (
                      <span className="text-gray-400">Anonymous</span>
                    ) : (
                      <div>
                        <p>{complaint.fullName}</p>
                        <p className="text-sm text-gray-500">{complaint.contactNumber}</p>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComplaintTable;
