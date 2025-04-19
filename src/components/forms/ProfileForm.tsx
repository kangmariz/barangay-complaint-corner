
import React, { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, Upload, Camera, User, AlertCircle } from 'lucide-react';

const ProfileForm: React.FC = () => {
  const { user, updateUserProfile, verifyPassword, changePassword } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user profile
    updateUserProfile({
      fullName,
      email,
      contactNumber,
      profilePicture
    });
    
    setProfileUpdateSuccess(true);
    setTimeout(() => setProfileUpdateSuccess(false), 3000);
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    // Validate password
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "New password and confirmation must match",
      });
      return;
    }
    
    // Use the new changePassword function that verifies the current password
    const success = changePassword(currentPassword, newPassword);
    
    if (success) {
      setPasswordUpdateSuccess(true);
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setPasswordUpdateSuccess(false), 3000);
    }
    // The toast notifications are handled in the AuthContext
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setContactNumber(value);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
        <CardDescription>
          Manage your personal information and account security.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            {profileUpdateSuccess && (
              <Alert className="bg-green-50 border-green-200 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertDescription className="text-green-700">
                  Your profile has been successfully updated!
                </AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profilePicture} alt={fullName} />
                    <AvatarFallback>
                      <User className="h-12 w-12 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <Label 
                    htmlFor="profile-picture" 
                    className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <Input 
                      id="profile-picture" 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </Label>
                </div>
                <p className="text-sm text-gray-500">Click the camera icon to change your profile picture</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={contactNumber}
                  onChange={handleContactNumberChange}
                  placeholder="Enter your contact number"
                  className="border border-gray-300 rounded-md"
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-md"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="password">
            {passwordUpdateSuccess && (
              <Alert className="bg-green-50 border-green-200 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertDescription className="text-green-700">
                  Your password has been successfully changed!
                </AlertDescription>
              </Alert>
            )}
            
            {passwordError && (
              <Alert className="bg-red-50 border-red-200 mb-4">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <AlertDescription className="text-red-700">
                  {passwordError}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-md"
                >
                  Change Password
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
