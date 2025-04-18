
import { Complaint } from '@/types';
import { format } from 'date-fns';

interface ComplaintBasicInfoProps {
  complaint: Complaint;
}

const ComplaintBasicInfo = ({ complaint }: ComplaintBasicInfoProps) => {
  return (
    <>
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
    </>
  );
};

export default ComplaintBasicInfo;
