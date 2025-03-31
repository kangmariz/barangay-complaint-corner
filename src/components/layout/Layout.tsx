
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch }) => {
  const { user } = useAuth();
  
  // No layout for unauthenticated users
  if (!user) {
    return <>{children}</>;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar onSearch={onSearch} />
          <main className="flex-1 bg-gray-100">
            {children}
          </main>
          <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
            © 2025 Barangay Nabuad Complaint Management System. All Rights Reserved.
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
