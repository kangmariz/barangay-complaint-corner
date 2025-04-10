
import React from 'react';
import { Complaint } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Pencil, Eye } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ComplaintTableProps {
  complaints: Complaint[];
  readOnly?: boolean;
  isEditable?: (complaint: Complaint) => boolean;
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({ complaints, readOnly = false, isEditable }) => {
  const { user } = useAuth();
  const { updateComplaintStatus } = useComplaints();
  const navigate = useNavigate();
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

  const handleEditComplaint = (complaint: Complaint) => {
    navigate(`/edit-complaint/${complaint.id}`);
  };
  
  const handleViewPhoto = (photoUrl?: string) => {
    if (photoUrl) {
      window.open(photoUrl, '_blank');
    }
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
            <TableHead className="text-white">Photo</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Submitted On</TableHead>
            {isAdmin && <TableHead className="text-white">Contact Info</TableHead>}
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 9 : 8} className="text-center py-8 text-gray-500">
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewPhoto(complaint.photo)}
                      className="text-blue-500 p-0 underline"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
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
                <TableCell>
                  {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
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
                <TableCell>
                  {!isAdmin && isEditable && isEditable(complaint) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditComplaint(complaint)} 
                      className="text-blue-500"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComplaintTable;
