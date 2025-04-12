
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Menu, ChevronDown, Settings, LogOut } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Use the user's profile picture if available, otherwise use the default
  const profilePicture = user?.profilePicture || "/public/uploads/profile.png";

  return (
    <nav className="bg-barangay-blue py-2 px-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-4"> 
        <Button variant="ghost" className="text-white" onClick={toggleSidebar}>
          <Menu className="h-10 w-10" />
        </Button>

        <form onSubmit={handleSearch} className="relative w-64"> 
          <Input 
            type="search" 
            placeholder="Search" 
            className="w-full pl-4 pr-12 py-2 rounded-full bg-white border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            className="absolute right-0 top-0 h-full rounded-full px-3 bg-barangay-blue text-white" 
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>
      
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center text-white">
              <div className="rounded-full">
                <img 
                  src={profilePicture} 
                  alt="User" 
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
              <div className="flex items-center">
                <span>{user?.fullName || "Anonymous"}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild className="flex items-center">
              <Link to="/profile" className="w-full cursor-pointer flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
