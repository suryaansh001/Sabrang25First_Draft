import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`fixed top-4 left-4 z-[40] ${className}`}>
      <div className="ml-12 flex items-center justify-center top-0">
        <Image
          src="/images/Logo@2x.png"
          alt="Sabrang Festival Logo"
          width={144} // Corresponds to Tailwind's w-36
          height={100} // A reasonable height based on w-36
          priority
        />
      </div>
    </div>
  );
};

export default Logo;
