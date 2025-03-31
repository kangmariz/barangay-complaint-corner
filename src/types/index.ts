
export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  contactNumber: string;
  role: 'admin' | 'resident';
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  purok: string;
  location?: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  photo?: string;
  anonymous: boolean;
  fullName?: string;
  contactNumber?: string;
  userId?: string;
  createdAt: string;
}
