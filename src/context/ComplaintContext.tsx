
import React, { createContext, useContext, useEffect } from 'react';
import { ComplaintContextType } from '@/types/complaint';
import { useAuth } from './AuthContext';
import { useComplaintActions } from '@/hooks/use-complaint-actions';
import { useComplaintUtils } from '@/hooks/use-complaint-utils';
import { useToast } from '@/hooks/use-toast';

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    complaints,
    setComplaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
    updateComplaintStatus
  } = useComplaintActions();

  const userComplaints = user 
    ? complaints.filter(complaint => 
        complaint.userId === user.id || 
        (complaint.anonymous && complaint.userId === user.id)
      )
    : [];

  const { searchComplaints, deleteAllResolved: deleteAllResolvedUtil } = useComplaintUtils(complaints, userComplaints);

  // Save to localStorage whenever complaints change
  useEffect(() => {
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }, [complaints]);

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
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the complaint.",
    });
  };

  const contextValue: ComplaintContextType = {
    complaints,
    userComplaints,
    addComplaint,
    updateComplaint,
    updateComplaintStatus,
    deleteComplaint,
    searchComplaints: (query: string) => searchComplaints(query, user?.role === 'admin'),
    addComment,
    deleteAllResolved: () => deleteAllResolvedUtil(setComplaints, toast)
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
