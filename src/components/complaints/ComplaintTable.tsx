
import React, { useState, useEffect } from 'react';
import { Complaint } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Pencil, Eye, Trash2, FileText, MessageSquare } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import ComplaintDetails from './ComplaintDetails';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

interface ComplaintTableProps {
  complaints: Complaint[];
  readOnly?: boolean;
  isEditable?: (complaint: Complaint) => boolean;
  hideActions?: boolean;
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({ 
  complaints, 
  readOnly = false, 
  isEditable,
  hideActions = false 
}) => {
  const { user } = useAuth();
  const { updateComplaintStatus, deleteComplaint, addComment } = useComplaints();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState<Complaint | null>(null);
  const [localComplaints, setLocalComplaints] = useState<Complaint[]>(complaints);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentComplaintId, setCommentComplaintId] = useState<number | null>(null);
  
  // Update local complaints when the props change
  useEffect(() => {
    setLocalComplaints(complaints);
  }, [complaints]);
  
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
    
    // Update local state for immediate UI update
    setLocalComplaints(
      localComplaints.map(complaint => 
        complaint.id === id 
          ? { ...complaint, status: value as Complaint['status'] } 
          : complaint
      )
    );
  };

  const handleEditComplaint = (complaint: Complaint) => {
    navigate(`/edit-complaint/${complaint.id}`);
  };
  
  const handleViewPhoto = (photoUrl?: string) => {
    if (photoUrl) {
      window.open(photoUrl, '_blank');
    }
  };
  
  const handleDeleteClick = (complaint: Complaint) => {
    setComplaintToDelete(complaint);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (complaintToDelete) {
      // Delete from context (which updates localStorage)
      deleteComplaint(complaintToDelete.id);
      
      // Update local state for immediate UI update
      setLocalComplaints(localComplaints.filter(c => c.id !== complaintToDelete.id));
      
      // Close dialog
      setDeleteDialogOpen(false);
      setComplaintToDelete(null);
    }
  };
  
  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setViewDetailsOpen(true);
  };
  
  const handleAddCommentClick = (complaintId: number) => {
    setCommentComplaintId(complaintId);
    setCommentDialogOpen(true);
  };
  
  const handleSubmitComment = () => {
    if (!commentComplaintId || !commentText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a comment before submitting.",
      });
      return;
    }
    
    addComment(commentComplaintId, commentText);
    setCommentText('');
    setCommentDialogOpen(false);
    
    // Update UI for comment count
    setLocalComplaints(prevComplaints => 
      prevComplaints.map(complaint => {
        if (complaint.id === commentComplaintId) {
          const updatedComments = [...(complaint.comments || []), {
            id: Date.now(),
            text: commentText,
            createdAt: new Date().toISOString(),
            userId: user?.id || '',
            userName: user?.fullName || user?.username || 'Anonymous'
          }];
          
          return { ...complaint, comments: updatedComments };
        }
        return complaint;
      })
    );
  };
  
  return (
    <>
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
              {!hideActions && <TableHead className="text-white">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {localComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 9 : 8} className="text-center py-8 text-gray-500">
                  No complaints found
                </TableCell>
              </TableRow>
            ) : (
              localComplaints.map((complaint) => (
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
                  {!hideActions && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(complaint)} 
                          className="text-purple-500"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        
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
                        
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleAddCommentClick(complaint.id)} 
                            className="text-green-500"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Comment
                            {complaint.comments && complaint.comments.length > 0 && (
                              <span className="ml-1 bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs">
                                {complaint.comments.length}
                              </span>
                            )}
                          </Button>
                        )}
                        
                        {isAdmin && complaint.status === 'Resolved' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteClick(complaint)} 
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resolved complaint? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Details Dialog */}
      <ComplaintDetails 
        complaint={selectedComplaint} 
        isOpen={viewDetailsOpen} 
        onOpenChange={setViewDetailsOpen} 
      />
      
      {/* Add Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
              Add a comment to this complaint to provide feedback or instructions for the resident.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Type your comment here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full"
            />
            {commentText.trim() === '' && (
              <p className="text-red-500 text-xs mt-1">Comment cannot be empty</p>
            )}
          </div>
          <DialogFooter className="flex justify-between mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSubmitComment} 
              disabled={commentText.trim() === ''}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Submit Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComplaintTable;
