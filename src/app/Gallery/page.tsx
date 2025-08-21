"use client";
import React, { useState, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Footer from '../../../components/Footer';

const Gallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, size: number, animationDelay: number, duration: number}>>([]);
  
  const images = [
    '/images/gallery_desktop/1.png',
    '/images/gallery_desktop/2.png',
    // '/images/gallery_sample/3.webp',
    // '/images/gallery_sample/4.webp',
    // '/images/gallery_sample/5.webp',
  ];

  // Generate stars for the background
  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        animationDelay: Math.random() * 3,
        duration: Math.random() * 4 + 2
      }));
      setStars(newStars);
    };
    generateStars();
  }, []);

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
    <div className="min-h-screen text-white font-sans relative overflow-hidden">
      {/* Starry Space Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 via-pink-900 to-black -z-10">
        {/* Animated Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
        
        {/* Nebula Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

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
      <div className="relative w-full flex items-center justify-center p-1 z-10 h-[calc(100vh-120px)]">
        <div className="relative w-full max-w-9xl h-full rounded-2xl overflow-hidden">
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
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons - Positioned beside the image */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-20">
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
      </div>

      {/* Footer with proper z-index */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Gallery;