
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
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const EditComplaintPage: React.FC = () => {
  const { user } = useAuth();
  const { userComplaints, updateComplaint } = useComplaints();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  const [showNotEditable, setShowNotEditable] = useState(false);
  
  useEffect(() => {
    if (id && userComplaints && userComplaints.length > 0) {
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
        
        if (foundComplaint.status !== 'Pending') {
          setShowNotEditable(true);
        }
      }
    }
  }, [id, userComplaints]);
  
  const isEditable = complaint?.status === 'Pending';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditable) {
      setShowNotEditable(true);
      return;
    }
    
    if (!isAnonymous && (!fullName || !contactNumber)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (!complaint) return;
    
    const updatedComplaint = {
      ...complaint,
      title,
      description,
      purok,
      anonymous: isAnonymous,
      fullName: isAnonymous ? undefined : fullName,
      contactNumber: isAnonymous ? undefined : contactNumber,
      photo: photoUrl
    };
    
    updateComplaint(updatedComplaint);
    setShowSuccess(true);
    
    toast({
      title: "Complaint Updated",
      description: "Your complaint has been successfully updated!",
    });
    
    setTimeout(() => {
      navigate('/my-complaints');
    }, 2000);
  };
  
  const handleViewPhoto = (photoUrl?: string) => {
    if (photoUrl) {
      window.open(photoUrl, '_blank');
    }
  };
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (id && !complaint) {
    return <Navigate to="/my-complaints" replace />;
  }
  
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Card className="w-full max-w-4xl mx-auto">
          {showSuccess && (
            <Alert className="bg-green-50 border-green-200 mb-4 mt-4 mx-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-green-700">
                Your complaint has been successfully updated!
              </AlertDescription>
            </Alert>
          )}
          
          {showNotEditable && (
            <Alert className="bg-amber-50 border-amber-200 mb-4 mt-4 mx-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <AlertDescription className="text-amber-700">
                This complaint cannot be edited because its status is {complaint?.status}. Only complaints with 'Pending' status can be edited.
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
                  disabled={!isEditable}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditComplaintPage;
