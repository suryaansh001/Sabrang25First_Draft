"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfinityTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

const InfinityTransition: React.FC<InfinityTransitionProps> = ({ isActive, onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'ball' | 'infinity' | 'zoom' | 'complete'>('idle');
  const [videoReady, setVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    Object.values(phaseTimersRef.current).forEach(timer => clearTimeout(timer));
    phaseTimersRef.current = {};
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Preload and prepare video
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Set video properties for optimal performance
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      video.loop = false; // Don't loop for transition
      
      // Load video immediately
      video.load();
      
      // Handle video ready state
      const handleCanPlay = () => {
        setVideoReady(true);
        // Pause initially to prevent autoplay issues
        video.pause();
      };

      const handleLoadedData = () => {
        setVideoReady(true);
        video.pause();
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleLoadedData);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, []);

  // Main animation controller - optimized for mobile
  useEffect(() => {
    if (!isActive) {
      setCurrentPhase('idle');
      clearAllTimers();
      return;
    }

    // Clear any existing timers
    clearAllTimers();

    // Start animation sequence with mobile-optimized timing
    const startAnimation = () => {
      // Phase 1: Ball (faster on mobile)
      setCurrentPhase('ball');
      
      const ballDuration = isMobile ? 600 : 800;
      phaseTimersRef.current.ball = setTimeout(() => {
        // Phase 2: Infinity (faster on mobile)
        setCurrentPhase('infinity');
        
        const infinityDuration = isMobile ? 300 : 400;
        phaseTimersRef.current.infinity = setTimeout(() => {
          // Phase 3: Zoom (faster on mobile)
          setCurrentPhase('zoom');
          
          const zoomDuration = isMobile ? 200 : 300;
          phaseTimersRef.current.zoom = setTimeout(() => {
            // Phase 4: Complete - show full black background
            setCurrentPhase('complete');
            
            // Almost immediate completion for mobile, minimal delay for desktop
            const completeDelay = isMobile ? 10 : 50;
            phaseTimersRef.current.complete = setTimeout(() => {
              onComplete();
            }, completeDelay);
          }, zoomDuration);
        }, infinityDuration);
      }, ballDuration);
    };

    // Reduced delay for mobile
    const startDelay = isMobile ? 50 : 100;
    animationRef.current = setTimeout(startAnimation, startDelay);

    return () => {
      clearAllTimers();
    };
  }, [isActive, onComplete, clearAllTimers, isMobile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Play video when animation starts
  useEffect(() => {
    if (currentPhase === 'ball' && videoRef.current && videoReady) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Ignore autoplay errors, animation will continue
      });
    }
  }, [currentPhase, videoReady]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Full black background - always visible when active */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Background video - only visible during animation phases */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            filter: 'brightness(0.6) contrast(1.1)',
            opacity: (videoReady && currentPhase !== 'complete') ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out' // Faster transition for mobile
          }}
        >
          <source src="/videos/infinty_transition.mp4" type="video/mp4" />
          <source src="/videos/infinity_transition.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video loading indicator */}
        {!videoReady && currentPhase !== 'complete' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            {/* Loading indicator removed */}
          </div>
        )}
      </div>

      {/* Animation container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          
          {/* Ball Phase - optimized for mobile */}
          <AnimatePresence mode="wait">
            {currentPhase === 'ball' && (
              <motion.div
                key="ball"
                className="absolute inset-0 w-full h-full rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #114fee 0%, #3edc81 50%, #114fee 100%)',
                  boxShadow: isMobile 
                    ? '0 0 20px rgba(17, 79, 238, 0.6), 0 0 40px rgba(62, 220, 129, 0.4)'
                    : '0 0 40px rgba(17, 79, 238, 0.8), 0 0 80px rgba(62, 220, 129, 0.6)'
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: isMobile ? 180 : 360 // Reduced rotation for mobile
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: isMobile ? 0.6 : 0.8, 
                  ease: "easeInOut"
                }}
              />
            )}
          </AnimatePresence>

          {/* Infinity Symbol Phase - optimized for mobile */}
          <AnimatePresence mode="wait">
            {currentPhase === 'infinity' && (
              <motion.div
                key="infinity"
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: isMobile ? 0.3 : 0.4, 
                  ease: "easeInOut" 
                }}
              >
                <svg
                  viewBox="0 0 302.73 467.06"
                  className="w-full h-full"
                  style={{ 
                    filter: isMobile 
                      ? 'drop-shadow(0 0 15px rgba(17, 79, 238, 0.7))'
                      : 'drop-shadow(0 0 30px rgba(17, 79, 238, 0.9))'
                  }}
                >
                  <defs>
                    <linearGradient id="infinity-main" x1="-225.6" y1="2357.64" x2="-96.05" y2="1908.83" gradientTransform="translate(-819.63 -1648.32) rotate(-31.96)" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#114fee"/>
                      <stop offset="1" stopColor="#3edc81"/>
                    </linearGradient>
                    <linearGradient id="infinity-secondary" x1="-532.26" y1="2274.32" x2="66.92" y2="1951.6" gradientTransform="translate(-819.63 -1648.32) rotate(-31.96)" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="red"/>
                      <stop offset="1" stopColor="#ff0"/>
                    </linearGradient>
                    <filter id="infinity-glow">
                      <feGaussianBlur stdDeviation={isMobile ? "2" : "4"} result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <g filter="url(#infinity-glow)">
                    <path
                      d="M111.89,243.07c24.31,61.36,56.77,121.1,57.12,171.37.02,2.72-.25,5.39-.79,7.97-.12.61-.26,1.2-.42,1.79,0,0,0,0,0,0-9.09,37.03-38.54,38.01-62.59,29.39,8.38,3.85,17.14,7.19,26.25,9.98,37.13,11.34,94.36-3.69,112.42-64.5,16.54-55.68-23.67-130.74-53.56-203.32-10.94-26.57-20.5-52.8-25.39-77.62-3.57-18.1-4.65-35.46-1.97-51.65.71-4.26,1.67-8.27,2.86-12.03C173.47,25.72,194.71-.55,229.56.13,145.67-3.43,85.03,65.5,85.6,133.81c.09,11.05,1.25,22.21,3.23,33.42,4.46,25.19,13.07,50.66,23.06,75.85h0Z"
                      fill="url(#infinity-main)"
                      stroke="url(#infinity-main)"
                      strokeWidth="2"
                    />
                    <path
                      d="M88.84,167.23c-21.73,15.62-41.4,32.07-55.44,49.04-52.32,63.24-39.19,141.5,11.85,194.9-61.63-68.96-5.71-117.94,21.16-137.37,13.33-10.22,28.87-20.43,45.48-30.73,24.95-15.46,52.36-31.11,78.44-47.32,43.38-26.96,83.08-55.45,101.74-87.13,28.67-48.68-4.8-99.6-48.88-107.21,49.63,13,6.35,59.55-13.1,73.65-.74.61-1.49,1.22-2.26,1.84-14.74,11.85-37.54,25.75-62.89,41.22-24.63,15.03-51.68,31.54-76.1,49.09h0Z"
                      fill="url(#infinity-secondary)"
                      opacity="0.8"
                    />
                  </g>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Zoom Phase - optimized for mobile */}
          <AnimatePresence mode="wait">
            {currentPhase === 'zoom' && (
              <motion.div
                key="zoom"
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 1 }}
                animate={{ scale: isMobile ? 40 : 60 }} // Smaller zoom for mobile
                transition={{ 
                  duration: isMobile ? 0.2 : 0.3, 
                  ease: "easeIn" 
                }}
              >
                <svg
                  viewBox="0 0 302.73 467.06"
                  className="w-full h-full"
                  style={{ 
                    filter: isMobile 
                      ? 'drop-shadow(0 0 30px rgba(17, 79, 238, 0.8))'
                      : 'drop-shadow(0 0 60px rgba(17, 79, 238, 1))'
                  }}
                >
                  <defs>
                    <linearGradient id="zoom-main" x1="-225.6" y1="2357.64" x2="-96.05" y2="1908.83" gradientTransform="translate(-819.63 -1648.32) rotate(-31.96)" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#114fee"/>
                      <stop offset="1" stopColor="#3edc81"/>
                    </linearGradient>
                    <linearGradient id="zoom-secondary" x1="-532.26" y1="2274.32" x2="66.92" y2="1951.6" gradientTransform="translate(-819.63 -1648.32) rotate(-31.96)" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="red"/>
                      <stop offset="1" stopColor="#ff0"/>
                    </linearGradient>
                  </defs>
                  <g>
                    <path
                      d="M111.89,243.07c24.31,61.36,56.77,121.1,57.12,171.37.02,2.72-.25,5.39-.79,7.97-.12.61-.26,1.2-.42,1.79,0,0,0,0,0,0-9.09,37.03-38.54,38.01-62.59,29.39,8.38,3.85,17.14,7.19,26.25,9.98,37.13,11.34,94.36-3.69,112.42-64.5,16.54-55.68-23.67-130.74-53.56-203.32-10.94-26.57-20.5-52.8-25.39-77.62-3.57-18.1-4.65-35.46-1.97-51.65.71-4.26,1.67-8.27,2.86-12.03C173.47,25.72,194.71-.55,229.56.13,145.67-3.43,85.03,65.5,85.6,133.81c.09,11.05,1.25,22.21,3.23,33.42,4.46,25.19,13.07,50.66,23.06,75.85h0Z"
                      fill="url(#zoom-main)"
                    />
                    <path
                      d="M88.84,167.23c-21.73,15.62-41.4,32.07-55.44,49.04-52.32,63.24-39.19,141.5,11.85,194.9-61.63-68.96-5.71-117.94,21.16-137.37,13.33-10.22,28.87-20.43,45.48-30.73,24.95-15.46,52.36-31.11,78.44-47.32,43.38-26.96,83.08-55.45,101.74-87.13,28.67-48.68-4.8-99.6-48.88-107.21,49.63,13,6.35,59.55-13.1,73.65-.74.61-1.49,1.22-2.26,1.84-14.74,11.85-37.54,25.75-62.89,41.22-24.63,15.03-51.68,31.54-76.1,49.09h0Z"
                      fill="url(#zoom-secondary)"
                      opacity="0.8"
                    />
                  </g>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default InfinityTransition;
