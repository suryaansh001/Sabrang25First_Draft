"use client";

import Link from 'next/link';
import React from 'react';

interface TopRightJKLULogoProps {
  className?: string;
}

const TopRightJKLULogo: React.FC<TopRightJKLULogoProps> = ({ className = '' }) => {
  return (
    <div
      className={`hidden md:block fixed right-[20px] top-[20px] z-[200] select-none pointer-events-none ${className}`}
      aria-hidden
    >
     <Link href="/" className="pointer-events-auto">
        <img
          src="/JKLU_logo_white.png"
          alt="JKLU"
          className="w-25 h-25 md:w-25 md:h-25 object-contain opacity-90"
        />
      </Link>
    </div>
  );
};

export default TopRightJKLULogo;


