"use client";

import React from 'react';

const WhySponsorUs = () => {
  const images = [
    '/images/Why Sponsor us/1.webp',
    '/images/Why Sponsor us/2.webp',
    '/images/Why Sponsor us/3.webp',
    '/images/Why Sponsor us/4.webp',
    '/images/Why Sponsor us/5.webp',
    '/images/Why Sponsor us/6.webp',
    '/images/Why Sponsor us/7.webp',
    '/images/Why Sponsor us/8.webp',
    '/images/Why Sponsor us/9.webp',
    '/images/Why Sponsor us/10.webp',
    '/images/Why Sponsor us/11.webp'
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Images Container */}
      {images.map((image, index) => (
        <div key={index} className="w-full">
          <img 
            src={image} 
            alt={`Sponsorship slide ${index + 1}`}
            className="w-full h-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default WhySponsorUs;

