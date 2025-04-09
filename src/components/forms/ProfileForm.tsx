
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
import { useToast } from '@/components/ui/use-toast';

const ProfileForm: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user profile
    updateUserProfile({
      fullName,
      email,
      contactNumber
    });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "New password and confirmation must match",
      });
      return;
    }
    
    if (currentPassword !== 'password') { // Simulating password check
      toast({
        variant: "destructive",
        title: "Incorrect password",
        description: "Your current password is incorrect",
      });
      return;
    }
    
    // In a real app, you would call an API to change the password
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    });
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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
            <form onSubmit={handleProfileUpdate} className="space-y-6">
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
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter your contact number"
                  className="border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-barangay-blue text-white px-6 py-2 rounded-md"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="password">
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
                  className="bg-barangay-blue text-white px-6 py-2 rounded-md"
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
