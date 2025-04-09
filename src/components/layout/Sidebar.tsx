
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, FileText, FilePlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  
  const isAdmin = user?.role === 'admin';
  const isCollapsed = state === 'collapsed';
  const homePath = isAdmin ? '/dashboard' : '/home';
  
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
        {/* Logo Resizing - Make clickable */}
        <Link to={homePath} className="block">
          <div className={cn(
            "mb-2 transition-all duration-300",
            isCollapsed ? "w-10 h-10" : "w-[140px] h-[140px]"
          )}>
            <img
              src="/public/uploads/Logo2.png"
              alt="logo"
              className="h-full w-full object-contain"
            />
          </div>
        </Link>
  
        {/* Title Resizing - Make clickable */}
        <Link to={homePath} className="block">
          <div className="flex justify-center items-center h-full text-center">
            <h2 className={cn(
              "text-white font-bold transition-all duration-300",
              isCollapsed ? "text-sm" : "text-2xl"
            )}>
              BNCMS<br />
              <span className={cn(
                "font-normal transition-all duration-300",
                isCollapsed ? "text-[7px]" : "text-[10.5px]"
              )}>
                (Barangay Nabuad Complaint Management System)
              </span>
            </h2>
          </div>
        </Link>
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
