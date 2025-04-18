
import { Complaint } from '@/types';

interface ComplaintSubmitterProps {
  complaint: Complaint;
}

const ComplaintSubmitter = ({ complaint }: ComplaintSubmitterProps) => {
  if (complaint.anonymous) {
    return (
      <div className="grid grid-cols-3 gap-2">
        <div className="font-medium">Anonymous:</div>
        <div className="col-span-2">Yes</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div className="font-medium">Anonymous:</div>
        <div className="col-span-2">No</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="font-medium">Full Name:</div>
        <div className="col-span-2">{complaint.fullName}</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="font-medium">Contact Number:</div>
        <div className="col-span-2">{complaint.contactNumber}</div>
      </div>
    </>
  );
};

export default ComplaintSubmitter;
