'use client';

import React from 'react';
import Logo from '../../../components/Logo';
import SidebarDock from '../../../components/SidebarDock';
import Footer from '../../../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/aboutpage.webp)'
        }}
      />
      
      {/* Black Overlay for better text readability */}
      <div className="fixed inset-0 -z-10 bg-black/60" />
      
      <Logo />
      <SidebarDock />
      
      {/* Main Content Container */}
      <div className="relative z-10 pb-16 ">
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-300">
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
            {/* Hero Image for What is Sabrang */}
            
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Image */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <img 
                    src="/images/about-section/what_is_sabrang.JPG" 
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
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
            >
              <source src="/video/about-section/about-op.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-pink-900/80"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    Why It's OP
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                  Flagship Showdowns
                </span>
              </h2>
            </div>
            
            {/* Three Vertical Parallel Videos with Image Fallbacks */}
            <div className="grid md:grid-cols-3 gap-8">
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
                   >
                     <source src="/video/about-section/panache.mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                   <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Panache</h3>
                   <p className="text-xl text-gray-200 drop-shadow-lg">Glamorous fashion show</p>
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
                   >
                     <source src="/video/about-section/BandJAM.mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                   <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Band Jam</h3>
                   <p className="text-xl text-gray-200 drop-shadow-lg">Electrifying music</p>
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
                   >
                     <source src="/video/about-section/Dance (2).mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                   <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Dance Battle</h3>
                   <p className="text-xl text-gray-200 drop-shadow-lg">Ultimate dance glory</p>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Beyond Competitions Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
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
            <div className="grid lg:grid-cols-2 gap-16 items-center">
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
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

      {/* Footer outside main container */}
      <Footer />

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
