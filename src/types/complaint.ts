
import { Complaint } from './index';

export interface ComplaintContextType {
  complaints: Complaint[];
  userComplaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => void;
  updateComplaintStatus: (id: number, status: Complaint['status']) => void;
  updateComplaint: (updatedComplaint: Complaint) => void;
  deleteComplaint: (id: number) => void;
  searchComplaints: (query: string) => Complaint[];
  addComment: (id: number, comment: string) => void;
  deleteAllResolved: () => void;
}

export const initialComplaintsData: Complaint[] = [
  {
    id: 1,
    title: 'Flooded Road',
    description: 'Heavy rain caused severe flooding.',
    purok: 'Purok 1',
    status: 'Pending',
    anonymous: false,
    fullName: 'John Doe',
    contactNumber: '09123456789',
    userId: '1',
    createdAt: new Date().toISOString(),
    comments: []
  },
  {
    id: 2,
    title: 'Streetlight not working',
    description: 'The streetlight in front of house number 42 is not working for 3 days now.',
    purok: 'Purok 3',
    status: 'Resolved',
    anonymous: true,
    userId: '2',
    createdAt: new Date().toISOString(),
    comments: []
  }
];
