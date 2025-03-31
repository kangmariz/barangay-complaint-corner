
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarangayLogo } from '@/components';
import { Search, Menu, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="bg-barangay-blue p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/" className="flex items-center">
            <BarangayLogo className="w-10 h-10 mr-2" />
            <span className="text-white text-2xl font-bold">BNCMS</span>
          </Link>
        </div>
      </div>
      
      <div className="flex-1 max-w-xl mx-4">
        <form onSubmit={handleSearch} className="relative">
          <Input 
            type="search" 
            placeholder="Search" 
            className="w-full pl-4 pr-10 py-2 rounded-full bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" 
            size="icon"
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
                <span>{user?.fullName || "Resident"}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full cursor-pointer">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
