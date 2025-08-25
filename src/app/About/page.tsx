'use client';

import React, { useState, useEffect } from 'react';
import Logo from '../../../components/Logo';
import SidebarDock from '../../../components/SidebarDock';
import { Calendar, Users, Handshake, Info, Clock, Star, Mail, Home, HelpCircle, X, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import InfinityTransition from '../../../components/InfinityTransition';

const AboutPage = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/about-section/about_back.webp)'
        }}
      />
      
      {/* Black Overlay for better text readability */}
      <div className="fixed inset-0 -z-10 bg-black/60" />

      {/* Logo and sidebar */}
      <Logo className="block" />
      <SidebarDock className="hidden lg:block" />

      {/* Mobile hamburger (same style as HOME) */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition"
      >
        <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
        <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
        <span className="block h-0.5 bg-white/80 rounded-full w-4" />
      </button>

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
          <div className="pt-20 px-6 h-full overflow-y-auto">
            <div className="grid grid-cols-1 gap-3 pb-8">
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

      {/* Local Infinity Transition for mobile nav (mobile-optimized) */}
      <InfinityTransition
        isActive={showTransition}
        onComplete={() => {
          if (targetHref) {
            router.push(targetHref);
          }
          setShowTransition(false);
          setTargetHref(null);
        }}
      />
      
      {/* Main Content Container */}
      <div className="relative z-10 pb-16 flex-grow">
        {/* Hero Section */}
        <section 
          className="min-h-screen flex items-center justify-center relative"
          style={{
            backgroundImage: 'url(/images/about-section/about-bg.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Hero Background Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 drop-shadow-2xl">
                ABOUT
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 drop-shadow-2xl">
                SABRANG
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the grandest cultural fest. Unleash your talent, witness captivating performances, 
              and create unforgettable memories that will last a lifetime.
            </p>
          </div>
        </section>

        {/* What is Sabrang Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Mobile: background image behind text */}
            <div className="lg:hidden relative overflow-hidden rounded-2xl mb-12">
              <img
                src="/images/about-section/what_is_sabrang.webp"
                alt="What is Sabrang - Cultural Fest Celebration"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10 p-6 space-y-6">
                <h2 className="text-4xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                    What is Sabrang?
                  </span>
                </h2>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Sabrang isn't just a fest — it's an explosion of talent, creativity, and cosmic energy.
                  Over three thrilling days, JKLU transforms into a universe of music, dance, art, technology,
                  and pure celebration.
                </p>
                <p className="text-lg text-gray-200 leading-relaxed">
                  With a massive prize pool, flagship events, celebrity performances, and non-stop entertainment,
                  Sabrang is where memories are made and legends are born.
                </p>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-300 font-medium">Experience the Magic</span>
                </div>
              </div>
            </div>

            {/* Desktop: side by side */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Image */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <img 
                    src="/images/about-section/what_is_sabrang.webp" 
                    alt="What is Sabrang - Cultural Fest Celebration"
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold">
                  ✨
                </div>
              </div>
              
              {/* Right: Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                    What is Sabrang?
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  Sabrang isn't just a fest — it's an explosion of talent, creativity, and cosmic energy. 
                  Over three thrilling days, JKLU transforms into a universe of music, dance, art, technology, 
                  and pure celebration.
                </p>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  With a massive prize pool, flagship events, celebrity performances, and non-stop entertainment, 
                  Sabrang is where memories are made and legends are born.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 font-medium">Experience the Magic</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why It's OP Section */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm relative overflow-hidden">
          {/* Background Video with Image Fallback */}
          <div className="absolute inset-0 -z-10">
                         {/* Image Fallback - Always visible */}
             <img 
               src="/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.40_42fe13c8.jpg" 
               alt="Why It's OP Background"
               className="w-full h-full object-cover"
             />
            {/* Video Overlay - when loaded */}
            <video 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay 
              muted 
              loop
              playsInline
              preload="metadata"
              onError={(e) => {
                console.warn('About video failed to load, using image fallback', e);
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
              }}
              onLoadStart={() => console.log('About video loading started')}
              onCanPlay={() => console.log('About video can play')}
            >
              <source src="/videos/optimized/aboutop.mp4" type="video/mp4" />
              <source src="/videos/aboutsection/aboutop.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-pink-900/80"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                    Why It's OP
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                    (Overpowered)
                  </span>
                </h2>
                <div className="space-y-4">
                  {[
                    '₹3,00,000+ in prizes for winners and top performers',
                    'Flagship competitions that push creativity and skill',
                    'National-level participation',
                    'Immersive themes every year',
                    'Epic nights with DJs, live bands, and celebrities'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flagship Section */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                  Flagship Showdowns
                </span>
              </h2>
              <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
                Our crown jewels - the most prestigious events that define Sabrang's legacy. 
                These competitions bring together the nation's finest talent for epic showdowns.
              </p>
            </div>
            
            {/* First Row - Top 3 Flagship Events */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                             {/* Panache Video */}
               <div className="relative group h-[600px]">
                 <div className="absolute inset-0 overflow-hidden rounded-2xl">
                   {/* Image Fallback - Always visible */}
                   <img 
                     src="/images/about-section/Panache.png" 
                     alt="Panache Fashion Show"
                     className="w-full h-full object-cover"
                   />
                   {/* Video Overlay - when loaded */}
                   <video 
                     className="absolute inset-0 w-full h-full object-cover"
                     autoPlay 
                     muted 
                     loop
                     playsInline
                     preload="metadata"
                     onError={(e) => {
                       console.warn('Panache video failed to load, using image fallback', e);
                       const target = e.target as HTMLVideoElement;
                       target.style.display = 'none';
                     }}
                     onLoadStart={() => console.log('Panache video loading started')}
                     onCanPlay={() => console.log('Panache video can play')}
                   >
                     <source src="/videos/optimized/panache.mp4" type="video/mp4" />
                     <source src="/videos/aboutsection/panache.mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
                    ⭐ FLAGSHIP
                  </div>
                   <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Panache</h3>
                  <p className="text-xl text-gray-200 drop-shadow-lg mb-4">Glamorous fashion show</p>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>• Two-day extravaganza</p>
                    <p>• Theme Walk + Runway</p>
                    <p>• ₹85-120 entry</p>
                  </div>
                 </div>
               </div>
               
               {/* Band Jam Video */}
               <div className="relative group h-[600px]">
                 <div className="absolute inset-0 overflow-hidden rounded-2xl">
                   {/* Image Fallback - Always visible */}
                   <img 
                     src="/images/about-section/Bandjam.png" 
                     alt="Band Jam Music Competition"
                     className="w-full h-full object-cover"
                   />
                   {/* Video Overlay - when loaded */}
                   <video 
                     className="absolute inset-0 w-full h-full object-cover"
                     autoPlay 
                     muted 
                     loop
                     playsInline
                     preload="metadata"
                     onError={(e) => {
                       console.warn('Band Jam video failed to load, using image fallback', e);
                       const target = e.target as HTMLVideoElement;
                       target.style.display = 'none';
                     }}
                     onLoadStart={() => console.log('Band Jam video loading started')}
                     onCanPlay={() => console.log('Band Jam video can play')}
                   >
                     <source src="/videos/optimized/bandjam.mp4" type="video/mp4" />
                     <source src="/videos/aboutsection/bandjam.mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
                    ⭐ FLAGSHIP
                  </div>
                   <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Band Jam</h3>
                  <p className="text-xl text-gray-200 drop-shadow-lg mb-4">Electrifying music</p>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>• Original compositions</p>
                    <p>• Rock to classical fusion</p>
                    <p>• ₹60 entry</p>
                  </div>
                 </div>
               </div>
               
               {/* Dance Battle Video */}
               <div className="relative group h-[600px]">
                 <div className="absolute inset-0 overflow-hidden rounded-2xl">
                   {/* Image Fallback - Always visible */}
                   <img 
                     src="/images/about-section/Dance.png" 
                     alt="Dance Battle Competition"
                     className="w-full h-full object-cover"
                   />
                   {/* Video Overlay - when loaded */}
                   <video 
                     className="absolute inset-0 w-full h-full object-cover"
                     autoPlay 
                     muted 
                     loop
                     playsInline
                     preload="metadata"
                     onError={(e) => {
                       console.warn('Dance video failed to load, using image fallback', e);
                       const target = e.target as HTMLVideoElement;
                       target.style.display = 'none';
                     }}
                     onLoadStart={() => console.log('Dance video loading started')}
                     onCanPlay={() => console.log('Dance video can play')}
                   >
                     <source src="/videos/optimized/dance.mp4" type="video/mp4" />
                     <source src="/videos/aboutsection/dance.mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
                    ⭐ FLAGSHIP
                  </div>
                   <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Dance Battle</h3>
                  <p className="text-xl text-gray-200 drop-shadow-lg mb-4">Ultimate dance glory</p>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>• Hip-hop to krumping</p>
                    <p>• Crew vs crew battles</p>
                    <p>• ₹45 entry</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row - Remaining Flagship Events */}
            <div className="grid md:grid-cols-4 gap-6">
              {/* Nukkad Natak */}
              <div className="relative group h-[400px] bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-3">
                    ⭐ FLAGSHIP
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Nukkad Natak</h3>
                  <p className="text-sm text-gray-200 mb-3">Street theater magic</p>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• Social awareness</p>
                    <p>• Open air performances</p>
                    <p>• Free entry</p>
                  </div>
                </div>
              </div>

              {/* Spotlight */}
              <div className="relative group h-[400px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-3">
                    ⭐ FLAGSHIP
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Spotlight</h3>
                  <p className="text-sm text-gray-200 mb-3">Acting excellence</p>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• Solo & duet acts</p>
                    <p>• Dramatic performances</p>
                    <p>• ₹25 entry</p>
                  </div>
                </div>
              </div>

              {/* Singing Palooza */}
              <div className="relative group h-[400px] bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-3">
                    ⭐ FLAGSHIP
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Singing Palooza</h3>
                  <p className="text-sm text-gray-200 mb-3">Vocal mastery</p>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• Bollywood to classical</p>
                    <p>• Solo & duet</p>
                    <p>• ₹35 entry</p>
                  </div>
                </div>
              </div>

              {/* Step Up */}
              <div className="relative group h-[400px] bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-3">
                    ⭐ FLAGSHIP
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Step Up</h3>
                  <p className="text-sm text-gray-200 mb-3">Group dance energy</p>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• Synchronized routines</p>
                    <p>• High-energy choreography</p>
                    <p>• ₹40 entry</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flagship Stats */}
            <div className="mt-16 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-yellow-400 mb-2">8</div>
                  <div className="text-lg text-yellow-200">Flagship Events</div>
                  <div className="text-sm text-yellow-300 mt-2">Premium competitions</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-purple-400 mb-2">₹2,00,000+</div>
                  <div className="text-lg text-purple-200">Prize Pool</div>
                  <div className="text-sm text-purple-300 mt-2">For flagship winners</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6">
                  <div className="text-4xl font-bold text-blue-400 mb-2">15,000+</div>
                  <div className="text-lg text-blue-200">Total Capacity</div>
                  <div className="text-sm text-blue-300 mt-2">Across all events</div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Beyond Competitions Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Mobile: background image behind text */}
            <div className="lg:hidden relative overflow-hidden rounded-2xl mb-12">
              <img
                src="/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.37_b514dcc5.jpg"
                alt="Beyond Competitions - Live Performance"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10 p-6 space-y-6">
                <h2 className="text-4xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                    Beyond Competitions
                  </span>
                </h2>
                <div className="space-y-4">
                  {['DJ Night: Dance till dawn','Mini Games Arena','Wall of Goodness'].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-200 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: side by side */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                    Beyond Competitions
                  </span>
                </h2>
                <div className="space-y-4">
                  {[
                    'DJ Night: Dance till dawn',
                    'Mini Games Arena',
                    'Wall of Goodness'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-300 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right: Image */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <img 
                    src="/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.37_b514dcc5.jpg" 
                    alt="Beyond Competitions - Live Performance"
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
                  🚀
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Vibe Section */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            {/* Mobile: background image behind text */}
            <div className="lg:hidden relative overflow-hidden rounded-2xl mb-12">
              <img
                src="/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.40_42fe13c8.jpg"
                alt="Final Vibe - Live Event Atmosphere"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10 p-6 space-y-6">
                <h2 className="text-4xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                    The Final Vibe
                  </span>
                </h2>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Imagine vibrant lights, roaring crowds, breathtaking performances, and an energy that doesn't fade until the last beat drops. That's Sabrang—more than a fest, it's an experience you'll remember for years.
                </p>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-pink-300 font-medium">Unforgettable Memories</span>
                </div>
              </div>
            </div>

            {/* Desktop: side by side */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Image */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <img 
                    src="/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.40_42fe13c8.jpg" 
                    alt="Final Vibe - Live Event Atmosphere"
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </div>
              
              {/* Right: Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                    The Final Vibe
                  </span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Imagine vibrant lights, roaring crowds, breathtaking performances, and an energy 
                  that doesn't fade until the last beat drops. That's Sabrang more than a fest, 
                  it's an experience you'll remember for years.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-pink-400 font-medium">Unforgettable Memories</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer is rendered globally in AppShell */}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 active:scale-95"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <style jsx>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #7c3aed, #db2777);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Animation for floating elements */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
