
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (fullName: string, username: string, password: string, email: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize users from localStorage or use mock data if not available
const getInitialUsers = (): User[] => {
  const savedUsers = localStorage.getItem('barangay_users');
  if (savedUsers) {
    return JSON.parse(savedUsers);
  }
  
  // Default mock users if no saved data
  return [
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
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(getInitialUsers);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Load saved user session on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('barangay_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('barangay_users', JSON.stringify(users));
  }, [users]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const foundUser = users.find(u => u.username === username);
  
      if (foundUser && password === 'password') { // Simulating password check
        setUser(foundUser);
        localStorage.setItem('barangay_user', JSON.stringify(foundUser));
  
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.fullName}!`,
        });

        return true;
      }
  
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password",
      });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An error occurred while trying to log in.",
      });
      return false;
    }
  };

  const signup = async (
    fullName: string, 
    username: string, 
    password: string, 
    email: string
  ): Promise<boolean> => {
    try {
      // Check if username already exists
      if (users.some(u => u.username === username)) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "Username already exists",
        });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: (users.length + 1).toString(),
        fullName,
        username,
        email,
        contactNumber: '', // Empty by default
        role: 'resident'
      };

      // Add to users array and update localStorage
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setUser(newUser);
      
      // Save to localStorage
      localStorage.setItem('barangay_users', JSON.stringify(updatedUsers));
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
      
      // Update in users array
      const updatedUsers = users.map(u => 
        u.id === user.id ? updatedUser : u
      );
      
      setUsers(updatedUsers);
      setUser(updatedUser);
      
      // Update in localStorage
      localStorage.setItem('barangay_users', JSON.stringify(updatedUsers));
      localStorage.setItem('barangay_user', JSON.stringify(updatedUser));
      
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
