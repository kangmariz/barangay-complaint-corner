
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarangayLogo } from '@/components';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
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
        <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-lg">
          Log in to access the Barangay Nabuad Complaint Management System<br />
          and stay updated on your complaints and announcements.
        </p>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Email Address / Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
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
          </div>
          
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-barangay-blue hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 text-white">
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="text-white font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
