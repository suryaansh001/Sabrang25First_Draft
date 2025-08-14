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
      <Logo />
      <SidebarDock />
      
      {/* Main Image Display */}
      <div className="relative w-full h-screen flex items-center justify-center p-6">
        <div className="relative w-full max-w-4xl h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
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
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </div>
        
        {/* Image Counter */}
        <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold z-20">
          {currentImageIndex + 1} / {images.length}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-8 right-8 flex space-x-2 z-20">
          <button
            onClick={goToPrevious}
            className="bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-300 p-2 rounded-full text-white group"
            aria-label="Previous image"
          >
            <IconChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>

          <button
            onClick={goToNext}
            className="bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-300 p-2 rounded-full text-white group"
            aria-label="Next image"
          >
            <IconChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Page Title */}
        <div className="absolute top-8 left-8 z-20">
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-lg text-white">
            Gallery
          </h1>
          <p className="text-sm md:text-lg text-gray-200 mt-1 drop-shadow-lg">
            Relive the moments from Sabrang '25!
          </p>
        </div>
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