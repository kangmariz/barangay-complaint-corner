
import React from 'react';

const BarangayLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`rounded-full overflow-hidden ${className}`}>
    <img
      src="/public/lovable-uploads/f3f03990-ed80-4d1e-a899-54613ced0a52.png"
      alt="Barangay Nabuad Logo"
      className="w-full h-full object-contain"
    />
  </div>
);

export default BarangayLogo;
