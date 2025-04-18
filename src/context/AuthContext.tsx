
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// User type definition
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  contactNumber?: string;
  role: 'user' | 'admin';
  profilePicture?: string;
}

// Mock admin user for demonstration
const adminUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@barangay.gov.ph',
  fullName: 'Admin User',
  contactNumber: '09123456789',
  role: 'admin',
  profilePicture: '/public/uploads/profile.png'
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (fullName: string, username: string, password: string, email: string) => Promise<boolean>;
  updateUserProfile: (profileData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user state from local storage if available
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Mock user database in localStorage
  const getUsersFromStorage = (): User[] => {
    const savedUsers = localStorage.getItem('users');
    const initialUsers = savedUsers ? JSON.parse(savedUsers) : [adminUser];
    return initialUsers;
  };
  
  const saveUsersToStorage = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  // Initialize users in localStorage if not exists
  useEffect(() => {
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      saveUsersToStorage([adminUser]);
    }
  }, []);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, validate credentials against API
    // Here, we're just checking against our mock users in localStorage
    if (username === 'admin' && password === 'password') {
      setUser(adminUser);
      navigate('/dashboard');
      toast({
        title: "Login Successful",
        description: "Welcome back, Admin!",
      });
      return true;
    }
    
    // Check regular users
    const users = getUsersFromStorage();
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser) {
      setUser(foundUser);
      navigate(foundUser.role === 'admin' ? '/dashboard' : '/home');
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.fullName || foundUser.username}!`,
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username or password",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const signup = async (fullName: string, username: string, password: string, email: string): Promise<boolean> => {
    // In a real app, send request to API for signup
    // For now, just add to our mock users list
    const users = getUsersFromStorage();
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Username already taken",
      });
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      fullName,
      role: 'user',
      profilePicture: '/public/uploads/profile.png'
    };
    
    // Add to users list and save
    users.push(newUser);
    saveUsersToStorage(users);
    
    // Log in the new user
    setUser(newUser);
    navigate('/home');
    
    toast({
      title: "Account Created",
      description: "Your account has been successfully created.",
    });
    return true;
  };

  const updateUserProfile = (profileData: Partial<User>) => {
    if (!user) return;
    
    // Update current user
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    
    // Also update in the users list
    const users = getUsersFromStorage();
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...profileData } : u
    );
    
    saveUsersToStorage(updatedUsers);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateUserProfile }}>
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
