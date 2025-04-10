
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components';
import { useComplaints } from '@/context/ComplaintContext';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const EditComplaintPage: React.FC = () => {
  const { user } = useAuth();
  const { userComplaints, updateComplaintStatus } = useComplaints();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [complaint, setComplaint] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purok, setPurok] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Find the complaint by ID
  useEffect(() => {
    if (id && userComplaints) {
      const foundComplaint = userComplaints.find(c => c.id === parseInt(id));
      if (foundComplaint) {
        setComplaint(foundComplaint);
        setTitle(foundComplaint.title);
        setDescription(foundComplaint.description);
        setPurok(foundComplaint.purok);
        setIsAnonymous(foundComplaint.anonymous);
        setFullName(foundComplaint.fullName || '');
        setContactNumber(foundComplaint.contactNumber || '');
        setPhotoUrl(foundComplaint.photo);
      }
    }
  }, [id, userComplaints]);
  
  // Check if complaint is editable
  const isEditable = complaint?.status === 'Pending';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditable) {
      return;
    }
    
    // In a real app, you would call an API to update the complaint
    // For now, we'll just simulate success
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/my-complaints');
    }, 2000);
  };
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect if complaint not found or not owned by user
  if (id && !complaint) {
    return <Navigate to="/my-complaints" replace />;
  }
  
  // Redirect if complaint is not editable
  if (complaint && !isEditable) {
    return <Navigate to="/my-complaints" replace />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Card className="w-full max-w-4xl mx-auto">
          {showSuccess && (
            <Alert className="bg-green-50 border-green-200 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-green-700">
                Your complaint has been successfully updated!
              </AlertDescription>
            </Alert>
          )}
          <CardHeader>
            <CardTitle className="text-2xl text-black font-bold">Edit Complaint</CardTitle>
            <CardDescription>
              Make changes to your pending complaint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Switch
                  id="anonymous-mode"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  disabled={!isEditable}
                />
                <Label htmlFor="anonymous-mode">Submit anonymously</Label>
              </div>
              
              {!isAnonymous && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center">
                      Full Name
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="border border-gray-300 rounded-md"
                      required={!isAnonymous}
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="flex items-center">
                      Contact Number
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="contactNumber"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Enter your contact number"
                      className="border border-gray-300 rounded-md"
                      required={!isAnonymous}
                      disabled={!isEditable}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="complaintTitle" className="flex items-center">
                  Complaint Title
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="complaintTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your complaint"
                  required
                  className="border border-gray-300 rounded-md"
                  disabled={!isEditable}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="complaintDescription" className="flex items-center">
                  Complaint Description
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="complaintDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your complaint in detail"
                  required
                  className="min-h-32 border border-gray-300 rounded-md"
                  disabled={!isEditable}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purok" className="flex items-center">
                  Purok
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="purok"
                  value={purok}
                  onChange={(e) => setPurok(e.target.value)}
                  placeholder="Enter the purok location"
                  required
                  className="border border-gray-300 rounded-md"
                  disabled={!isEditable}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo">Photo (Optional)</Label>
                <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                  {photoUrl ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={photoUrl} 
                        alt="Complaint" 
                        className="max-h-40 mb-2" 
                        onClick={() => handleViewPhoto(photoUrl)}
                      />
                      {isEditable && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setPhotoUrl(undefined)}
                        >
                          Replace Photo
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Label
                      htmlFor="photo-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        {photo ? photo.name : "Click to upload a photo"}
                      </span>
                      {isEditable && (
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setPhoto(e.target.files[0]);
                              setPhotoUrl(URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                          disabled={!isEditable}
                        />
                      )}
                    </Label>
                  )}
                </div>
              </div>
              
              {isEditable && (
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/my-complaints')}
                    className="px-8 py-2 rounded-md text-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-barangay-blue text-white px-8 py-2 rounded-md text-lg"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Helper function to handle viewing photos
const handleViewPhoto = (photoUrl?: string) => {
  if (photoUrl) {
    window.open(photoUrl, '_blank');
  }
};

export default EditComplaintPage;
