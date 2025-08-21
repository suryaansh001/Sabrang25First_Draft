'use client';
import React, { memo, useEffect, useState } from 'react';
import { Play, Github, Linkedin, LayoutDashboard, Calendar, Users, Handshake, Info, Clock, Star, Mail, Home, HelpCircle, X } from 'lucide-react';
import SidebarDock from '../../components/SidebarDock';
import { useVideo } from '../../components/VideoContext';
import { useRouter } from 'next/navigation';
import InfinityTransition from '../../components/InfinityTransition';

// Video Background Component with comprehensive optimizations
const VideoBackground = () => {
  const [videoError, setVideoError] = React.useState(false);
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [videoAttempted, setVideoAttempted] = React.useState(false);
  const [currentFormat, setCurrentFormat] = React.useState<'mp4' | 'webm'>('mp4');
  const [networkSpeed, setNetworkSpeed] = React.useState<'fast' | 'slow' | 'unknown'>('unknown');
  const [loadingStrategy, setLoadingStrategy] = React.useState<'aggressive' | 'conservative'>('conservative');
  const [isTabVisible, setIsTabVisible] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { hasPlayedVideo, setHasPlayedVideo } = useVideo();

  // Detect network speed and adjust loading strategy
  React.useEffect(() => {
    const detectNetworkSpeed = async () => {
      try {
        // Check if navigator.connection is available
        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
          if (connection.effectiveType === '4g' || connection.effectiveType === '5g') {
            setNetworkSpeed('fast');
            setLoadingStrategy('aggressive');
          } else if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
            setNetworkSpeed('slow');
            setLoadingStrategy('conservative');
          }
        }

        // Fallback: Test with a small image
        const startTime = performance.now();
        const testImage = new Image();
        testImage.src = '/images/hero.webp';
        
        testImage.onload = () => {
          const loadTime = performance.now() - startTime;
          if (loadTime < 1000) {
            setNetworkSpeed('fast');
            setLoadingStrategy('aggressive');
          } else {
            setNetworkSpeed('slow');
            setLoadingStrategy('conservative');
          }
        };
      } catch (error) {
        console.log('Network detection failed, using conservative strategy');
        setLoadingStrategy('conservative');
      }
    };

    detectNetworkSpeed();
  }, []);

  // Handle tab visibility changes globally
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      const wasVisible = isTabVisible;
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);
      
      if (!wasVisible && isVisible) {
        console.log('Tab became visible, refreshing media...');
        // Force refresh of video and image when tab becomes visible
        if (videoRef.current && videoLoaded) {
          setTimeout(() => {
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.play().catch(e => console.log('Video restoration failed:', e));
            }
          }, 200);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTabVisible, videoLoaded]);

  // Preload critical assets
  React.useEffect(() => {
    const preloadAssets = () => {
      // Preload hero image
      const heroImage = new Image();
      heroImage.src = '/images/hero.webp';
      
      // Note: Video preloading is handled by the video element itself
      // with the preload attribute based on network speed
    };

    preloadAssets();
  }, [loadingStrategy]);

  // Add timeout for video loading with network-aware timing
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded && !videoError) {
        console.log(`Video loading timeout (${loadingStrategy} strategy), falling back to enhanced background`);
        setVideoError(true);
        setVideoAttempted(true);
      }
    }, loadingStrategy === 'aggressive' ? 5000 : 10000); // Reduced timeout for faster fallback

    return () => clearTimeout(timeout);
  }, [videoLoaded, videoError, loadingStrategy]);

  const handleVideoError = (e: any) => {
    console.log(`Video failed to load (${currentFormat}): ${e.target?.error?.message || 'Unknown error'}`);
    
    // Try WebM if MP4 failed
    if (currentFormat === 'mp4' && !videoAttempted) {
      console.log('Trying WebM format...');
      setCurrentFormat('webm');
      setVideoError(false);
      return;
    }
    
    // If both formats failed, fall back to enhanced background
    console.log('Both video formats failed, using enhanced background fallback');
    setVideoError(true);
    setVideoAttempted(true);
  };

  const handleVideoLoad = () => {
    console.log(`Video loaded successfully (${currentFormat})`);
    setVideoLoaded(true);
    setVideoAttempted(true);
    setHasPlayedVideo(true);
  };

  // Ensure video keeps playing and handle tab visibility changes
  React.useEffect(() => {
    if (videoRef.current && videoLoaded) {
      const video = videoRef.current;
      
      const ensurePlaying = () => {
        if (video.paused) {
          video.play().catch(e => console.log('Video play failed:', e));
        }
      };

      // Handle tab visibility changes
      const handleVisibilityChange = () => {
        if (!document.hidden && videoLoaded) {
          console.log('Tab became visible, restoring video...');
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            if (video.paused) {
              video.play().catch(e => console.log('Video restoration failed:', e));
            }
          }, 100);
        }
      };

      // Check every 2 seconds if video is still playing
      const interval = setInterval(ensurePlaying, 2000);
      
      // Listen for tab visibility changes
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [videoLoaded]);

  // Aggressive video restoration when tab becomes visible
  React.useEffect(() => {
    if (isTabVisible && videoLoaded && videoRef.current) {
      const video = videoRef.current;
      
      // Multiple attempts to restore video
      const restoreVideo = () => {
        if (video.paused) {
          video.play().catch(e => {
            console.log('Video restoration attempt failed:', e);
            // Try again after a short delay
            setTimeout(() => {
              if (video.paused) {
                video.play().catch(e2 => console.log('Second video restoration attempt failed:', e2));
              }
            }, 500);
          });
        }
      };

      // Try to restore video when tab becomes visible
      const timer = setTimeout(restoreVideo, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isTabVisible, videoLoaded]);

  const handleImageLoad = () => {
    console.log('Hero background image loaded successfully');
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.log('Hero background image failed to load, using gradient fallback');
    setImageLoaded(false);
  };

  // Force reload image when tab becomes visible
  React.useEffect(() => {
    if (isTabVisible && !imageLoaded) {
      console.log('Tab visible but image not loaded, attempting to reload...');
      // This will trigger a re-render and attempt to load the image again
      const timer = setTimeout(() => {
        setImageLoaded(false); // Reset to trigger reload
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isTabVisible, imageLoaded]);

  // Get video source based on current format and network speed
  const getVideoSource = () => {
    const basePath = '/videos/herovideo';
    const format = currentFormat === 'mp4' ? 'mp4' : 'webm';
    
    // Use smaller video for slow networks
    if (networkSpeed === 'slow') {
      return `${basePath}2.${format}`;
    }
    
    return `${basePath}.${format}`;
  };

  // Debug video loading
  React.useEffect(() => {
    console.log('Video loading debug info:', {
      currentFormat,
      networkSpeed,
      loadingStrategy,
      videoLoaded,
      videoError,
      videoAttempted,
      videoSource: getVideoSource()
    });
  }, [currentFormat, networkSpeed, loadingStrategy, videoLoaded, videoError, videoAttempted]);

  // Get preload strategy based on network speed
  const getPreloadStrategy = () => {
    if (loadingStrategy === 'aggressive') {
      return 'auto';
    }
    return networkSpeed === 'fast' ? 'metadata' : 'none';
  };

  return (
    <>
      {/* Primary background: bg.jpg image */}
      <img
        src="/bg.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-100"
        style={{ filter: 'brightness(0.8) contrast(1.1)' }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        crossOrigin="anonymous"
        loading="eager"
        fetchPriority="high"
      />
      
      {/* Backup gradient background - always present as safety net */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-blue-900 opacity-40" />
      
      {/* Secondary fallback: Disco animated background if image fails */}
      {!imageLoaded && (
        <div className="absolute inset-0">
          {/* Disco base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-pink-800 to-indigo-900 animate-pulse" style={{ animationDuration: '4s' }} />
          
          {/* Disco light beams */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="disco1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0080" stopOpacity="0.6">
                  <animate attributeName="stop-opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#8000ff" stopOpacity="0.6">
                  <animate attributeName="stop-opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <linearGradient id="disco2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6">
                  <animate attributeName="stop-opacity" values="0.8;0.3;0.8" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#ffff00" stopOpacity="0.6">
                  <animate attributeName="stop-opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <linearGradient id="disco3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ff8000" stopOpacity="0.5">
                  <animate attributeName="stop-opacity" values="0.5;0.9;0.5" dur="5s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#8000ff" stopOpacity="0.5">
                  <animate attributeName="stop-opacity" values="0.9;0.5;0.9" dur="5s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            
            {/* Animated disco light beams */}
            <rect x="0" y="0" width="100" height="100" fill="url(#disco1)" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="6s" repeatCount="indefinite" />
            </rect>
            <rect x="0" y="0" width="100" height="100" fill="url(#disco2)" opacity="0.2">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="8s" repeatCount="indefinite" />
            </rect>
            <rect x="0" y="0" width="100" height="100" fill="url(#disco3)" opacity="0.25">
              <animate attributeName="opacity" values="0.25;0.65;0.25" dur="7s" repeatCount="indefinite" />
            </rect>
          </svg>
          
          {/* Disco spotlights */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-b from-yellow-400 via-orange-500 to-transparent rounded-full blur-2xl opacity-60 animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute top-0 right-1/3 w-32 h-32 bg-gradient-to-b from-pink-400 via-purple-500 to-transparent rounded-full blur-xl opacity-70 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-0 left-2/3 w-36 h-36 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent rounded-full blur-2xl opacity-65 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
          </div>
          
          {/* Disco floor effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Floating disco balls */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full shadow-lg animate-bounce" style={{ animationDuration: '2s', boxShadow: '0 0 20px rgba(255, 255, 0, 0.6)' }} />
            <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full shadow-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s', boxShadow: '0 0 15px rgba(255, 0, 255, 0.6)' }} />
            <div className="absolute bottom-1/3 left-1/2 w-10 h-10 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full shadow-lg animate-bounce" style={{ animationDuration: '1.8s', animationDelay: '1s', boxShadow: '0 0 25px rgba(0, 255, 255, 0.6)' }} />
          </div>
        </div>
      )}
      
      {/* Video overlay - keep mounted as long as no error so it doesn't disappear */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload={getPreloadStrategy()}
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          style={{ filter: 'brightness(0.7) contrast(1.2)' }}
          onError={handleVideoError}
          onLoadStart={() => console.log(`Video loading started (${currentFormat})`)}
          onCanPlay={handleVideoLoad}
          onLoadedData={handleVideoLoad}
          onLoad={() => console.log('Video load event fired')}
          onLoadedMetadata={() => console.log('Video metadata loaded')}
          onStalled={() => console.log('Video stalled')}
          onSuspend={() => console.log('Video suspended')}
          onAbort={() => console.log('Video aborted')}
          onEmptied={() => console.log('Video emptied')}
          onEnded={() => {
            console.log('Video ended, restarting...');
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(e => console.log('Video restart failed:', e));
            }
          }}
        >
          {/* Multiple source formats for better compatibility */}
          <source src={getVideoSource()} type={`video/${currentFormat}`} />
          <source src="/videos/herovideo2.mp4" type="video/mp4" />
          <source src="/videos/herovideo.mp4" type="video/mp4" />
          <source src="/videos/herovideo2.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Enhanced fallback background - always visible when video fails or is not loaded */}
      {(videoError || !videoLoaded) && (
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-blue-900">
          {/* Animated background elements for visual interest */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/30 rounded-full blur-3xl -translate-x-1/2 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-tl from-indigo-400/20 to-blue-600/25 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-500/25 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
          </div>
        </div>
      )}

            {/* Ultimate fallback: Disco party background when both video and image fail */}
      {videoError && !imageLoaded && (
        <div className="absolute inset-0">
          {/* Disco party base */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-pink-900" />
          
          {/* Disco light grid */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="discoGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="0.5" fill="#ff0080" opacity="0.6">
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="5" cy="5" r="0.3" fill="#00ffff" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
                </circle>
              </pattern>
              <linearGradient id="discoParty1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0080" stopOpacity="0.4">
                  <animate attributeName="stop-opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#8000ff" stopOpacity="0.4">
                  <animate attributeName="stop-opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            
            {/* Disco grid pattern */}
            <rect x="0" y="0" width="100" height="100" fill="url(#discoGrid)" />
            <rect x="0" y="0" width="100" height="100" fill="url(#discoParty1)" opacity="0.3" />
          </svg>
          
          {/* Disco laser beams */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '1.5s' }} />
            <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '1.8s', animationDelay: '1s' }} />
            <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '2.2s', animationDelay: '0.3s' }} />
          </div>
          
          {/* Disco spotlights */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-60 h-60 bg-gradient-to-b from-yellow-400 via-orange-500 to-transparent rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute top-0 right-1/3 w-50 h-50 bg-gradient-to-b from-pink-400 via-purple-500 to-transparent rounded-full blur-2xl opacity-50 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-0 left-2/3 w-55 h-55 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent rounded-full blur-3xl opacity-45 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
          </div>
          
          {/* Floating disco elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 12 + 4}px`,
                  height: `${Math.random() * 12 + 4}px`,
                  backgroundColor: ['#ff0080', '#00ffff', '#ffff00', '#ff8000', '#8000ff'][Math.floor(Math.random() * 5)],
                  opacity: Math.random() * 0.6 + 0.4,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`
                }}
              />
            ))}
          </div>
          
          {/* Disco floor reflection */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}
    </>
  );
};

interface LayeredLandingPageProps {
  isLoading?: boolean;
}

// Lightweight video layer for mobile/tablet to avoid heavy fallbacks
const MobileVideoBackground: React.FC = () => {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'brightness(0.7) contrast(1.2)' }}
    >
      <source src="/videos/herovideo2.webm" type="video/webm" />
      <source src="/videos/herovideo2.mp4" type="video/mp4" />
      <source src="/videos/herovideo.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

const LayeredLandingPage = memo(function LayeredLandingPage({ isLoading = false }: LayeredLandingPageProps) {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);
  const router = useRouter();

  const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule', icon: <Clock className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
  ];

  useEffect(() => {
    // Simple asset preloading for critical resources
    const preloadCriticalAssets = async () => {
      try {
        // Preload hero image
        const heroImage = new Image();
        heroImage.src = '/images/hero.webp';
        
        // Wait for image to load or timeout
        await Promise.race([
          new Promise((resolve) => {
            heroImage.onload = resolve;
            heroImage.onerror = resolve; // Don't fail if image doesn't load
          }),
          new Promise(resolve => setTimeout(resolve, 3000)) // 3 second timeout
        ]);
        
        setAssetsLoaded(true);
      } catch (error) {
        console.log('Asset preloading failed, continuing anyway');
        setAssetsLoaded(true);
      }
    };

    preloadCriticalAssets();
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Mobile & Tablet Hero (<= lg) */}
      <div className="block lg:hidden relative min-h-screen">
        <img
          src="/herobg.webp"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        {/* Mobile video background (same as desktop sources, lightweight) */}
        <div className="absolute inset-0">
          <MobileVideoBackground />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* Decorative overlays for mobile hero */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Aurora blobs */}
          <div className="aurora">
            <div className="aurora-blob aurora-1" />
            <div className="aurora-blob aurora-2" />
            <div className="aurora-blob aurora-3" />
          </div>

          {/* Soft center glow behind title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-white/10 via-cyan-300/10 to-purple-500/10 blur-3xl" />

          {/* Gentle scanline sweep */}
          <div className="scan-line absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

          {/* Twinkling particles */}
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="star-twinkle absolute rounded-full"
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${(i * 37) % 100}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(186,230,253,0.9)'
              }}
            />
          ))}
        </div>

        {/* Top-left logo */}
        {!isLoading && (
          <div className="absolute top-4 left-4 z-20">
            <img
              src="/images/Logo@2x.png"
              alt="Logo"
              className="h-10 w-auto"
              loading="eager"
              fetchPriority="high"
              onError={(e) => {
                console.log('Logo PNG failed, trying SVG fallback');
                (e.target as HTMLImageElement).src = '/images/Logo.svg';
              }}
            />
          </div>
        )}

        {/* Top-right stylized hamburger (three decreasing lines) */}
        {!isLoading && (
          <button
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
            className="absolute top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition pointer-events-auto"
          >
            <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
            <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
            <span className="block h-0.5 bg-white/80 rounded-full w-4" />
          </button>
        )}

        {/* Center content */}
        {!isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-6 pointer-events-none">
            <div>
              <h1 className="font-black leading-none">
                <span className="block text-7xl sm:text-8xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-200 drop-shadow" style={{ fontFamily: "'Stardos Stencil', 'Orbitron', sans-serif" }}>
                  SABRANG
                </span>
                <span className="mt-3 block text-6xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 drop-shadow" style={{ fontFamily: "'Stardos Stencil', 'Orbitron', sans-serif" }}>
                  25
                </span>
              </h1>
              <p className="mt-3 text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300">
                Noorwana & Color to Cosmos
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <a href="/Signup" className="btn-prism pointer-events-auto">
                  <span>Register Now</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
            <div className="absolute top-4 right-4">
              <button
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="pt-20 px-6">
              <div className="grid grid-cols-1 gap-3">
                {mobileNavItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => { setMobileMenuOpen(false); setTargetHref(item.href); setShowTransition(true); }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-base hover:bg-white/15 active:scale-[0.99] transition text-left"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/20">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop/Laptop layout (>= lg) */}
      <div className="hidden lg:block">
        {/* Top Right Black Pill Notch */}
        {!isLoading && (
          <div 
            className="absolute top-0 right-30 z-20 w-[500px] h-[70px] bg-black rounded-[30px]"
            style={{ transform: 'translateX(50%)' }}
          />
        )}
        
        {/* Register Now Button - Positioned above everything */}
        {!isLoading && (
          <div className="absolute top-2.5 right-2 z-50 flex items-center space-x-5">
            <a href="/Signup" className="px-24 py-4 bg-black/40 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-black/60 transition-all duration-300 border border-white/30">
              Register Now
            </a>
            <a href="/dashboard" className="w-12 h-12 bg-purple-600/60 hover:bg-purple-600/80 rounded-full text-white transition-all duration-300 border border-purple-400/40 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </a>
          </div>
        )}
        
        {/* SidebarDock - Consistent with other pages */}
        {!isLoading && <SidebarDock className="hidden lg:block" />}
        
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
          {!isLoading && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-500/40 rounded-full blur-3xl -translate-x-1/2"></div>
              <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-tl from-indigo-400/40 to-blue-600/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-pink-500/40 rounded-full blur-2xl"></div>
            </div>
          )}
          
          {/* Top Navigation */}
          <nav className="relative z-40 flex items-center justify-between p-8 pt-0 pointer-events-none">
            <div className="flex items-center space-x-4 ml-12">
              {/* Navigation links moved to left panel as icons */}
            </div>
          </nav>
          
          {/* Main Content Area - Centered Sabrang 2025 */}
          {!isLoading && (
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center">
                                              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none">
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-200 drop-shadow-lg text-8xl md:text-9xl lg:text-[12rem]" style={{ fontFamily: "'Stardos Stencil', 'Orbitron', sans-serif", textShadow: '0 0 30px rgba(255,255,255,0.5)', letterSpacing: '0.02em' }}>
                     SABRANG
                   </span><br /><br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 drop-shadow-2xl text-8xl md:text-9xl lg:text-[10rem]" style={{ fontFamily: "'Stardos Stencil', 'Orbitron', sans-serif", textShadow: '0 0 40px rgba(34, 211, 238, 0.6)' }}>
                     2025
                   </span>
                </h1>
              </div>
            </div>
          )}
          
          
        </div>
        
        {/* Left Panel - Black Section */}
        <div className="absolute top-0 left-0 w-1/6 h-full bg-black flex flex-col">
          
          {/* Logo */}
          {!isLoading && (
            <div className="p-8 pt-12">
                <div className="w-30 h-26 ml-12 flex items-center justify-center top-0">
                <img 
                  src="/images/Logo@2x.png" 
                  alt="Logo" 
                  className="w-36 h-25" 
                  loading="eager"
                  fetchPriority="high"
                  onError={(e) => { 
                    console.log('Logo PNG failed, trying SVG fallback');
                    (e.target as HTMLImageElement).src = '/images/Logo.svg'; 
                  }} 
                  onLoad={() => console.log('Logo loaded successfully')}
                />
              </div>
            </div>
          )}
          
          
        </div>
      </div>

      {/* Infinity transition for mobile nav */}
      <InfinityTransition
        isActive={showTransition}
        onComplete={() => {
          if (targetHref) router.push(targetHref);
          setShowTransition(false);
          setTargetHref(null);
        }}
      />
    </div>
  );
});

export default LayeredLandingPage;