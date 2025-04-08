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
  const { login, user } = useAuth();  // Destructure user to access the logged-in user
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        // After successful login, navigate based on user role
        if (user?.role === 'admin') {
          navigate('/dashboard');  // Redirect to dashboard if admin
        } else {
          navigate('/home');  // Redirect to home if resident
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container flex flex-col items-center justify-center p-4">
      <Link to="/home" className="block">
        <BarangayLogo className="w-32 h-32" />
      </Link>

      <div className="text-center text-white mb-4">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-lg mb-2">
          Log in to access the Barangay Nabuad Complaint Management System and stay<br />
          updated on your complaints and announcements.
        </p>
        <hr className="border-t-4 border-[#03327b] my-4"></hr>
      </div>

      <div className="w-80 max-w-md rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Username"
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

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-40 bg-[#03327b] hover:bg-[#053788FF] text-white py-3 rounded-md font-semibold"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-10 text-white">
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#03327b] font-bold hover:text-[#053788FF]">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
