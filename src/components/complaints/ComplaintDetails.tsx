
import React from 'react';
import { Complaint } from '@/types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComplaintDetailsProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, isOpen, onOpenChange }) => {
  if (!complaint) return null;

  const handleViewPhoto = (photoUrl?: string) => {
    if (photoUrl) {
      window.open(photoUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Complaint Details</DialogTitle>
          <DialogDescription>
            Review the details of this complaint
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Complaint ID:</div>
              <div className="col-span-2">{complaint.id}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Title:</div>
              <div className="col-span-2">{complaint.title}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Status:</div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  complaint.status === 'Pending' 
                    ? 'bg-red-100 text-red-800' 
                    : complaint.status === 'In Progress' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                }`}>
                  {complaint.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Purok:</div>
              <div className="col-span-2">{complaint.purok}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Submitted:</div>
              <div className="col-span-2">{format(new Date(complaint.createdAt), 'MMMM d, yyyy')}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="font-medium">Anonymous:</div>
              <div className="col-span-2">{complaint.anonymous ? 'Yes' : 'No'}</div>
            </div>
            {!complaint.anonymous && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Full Name:</div>
                  <div className="col-span-2">{complaint.fullName}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Contact Number:</div>
                  <div className="col-span-2">{complaint.contactNumber}</div>
                </div>
              </>
            )}
            <div>
              <div className="font-medium mb-1">Description:</div>
              <div className="bg-gray-50 p-3 rounded-md">{complaint.description}</div>
            </div>
            {complaint.photo && (
              <div>
                <div className="font-medium mb-1">Photo:</div>
                <div className="flex justify-center">
                  <img src={complaint.photo} alt="Complaint" className="max-h-64 rounded-md" />
                </div>
                <div className="text-center mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewPhoto(complaint.photo)}
                    className="text-blue-500"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Full Size
                  </Button>
                </div>
              </div>
            )}
            {complaint.comments && complaint.comments.length > 0 && (
              <div>
                <div className="font-medium mb-2">Comments:</div>
                <div className="space-y-3">
                  {complaint.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">{comment.text}</p>
                          <div className="mt-1 text-xs text-gray-500">
                            {comment.userName} - {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetails;
