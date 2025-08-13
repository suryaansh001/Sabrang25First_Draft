import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`fixed top-4 left-4 z-50 ${className}`}>
      <Image
        src="/images/Logo@2x.png"
        alt="Sabrang Logo"
        width={90}
        height={80}
        className="w-26 h-16 ml-16 md:w-20 md:h-20 drop-shadow-lg"
        priority
      />
    </div>
  );
};

export default Logo;
