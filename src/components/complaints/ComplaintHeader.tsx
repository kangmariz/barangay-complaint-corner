
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const ComplaintHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold">Complaint Details</DialogTitle>
      <DialogDescription>
        Review the details of this complaint
      </DialogDescription>
    </DialogHeader>
  );
};

export default ComplaintHeader;
