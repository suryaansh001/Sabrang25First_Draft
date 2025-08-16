'use client';
import React, { memo, useEffect } from 'react';
import { Play, Github, Linkedin, LayoutDashboard } from 'lucide-react';
import SidebarDock from '../../components/SidebarDock';

// Video Background Component with multiple fallbacks
const VideoBackground = () => {
  const [videoError, setVideoError] = React.useState(false);
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [videoAttempted, setVideoAttempted] = React.useState(false);

  // Add timeout for video loading
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded && !videoError) {
        console.log('Video loading timeout, falling back to image');
        setVideoError(true);
        setVideoAttempted(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [videoLoaded, videoError]);

  const handleVideoError = (e: any) => {
    console.error('Video failed to load, falling back to hero background image', e);
    setVideoError(true);
    setVideoAttempted(true);
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
    setVideoAttempted(true);
  };

  const handleImageLoad = () => {
    console.log('Hero background image loaded successfully');
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('Hero background image failed to load, using gradient fallback');
    setImageLoaded(false);
  };

  return (
    <>
      {/* Primary fallback: Hero background image - always visible */}
      <img
        src="/images/hero.webp"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
        style={{ filter: 'brightness(0.6) contrast(1.1)' }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        crossOrigin="anonymous"
      />
      
      {/* Secondary fallback: Gradient background if image fails */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800" />
      )}
      
      {/* Video overlay - shows when video loads, covers the image */}
      {!videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          style={{ filter: 'brightness(0.7) contrast(1.2)' }}
          onError={handleVideoError}
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={handleVideoLoad}
          onLoadedData={handleVideoLoad}
          onLoad={() => console.log('Video load event fired')}
          onLoadedMetadata={() => console.log('Video metadata loaded')}
        >
          <source src="/video/herovideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </>
  );
};

const LayeredLandingPage = memo(function LayeredLandingPage() {
  useEffect(() => {
    // Check if video file is accessible
    fetch('/video/herovideo.mp4', { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log('✅ Video file is accessible:', response.status, response.statusText);
          console.log('📏 Content-Length:', response.headers.get('content-length'));
        } else {
          console.error('❌ Video file not accessible:', response.status, response.statusText);
        }
      })
      .catch(error => {
        console.error('❌ Error checking video file:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* Top Right Black Pill Notch */}
      <div 
        className="absolute top-0 right-30 z-20 w-[500px] h-[70px] bg-black rounded-[30px]"
        style={{ transform: 'translateX(50%)' }}
      />
      
      {/* Auth Buttons - Positioned above everything */}
      <div className="absolute top-2 right-8 z-50 flex items-center space-x-4">
        <a href="/Login" className="px-8 py-4 bg-black/40 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-black/60 transition-all duration-300 border border-white/30">
          Log In
        </a>
        <a href="/Signup" className="px-8 py-4 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium transition-all duration-300 border border-white/40">
          Sign Up
        </a>
        <a href="/dashboard" className="w-12 h-12 bg-purple-600/60 hover:bg-purple-600/80 rounded-full text-white transition-all duration-300 border border-purple-400/40 flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5" />
        </a>
      </div>
      
      {/* SidebarDock - Consistent with other pages */}
      <SidebarDock />
      
      {/* Right Panel - Blue Section with Notch Cutout */}
      <div 
        className="absolute top-0 h-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 p-6 sm:p-8 md:p-12 lg:p-16"
        style={{
          left: '16.67%',
          right: '0',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% calc(100% - 100px), 200px calc(100% - 100px), 200px calc(100% - 60px), 0% calc(100% - 60px))'
        }}
      >
        {/* Video background - positioned within right panel */}
        <div className="absolute inset-0 -z-10">
          {/* Video with multiple fallbacks */}
          <VideoBackground />
          
          {/* Black overlay on top of video */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Background 3D Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-500/40 rounded-full blur-3xl -translate-x-1/2"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-tl from-indigo-400/40 to-blue-600/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-pink-500/40 rounded-full blur-2xl"></div>
        </div>
        
        {/* Top Navigation */}
        <nav className="relative z-40 flex items-center justify-between p-8 pt-0 pointer-events-none">
          <div className="flex items-center space-x-4 ml-12">
            {/* Navigation links moved to left panel as icons */}
          </div>
        </nav>
        
        {/* Main Content Area - Centered Sabrang 2025 */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter" style={{ fontFamily: "'Orbitron', 'Arial Black', sans-serif" }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-200 drop-shadow-lg" style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
                SABRANG
              </span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-500 drop-shadow-2xl" style={{ textShadow: '0 0 40px rgba(147,51,234,0.4)' }}>
                2025
              </span>
            </h1>
          </div>
        </div>
        
        
      </div>
      
      {/* Left Panel - Black Section */}
      <div className="absolute top-0 left-0 w-1/6 h-full bg-black flex flex-col">
        
        {/* Logo */}
        <div className="p-8 pt-12">
            <div className="w-30 h-26 ml-12 flex items-center justify-center top-0">
            <img src="/images/Logo@2x.png" alt="Logo" className="w-36 h-25" onError={(e) => { (e.target as HTMLImageElement).src = '/images/Logo.svg'; }} />
          </div>
        </div>
        
        {/* Get Started Button - Creates True Notch Effect */}
        <div className="absolute bottom-0 left-8 z-50">
          <a 
            href="/Signup"
            className="py-4 px-8 bg-black rounded-full text-white text-base font-medium hover:bg-gray-900 transition-all duration-300 border border-white/30 inline-block cursor-pointer flex items-center justify-center"
            style={{
              width: '380px', // Extends deep into blue panel
              height: '60px' // Much smaller height like reference
            }}

          >
            Register Now
          </a>
        </div>
      </div>
      

    </div>
  );
});

export default LayeredLandingPage;