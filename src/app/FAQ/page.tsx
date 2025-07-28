'use client';

import React, { useState, useEffect } from 'react';

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

  const [openIndex, setOpenIndex] = useState(null);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
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
  }, []);

  const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 via-pink-900 to-black">
        {/* Nebula Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-60 right-32 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-pink-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Animated Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
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

        {/* Floating Planets */}
        <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-bounce" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-80 left-16 w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-600 rounded-full animate-bounce" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 right-40 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-bounce" style={{animationDuration: '7s', animationDelay: '1s'}}></div>

        {/* Saturn-like Ring Planet */}
        <div className="absolute bottom-20 left-20">
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
            <div className="absolute inset-0 border-4 border-yellow-400 rounded-full transform rotate-12 scale-150 opacity-60"></div>
            <div className="absolute inset-0 border-2 border-yellow-300 rounded-full transform -rotate-12 scale-125 opacity-40"></div>
          </div>
        </div>

        {/* Shooting Stars */}
        <div className="absolute top-40 left-0 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-60 right-0 w-1 h-1 bg-yellow-200 rounded-full animate-ping" style={{animationDelay: '7s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20">
        {/* Glowing Title */}
        <div className="text-center mb-8 relative">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 drop-shadow-2xl animate-pulse">
            Frequently Asked Questions
          </h1>
          <div className="absolute inset-0 text-5xl md:text-7xl font-extrabold leading-tight text-white opacity-20 blur-sm">
            Frequently Asked Questions
          </div>
        </div>

        <p className="text-xl md:text-2xl max-w-3xl text-center mb-12 text-blue-100 animate-fade-in">
          🌟 Find answers to common questions about Sabrang '25 🌟
        </p>

        {/* FAQ Cards */}
        <div className="w-full max-w-3xl space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              
              <div className="relative border border-cyan-400/50 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-pink-900/80 backdrop-blur-sm shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                {/* Question Button */}
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-6 py-6 flex justify-between items-center focus:outline-none group"
                >
                  <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-yellow-200 group-hover:from-yellow-200 group-hover:to-pink-200 transition-all duration-300">
                    ✨ {faq.question}
                  </h3>
                  <span
                    className={`transform transition-all duration-500 text-2xl ${
                      openIndex === index 
                        ? 'rotate-180 text-yellow-300 scale-125' 
                        : 'text-cyan-300 group-hover:text-yellow-300 group-hover:scale-110'
                    }`}
                  >
                    🌟
                  </span>
                </button>

                {/* Answer Container */}
                <div
                  className={`px-6 transition-all duration-500 ease-in-out overflow-hidden ${
                    openIndex === index 
                      ? 'max-h-48 opacity-100 pb-6' 
                      : 'max-h-0 opacity-0 pb-0'
                  }`}
                >
                  <div className="border-t border-cyan-400/30 pt-4">
                    <p className="text-blue-100 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                {/* Particle Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-8 right-8 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-4 left-8 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-2xl animate-bounce">
            <span>🌌</span>
            <span className="text-purple-200 font-semibold">Explore the Universe of Sabrang '25</span>
            <span>🚀</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FAQ;