
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarangayLogo } from '@/components';
import { useToast } from '@/hooks/use-toast';

const SignupForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate fields
    const newErrors: Record<string, string> = {};
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Order of parameters matches the updated function signature
      await signup(fullName, username, password, email);
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ form: "Failed to create account. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container flex flex-col items-center justify-center p-4">
      <Link to="/home">
        <BarangayLogo className="w-32 h-32" />
      </Link>
      
      <div className="text-center text-white mb-4">
        <h1 className="text-4xl font-bold mb-4">Create an Account</h1>
        <p className="text-lg mb-2">
          Join the Barangay Nabuad Complaint Management System to submit<br />
          complaints and stay informed about barangay updates.
        </p>
        <hr className="border-t-4 border-[#03327b] my-4"></hr>
      </div>
      
      <div className="w-full max-w-md rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          {errors.form && (
            <p className="text-red-500 text-sm text-center">{errors.form}</p>
          )}
          
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-40 bg-[#03327b] hover:bg-[#053788FF] text-white py-3 rounded-md font-semibold"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="mt-10 text-white">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-[#03327b] font-bold hover:text-[#053788FF]">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
