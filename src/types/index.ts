
// Define the Complaint type
export interface Complaint {
  id: number;
  title: string;
  description: string;
  purok: string;
  photo?: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
  userId?: string;
  anonymous: boolean;
  fullName?: string;
  contactNumber?: string;
  comments?: Comment[];
}

// Define the Comment type
export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  userId: string;
  userName: string;
}
