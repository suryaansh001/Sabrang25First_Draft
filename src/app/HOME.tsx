'use client';
import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { Play, Github, Linkedin, LayoutDashboard, Calendar, Users, Handshake, Info, Clock, Star, Mail, Home, HelpCircle, X } from 'lucide-react';
import SidebarDock from '../../components/SidebarDock';
import MobileScrollMenu from '../../components/MobileScrollMenu';
import { useVideo } from '../../components/VideoContext';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../components/NavigationContext';


// Beautiful First-Load Background Component
const BeautifulBackground = memo(() => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Animated gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-purple-700/50 to-pink-600/40 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/30 via-indigo-600/40 to-violet-700/30 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      
      {/* Floating orbs with beautiful colors */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/40 to-purple-500/50 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-tl from-indigo-400/40 to-cyan-600/45 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400/35 to-pink-500/45 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-gradient-to-br from-cyan-400/30 to-blue-500/40 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/2 w-64 h-64 bg-gradient-to-br from-violet-400/35 to-fuchsia-500/40 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '3s' }}></div>
      </div>

      {/* Animated light rays */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-70 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-70 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400/50 to-transparent opacity-70 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent opacity-70 animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
      </div>

      {/* Floating particles with beautiful colors */}
      <div className="absolute inset-0 overflow-hidden">
        {useMemo(() => {
          // Use completely deterministic values to avoid hydration mismatch
          const particles = Array.from({ length: 20 }).map((_, i) => {
            const colors = ['#60a5fa', '#a855f7', '#ec4899', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];
            
            // Completely deterministic values based on index
            const width = 4 + (i % 8); // 4-11px
            const height = 4 + ((i + 3) % 8); // 4-11px
            const colorIndex = i % colors.length;
            const opacity = 0.3 + ((i * 0.7) % 0.7); // 0.3-1.0
            const duration = 3 + ((i * 0.4) % 4); // 3-7s
            const delay = (i * 0.2) % 2; // 0-2s
            const shadow = 15 + ((i * 1.5) % 20); // 15-35px
            
            return (
              <div
                key={i}
                className="absolute rounded-full animate-bounce"
                style={{
                  left: `${(i * 67) % 100}%`,
                  top: `${(i * 43) % 100}%`,
                  width: `${width}px`,
                  height: `${height}px`,
                  backgroundColor: colors[colorIndex],
                  opacity: opacity,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  boxShadow: `0 0 ${shadow}px currentColor`
                }}
              />
            );
          });
          return particles;
        }, [])}
      </div>

      {/* Center spotlight effect */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/30 via-purple-500/35 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
    </div>
  );
});

BeautifulBackground.displayName = 'BeautifulBackground';

// Optimized Video Background Component
const VideoBackground = memo(() => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { setHasPlayedVideo } = useVideo();

  const handleCanPlay = useCallback(() => {
    setVideoLoaded(true);
    setHasPlayedVideo(true);
  }, [setHasPlayedVideo]);

  const handleError = useCallback(() => {
    console.log('Video failed to load, using fallback');
    setVideoError(true);
  }, []);

  // Optimized video loading with error handling
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [handleCanPlay, handleError]);

  if (videoError) {
    return null;
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out'
        }}
      >
        <source src="/videos/herovideo.mp4" type="video/mp4" />
        <source src="/videos/herovideo2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
    </>
  );
});

VideoBackground.displayName = 'VideoBackground';

interface LayeredLandingPageProps {
  isLoading?: boolean;
}

// Optimized mobile video background
const MobileVideoBackground = memo(() => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleCanPlay = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    console.log('Mobile video failed to load');
    setVideoError(true);
  }, []);

  useEffect(() => {
    // Preload mobile video immediately
    const video = document.createElement('video');
    video.src = '/videos/herovideo2.mp4';
    video.preload = 'auto';
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [handleCanPlay, handleError]);

  if (videoError) {
    return null;
  }

  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <source src="/videos/herovideo2.mp4" type="video/mp4" />
        <source src="/videos/herovideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </>
  );
});

MobileVideoBackground.displayName = 'MobileVideoBackground';

const LayeredLandingPage = memo(function LayeredLandingPage({ isLoading = false }: LayeredLandingPageProps) {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { navigate } = useNavigation();

  // Optimized mobile detection with matchMedia
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    let rafId = 0;
    const update = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsMobile(mq.matches));
    };
    update();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update, { passive: true } as any);
      return () => {
        cancelAnimationFrame(rafId);
        mq.removeEventListener('change', update as any);
      };
    }
    // @ts-ignore older Safari
    mq.addListener(update);
    return () => {
      cancelAnimationFrame(rafId);
      // @ts-ignore older Safari
      mq.removeListener(update);
    };
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  const mobileNavItems = useMemo(() => [
    { title: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
  ], []);

  useEffect(() => {
    // Simple asset preloading
    const preloadCriticalAssets = async () => {
      try {
        const heroImage = new Image();
        heroImage.src = '/images/hero.webp';
        
        await Promise.race([
          new Promise((resolve) => {
            heroImage.onload = resolve;
            heroImage.onerror = resolve;
          }),
          new Promise(resolve => setTimeout(resolve, 2000))
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
      {/* No background fallback per request */}
      
      {/* Mobile Loading Video - shows while loading on mobile */}
      {isLoading && isMobile && (
        <div className="fixed inset-0 z-[200] bg-black">
          {/* Mobile loading video */}
          <video
            autoPlay
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/mobile_loading.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Skip Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setAssetsLoaded(true)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 active:scale-95"
            >
              Skip
            </button>
          </div>
          
          {/* Loading overlay */}
          <div className="absolute inset-0 bg-black/0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg font-medium">Loading Sabrang 25...</p>
            </div>
          </div>

          {/* Progress Bar at Bottom */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      )}

      {/* Mobile & Tablet Hero (<= lg) */}
      <div className="block lg:hidden relative min-h-screen overflow-hidden">
        
        {/* Mobile video background only */}
        <div className="absolute inset-0">
          <MobileVideoBackground />
        </div>

        {/* Special Mobile Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-500/40 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-tl from-cyan-400/30 to-blue-500/40 rounded-full blur-lg animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-gradient-to-r from-orange-400/25 to-red-500/35 rounded-full blur-xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full animate-bounce"
                style={{
                  left: `${(i * 73) % 100}%`,
                  top: `${(i * 47) % 100}%`,
                  animationDuration: `${3 + (i % 3)}s`,
                  animationDelay: `${(i * 0.3) % 2}s`,
                }}
              />
            ))}
          </div>

          {/* Animated light streaks */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-2/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-400/50 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
          </div>

          {/* Center spotlight effect */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-white/10 via-purple-500/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s' }} />
        </div>
        
        {/* Removed overlay gradient per request */}

        {/* Decorative overlays removed per request */}

        {/* Top-left logo */}
        {!isLoading && (
          <div className="absolute top-4 left-4 z-20">
            <a href="/" aria-label="Go to homepage">
              <img
                src="/images/Logo@2x.png"
                alt="Logo"
                className="h-12 w-auto cursor-pointer"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/Logo.svg';
                }}
              />
            </a>
          </div>
        )}

        {/* Top-right hamburger menu */}
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
            <div className="max-w-sm mx-auto">
                             {/* Main Title */}
               <h1 className="font-black leading-tight mb-6 whitespace-nowrap overflow-visible">
                 <span className="preload inline text-6xl sm:text-8xl md:text-9xl text-orange-50 drop-shadow-lg" style={{ 
                   fontFamily: "'Quivert', sans-serif",
                   textShadow: '0 0 20px rgba(255,248,240,0.4)'
                 }}>
                   SABRANG
                 </span>
                 <span className="inline-block text-10xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 ml-2 sm:ml-3 md:ml-4 leading-[1.1] align-baseline" style={{ 
                   fontFamily: "'TAN Nimbus', sans-serif",
                   textShadow: '0 0 15px rgba(34,211,238,0.4)'
                 }}>
                   25
                 </span>
               </h1>
              
              {/* Date */}
              <div className="mb-6">
                <p className="text-white/90 text-lg font-bold tracking-widest" style={{ 
                  fontFamily: "'Times New Roman', sans-serif",
                  textShadow: '0 0 10px rgba(255,255,255,0.3)',
                  letterSpacing: '0.1em'
                }}>
                  October 09-11, 2025
                </p>
              </div>
              
              {/* Tagline */}
              <p className="text-gray-300 text-base mb-8 leading-relaxed">
                Unforgettable celebration of culture, creativity, and community.
              </p>
              
              {/* CTA Button */}
              <div className="flex items-center justify-center">
                <a href="/Registration-starting-soon" className="btn-prism pointer-events-auto transform hover:scale-105 transition-transform duration-300">
                  <span className="text-lg font-semibold">Register Now</span>
                </a>
              </div>
              
              {/* Scroll indicator */}
              <div className="mt-12 flex flex-col items-center space-y-2">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
                </div>
                <span className="text-white/60 text-xs">Scroll to explore</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-hidden">
            <div className="absolute top-4 right-4">
              <button
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="pt-20 px-6 h-full overflow-y-auto">
              <div className="grid grid-cols-1 gap-3 pb-8">
                {mobileNavItems.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => { setMobileMenuOpen(false); navigate(item.href); }}
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

        {/* Mobile Scroll Menu - appears when scrolling */}
        <MobileScrollMenu 
          onNavigate={(href) => {
            navigate(href);
          }}
        />
      </div>

      {/* Mobile Content Sections - separate from hero */}
      {!isLoading && (
        <div className="block lg:hidden relative min-h-screen overflow-hidden" style={{ 
          contentVisibility: 'auto', 
          containIntrinsicSize: '800px 1200px',
          background: `
            radial-gradient(ellipse at top, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at center, rgba(236, 72, 153, 0.15) 0%, transparent 70%),
            linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(30, 0, 50, 0.8) 25%, rgba(0, 20, 40, 0.8) 50%, rgba(50, 0, 30, 0.8) 75%, rgba(0, 0, 0, 0.9) 100%)
          `
        }}>
          {/* Special Mobile Content Background */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Animated gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/8 via-transparent to-cyan-500/8 animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/6 via-transparent to-emerald-500/6 animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }}></div>
            
            {/* Animated background orbs */}
            <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-600/30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s' }}></div>
            <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-gradient-to-tl from-pink-500/20 to-orange-500/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-cyan-500/15 to-indigo-600/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
            
            {/* Additional floating gradient orbs */}
            <div className="absolute top-1/3 left-1/6 w-24 h-24 bg-gradient-to-br from-yellow-400/15 to-red-500/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }}></div>
            <div className="absolute bottom-1/3 right-1/6 w-28 h-28 bg-gradient-to-tl from-green-400/15 to-teal-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '1.5s' }}></div>
            
            {/* Floating geometric shapes */}
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-sm animate-bounce"
                  style={{
                    left: `${(i * 89) % 100}%`,
                    top: `${(i * 67) % 100}%`,
                    animationDuration: `${4 + (i % 4)}s`,
                    animationDelay: `${(i * 0.5) % 3}s`,
                    transform: `rotate(${i * 45}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Animated gradient lines */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Horizontal gradient lines */}
              <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent opacity-50 animate-pulse" style={{ animationDuration: '5s' }} />
              <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-50 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/25 to-transparent opacity-40 animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
              <div className="absolute top-1/6 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent opacity-35 animate-pulse" style={{ animationDuration: '8s', animationDelay: '3s' }} />
              
              {/* Vertical gradient lines */}
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400/25 to-transparent opacity-40 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1.5s' }} />
              <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-green-400/20 to-transparent opacity-35 animate-pulse" style={{ animationDuration: '7s', animationDelay: '2.5s' }} />
              <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-orange-400/30 to-transparent opacity-45 animate-pulse" style={{ animationDuration: '8s', animationDelay: '0.5s' }} />
              
              {/* Diagonal gradient lines */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent opacity-30 transform rotate-12 animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent opacity-35 transform -rotate-12 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-400/20 to-transparent opacity-30 transform rotate-6 animate-pulse" style={{ animationDuration: '11s', animationDelay: '3s' }} />
              </div>
              
              {/* Moving gradient lines */}
              <div className="absolute inset-0">
                <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '4s', animationDelay: '0s' }} />
                <div className="absolute top-2/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/35 to-transparent opacity-55 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
                <div className="absolute top-1/5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent opacity-50 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
              </div>
            </div>
          </div>
          {/* Hero Introduction Section */}
          <section className="px-6 py-20 relative">
            <div className="text-center relative z-10">
              <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
              <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in-up" style={{ fontFamily: "'Quivert', sans-serif" }}>Sabrang 25</h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Unforgettable celebration of culture, creativity, and community.
              </p>
              <div className="mt-6 flex items-center justify-center space-x-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-sm">Experience the Magic</span>
              </div>
            </div>
            
            {/* Special floating elements for this section */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s' }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-gradient-to-tl from-cyan-500/20 to-blue-500/30 rounded-full blur-lg animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
            </div>
          </section>

          {/* Explore More Section */}
          <section className="px-6 py-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Quivert', sans-serif" }}>Explore More</h3>
              <p className="text-gray-400 text-sm">Discover what makes Sabrang special</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {[
                { title: 'About', icon: <Info className="w-6 h-6" />, href: '/About', color: 'from-blue-500 to-cyan-500', glowColor: 'shadow-blue-500/20', bgImage: '/images/about-section/about_back.webp' },
                { title: 'Events', icon: <Calendar className="w-6 h-6" />, href: '/Events', color: 'from-purple-500 to-pink-500', glowColor: 'shadow-purple-500/20', bgImage: '/images/backgrounds/eventpage.webp' },
                { title: 'Highlights', icon: <Star className="w-6 h-6" />, href: '/Gallery', color: 'from-yellow-500 to-orange-500', glowColor: 'shadow-yellow-500/20', bgImage: '/images/gallery_desktop/1.webp' },
                { title: 'Schedule', icon: <Clock className="w-6 h-6" />, href: '/schedule/progress', color: 'from-green-500 to-emerald-500', glowColor: 'shadow-green-500/20', bgImage: '/images/Schedule.jpg' }
              ].map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => { navigate(item.href); }}
                  className={`group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-white/40 active:scale-[0.98] transition-all duration-300 text-center overflow-hidden hover:${item.glowColor} hover:shadow-lg`}
                  style={{ 
                    background: `linear-gradient(135deg, ${item.color.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : item.color.includes('purple') ? 'rgba(147, 51, 234, 0.1)' : item.color.includes('yellow') ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)'}, rgba(255, 255, 255, 0.05))`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Background image with low opacity */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 group-hover:opacity-15 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${item.bgImage})` }}
                  ></div>
                  
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                  
                  {/* Floating particles inside card */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  
                  {/* Icon container with enhanced effects */}
                  <div className="relative z-10 w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/20">
                    <div className="text-white group-hover:text-white transition-colors duration-300 group-hover:drop-shadow-lg">
                      {item.icon}
                    </div>
                  </div>
                  
                  {/* Title with enhanced styling */}
                  <span className="relative z-10 font-semibold text-white text-sm group-hover:text-white transition-colors duration-300 group-hover:drop-shadow-md">
                    {item.title}
                  </span>
                  
                  {/* Enhanced hover effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </section>

          {/* Ready to Join Section */}
          <section className="px-6 py-20">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Quivert', sans-serif" }}>Ready to Join?</h3>
              <p className="text-gray-300 mb-8 text-lg">Don't miss out on the biggest event of the year!</p>
              
              {/* Enhanced Register Button */}
              <div className="relative group">
                <a 
                  href="/Registration-starting-soon" 
                  className="relative inline-block px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full text-white font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-purple-500/25"
                >
                  <span className="relative z-10">Register Now</span>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                </a>
                
                {/* Floating particles around button */}
                <div className="absolute inset-0 pointer-events-none">
                  {useMemo(() => Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                      style={{
                        left: `${20 + (i * 15)}%`,
                        top: `${30 + (i * 20)}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '2s'
                      }}
                    />
                  )), [])}
                </div>
              </div>
              
              {/* Additional info */}
              <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>3 Days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Live Events</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Premium</span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats Section */}
          <section className="px-6 py-16">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4">
                <div className="text-2xl font-bold text-purple-400 mb-1">25+</div>
                <div className="text-xs text-purple-300">Events</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">₹3L+</div>
                <div className="text-xs text-blue-300">Prizes</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4">
                <div className="text-2xl font-bold text-yellow-400 mb-1">7</div>
                <div className="text-xs text-yellow-300">Flagship</div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Desktop/Laptop layout (>= lg) */}
      <div className="hidden lg:block">
        {/* Top Right Black Pill Notch */}
        {!isLoading && (
          <div 
            className="absolute top-0 right-30 z-20 w-[500px] h-[70px] bg-black rounded-[30px]"
            style={{ transform: 'translateX(50%)' }}
          />
        )}
        
        {/* Top-left Logo (desktop) */}
        {!isLoading && (
          <div className="absolute top-6 left-10 z-50">
            <img
              src="/images/Logo@2x.png"
              alt="Logo"
              className="h-32 w-auto"
              loading="eager"
              fetchPriority="high"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/Logo.svg';
              }}
            />
          </div>
        )}
        
        {/* Register Now Button */}
        {!isLoading && (
          <div className="absolute top-6 right-6 z-50 flex items-center space-x-5">
            <a href="/Registration-starting-soon" className="px-28 py-5 bg-black/40 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-black/60 transition-all duration-300 border border-white/30">
              Register Now
            </a>
            <a href="/Registration-starting-soon" className="p-2 text-white transition-all duration-300 flex items-center justify-center">
            <img src="/JKLU_logo_white.png" alt="JKLU" className="w-15 h-15 object-contain" />
            </a>
          </div>
        )}
        
        {/* SidebarDock with InfinityTransition navigation */}
        {!isLoading && (
          <div className="fixed inset-0 pointer-events-none z-[99999]">
            <SidebarDock 
              className="hidden lg:block pointer-events-auto"
              onNavigate={(href) => { navigate(href); }}
            />
          </div>
        )}
        
        {/* Right Panel */}
        <div 
          className="absolute top-0 h-full bg-black p-6 sm:p-8 md:p-12 lg:p-16"
          style={{
            left: '0',
            right: '0',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% calc(100% - 100px), 200px calc(100% - 100px), 200px calc(100% - 60px), 0% calc(100% - 60px))'
          }}
        >
          {/* Video background only */}
          <div className="absolute inset-0 -z-10">
            <VideoBackground />
          </div>
          
          {/* Background decorative circles removed per request */}
          
          {/* Navigation */}
          <nav className="relative z-40 flex items-center justify-between p-8 pt-0 pointer-events-none">
            <div className="flex items-center space-x-4 ml-12">
              {/* Navigation links */}
            </div>
          </nav>
          
          {/* Main Content */}
          {!isLoading && (
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center">
                                                 <h1 className="text-8xl md:text-7xl lg:text-9xl font-black text-white leading-none">
                  <span className="text-orange-50 drop-shadow-lg text-9xl md:text-11xl lg:text-[11rem]" style={{ 
                    fontFamily: "'Quivert', sans-serif", 
                    letterSpacing: '0.02em',
                    textShadow: '0 0 30px rgba(255,248,240,0.5)'
                  }}>
                    SABRANG
                  </span><br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-2xl text-5xl md:text-6xl lg:text-8xl" style={{ 
                    fontFamily: "'TAN Nimbus', sans-serif", 
                    textShadow: '0 0 20px rgba(34,211,238,0.5)'
                  }}>
                    2025
                  </span>
                </h1>
                
                {/* Desktop Date */}
                <div className="mt-8">
                  <p className="text-white/90 text-xl font-bold tracking-widest" style={{ 
                    fontFamily: "'Times New Roman', sans-serif",
                    textShadow: '0 0 15px rgba(255,255,255,0.4)',
                    letterSpacing: '0.15em'
                  }}>
                    October 09-11, 2025
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

              {/* Infinity transition handled by AppShell */}

      {/* Enhanced Mobile Styles */}
      <style jsx>{`
        /* Mobile-specific animations */
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Mobile hero animations */
        .mobile-hero-content {
          animation: slideUpFade 1s ease-out 0.5s both;
        }

        .mobile-hero-title {
          animation: scaleIn 1.2s ease-out 0.8s both;
        }

        .mobile-hero-subtitle {
          animation: slideUpFade 1s ease-out 1.1s both;
        }

        .mobile-hero-button {
          animation: scaleIn 1s ease-out 1.4s both;
        }

        /* Enhanced mobile card hover effects */
        .mobile-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        /* Mobile button glow effect */
        .mobile-button-glow {
          position: relative;
          overflow: hidden;
        }

        .mobile-button-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .mobile-button-glow:hover::before {
          left: 100%;
        }

        /* Mobile star twinkle animation */
        .star-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

         /* Mobile responsive improvements */
         @media (max-width: 640px) {
           .mobile-hero-title {
             font-size: 3.5rem;
             line-height: 1;
           }
           
           .mobile-hero-subtitle {
             font-size: 1rem;
           }
           
           .mobile-explore-grid {
             grid-template-columns: repeat(2, 1fr);
             gap: 0.75rem;
           }
           
           /* Ensure 25 text is fully visible on mobile */
           h1 span:last-child {
             font-size: 2.5rem !important;
             line-height: 1.2 !important;
             margin-top: 0.2rem !important;
           }
         }

         @media (max-width: 480px) {
           .mobile-hero-title {
             font-size: 3rem;
           }
           
           .mobile-explore-grid {
             gap: 0.5rem;
           }
           
           /* Even smaller text for very small screens but ensure visibility */
           h1 span:last-child {
             font-size: 2rem !important;
             line-height: 1.3 !important;
             margin-top: 0.3rem !important;
           }
         }

        /* Custom scrollbar for mobile */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 4px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #8b5cf6, #ec4899);
            border-radius: 2px;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Enhanced mobile transitions */
        .mobile-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-transition:hover {
          transform: translateY(-2px);
        }

        /* Custom fade-in animations for mobile */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        /* Enhanced mobile card animations */
        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .mobile-card-float {
          animation: cardFloat 3s ease-in-out infinite;
        }

        /* Mobile particle effects */
        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        .mobile-particle {
          animation: particleFloat 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});

export default LayeredLandingPage;