'use client';

import React, { useState, useEffect } from 'react';
import SidebarDock from '../../../components/SidebarDock';
import Logo from '../../../components/Logo';
// import Footer from '../../../components/Footer';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  animationDelay: number;
  duration: number;
}

const FAQ = () => {
  const faqs = [
    {
      question: "What is Sabrang '25?",
      answer: "Sabrang '25 is the grandest cultural fest, offering a platform for talent, captivating performances, and unforgettable memories."
    },
    {
      question: "How can I participate in Sabrang '25 events?",
      answer: "You can register for various competitions and workshops through our 'Register Now' button on the homepage or by navigating to the Events section."
    },
    {
      question: "Is there a registration fee?",
      answer: "Information regarding registration fees for specific events will be provided during the registration process or can be found on the individual event pages."
    },
    {
      question: "Where will Sabrang '25 take place?",
      answer: "Details about the venue and specific event locations will be announced closer to the event date on our website and social media channels."
    },
    {
      question: "Can I attend Sabrang '25 without participating in events?",
      answer: "Yes, you are welcome to attend Sabrang '25 as a spectator to enjoy the performances and overall festive atmosphere."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random stars (fewer stars on mobile for better performance)
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 100;
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          animationDelay: Math.random() * 4,
          duration: Math.random() * 3 + 2,
        });
      }
      setStars(newStars);
    };

    generateStars();

    // Regenerate stars on window resize for responsive behavior
    const handleResize = () => {
      generateStars();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div 
      className="min-h-screen text-white font-sans relative overflow-hidden"
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth'
      }}
    >
      <Logo />
      <SidebarDock />
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 via-pink-900 to-black">
        {/* Nebula Effect */}
        <div className="absolute inset-0 opacity-15 sm:opacity-25 md:opacity-30">
          <div className="absolute top-8 sm:top-16 md:top-20 left-8 sm:left-16 md:left-20 w-32 h-32 sm:w-48 md:w-72 lg:w-96 sm:h-48 md:h-72 lg:h-96 bg-purple-500 rounded-full blur-2xl sm:blur-3xl animate-pulse will-change-transform"></div>
          <div className="absolute top-32 sm:top-48 md:top-60 right-12 sm:right-24 md:right-32 w-24 h-24 sm:w-32 md:w-48 lg:w-64 sm:h-32 md:h-48 lg:h-64 bg-blue-400 rounded-full blur-2xl sm:blur-3xl animate-pulse will-change-transform" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-16 sm:bottom-32 md:bottom-40 left-1/4 sm:left-1/3 w-28 h-28 sm:w-40 md:w-60 lg:w-80 sm:h-40 md:h-60 lg:h-80 bg-pink-400 rounded-full blur-2xl sm:blur-3xl animate-pulse will-change-transform" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Animated Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse will-change-transform"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {/* Floating Planets - Responsive sizes */}
        <div className="absolute top-16 sm:top-24 md:top-32 right-6 sm:right-12 md:right-20 w-8 h-8 sm:w-12 md:w-16 lg:w-24 sm:h-12 md:h-16 lg:h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-bounce will-change-transform" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-32 sm:top-56 md:top-80 left-6 sm:left-12 md:left-16 w-6 h-6 sm:w-8 md:w-12 lg:w-16 sm:h-8 md:h-12 lg:h-16 bg-gradient-to-br from-blue-300 to-blue-600 rounded-full animate-bounce will-change-transform" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
        <div className="absolute bottom-12 sm:bottom-24 md:bottom-32 right-16 sm:right-32 md:right-40 w-7 h-7 sm:w-10 md:w-16 lg:w-20 sm:h-10 md:h-16 lg:h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-bounce will-change-transform" style={{animationDuration: '7s', animationDelay: '1s'}}></div>

        {/* Saturn-like Ring Planet - Mobile optimized */}
        <div className="absolute bottom-6 sm:bottom-12 md:bottom-20 left-6 sm:left-12 md:left-20">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 md:w-20 lg:w-28 sm:h-16 md:h-20 lg:h-28 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full animate-spin will-change-transform" style={{animationDuration: '20s'}}></div>
            <div className="absolute inset-0 border border-yellow-400 sm:border-2 md:border-3 lg:border-4 rounded-full transform rotate-12 scale-125 sm:scale-150 opacity-40 sm:opacity-60"></div>
            <div className="absolute inset-0 border border-yellow-300 rounded-full transform -rotate-12 scale-110 sm:scale-125 opacity-30 sm:opacity-40"></div>
          </div>
        </div>

        {/* Shooting Stars - Mobile responsive */}
        <div className="absolute top-16 sm:top-32 md:top-40 left-0 w-0.5 h-0.5 sm:w-1 md:w-2 sm:h-1 md:h-2 bg-white rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-24 sm:top-48 md:top-60 right-0 w-0.5 h-0.5 sm:w-1 md:w-1 sm:h-1 md:h-1 bg-yellow-200 rounded-full animate-ping" style={{animationDelay: '7s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                 {/* Glowing Title - Mobile responsive */}
         <div className="text-center mb-6 sm:mb-8 relative">
           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 drop-shadow-2xl animate-pulse px-2 text-center">
             Frequently Asked Questions
           </h1>
           <div className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white opacity-20 blur-sm px-2 text-center">
             Frequently Asked Questions
           </div>
         </div>

        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl text-center mb-8 sm:mb-12 text-blue-100 animate-fade-in px-4">
          🌟 Find answers to common questions about Sabrang '25 🌟
        </p>

        {/* FAQ Cards - Mobile optimized */}
        <div className="w-full max-w-3xl space-y-4 sm:space-y-6 px-2 sm:px-0">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Glowing Border Effect */}
              <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-lg sm:rounded-xl blur opacity-25 sm:opacity-30 group-hover:opacity-50 sm:group-hover:opacity-60 transition duration-300"></div>
              
              <div className="relative border border-cyan-400/50 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-pink-900/80 backdrop-blur-sm shadow-xl sm:shadow-2xl transition-all duration-500 transform hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] sm:hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                {/* Question Button - Touch optimized */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-start sm:items-center focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-inset group active:scale-[0.98] transition-transform duration-150"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-yellow-200 group-hover:from-yellow-200 group-hover:to-pink-200 transition-all duration-300 pr-4 leading-relaxed">
                    ✨ {faq.question}
                  </h3>
                  <span
                    className={`transform transition-all duration-500 text-xl sm:text-2xl flex-shrink-0 ${
                      openIndex === index 
                        ? 'rotate-180 text-yellow-300 scale-110 sm:scale-125' 
                        : 'text-cyan-300 group-hover:text-yellow-300 group-hover:scale-105 sm:group-hover:scale-110'
                    }`}
                    aria-hidden="true"
                  >
                    🌟
                  </span>
                </button>

                {/* Answer Container - Mobile optimized */}
                <div
                  id={`faq-answer-${index}`}
                  className={`px-4 sm:px-6 transition-all duration-500 ease-in-out overflow-hidden ${
                    openIndex === index 
                      ? 'max-h-64 sm:max-h-48 opacity-100 pb-4 sm:pb-6' 
                      : 'max-h-0 opacity-0 pb-0'
                  }`}
                  aria-hidden={openIndex !== index}
                >
                  <div className="border-t border-cyan-400/30 pt-3 sm:pt-4">
                    <p className="text-blue-100 leading-relaxed text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                {/* Particle Effect on Hover - Reduced on mobile */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
                  <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-8 right-8 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-4 left-8 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Decoration - Mobile responsive */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-lg sm:text-xl md:text-2xl animate-bounce">
            <span>🌌</span>
            <span className="text-purple-200 font-semibold text-center">Explore the Universe of Sabrang '25</span>
            <span>🚀</span>
          </div>
        </div>
      </div>
      
<<<<<<< HEAD
      {/* Footer properly positioned at bottom */}
      <div className="mt-auto">
        <Footer />
      </div>
=======
      {/* Footer is rendered globally in AppShell */}
>>>>>>> 733a2c3 (Mobile optimizations + footer cleanup)

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse,
          .animate-bounce,
          .animate-spin,
          .animate-ping,
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQ;