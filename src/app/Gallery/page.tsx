"use client";
import React, { useState, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { FloatingDock } from '../../../components/FloatingDock';
import {
  IconHome,
  IconUsers,
  IconPhoto,
  IconCalendarEvent,
  IconInfoCircle,
  IconMail,
  IconBrandGithub,
} from '@tabler/icons-react';

const Gallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    '/images/gallery_sample/1.webp',
    '/images/gallery_sample/2.webp',
    '/images/gallery_sample/3.webp',
    '/images/gallery_sample/4.webp',
    '/images/gallery_sample/5.webp',
  ];

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Team",
      icon: (
        <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Team",
    },
    {
      title: "Events",
      icon: (
        <IconCalendarEvent className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Events",
    },
    {
      title: "Gallery",
      icon: (
        <IconPhoto className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Gallery",
    },
    {
      title: "FAQ",
      icon: (
        <IconInfoCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/FAQ",
    },
    {
      title: "Contact",
      icon: (
        <IconMail className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Contact",
    },
  ];

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
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
      <div className="relative w-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-6xl h-[600px] md:h-[700px] lg:h-[800px] rounded-2xl overflow-hidden shadow-2xl">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
                             <img
                 src={image}
                 alt={`Gallery Image ${index + 1}`}
                 className="w-full h-full object-contain"
               />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </div>
        
        {/* Image Counter */}
        {/* <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold z-20">
          {currentImageIndex + 1} / {images.length}
        </div> */}

        {/* Navigation Buttons */}
        <div className="absolute bottom-8 right-8 flex space-x-4 z-20">
          <button
            onClick={goToPrevious}
            className="relative group overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 p-1 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-110 hover:rotate-3"
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
            className="relative group overflow-hidden bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 p-1 rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-110 hover:-rotate-3"
            aria-label="Next image"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative bg-black/80 backdrop-blur-md p-3 rounded-full border border-cyan-400/30 hover:border-cyan-300/60 transition-all duration-300">
              <IconChevronRight className="w-6 h-6 text-white group-hover:text-cyan-200 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500 -z-10"></div>
          </button>
        </div>

        {/* Page Title */}
        {/* <div className="absolute top-8 left-8 z-20">
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-lg text-white">
            Gallery
          </h1>
          <p className="text-sm md:text-lg text-gray-200 mt-1 drop-shadow-lg">
            Relive the moments from Sabrang '25!
          </p>
        </div> */}
      </div>
      
      {/* Floating Dock positioned at left center */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50">
        <FloatingDock
          mobileClassName="translate-y-0"
          items={links}
        />
      </div>
    </div>
  );
};

export default Gallery; 