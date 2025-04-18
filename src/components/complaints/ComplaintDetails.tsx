
import React from 'react';
import { Complaint } from '@/types';
import { Dialog, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import ComplaintHeader from './ComplaintHeader';
import ComplaintBasicInfo from './ComplaintBasicInfo';
import ComplaintSubmitter from './ComplaintSubmitter';
import ComplaintPhoto from './ComplaintPhoto';
import ComplaintComments from './ComplaintComments';

interface ComplaintDetailsProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, isOpen, onOpenChange }) => {
  if (!complaint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <ComplaintHeader />
        <ScrollArea className="flex-1 pr-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4 pr-2">
            <ComplaintBasicInfo complaint={complaint} />
            <ComplaintSubmitter complaint={complaint} />
            <div>
              <div className="font-medium mb-1">Description:</div>
              <div className="bg-gray-50 p-3 rounded-md">{complaint.description}</div>
            </div>
            <ComplaintPhoto photoUrl={complaint.photo} />
            <ComplaintComments comments={complaint.comments} />
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
