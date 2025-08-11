'use client';

import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create stars
    const createStars = () => {
      const numberOfStars = 1000;
      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 2 + 1;
        
        // Random animation duration
        const duration = Math.random() * 3 + 2;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        
        container.appendChild(star);
      }
    };

    createStars();

    // Cleanup
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="stars" style={{ zIndex: 0 }} />
      <div className="carnival-light" style={{ top: '20%', left: '10%' }} />
      <div className="carnival-light" style={{ top: '60%', right: '15%' }} />
      <div className="carnival-light" style={{ bottom: '30%', left: '30%' }} />
    </>
  );
};

export default Background; 