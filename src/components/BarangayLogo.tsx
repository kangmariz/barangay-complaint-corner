import React from 'react';

const BarangayLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`w-48 h-48 ${className}`}>
    <img
      src="/public/uploads/Logo2.png"
      alt="Barangay Nabuad Logo"
      className="w-full h-full object-contain"
    />
  </div>
);

export default BarangayLogo;
