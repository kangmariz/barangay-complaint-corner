
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Complaint } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ComplaintContextType {
  complaints: Complaint[];
  userComplaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => void;
  updateComplaintStatus: (id: number, status: Complaint['status']) => void;
  updateComplaint: (updatedComplaint: Complaint) => void;
  deleteComplaint: (id: number) => void;
  searchComplaints: (query: string) => Complaint[];
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

// Mock data for complaints
const initialComplaints: Complaint[] = [
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
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Streetlight not working',
    description: 'The streetlight in front of house number 42 is not working for 3 days now.',
    purok: 'Purok 3',
    status: 'Resolved',
    anonymous: true,
    userId: '2',
    createdAt: new Date().toISOString()
  }
];

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get complaints that belong to the current user
  const userComplaints = user 
    ? complaints.filter(complaint => 
        complaint.userId === user.id || 
        (complaint.anonymous && complaint.userId === user.id)
      )
    : [];

  const addComplaint = (newComplaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => {
    const complaintToAdd: Complaint = {
      ...newComplaint,
      id: complaints.length + 1,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      userId: user?.id
    };
    
    setComplaints([...complaints, complaintToAdd]);
    toast({
      title: "Complaint submitted",
      description: "Your complaint has been successfully submitted.",
    });
  };

  const updateComplaint = (updatedComplaint: Complaint) => {
    setComplaints(
      complaints.map(complaint => 
        complaint.id === updatedComplaint.id
          ? { ...updatedComplaint }
          : complaint
      )
    );
  };

  const deleteComplaint = (id: number) => {
    setComplaints(complaints.filter(complaint => complaint.id !== id));
    
    toast({
      title: "Complaint deleted",
      description: "The complaint has been successfully removed.",
    });
  };

  const updateComplaintStatus = (id: number, status: Complaint['status']) => {
    setComplaints(
      complaints.map(complaint => 
        complaint.id === id 
          ? { ...complaint, status } 
          : complaint
      )
    );
    
    // Dispatch event for status change
    window.dispatchEvent(
      new CustomEvent('complaintStatusUpdated', { 
        detail: { id, status } 
      })
    );
    
    toast({
      title: "Status updated",
      description: `Complaint has been marked as ${status}`,
    });
  };

  const searchComplaints = (query: string): Complaint[] => {
    if (!query) return user?.role === 'admin' ? complaints : userComplaints;
    
    const searchTerm = query.toLowerCase();
    const filtered = (user?.role === 'admin' ? complaints : userComplaints).filter(
      complaint => 
        complaint.title.toLowerCase().includes(searchTerm) ||
        complaint.description.toLowerCase().includes(searchTerm) ||
        complaint.purok.toLowerCase().includes(searchTerm) ||
        complaint.status.toLowerCase().includes(searchTerm)
    );
    
    return filtered;
  };

  const contextValue: ComplaintContextType = {
    complaints,
    userComplaints,
    addComplaint,
    updateComplaint,
    updateComplaintStatus,
    deleteComplaint,
    searchComplaints
  };

  return (
    <ComplaintContext.Provider value={contextValue}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
