import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`fixed top-4 left-4 z-50 ${className}`}>
      <div className="w-30 h-26 ml-12 flex items-center justify-center top-0">
        <img 
          src="/images/Logo@2x.png" 
          alt="Logo" 
          className="w-36 h-25" 
          onError={(e) => { 
            (e.target as HTMLImageElement).src = '/images/Logo.svg'; 
          }} 
        />
      </div>
    </div>
  );
};

export default Logo;
