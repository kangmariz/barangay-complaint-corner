
import React from 'react';
import { Complaint } from '@/types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Complaint Details</DialogTitle>
          <DialogDescription>
            Review the details of this complaint
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetails;
