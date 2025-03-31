
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NotFound = () => {
  const { user } = useAuth();
  const redirectPath = user ? (user.role === "admin" ? "/dashboard" : "/home") : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-barangay-blue to-barangay-purple p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-barangay-blue mb-4">404</h1>
          <p className="text-xl text-gray-700 mb-6">Oops! Page not found</p>
          <p className="text-gray-500 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link 
            to={redirectPath} 
            className="bg-barangay-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to {user ? (user.role === "admin" ? "Dashboard" : "Home") : "Login"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
