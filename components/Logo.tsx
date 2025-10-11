import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div 
      className={`hidden lg:block fixed top-7 left-8 z-[100] transition-transform duration-300 ease-in-out ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <a href="/" aria-label="Go to homepage">
          <img 
            src="/images/Logo@2x.png" 
            alt="Logo" 
            className="h-10 w-auto lg:h-25 lg:w-31 cursor-pointer" 
            onError={(e) => { 
              (e.target as HTMLImageElement).src = '/images/Logo.svg'; 
            }} 
          />
        </a>
        {/* JK TYRE Logo - Small below Sabrang logo */}
        <img
          src="/logo_sponser.png"
          alt="JK TYRE - TOTAL CONTROL"
          className="h-6 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default Logo;
