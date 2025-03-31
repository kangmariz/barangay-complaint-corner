
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarangayLogo } from '@/components';

const SignupForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await signup(fullName, username, password, contactNumber);
      if (success) {
        navigate('/home');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <BarangayLogo className="w-32 h-32" />
      </div>
      
      <div className="text-center text-white mb-4">
        <h1 className="text-4xl font-bold mb-2">Create an Account</h1>
        <p className="text-lg">
          Join the Barangay Nabuad Complaint Management System to submit<br />
          complaints and stay informed about barangay updates.
        </p>
      </div>
      
      <div className="w-full max-w-2xl bg-white rounded-lg p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <span className="text-red-500 text-sm">*</span>
            </div>
            
            <div>
              <Input
                type="text"
                placeholder="Email Address / Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <span className="text-red-500 text-sm">*</span>
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <span className="text-red-500 text-sm">*</span>
            </div>
            
            <div>
              <Input
                type="text"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-10 py-3 bg-barangay-blue hover:bg-blue-700 text-white rounded-md font-semibold"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 text-white">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-white font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
