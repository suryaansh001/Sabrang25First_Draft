"use client";
import React, { useState, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const Gallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const images = [
    '/images/gallery_sample/1.webp',
    '/images/gallery_sample/2.webp',
    '/images/gallery_sample/3.webp',
    '/images/gallery_sample/4.webp',
    '/images/gallery_sample/5.webp',
  ];

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length, isTransitioning]);

  const handleImageChange = (newIndex: number) => {
    if (newIndex !== currentImageIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex(newIndex);
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }
  };

  const goToNext = () => {
    const nextIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    handleImageChange(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    handleImageChange(prevIndex);
  };

  const goToImage = (index: number) => {
    handleImageChange(index);
  };

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden bg-gray-900">
      {/* Page Title */}
      <div className="text-center pt-16 pb-8 z-20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-3 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.35)]">
          Last Sabrang
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-white/80 drop-shadow-[0_0_12px_rgba(34,211,238,0.25)]">
          Relive the moments from Sabrang '25!
        </p>
        <div className="mt-4 h-1 w-48 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 blur-[1px]"></div>
      </div>
      
      {/* Main Image Display */}
      <div className="relative w-full flex items-center justify-center p-4 z-10">
        <div className="relative w-full max-w-6xl h-[600px] md:h-[700px] lg:h-[800px] rounded-2xl overflow-hidden shadow-2xl">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentImageIndex 
                  ? 'opacity-100 scale-100 blur-0' 
                  : 'opacity-0 scale-110 blur-sm'
              }`}
              style={{
                transform: index === currentImageIndex 
                  ? 'scale(1) rotate(0deg)' 
                  : 'scale(1.1) rotate(1deg)',
                filter: index === currentImageIndex 
                  ? 'brightness(1) contrast(1)' 
                  : 'brightness(0.8) contrast(0.8)',
              }}
            >
              <img
                src={image}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-full object-contain transition-all duration-1000 ease-in-out"
                style={{
                  transform: index === currentImageIndex 
                    ? 'scale(1)' 
                    : 'scale(1.05)',
                }}
              />
              {/* Enhanced overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <div className="absolute bottom-8 right-8 flex space-x-4 z-20">
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className={`relative group overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 p-1 rounded-full shadow-2xl transition-all duration-500 transform ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-purple-500/50 hover:scale-110 hover:rotate-3'
            }`}
            aria-label="Previous image"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative bg-black/80 backdrop-blur-md p-3 rounded-full border border-purple-400/30 hover:border-purple-300/60 transition-all duration-300">
              <IconChevronLeft className="w-6 h-6 text-white group-hover:text-purple-200 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500 -z-10"></div>
          </button>

          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className={`relative group overflow-hidden bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 p-1 rounded-full shadow-2xl transition-all duration-500 transform ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-cyan-500/50 hover:scale-110 hover:-rotate-3'
            }`}
            aria-label="Next image"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative bg-black/80 backdrop-blur-md p-3 rounded-full border border-cyan-400/30 hover:border-cyan-300/60 transition-all duration-300">
              <IconChevronRight className="w-6 h-6 text-white group-hover:text-cyan-200 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500 -z-10"></div>
          </button>
        </div>

        {/* Image thumbnails */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60 hover:scale-110'
              } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;