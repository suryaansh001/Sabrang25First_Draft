'use client';
import React, { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { Play, Github, Linkedin, LayoutDashboard, Calendar, Users, Handshake, Info, Clock, Star, Mail, Home, HelpCircle, X, Trophy, ShoppingCart } from 'lucide-react';
import SidebarDock from '../../../components/SidebarDock';
import MobileScrollMenu from '../../../components/MobileScrollMenu';
import { useVideo } from '../../../components/VideoContext';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';
import ShinyText from '../../../components/shinytext';
import EarlyBirdFloating from '../../../components/EarlyBirdFloating';


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
  const [showEarlyBird, setShowEarlyBird] = useState(true);
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

        {/* Early Bird Floating Component - Mobile */}
        {!isLoading && showEarlyBird && (
          <EarlyBirdFloating onClose={() => setShowEarlyBird(false)} />
        )}
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
      </div>

      {/* Early Bird Floating Component - Desktop */}
      {!isLoading && showEarlyBird && (
        <EarlyBirdFloating onClose={() => setShowEarlyBird(false)} />
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