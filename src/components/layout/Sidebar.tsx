
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, FilePlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  
  const isAdmin = user?.role === 'admin';
  const isCollapsed = state === 'collapsed';
  
  const navLinkClasses = "flex items-center space-x-3 text-white p-4 hover:bg-white/10 transition-colors rounded-md";
  const activeNavLinkClasses = "bg-white/20";
  
  return (
    <aside className={cn(
      "barangay-sidebar min-h-screen transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "pt-6 pb-4 flex flex-col items-center",
        isCollapsed && "px-2"
      )}>
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 mb-3">
          <img
            src="/public/lovable-uploads/3980b204-d0cf-4f1a-bdfd-61e2019f00cf.png"
            alt="User"
            className="h-full w-full object-cover"
          />
        </div>
        {!isCollapsed && (
          <h2 className="text-white text-xl font-semibold">{user?.fullName || "Resident"}</h2>
        )}
      </div>
      
      <div className="border-t border-white/20 my-4"></div>
      
      <nav className={cn(
        "px-4 py-2",
        isCollapsed && "px-2"
      )}>
        <ul className="space-y-2">
          {isAdmin ? (
            <>
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    cn(
                      navLinkClasses, 
                      isActive && activeNavLinkClasses,
                      isCollapsed && "justify-center p-2"
                    )
                  }
                >
                  <LayoutDashboard className="h-5 w-5" />
                  {!isCollapsed && <span>Dashboard</span>}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/complaints" 
                  className={({ isActive }) => 
                    cn(
                      navLinkClasses, 
                      isActive && activeNavLinkClasses,
                      isCollapsed && "justify-center p-2"
                    )
                  }
                >
                  <FileText className="h-5 w-5" />
                  {!isCollapsed && <span>Complaints</span>}
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink 
                  to="/home" 
                  className={({ isActive }) => 
                    cn(
                      navLinkClasses, 
                      isActive && activeNavLinkClasses,
                      isCollapsed && "justify-center p-2"
                    )
                  }
                >
                  <Home className="h-5 w-5" />
                  {!isCollapsed && <span>Home</span>}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/my-complaints" 
                  className={({ isActive }) => 
                    cn(
                      navLinkClasses, 
                      isActive && activeNavLinkClasses,
                      isCollapsed && "justify-center p-2"
                    )
                  }
                >
                  <FileText className="h-5 w-5" />
                  {!isCollapsed && <span>My Complaints</span>}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/submit-complaint" 
                  className={({ isActive }) => 
                    cn(
                      navLinkClasses, 
                      isActive && activeNavLinkClasses, 
                      isCollapsed && "justify-center p-2"
                    )
                  }
                >
                  <FilePlus className="h-5 w-5" />
                  {!isCollapsed && <span>Submit Complaint</span>}
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
