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
            backgroundImage: 'url(/images/backgrounds/about-hero.webp)',
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
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Video */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <video 
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    autoPlay 
                    muted 
                    loop
                    playsInline
                  >
                    <source src="/images/backgrounds/about-page/WhatsApp Video 2025-08-13 at 20.05.38_14fdac7b.mp4" type="video/mp4" />
                  </video>
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
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
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
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right: Video */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <video 
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    autoPlay 
                    muted 
                    loop
                    playsInline
                  >
                    <source src="/images/backgrounds/about-page/WhatsApp Video 2025-08-13 at 20.05.38_e7f140a8.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Categories Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
                Galactic Domains
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore the cosmic realms of creativity and competition
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Tech Galaxy',
                  description: 'Code through the stars in cosmic hackathons & stellar showcases',
                  image: '/images/backgrounds/about-page/WhatsApp Video 2025-08-13 at 20.05.33_be271183.mp4',
                  type: 'video',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  title: 'Command Nexus',
                  description: 'Lead missions with interstellar quizzes & cosmic challenges',
                  image: '/images/backgrounds/about-page/WhatsApp Video 2025-08-13 at 20.05.29_c38cc6c0.mp4',
                  type: 'video',
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  title: 'Creative Cosmos',
                  description: 'Design nebulas through artistic contests & visual installations',
                  image: '/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.40_42fe13c8.jpg',
                  type: 'image',
                  color: 'from-green-500 to-blue-500'
                },
                {
                  title: 'Cultural Universe',
                  description: 'Express your stellar soul through dance, music, drama & fashion',
                  image: '/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.37_b514dcc5.jpg',
                  type: 'image',
                  color: 'from-orange-500 to-red-500'
                }
              ].map((category, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    {category.type === 'video' ? (
                      <video 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        autoPlay 
                        muted 
                        loop
                        playsInline
                      >
                        <source src={category.image} type="video/mp4" />
                      </video>
                    ) : (
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                      {category.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-lg">✨</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flagship Section */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Video */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <video 
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    autoPlay 
                    muted 
                    loop
                    playsInline
                  >
                    <source src="/images/backgrounds/about-page/WhatsApp Video 2025-08-13 at 20.05.21_c5cbabb1.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </div>
              
              {/* Right: Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                    Flagship Showdowns
                  </span>
                </h2>
                <div className="space-y-4">
                  {[
                    'Panache – Glamorous fashion show',
                    'Band Jam – Electrifying music',
                    'Dance Battle – Ultimate dance glory'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300 text-lg">{item}</span>
                    </div>
                  ))}
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
              
              {/* Right: Video */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <video 
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    autoPlay 
                    muted 
                    loop
                    playsInline
                  >
                    <source src="/images/backgrounds/about-page/WhatsApp Video 2025-08-13 at 20.05.16_97cce750.mp4" type="video/mp4" />
                  </video>
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
              {/* Left: Video */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl">
                  <video 
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                    autoPlay 
                    muted 
                    loop
                    playsInline
                  >
                    <source src="/images/backgrounds/about-page/WhatsApp Video 2025-08-13 at 20.04.50_8741c3be.mp4" type="video/mp4" />
                  </video>
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
