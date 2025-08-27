import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`fixed top-4 left-4 z-[40] ${className}`}>
      <div className="flex items-center justify-center">
        <a href="/" aria-label="Go to homepage">
          <img 
            src="/images/Logo@2x.png" 
            alt="Logo" 
            className="h-10 w-auto lg:h-25 lg:w-36 cursor-pointer" 
            onError={(e) => { 
              (e.target as HTMLImageElement).src = '/images/Logo.svg'; 
            }} 
          />
        </a>
      </div>
    </div>
  );
};

export default Logo;
