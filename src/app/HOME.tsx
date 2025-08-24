'use client';
import React, { memo, useEffect, useState } from 'react';
import { Play, Github, Linkedin, LayoutDashboard, Calendar, Users, Handshake, Info, Clock, Star, Mail, Home, HelpCircle, X } from 'lucide-react';
import SidebarDock from '../../components/SidebarDock';
import MobileScrollMenu from '../../components/MobileScrollMenu';
import { useVideo } from '../../components/VideoContext';
import { useRouter } from 'next/navigation';
import InfinityTransition from '../../components/InfinityTransition';

// Simplified Video Background Component
const VideoBackground = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { setHasPlayedVideo } = useVideo();

  // Simple video loading
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        setVideoLoaded(true);
        setHasPlayedVideo(true);
      };

      const handleError = () => {
        console.log('Video failed to load, using fallback');
        setVideoError(true);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [setHasPlayedVideo]);

  if (videoError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-blue-900 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 animate-pulse" style={{ animationDuration: '8s' }} />
        
        {/* Floating orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-purple-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-tl from-indigo-400/30 to-blue-600/35 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400/25 to-pink-500/35 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-gradient-to-br from-cyan-400/20 to-blue-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '0.5s' }}></div>
        </div>

        {/* Animated light rays */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-60 animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-bounce"
              style={{
                left: `${(i * 67) % 100}%`,
                top: `${(i * 43) % 100}%`,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                backgroundColor: ['#60a5fa', '#a855f7', '#ec4899', '#06b6d4', '#8b5cf6'][Math.floor(Math.random() * 5)],
                opacity: Math.random() * 0.6 + 0.4,
                animationDuration: `${Math.random() * 4 + 3}s`,
                animationDelay: `${Math.random() * 2}s`,
                boxShadow: `0 0 ${Math.random() * 15 + 10}px currentColor`
              }}
            />
          ))}
        </div>

        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#grid)" className="text-blue-400/30" />
        </svg>

        {/* Center spotlight effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-500/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'brightness(0.6) contrast(1.1)' }}
    >
      <source src="/videos/herovideo.mp4" type="video/mp4" />
      <source src="/videos/herovideo2.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

interface LayeredLandingPageProps {
  isLoading?: boolean;
}

// Simplified mobile video background
const MobileVideoBackground: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Preload mobile video immediately
    const video = document.createElement('video');
    video.src = '/videos/herovideo2.mp4';
    video.preload = 'auto';
    
    const handleCanPlay = () => {
      setVideoLoaded(true);
    };

    const handleError = () => {
      console.log('Mobile video failed to load');
      setVideoError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  if (videoError) {
    return null;
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ 
        filter: 'brightness(0.3) contrast(1.1)',
        opacity: videoLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
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
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        {/* Mobile backup image - loads immediately */}
        <img
          src="/herobg.webp"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          onError={(e) => {
            console.log('Mobile hero image failed, trying fallback');
            (e.target as HTMLImageElement).src = '/images/hero.webp';
          }}
          onLoad={() => {
            console.log('Mobile hero image loaded successfully');
          }}
        />
        
        {/* Mobile video background */}
        <div className="absolute inset-0">
          <MobileVideoBackground />
          
          {/* Video loading indicator */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-center opacity-0 pointer-events-none">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

        {/* Simplified decorative overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Soft center glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-white/10 via-cyan-300/10 to-purple-500/10 blur-3xl" />

          {/* Simple twinkling particles */}
          {Array.from({ length: 12 }).map((_, i) => (
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
                (e.target as HTMLImageElement).src = '/images/Logo.svg';
              }}
            />
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
            <div>
              <h1 className="font-black leading-none">
                <span className="block text-6xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-200 drop-shadow" style={{ fontFamily: "'Stardos Stencil', 'Orbitron', sans-serif" }}>
                  SABRANG
                </span>
                <span className="inline-block text-5xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 drop-shadow ml-2 sm:ml-3 md:ml-4" style={{ fontFamily: "'Stardos Stencil', 'Orbitron', sans-serif" }}>
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

        {/* Mobile Scroll Menu - appears when scrolling */}
        <MobileScrollMenu 
          onNavigate={(href) => {
            setTargetHref(href);
            setShowTransition(true);
          }}
        />
      </div>

      {/* Mobile Content Sections - separate from hero */}
      {!isLoading && (
        <div className="block lg:hidden relative bg-gradient-to-b from-black/80 via-purple-900/40 to-black/90 min-h-screen">
          {/* About section */}
          <section className="px-6 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to Sabrang 25</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Experience the magic of Noorwana & Color to Cosmos. Join us for an unforgettable celebration of culture, creativity, and community.
              </p>
            </div>
          </section>

          {/* Quick links section */}
          <section className="px-6 py-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Explore More</h3>
            <div className="grid grid-cols-2 gap-4">
              {mobileNavItems.slice(1, 5).map((item) => (
                <button
                  key={item.title}
                  onClick={() => { setTargetHref(item.href); setShowTransition(true); }}
                  className="p-6 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 active:scale-[0.98] transition-all duration-200 text-center group"
                >
                  <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.title}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Call to action */}
          <section className="px-6 py-16">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Join?</h3>
              <p className="text-gray-300 mb-6">Don't miss out on the biggest event of the year!</p>
              <a 
                href="/Signup" 
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Register Now
              </a>
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
          <div className="absolute top-10 left-10 z-50">
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
          <div className="absolute top-2.5 right-2 z-50 flex items-center space-x-5">
            <a href="/Signup" className="px-24 py-4 bg-black/40 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-black/60 transition-all duration-300 border border-white/30">
              Register Now
            </a>
            <a href="/dashboard" className="w-12 h-12 bg-purple-600/60 hover:bg-purple-600/80 rounded-full text-white transition-all duration-300 border border-purple-400/40 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </a>
          </div>
        )}
        
        {/* SidebarDock */}
        {!isLoading && <SidebarDock className="hidden lg:block" />}
        
        {/* Right Panel */}
        <div 
          className="absolute top-0 h-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 p-6 sm:p-8 md:p-12 lg:p-16"
          style={{
            left: '0',
            right: '0',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% calc(100% - 100px), 200px calc(100% - 100px), 200px calc(100% - 60px), 0% calc(100% - 60px))'
          }}
        >
          {/* Video background */}
          <div className="absolute inset-0 -z-10">
            <VideoBackground />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          
          {/* Simple background elements */}
          {!isLoading && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-500/40 rounded-full blur-3xl -translate-x-1/2"></div>
              <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-tl from-indigo-400/40 to-blue-600/30 rounded-full blur-2xl"></div>
            </div>
          )}
          
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
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white leading-none">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-200 drop-shadow-lg text-8xl md:text-9xl lg:text-[12rem]" style={{ fontFamily: "'Stardos Stencil', 'Orbitron', sans-serif", textShadow: '0 0 30px rgba(255,255,255,0.5)', letterSpacing: '0.02em' }}>
                    SABRANG
                  </span><br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 drop-shadow-2xl text-8xl md:text-9xl lg:text-[10rem]" style={{ fontFamily: "'Stardos Stencil', 'Orbitron', sans-serif", textShadow: '0 0 40px rgba(34, 211, 238, 0.6)' }}>
                    2025
                  </span>
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Infinity transition */}
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