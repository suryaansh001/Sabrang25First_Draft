import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`fixed top-2 left-2 sm:top-3 sm:left-3 z-[40] ${className}`}>
      <div className="flex items-center justify-center">
        <Image
          src="/images/Logo@2x.png"
          alt="Sabrang Festival Logo"
          width={112}
          height={76}
          sizes="(max-width: 480px) 64px, (max-width: 640px) 80px, (max-width: 768px) 112px, 144px"
          priority
          className="w-16 h-auto xs:w-20 sm:w-24 md:w-32"
        />
      </div>
    </div>
  );
};

export default Logo;
