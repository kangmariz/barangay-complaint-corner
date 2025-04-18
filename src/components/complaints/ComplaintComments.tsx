
import { MessageSquare } from "lucide-react";
import { format } from 'date-fns';
import { Complaint } from '@/types';

interface ComplaintCommentsProps {
  comments: Complaint['comments'];
}

const ComplaintComments = ({ comments }: ComplaintCommentsProps) => {
  if (!comments || comments.length === 0) return null;

  return (
    <div>
      <div className="font-medium mb-2">Comments:</div>
      <div className="space-y-3">
        {comments.map((comment) => (
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
  );
};

export default ComplaintComments;
