
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Complaint } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ComplaintContextType {
  complaints: Complaint[];
  userComplaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => void;
  updateComplaintStatus: (id: number, status: Complaint['status']) => void;
  updateComplaint: (updatedComplaint: Complaint) => void;
  deleteComplaint: (id: number) => void;
  searchComplaints: (query: string) => Complaint[];
  addComment: (id: number, comment: string) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

// Initial mock data for complaints
const initialComplaintsData: Complaint[] = [
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

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with data from localStorage or initial data if not available
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const savedComplaints = localStorage.getItem('complaints');
    return savedComplaints ? JSON.parse(savedComplaints) : initialComplaintsData;
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Save to localStorage whenever complaints change
  useEffect(() => {
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Get complaints that belong to the current user
  const userComplaints = user 
    ? complaints.filter(complaint => 
        complaint.userId === user.id || 
        (complaint.anonymous && complaint.userId === user.id)
      )
    : [];

  const addComplaint = (newComplaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => {
    // Find the highest ID to ensure uniqueness
    const highestId = complaints.reduce((max, complaint) => 
      complaint.id > max ? complaint.id : max, 0);
    
    const complaintToAdd: Complaint = {
      ...newComplaint,
      id: highestId + 1,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      userId: user?.id,
      comments: []
    };
    
    const updatedComplaints = [...complaints, complaintToAdd];
    setComplaints(updatedComplaints);
    
    toast({
      title: "Complaint submitted",
      description: "Your complaint has been successfully submitted.",
    });
  };

  const updateComplaint = (updatedComplaint: Complaint) => {
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === updatedComplaint.id
        ? { ...updatedComplaint }
        : complaint
    );
    
    setComplaints(updatedComplaints);
    
    toast({
      title: "Complaint updated",
      description: "Your complaint has been successfully updated.",
    });
  };

  const deleteComplaint = (id: number) => {
    const updatedComplaints = complaints.filter(complaint => complaint.id !== id);
    setComplaints(updatedComplaints);
    
    toast({
      title: "Complaint deleted",
      description: "The complaint has been successfully removed.",
    });
  };

  const updateComplaintStatus = (id: number, status: Complaint['status']) => {
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === id 
        ? { ...complaint, status } 
        : complaint
    );
    
    setComplaints(updatedComplaints);
    
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

  const addComment = (id: number, comment: string) => {
    if (!user) return;
    
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === id) {
        const newComment = {
          id: Date.now(),
          text: comment,
          createdAt: new Date().toISOString(),
          userId: user.id,
          userName: user.fullName || user.username
        };
        
        return {
          ...complaint,
          comments: [...(complaint.comments || []), newComment]
        };
      }
      return complaint;
    });
    
    setComplaints(updatedComplaints);
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the complaint.",
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
    searchComplaints,
    addComment
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
