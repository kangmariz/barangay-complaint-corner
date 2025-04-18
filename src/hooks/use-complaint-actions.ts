
import { useState } from 'react';
import { Complaint } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { initialComplaintsData } from '@/types/complaint';

export const useComplaintActions = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const savedComplaints = localStorage.getItem('complaints');
    return savedComplaints ? JSON.parse(savedComplaints) : initialComplaintsData;
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const addComplaint = (newComplaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => {
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
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
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
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    toast({
      title: "Complaint updated",
      description: "Your complaint has been successfully updated.",
    });
  };

  const deleteComplaint = (id: number) => {
    const updatedComplaints = complaints.filter(complaint => complaint.id !== id);
    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
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
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
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

  return {
    complaints,
    setComplaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
    updateComplaintStatus
  };
};
