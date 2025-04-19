import React, { useState } from 'react';
import { useComplaints } from '@/context/ComplaintContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ComplaintForm: React.FC = () => {
  const { addComplaint } = useComplaints();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purok, setPurok] = useState('');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setContactNumber(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert photo to base64 if it exists
    let photoData;
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        photoData = reader.result;
        
        // Create complaint object with base64 photo
        const complaintData = {
          title,
          description,
          purok,
          anonymous: isAnonymous,
          fullName: isAnonymous ? undefined : fullName,
          contactNumber: isAnonymous ? undefined : contactNumber,
          photo: photoData
        };
        
        addComplaint(complaintData);
        setShowSuccess(true);
        
        // Reset form after submission
        setTitle('');
        setDescription('');
        setPurok('');
        setPhoto(null);
        
        // Navigate to my complaints after a short delay
        setTimeout(() => {
          navigate('/my-complaints');
        }, 2000);
      };
      
      reader.readAsDataURL(photo);
    } else {
      // Create complaint object without photo
      const complaintData = {
        title,
        description,
        purok,
        anonymous: isAnonymous,
        fullName: isAnonymous ? undefined : fullName,
        contactNumber: isAnonymous ? undefined : contactNumber
      };
      
      addComplaint(complaintData);
      setShowSuccess(true);
      
      // Reset form after submission
      setTitle('');
      setDescription('');
      setPurok('');
      setPhoto(null);
      
      // Navigate to my complaints after a short delay
      setTimeout(() => {
        navigate('/my-complaints');
      }, 2000);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      {showSuccess && (
        <Alert className="bg-green-50 border-green-200 mb-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertDescription className="text-green-700">
            Your complaint has been successfully submitted!
          </AlertDescription>
        </Alert>
      )}
      <CardHeader>
        <CardTitle className="text-2xl text-black font-bold">Submit a Complaint</CardTitle>
        <CardDescription>
          Fill out the form below to submit your complaint to the barangay officials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-2 mb-6">
            <Switch
              id="anonymous-mode"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
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
                  onChange={handleContactNumberChange}
                  placeholder="Enter your contact number"
                  className="border border-gray-300 rounded-md"
                  required={!isAnonymous}
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photo">Photo (Optional)</Label>
            <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
              <Label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {photo ? photo.name : "Click to upload a photo"}
                </span>
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPhoto(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-barangay-blue text-white px-8 py-2 rounded-md text-lg"
            >
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;
