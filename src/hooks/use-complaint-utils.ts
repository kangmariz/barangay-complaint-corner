
import { Complaint } from '@/types';

export const useComplaintUtils = (complaints: Complaint[], userComplaints: Complaint[]) => {
  const searchComplaints = (query: string, isAdmin: boolean): Complaint[] => {
    if (!query) return isAdmin ? complaints : userComplaints;
    
    const searchTerm = query.toLowerCase();
    const filtered = (isAdmin ? complaints : userComplaints).filter(
      complaint => 
        complaint.title.toLowerCase().includes(searchTerm) ||
        complaint.description.toLowerCase().includes(searchTerm) ||
        complaint.purok.toLowerCase().includes(searchTerm) ||
        complaint.status.toLowerCase().includes(searchTerm)
    );
    
    return filtered;
  };

  const deleteAllResolved = (
    setComplaints: (complaints: Complaint[]) => void,
    toast: any
  ) => {
    const resolvedComplaints = complaints.filter(complaint => complaint.status === 'Resolved');
    
    if (resolvedComplaints.length === 0) {
      toast({
        title: "No Resolved Complaints",
        description: "There are no resolved complaints to delete at this time.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedComplaints = complaints.filter(complaint => complaint.status !== 'Resolved');
    setComplaints(updatedComplaints);
    localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
    
    toast({
      title: "Complaints Deleted",
      description: `Successfully deleted ${resolvedComplaints.length} resolved complaint(s).`,
    });
  };

  const hasResolvedComplaints = (): boolean => {
    return complaints.some(complaint => complaint.status === 'Resolved');
  };

  return {
    searchComplaints,
    deleteAllResolved,
    hasResolvedComplaints
  };
};
