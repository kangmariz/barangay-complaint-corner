import React, { useState, useEffect } from 'react';
import { Complaint } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Pencil, Eye, Trash2, FileText, MessageSquare, MoreVertical, Info } from 'lucide-react';
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const isMobile = useIsMobile();
  
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
      deleteComplaint(complaintToDelete.id);
      setLocalComplaints(localComplaints.filter(c => c.id !== complaintToDelete.id));
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
  
  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {localComplaints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No complaints found
            </div>
          ) : (
            localComplaints.map((complaint) => (
              <div 
                key={complaint.id}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{complaint.title}</h3>
                    <p className="text-xs text-gray-500">ID: {complaint.id}</p>
                  </div>
                  {isAdmin && !readOnly ? (
                    <Select 
                      defaultValue={complaint.status} 
                      onValueChange={(value) => updateComplaintStatus(complaint.id, value as Complaint['status'])}
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
                </div>
                
                <div className="mb-2">
                  <p className="text-sm line-clamp-2">{complaint.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                  <div>
                    <span className="font-semibold">Location:</span> {complaint.purok}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                  </div>
                  
                  {isAdmin && (
                    <div className="col-span-2">
                      <span className="font-semibold">Contact:</span> {complaint.anonymous ? 
                        <span className="text-gray-400">Anonymous</span> : 
                        `${complaint.fullName} (${complaint.contactNumber})`}
                    </div>
                  )}
                </div>
                
                {!hideActions && (
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(complaint)} 
                      className="text-purple-500 flex-grow"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    
                    {isAdmin ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAddCommentClick(complaint.id)} 
                          className="text-green-500 flex-grow"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Comment
                          {complaint.comments && complaint.comments.length > 0 && (
                            <span className="ml-1 bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs">
                              {complaint.comments.length}
                            </span>
                          )}
                        </Button>
                        
                        {complaint.status === 'Resolved' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteClick(complaint)} 
                            className="text-red-500 flex-grow"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        )}
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
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
        
        <ComplaintDetails 
          complaint={selectedComplaint} 
          isOpen={viewDetailsOpen} 
          onOpenChange={setViewDetailsOpen} 
        />
        
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
  }
  
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
                        onClick={() => complaint.photo && window.open(complaint.photo, '_blank')}
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
                        onValueChange={(value) => updateComplaintStatus(complaint.id, value as Complaint['status'])}
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
                      {isAdmin ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem onClick={() => handleViewDetails(complaint)} className="cursor-pointer">
                              <FileText className="h-4 w-4 mr-2 text-purple-500" />
                              <span>Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddCommentClick(complaint.id)} className="cursor-pointer">
                              <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                              <span>Comment</span>
                              {complaint.comments && complaint.comments.length > 0 && (
                                <span className="ml-1 bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs">
                                  {complaint.comments.length}
                                </span>
                              )}
                            </DropdownMenuItem>
                            {complaint.status === 'Resolved' && (
                              <DropdownMenuItem onClick={() => handleDeleteClick(complaint)} className="cursor-pointer text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(complaint)} 
                          className="text-purple-500"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
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
      
      <ComplaintDetails 
        complaint={selectedComplaint} 
        isOpen={viewDetailsOpen} 
        onOpenChange={setViewDetailsOpen} 
      />
      
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
