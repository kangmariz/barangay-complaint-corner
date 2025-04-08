import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>; // Adjusted to return boolean
  signup: (fullName: string, username: string, password: string, contactNumber: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    username: 'john',
    email: 'john@example.com',
    contactNumber: '09123456789',
    role: 'resident'
  },
  {
    id: '2',
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@example.com',
    contactNumber: '09123456788',
    role: 'admin'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem('barangay_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => { // Changed to return boolean
    try {
      const foundUser = mockUsers.find(u => u.username === username);
  
      if (foundUser && password === 'password') { // Simulating password check
        setUser(foundUser);
        localStorage.setItem('barangay_user', JSON.stringify(foundUser));
  
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.fullName}!`,
        });

        // Return true for successful login
        return true;
      }
  
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password",
      });
      return false; // Return false if login failed
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An error occurred while trying to log in.",
      });
      return false; // Return false on error
    }
  };

  const signup = async (
    fullName: string, 
    username: string, 
    password: string, 
    contactNumber: string
  ): Promise<boolean> => {
    try {
      // Check if username already exists
      if (mockUsers.some(u => u.username === username)) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "Username already exists",
        });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        fullName,
        username,
        email: `${username}@example.com`, // Generating a fake email for demo
        contactNumber,
        role: 'resident'
      };

      // In a real app, this would be an API call to create a user account
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('barangay_user', JSON.stringify(newUser));
      
      toast({
        title: "Account created",
        description: "✅ You've successfully signed up!",
      });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Signup error",
        description: "An error occurred while trying to create your account.",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('barangay_user');
    toast({
      title: "Logged out",
      description: "✅ You've been successfully logged out",
    });
  };
  
  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('barangay_user', JSON.stringify(updatedUser));
      
      // Update in mock data too
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex >= 0) {
        mockUsers[userIndex] = updatedUser;
      }
      
      toast({
        title: "Profile updated",
        description: "✅ Your profile has been successfully updated",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
