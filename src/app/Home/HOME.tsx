'use client';
import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { Play, Github, Linkedin, LayoutDashboard, Calendar, Users, Handshake, Info, Clock, Star, Mail, Home, HelpCircle, X, Trophy, ShoppingCart } from 'lucide-react';
import SidebarDock from '../../../components/SidebarDock';
import MobileScrollMenu from '../../../components/MobileScrollMenu';
import { useVideo } from '../../../components/VideoContext';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';
import ShinyText from '../../../components/shinytext';


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
    { title: 'Schedule', href: '/schedule', icon: <Clock className="w-5 h-5" /> },
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

        {/* Simplified background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.8)_100%)]" />
        
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
                <ShinyText 
                  text="October 10-12, 2025"
                  speed={6}
                  className="text-white/90 text-lg font-bold tracking-widest"
                />
              </div>
              {/* Prize Pool Banner */}
              <div className="mb-6 flex items-center justify-center">
                <div className="relative prize-pill pointer-events-auto">
                  <div className="prize-glow" />
                  <div className="prize-shimmer" />
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 border border-white/30">
                      <Trophy className="w-4 h-4 text-yellow-300" />
                    </span>
                    <span className="font-extrabold tracking-wide">
                      Prize Pool ₹2.5 Lakh+
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Tagline */}
              <p className="text-gray-300 text-base mb-8 leading-relaxed">
                Unforgettable celebration of culture, creativity, and community.
              </p>
              
              {/* CTA Button */}
              <div className="flex items-center justify-center">
                <a href="/checkout" className="btn-prism pointer-events-auto transform hover:scale-105 transition-transform duration-300">
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
        <div className="block lg:hidden bg-[#0A0B1A] text-white relative overflow-hidden">
          {/* About Section */}
          <section className="px-6 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">About Sabrang</h2>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Sabrang is the annual cultural festival of JK Lakshmipat University, a vibrant confluence of art, music, and intellect. It's a platform where talent shines, creativity flourishes, and memories are forged.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-bold text-purple-400 mb-1">19</div>
                <div className="text-xs text-purple-300">Events</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">₹2.5L+</div>
                <div className="text-xs text-blue-300">Prizes</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl font-bold text-yellow-400 mb-1">7</div>
                <div className="text-xs text-yellow-300">Flagship</div>
              </div>
            </div>
          </section>

          {/* Special Artist Lineup - Navjot Ahuja Section */}
          <section className="px-6 py-16 bg-gradient-to-b from-purple-900/20 to-black/20 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
            </div>
            
            <div className="relative z-10 text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  Special Artist Lineup
                </h2>
                <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Spectacular Performance</p>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse" />
            </div>

            {/* Artist Showcase */}
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-4xl leading-[1.15] pt-1 font-bold text-white mb-2" style={{ fontFamily: "'TAN Nimbus', 'Quivert', sans-serif" }}>
                  NAVJOT AHUJA
                </h3>
                <p className="text-yellow-400 font-semibold text-lg tracking-wider">LIVE IN CONCERT</p>
              </div>

              {/* Image Carousel */}
              <div className="flex gap-3 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex-shrink-0 relative group">
                  <img 
                    src="/images/artist/navjotAhuja/navjot1.jpg" 
                    alt="Navjot Ahuja Profile" 
                    className="w-32 h-40 object-cover rounded-lg border-2 border-purple-500/50 transition-all duration-300 group-hover:scale-105 group-hover:border-purple-400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-shrink-0 relative group">
                  <img 
                    src="/images/artist/navjotAhuja/navjot3.JPG" 
                    alt="Navjot Ahuja Performance" 
                    className="w-32 h-40 object-cover rounded-lg border-2 border-pink-500/50 transition-all duration-300 group-hover:scale-105 group-hover:border-pink-400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-shrink-0 relative group">
                  <img 
                    src="/images/artist/navjotAhuja/navjot4.jpg" 
                    alt="Navjot Ahuja with DJ" 
                    className="w-32 h-40 object-cover rounded-lg border-2 border-cyan-500/50 transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Artist Description */}
              <div className="text-center mb-8">
                <p className="text-gray-300 text-base leading-relaxed mb-4 max-w-md mx-auto">
                  🎤 <span className="text-purple-400 font-semibold">Experience the magic</span> of Navjot Ahuja's soulful voice and electrifying stage presence
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  A night of melodies that will resonate in your heart forever. Don't miss this once-in-a-lifetime performance!
                </p>
                
                {/* Performance Details removed as requested */}
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <p className="text-yellow-400 font-bold text-lg mb-4 animate-pulse">
                  ✨ Ready to be mesmerized? ✨
                </p>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 border border-purple-400/50"
                >
                  Secure Your Spot - Register Now!
                </button>
                <p className="text-gray-400 text-xs mt-2">
                  Limited seats available for this exclusive performance
                </p>
              </div>
            </div>
          </section>

          {/* Aman's Collective - Mobile */}
          <section className="px-6 py-14 bg-gradient-to-b from-black/10 to-black/30 relative overflow-hidden">
            <div className="relative z-10 text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.25em] bg-white/10 border border-white/15 text-amber-300">LIVE BAND</span>
              </div>
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-amber-300 via-yellow-400 to-rose-400 bg-clip-text text-transparent" style={{ fontFamily: "'TAN Nimbus', 'Quivert', sans-serif" }}>AMAN'S COLLECTIVE</h3>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
              <img src="/images/artist/day2-artist/WhatsApp Image 2025-10-05 at 21.08.21_d4b9a99a.jpg" alt="Aman's Collective" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                <button onClick={() => navigate('/checkout')} className="flex-1 py-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-black text-sm font-bold">Reserve</button>
                <a href="/Events" className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm">Details</a>
              </div>
            </div>
          </section>

          {/* DJ Night with Dewik - Mobile */}
          <section className="px-6 py-14 bg-gradient-to-b from-black/10 to-black/30 relative overflow-hidden">
            <div className="relative z-10 text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src="/images/artist/day1%20performance/Spectal%20Logo%20White.png" alt="Dewik Logo" className="h-6 w-auto opacity-90" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-[0.25em] bg-white/10 border border-white/15 text-cyan-300">DJ NIGHT</span>
              </div>
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent" style={{ fontFamily: "'TAN Nimbus', 'Quivert', sans-serif" }}>DEWIK</h3>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
              <img src="/images/artist/day1%20performance/artist%20photo/IMG_0345.JPG" alt="Dewik live" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                <button onClick={() => navigate('/checkout')} className="flex-1 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white text-sm font-bold">Register</button>
                <a href="/Events" className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm">Details</a>
              </div>
            </div>
          </section>

          

          {/* Flagship Events Preview */}
          <section className="px-6 py-16 bg-black/20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">Flagship Events</h2>
              <p className="text-gray-400 text-sm">The biggest highlights of Sabrang '25</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Manually selected flagship events for preview */}
              <EventCardPreview id={1} title="RAMPWALK - PANACHE" image="/posters/PANACHE.webp" category="Flagship" price="₹85-120" />
              <EventCardPreview id={2} title="BANDJAM" image="/posters/BANDJAM.webp" category="Flagship" price="₹60" />
            </div>
            <div className="text-center mt-8">
              <button onClick={() => navigate('/Events')} className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition">
                View All Events
              </button>
            </div>
          </section>

          {/* Special Artist Lineup - Navjot Ahuja Section */}
          <section className="px-6 py-16 bg-gradient-to-b from-purple-900/20 to-black/20 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
            </div>
            
            <div className="relative z-10 text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  Special Artist Lineup
                </h2>
                <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-gray-400 text-sm mb-2">Spectacular Performance</p>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse" />
            </div>

            {/* Artist Showcase */}
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-4xl leading-[1.15] pt-1 font-bold text-white mb-2" style={{ fontFamily: "'TAN Nimbus', 'Quivert', sans-serif" }}>
                  NAVJOT AHUJA
                </h3>
                <p className="text-yellow-400 font-semibold text-lg tracking-wider">LIVE IN CONCERT</p>
              </div>

              {/* Image Carousel */}
              <div className="flex gap-3 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="flex-shrink-0 relative group">
                  <img 
                    src="/images/artist/navjotAhuja/navjot1.jpg" 
                    alt="Navjot Ahuja Profile" 
                    className="w-32 h-40 object-cover rounded-lg border-2 border-purple-500/50 transition-all duration-300 group-hover:scale-105 group-hover:border-purple-400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-shrink-0 relative group">
                  <img 
                    src="/images/artist/navjotAhuja/navjot3.JPG" 
                    alt="Navjot Ahuja Performance" 
                    className="w-32 h-40 object-cover rounded-lg border-2 border-pink-500/50 transition-all duration-300 group-hover:scale-105 group-hover:border-pink-400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-shrink-0 relative group">
                  <img 
                    src="/images/artist/navjotAhuja/navjot4.jpg" 
                    alt="Navjot Ahuja with DJ" 
                    className="w-32 h-40 object-cover rounded-lg border-2 border-cyan-500/50 transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Artist Description */}
              <div className="text-center mb-8">
                <p className="text-gray-300 text-base leading-relaxed mb-4 max-w-md mx-auto">
                  🎤 <span className="text-purple-400 font-semibold">Experience the magic</span> of Navjot Ahuja's soulful voice and electrifying stage presence
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  A night of melodies that will resonate in your heart forever. Don't miss this once-in-a-lifetime performance!
                </p>
                
                {/* Performance Details removed as requested */}
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <p className="text-yellow-400 font-bold text-lg mb-4 animate-pulse">
                  ✨ Ready to be mesmerized? ✨
                </p>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 border border-purple-400/50"
                >
                  Secure Your Spot - Register Now!
                </button>
                <p className="text-gray-400 text-xs mt-2">
                  Limited seats available for this exclusive performance
                </p>
              </div>
            </div>
          </section>

          {/* Gallery Preview */}
          <section className="px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">Glimpse of Sabrang '24</h2>
              <p className="text-gray-400 text-sm">Relive the moments</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <img src="/images/gallery_mobile/7.webp" alt="Gallery 1" className="rounded-lg aspect-square object-cover" />
              <img src="/images/gallery_mobile/8.webp" alt="Gallery 2" className="rounded-lg aspect-square object-cover" />
              <img src="/images/gallery_mobile/9.webp" alt="Gallery 3" className="rounded-lg aspect-square object-cover" />
            </div>
             <div className="text-center mt-8">
              <button onClick={() => navigate('/Gallery')} className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition">
                View Full Gallery
              </button>
            </div>
          </section>

          {/* Final CTA */}
          <section className="px-6 py-20 text-center bg-gradient-to-t from-purple-900/30 to-transparent">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Join?</h3>
            <p className="text-gray-300 mb-8 text-lg">Don't miss out on the biggest event of the year!</p>
            <a href="/checkout" className="btn-prism pointer-events-auto transform hover:scale-105 transition-transform duration-300">
              <span className="text-lg font-semibold">Register Now</span>
            </a>
          </section>
        </div>
      )}

      {/* Desktop/Laptop layout (>= lg) */}
      <div className="hidden lg:block">
        {/* Desktop Hero Section */}
        <section className="relative h-screen bg-black overflow-hidden">
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
              <a href="/checkout" className="px-28 py-5 bg-black/40 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-black/60 transition-all duration-300 border border-white/30">
                Register Now
              </a>
              <a href="/Events" className="p-2 text-white transition-all duration-300 flex items-center justify-center">
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
                    <ShinyText 
                      text="October 10-12, 2025"
                      speed={6}
                      className="text-white/90 text-xl font-bold tracking-widest"
                    />
                  </div>
                  {/* Prize Pool Banner */}
                  <div className="mt-6 flex items-center justify-center">
                    <div className="relative prize-pill prize-pill-lg">
                      <div className="prize-glow" />
                      <div className="prize-shimmer" />
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 border border-white/30">
                          <Trophy className="w-5 h-5 text-yellow-300" />
                        </span>
                        <span className="font-extrabold tracking-widest">
                          Prize Pool ₹2.5 Lakh+
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      

      {/* Special Navjot Ahuja Section - Desktop Only */}
      {!isLoading && (
         <section className="hidden lg:block relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-700/50 via-black/30 to-indigo-700/50">
          {/* Background vertical photos */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 relative overflow-hidden">
              <img 
                src="/images/artist/navjotAhuja/navjot1.jpg" 
                alt="Navjot Ahuja 1" 
                className="w-full h-full object-cover opacity-60"
              />
               <div className="absolute inset-0 bg-gradient-to-r from-purple-700/40 to-transparent" />
            </div>
            <div className="w-1/3 relative overflow-hidden">
              <img 
                src="/images/artist/navjotAhuja/navjot2.jpg" 
                alt="Navjot Ahuja 2" 
                className="w-full h-full object-cover opacity-60"
              />
               <div className="absolute inset-0 bg-gradient-to-r from-purple-700/40 to-transparent" />
            </div>
            <div className="w-1/3 relative overflow-hidden">
              <img 
                src="/images/artist/navjotAhuja/navjot3.JPG" 
                alt="Navjot Ahuja 3" 
                className="w-full h-full object-cover opacity-60"
              />
               <div className="absolute inset-0 bg-gradient-to-r from-purple-700/40 to-transparent" />
            </div>
          </div>

           {/* Content overlay */}
           <div className="relative z-10 flex items-center justify-between h-full pl-32 pr-16">
             {/* Subtle moving spotlights */}
             <div className="pointer-events-none absolute inset-0 overflow-hidden">
               <div className="absolute -top-10 -left-10 w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.18),transparent_60%)] blur-2xl animate-[prizeFloat_10s_ease-in-out_infinite]" />
               <div className="absolute bottom-0 right-0 w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_60%)] blur-2xl animate-[prizeFloat_8s_ease-in-out_infinite]" />
             </div>
             {/* Left side - Description */}
             <div className="w-1/2 text-white">
             <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] tracking-[0.25em] bg-yellow-500/15 border border-yellow-400/40 text-yellow-300 font-semibold">HEADLINER</span>
                  <span className="px-3 py-1 rounded-full text-[11px] tracking-[0.25em] bg-white/10 border border-white/20 text-white/80">MAIN STAGE</span>
                </div>
                <h2 className="text-6xl xl:text-7xl leading-[1.05] pt-2 font-black mb-4 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent shine-text" style={{ fontFamily: "'TAN Nimbus', 'Quivert', sans-serif" }}>
                  NAVJOT AHUJA
                </h2>
                <div className="w-40 h-[5px] bg-gradient-to-r from-yellow-400 via-amber-400 to-pink-500 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.35)] mb-6" />
              </div>
              
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-gray-200">
                  🎤 <span className="text-yellow-400 font-semibold">Experience the magic</span> of Navjot Ahuja's soulful voice and electrifying stage presence
                </p>
                <p className="text-gray-300">
                  A night of melodies that will resonate in your heart forever. Don't miss this once-in-a-lifetime performance!
                </p>
                
                {/* Day 3 Highlight removed as requested */}
                
                <p className="text-yellow-400 font-bold text-xl animate-pulse">
                  ✨ Ready to be mesmerized? ✨
                </p>
              </div>
            </div>

            {/* Right side - Tilted zigzag pattern */}
            <div className="w-1/2 flex justify-end items-center">
              <div className="relative">
                {/* Zigzag pattern background */}
                <div className="absolute inset-0 transform rotate-12">
                  <svg width="400" height="500" viewBox="0 0 400 500" className="opacity-20">
                    <defs>
                      <pattern id="zigzag" x="0" y="0" width="80" height="100" patternUnits="userSpaceOnUse">
                        <path d="M0,0 L40,50 L80,0 L80,100 L40,50 L0,100 Z" fill="url(#gradient)" />
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </pattern>
                    </defs>
                    <rect width="400" height="500" fill="url(#zigzag)" />
                  </svg>
                </div>
                
                {/* Tilted text */}
                <div className="absolute top-8 right-8 transform rotate-12">
                  <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'TAN Nimbus', sans-serif" }}>
                    LIVE IN CONCERT
                  </h3>
                  <p className="text-yellow-400 font-semibold text-lg">
                    SPECIAL GUEST
                  </p>
                </div>
                
                {/* Tilted Navjot photo with stronger aura */}
                <div className="relative transform rotate-12">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-gradient-to-br from-yellow-400/40 via-pink-400/30 to-purple-500/40 blur-2xl rounded-3xl" />
                    <img 
                      src="/images/artist/navjotAhuja/navjotpng.png" 
                      alt="Navjot Ahuja Tilted" 
                      className="relative w-80 h-80 object-cover rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] border-4 border-white/20"
                    />
                  </div>
                </div>
                
                 {/* Floating elements */}
                 <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300/60 rounded-full animate-pulse" />
                 <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-300/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                 <div className="absolute top-1/2 -left-8 w-4 h-4 bg-pink-300/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button 
              onClick={() => navigate('/checkout')}
               className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-400/25 border border-purple-300/50 text-xl"
            >
              Secure Your Spot - Register Now!
            </button>
            <p className="text-center text-gray-400 text-sm mt-2">
              Limited seats available for this exclusive performance
            </p>
          </div>
        </section>
      )}

      {/* Aman's Collective - Desktop Only (between Navjot and Dewik) */}
      {!isLoading && (
        <section className="hidden lg:block relative w-full h-screen overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-black">
          {/* Background with soft noise, bg image and spotlight */}
          <div className="absolute inset-0">
            <img src="/images/artist/day2-artist/Screenshot 2025-10-05 212953.png" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_65%)]" />
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-16 flex items-center gap-16">
              {/* Left: Photo collage */}
              <div className="flex-1">
                <div className="relative flex gap-4 items-end">
                  <div className="relative w-[420px] h-[560px] -rotate-2">
                    <div className="absolute -inset-1 bg-gradient-to-br from-rose-400/35 via-amber-300/25 to-yellow-400/35 blur-2xl rounded-3xl" />
                    <img src="/images/artist/day2-artist/WhatsApp Image 2025-10-05 at 21.08.21_d4b9a99a.jpg" alt="Aman's Collective live" className="relative z-10 w-full h-full object-cover rounded-3xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6)]" />
                  </div>
                  <div className="flex flex-col gap-4 rotate-2">
                    <img src="/images/artist/day2-artist/bg.jpg" alt="Aman poster" className="w-[220px] h-[270px] object-cover rounded-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.55)]" />
                    <img src="/images/artist/day2-artist/Screenshot 2025-10-05 211237.png" alt="Aman art" className="w-[220px] h-[270px] object-cover rounded-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.55)]" />
                  </div>
                </div>
              </div>

              {/* Right: Text and CTA */}
              <div className="flex-1 text-white">
                <div className="mb-3 flex items-center gap-2">
                  <span className="px-3 py-1 text-[11px] tracking-[0.35em] rounded-full bg-white/10 border border-white/20 text-amber-300">LIVE BAND</span>
                </div>
                <h2 className="text-6xl xl:text-7xl font-black leading-[1.15] pt-1 mb-2 overflow-visible bg-gradient-to-r from-amber-300 via-yellow-400 to-rose-400 bg-clip-text text-transparent" style={{ fontFamily: "'TAN Nimbus', 'Quivert', sans-serif" }}>
                  AMAN'S COLLECTIVE
                </h2>
                <p className="text-gray-300 text-lg max-w-xl leading-relaxed mb-8">
                  Soulful Hindi pop and indie vibes with powerful vocals, live guitars and a warm, intimate stage feel. A set crafted for sing-alongs and goosebumps.
                </p>
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/checkout')} className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-black font-bold tracking-wider hover:from-amber-300 hover:to-rose-300 transition-transform duration-300 border border-white/10 shadow-2xl hover:scale-[1.03]">Reserve Your Pass</button>
                  <a href="/Events" className="px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-white/15 transition">Explore Events</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DJ Night with Dewik - Desktop Only */}
      {!isLoading && (
        <section className="hidden lg:block relative w-full h-screen overflow-hidden bg-black">
          {/* Background: Spectal/DJ logo with neon beams */}
          <div className="absolute inset-0">
            <img
              src="/images/artist/day1%20performance/Spectal%20Logo%20White.png"
              alt="Dewik DJ Logo"
              className="absolute inset-0 w-[1100px] h-[1100px] object-contain opacity-[0.12] m-auto"
              style={{ filter: 'drop-shadow(0 0 45px rgba(99,102,241,0.45))' }}
            />
            {/* Neon light beams */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -left-1/4 top-0 w-[60%] h-full bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-transparent blur-3xl" />
              <div className="absolute -right-1/4 top-0 w-[60%] h-full bg-gradient-to-tl from-cyan-400/10 via-sky-500/5 to-transparent blur-3xl" />
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-16 flex items-center gap-16">
              {/* Left: Title and copy */}
              <div className="flex-1 text-white">
                <div className="mb-4 flex flex-col items-start gap-2">
                  <img
                    src="/images/artist/day1%20performance/Spectal%20Logo%20White.png"
                    alt="Dewik logo"
                    className="h-10 w-auto -ml-2 md:-ml-3 drop-shadow-[0_4px_24px_rgba(34,211,238,0.45)]"
                  />
                  <span className="px-3 py-1 text-xs tracking-[0.35em] rounded-full bg-white/10 border border-white/20 text-cyan-300">DJ NIGHT</span>
                </div>
                <h2 className="text-6xl xl:text-7xl font-black leading-[1.6] mb-4 overflow-visible">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500" style={{ fontFamily: "'TAN Nimbus', 'Quivert', sans-serif" }}>DEWIK</span>
                  <span className="block text-3xl font-bold text-white/90 tracking-widest">LIVE DJ SET</span>
                </h2>
                <p className="text-gray-300 text-lg max-w-xl leading-relaxed mb-8">
                  High-energy blends of House, Hip Hop, and Bollywood with festival-grade drops. Feel the bass, the lights, and the rush — a night engineered for the dancefloor.
                </p>

                {/* Equalizer bars */}
                <div className="flex items-end gap-1 h-14 mb-10">
                  <div className="w-2 bg-cyan-400/80 rounded-sm animate-[equalize_1.2s_ease-in-out_infinite]" />
                  <div className="w-2 bg-fuchsia-400/80 rounded-sm animate-[equalize_1.4s_ease-in-out_infinite]" />
                  <div className="w-2 bg-purple-400/80 rounded-sm animate-[equalize_1.1s_ease-in-out_infinite]" />
                  <div className="w-2 bg-pink-400/80 rounded-sm animate-[equalize_1.5s_ease-in-out_infinite]" />
                  <div className="w-2 bg-sky-400/80 rounded-sm animate-[equalize_1.3s_ease-in-out_infinite]" />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/checkout')}
                    className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold tracking-wider hover:from-cyan-400 hover:to-fuchsia-400 transition-transform duration-300 border border-white/20 shadow-2xl hover:scale-[1.03]"
                  >
                    Register for DJ Night
                  </button>
                  <a href="/Events" className="px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-white/15 transition">Explore Events</a>
                </div>
              </div>

              {/* Right: Featured performance collage */}
              <div className="flex-1 flex justify-end">
                <div className="relative flex gap-4 items-end">
                  {/* Large primary */}
                  <div className="relative w-[460px] h-[600px] rotate-2">
                    <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400/40 via-fuchsia-400/40 to-purple-500/40 blur-2xl rounded-3xl" />
                    <img
                      src="/images/artist/day1%20performance/artist%20photo/IMG_0345.JPG"
                      alt="Dewik performing live"
                      className="relative z-10 w-full h-full object-cover rounded-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                    />
                    <div className="absolute -top-3 -left-3 px-3 py-1 rounded-full bg-fuchsia-500 text-white text-xs font-bold shadow-lg">Headliner</div>
                  </div>
                  {/* Stacked side thumbs */}
                  <div className="flex flex-col gap-4 -rotate-2">
                    <img
                      src="/images/artist/day1%20performance/artist%20photo/IMG_2842.JPG"
                      alt="Dewik crowd shot"
                      className="w-[220px] h-[290px] object-cover rounded-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
                    />
                    <img
                      src="/images/artist/day1%20performance/artist%20photo/IMG_0804.JPG"
                      alt="Dewik on decks"
                      className="w-[220px] h-[290px] object-cover rounded-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom ticker */}
          <div className="absolute bottom-0 left-0 right-0 h-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="whitespace-nowrap animate-[ticker_18s_linear_infinite] text-white/80 text-sm tracking-[0.35em]">
              <span className="mx-8">DJ NIGHT • DEWIK • OCT 10 • JKLU • TURN THE NIGHT UP •</span>
              <span className="mx-8">HOUSE • HIP HOP • BOLLYWOOD • LIVE MIX • LIGHTS • ENERGY •</span>
              <span className="mx-8">REGISTER NOW • LIMITED PASSES • SABRANG 25 •</span>
            </div>
          </div>

          {/* Keyframes moved to global style block below to avoid nested styled-jsx */}
        </section>
      )}

              {/* Infinity transition handled by AppShell */}

      {/* Enhanced Mobile Styles */}
      <style jsx>{`
        /* Prize banner styles */
        .prize-pill {
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(8px);
          position: relative;
          overflow: hidden;
          box-shadow: 0 6px 30px rgba(250, 204, 21, 0.2), inset 0 0 0 1px rgba(255,255,255,0.06);
          animation: prizeFloat 6s ease-in-out infinite;
        }

        .prize-pill-lg {
          padding: 0.75rem 1.25rem;
        }

        .prize-glow {
          position: absolute;
          inset: -20%;
          background: radial-gradient(120px 60px at 10% 50%, rgba(250, 204, 21, 0.25), transparent 60%),
                      radial-gradient(120px 60px at 90% 50%, rgba(34, 211, 238, 0.22), transparent 60%),
                      radial-gradient(200px 120px at 50% -10%, rgba(168, 85, 247, 0.25), transparent 60%);
          filter: blur(18px);
          pointer-events: none;
        }

        .prize-shimmer {
          position: absolute;
          top: 0;
          left: -120%;
          height: 100%;
          width: 120%;
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
          animation: shimmer 2.2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }

        @keyframes prizeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

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
            background: rgba(107, 114, 128, 0.6);
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

        /* Dewik section keyframes */
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes equalize { 0%, 100% { height: 20%; } 25% { height: 65%; } 50% { height: 35%; } 75% { height: 90%; } }

        /* Shimmer for NAVJOT title */
        .shine-text {
          position: relative;
          overflow: hidden;
        }
        .shine-text:after {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.35) 50%, transparent 80%);
          transform: skewX(-20deg);
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});

const EventCardPreview = ({ id, title, image, category, price }: { id: number, title: string, image: string, category: string, price: string }) => {
  const { navigate } = useNavigation();
  return (
    <div
      className="rounded-lg overflow-hidden border border-white/10 group cursor-pointer shadow-lg bg-neutral-900/60 flex flex-col"
      onClick={() => navigate(`/Events`)}
    >
      <div className="relative w-full aspect-[3/5] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex flex-col items-start gap-1.5 mb-2">
          <div className="px-2 py-0.5 rounded-sm text-white text-[10px] font-bold uppercase tracking-widest bg-yellow-500/20 border border-yellow-400/30 text-yellow-300">
            ⚡ {category}
          </div>
          <div className="text-white text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded-full border border-white/20">
            {price}
          </div>
        </div>
        <h3 className="font-bold text-sm text-white uppercase tracking-wider flex-grow mb-3">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default LayeredLandingPage;