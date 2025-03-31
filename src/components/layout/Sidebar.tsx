
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, FilePlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  const navLinkClasses = "flex items-center space-x-3 text-white p-4 hover:bg-white/10 transition-colors rounded-md";
  const activeNavLinkClasses = "bg-white/20";
  
  return (
    <aside className="barangay-sidebar w-64 min-h-screen">
      <div className="pt-6 pb-4 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 mb-3">
          <img
            src="/public/lovable-uploads/3980b204-d0cf-4f1a-bdfd-61e2019f00cf.png"
            alt="User"
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="text-white text-xl font-semibold">{user?.fullName || "Resident"}</h2>
      </div>
      
      <div className="border-t border-white/20 my-4"></div>
      
      <nav className="px-4 py-2">
        <ul className="space-y-2">
          {isAdmin ? (
            <>
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    cn(navLinkClasses, isActive && activeNavLinkClasses)
                  }
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/complaints" 
                  className={({ isActive }) => 
                    cn(navLinkClasses, isActive && activeNavLinkClasses)
                  }
                >
                  <FileText className="h-5 w-5" />
                  <span>Complaints</span>
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink 
                  to="/home" 
                  className={({ isActive }) => 
                    cn(navLinkClasses, isActive && activeNavLinkClasses)
                  }
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/my-complaints" 
                  className={({ isActive }) => 
                    cn(navLinkClasses, isActive && activeNavLinkClasses)
                  }
                >
                  <FileText className="h-5 w-5" />
                  <span>My Complaints</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/submit-complaint" 
                  className={({ isActive }) => 
                    cn(navLinkClasses, isActive && activeNavLinkClasses)
                  }
                >
                  <FilePlus className="h-5 w-5" />
                  <span>Submit Complaint</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
