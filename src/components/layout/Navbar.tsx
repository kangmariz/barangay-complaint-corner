
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarangayLogo } from '@/components';
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="bg-barangay-blue py-2 px-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <Button variant="ghost" className="text-white mr-2" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        <Link to="/" className="flex items-center">
          <BarangayLogo className="w-12 h-12 mr-2" />
          <span className="text-white text-2xl font-bold">BNCMS</span>
        </Link>
      </div>
      
      <div className="flex-1 max-w-xl mx-4">
        <form onSubmit={handleSearch} className="relative">
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
            <Button variant="ghost" className="flex items-center space-x-2 text-white">
              <div className="rounded-full bg-white/20 p-1">
                <img 
                  src="/public/lovable-uploads/3980b204-d0cf-4f1a-bdfd-61e2019f00cf.png" 
                  alt="User" 
                  className="h-8 w-8 rounded-full"
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
              <Link to="/profile" className="w-full cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer flex items-center">
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
