"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CulturalComingSoon() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [konami, setKonami] = useState<number[]>([]);
  const [easterEgg, setEasterEgg] = useState(false);
  const [rehearsalCount, setRehearsalCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('');
  const containerRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [glitchDots, setGlitchDots] = useState<{ left: number; top: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  const culturalMessages = [
    "choreographing dance battles that'll make you question reality 💃",
    "tuning instruments for the most epic musical showdown 🎵",
    "designing stage setups that'll blow your mind ✨",
    "rehearsing performances until 3am (worth every second)",
    "crafting art installations that speak to your soul 🎨",
    "writing poetry that'll give you goosebumps 📝",
    "practicing drama pieces that'll leave you speechless 🎭",
    "organizing fashion shows that'll redefine style 👗",
    "planning cultural fusion events you've never seen before",
    "creating memories that'll last a lifetime... almost ready! 🌟"
  ];

  // Set time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) setTimeOfDay('night owl');
    else if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else if (hour < 22) setTimeOfDay('evening');
    else setTimeOfDay('creative soul');
  }, []);

  // Cycle through cultural messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % culturalMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Rehearsal count that occasionally updates
  useEffect(() => {
    setRehearsalCount(Math.floor(Math.random() * 127) + 45);
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setRehearsalCount(prev => prev + 1);
      }
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // Konami code easter egg
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // up up down down left right left right B A
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.keyCode];
      if (newKonami.length > konamiCode.length) {
        newKonami.splice(0, newKonami.length - konamiCode.length);
      }
      setKonami(newKonami);
      
      if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
        setEasterEgg(true);
        setTimeout(() => setEasterEgg(false), 5000);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konami]);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setEventCount(Math.floor(Math.random() * 8) + 15);
    setGlitchDots(Array.from({ length: 40 }, () => ({ left: Math.random() * 100, top: Math.random() * 100 })));
    setMounted(true);
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth text animation for cultural vibes
  const CulturalText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const [glow, setGlow] = useState(false);
    
    useEffect(() => {
      const interval = setInterval(() => {
        if (Math.random() > 0.88) {
          setGlow(true);
          setTimeout(() => setGlow(false), 400);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: glow ? [1, 1.02, 1] : 1,
          textShadow: glow ? "0 0 20px rgba(168, 85, 247, 0.5)" : "0 0 0px rgba(168, 85, 247, 0)"
        }}
        transition={{ 
          delay, 
          duration: 0.8, 
          type: "spring",
          scale: { duration: 0.3 },
          textShadow: { duration: 0.3 }
        }}
        className="relative"
      >
        {children}
      </motion.div>
    );
  };

  // Click to add more events (because culture is infinite)
  const handleEventClick = () => {
    setEventCount(prev => prev + Math.floor(Math.random() * 2) + 1);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden cursor-none selection:bg-purple-500/30"
      style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}
    >
      {/* Easter egg mode */}
      {easterEgg && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🎭</div>
            <div className="text-2xl text-purple-400 font-bold">SABRANG SUPER FAN DETECTED!</div>
            <div className="text-white/80 mt-2">you're definitely getting VIP access 👑</div>
          </div>
        </motion.div>
      )}

      {/* Custom cursor with cultural flair */}
      <motion.div
        className="fixed mix-blend-difference pointer-events-none z-50 flex items-center justify-center"
        style={{
          left: mousePos.x * windowSize.width / 100 - 20,
          top: mousePos.y * windowSize.height / 100 - 20,
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          rotate: isHovering ? [0, 180] : [0, 360],
        }}
        transition={{
          scale: { duration: 0.3 },
          rotate: { duration: isHovering ? 1 : 12, repeat: Infinity, ease: "linear" }
        }}
      >
        <div className="w-8 h-8 border-2 border-white rounded-full relative flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm"
          >
            ✨
          </motion.div>
        </div>
      </motion.div>

      {/* Floating cultural elements background */}
      <div className="absolute inset-0 opacity-10">
        {['🎭', '🎵', '💃', '🎨', '🎪', '🌟'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${20 + (i * 12)}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [-15, 15, -15],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        
        {/* Time-based greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8 text-white/60 text-sm flex items-center gap-2"
        >
          <span className="text-purple-400">✨</span>
          hello {timeOfDay} 👋
        </motion.div>

        {/* Cultural loading animation */}
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.6 }}
          className="mb-16 relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: isHovering ? [1, 1.2, 1] : 1
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.8 }
            }}
            className="w-40 h-40 relative"
          >
            {/* Cultural themed spinning rings */}
            <div className="absolute inset-0 border-2 border-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-spin opacity-30" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-3 border-2 border-yellow-400/40 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="absolute inset-6 border border-green-400/50 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-9 border border-blue-400/60 rounded-full animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  rotateY: { duration: 3, repeat: Infinity },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="text-4xl"
              >
                {isHovering ? '🎭' : '🎪'}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main cultural title */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {['S', 'A', 'B', 'R', 'A', 'N', 'G'].map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 300, opacity: 0, rotateZ: Math.random() * 60 - 30 }}
                animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                transition={{ 
                  delay: i * 0.15,
                  duration: 1,
                  type: "spring",
                  stiffness: 80 + Math.random() * 40
                }}
                className="inline-block text-6xl md:text-9xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent mr-2 hover:from-yellow-400 hover:via-purple-500 hover:to-pink-400 transition-all duration-500 cursor-pointer"
                whileHover={{ 
                  scale: 1.3, 
                  rotateZ: Math.random() * 15 - 7.5,
                  y: -10
                }}
                onClick={() => console.log(`You clicked ${letter}! Cultural vibes activated 🎭`)}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          
          <CulturalText delay={1}>
            <h2 className="text-2xl md:text-4xl text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text mb-2">
              the cultural extravaganza{' '}
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotateZ: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                }}
                className="inline-block text-yellow-400"
              >
                is brewing
              </motion.span>
            </h2>
          </CulturalText>
        </div>

        {/* Cultural commentary */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="max-w-2xl mb-12 p-8 border border-purple-500/20 rounded-2xl bg-gray-900/40 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            <span className="text-white/50 text-sm ml-3">~/sabrang-prep.log</span>
          </div>
          
          <motion.p 
            key={currentMessage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/80 text-base leading-relaxed mb-6"
          >
            <span className="text-purple-400">🎭</span> {culturalMessages[currentMessage]}
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <span className="text-2xl">🎪</span>
              <div>
                <motion.div 
                  key={rehearsalCount}
                  initial={{ scale: 1.3, color: '#a855f7' }}
                  animate={{ scale: 1, color: '#d1d5db' }}
                  className="font-bold text-white"
                >
                  {rehearsalCount}
                </motion.div>
                <div className="text-gray-400 text-xs">hours rehearsed</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <span className="text-2xl">🎨</span>
              <div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEventClick}
                  className="font-bold text-white hover:text-pink-400 transition-colors cursor-pointer"
                >
                  {eventCount}
                </motion.button>
                <div className="text-gray-400 text-xs">events planned</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-2xl"
              >
                ✨
              </motion.span>
              <div>
                <div className="font-bold text-white">∞</div>
                <div className="text-gray-400 text-xs">memories incoming</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cultural CTA button */}
        <motion.button
          initial={{ opacity: 0, y: 100, rotateZ: -5 }}
          animate={{ opacity: 1, y: 0, rotateZ: 0 }}
          transition={{ delay: 2, duration: 0.8, type: "spring" }}
          whileHover={{ 
            scale: 1.08,
            rotateZ: [0, -1, 1, 0],
            boxShadow: "0 25px 50px rgba(168, 85, 247, 0.4)",
          }}
          whileTap={{ scale: 0.95, rotateZ: 3 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl"
          onClick={() => {
            console.log('Get notified clicked! You\'re now on the VIP cultural list 🎭');
            // Add a celebratory effect
            document.body.style.animation = 'celebrate 1s ease-in-out';
            setTimeout(() => {
              document.body.style.animation = '';
            }, 1000);
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          
          <span className="relative flex items-center justify-center gap-3">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎭
            </motion.span>
            notify me when magic begins
            <motion.span
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "linear"
              }}
            >
              ✨
            </motion.span>
          </span>
        </motion.button>

        {/* Cultural status messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-16 text-center space-y-3"
        >
          <motion.div
            animate={{ 
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
            }}
            className="flex items-center justify-center gap-3 text-sm"
          >
            <motion.div
              animate={{ 
                backgroundColor: ['#a855f7', '#ec4899', '#10b981', '#f59e0b', '#a855f7'],
                scale: [1, 1.4, 1],
                boxShadow: ['0 0 0 rgba(168, 85, 247, 0)', '0 0 25px rgba(168, 85, 247, 0.6)', '0 0 0 rgba(168, 85, 247, 0)']
              }}
              transition={{ 
                backgroundColor: { duration: 5, repeat: Infinity },
                scale: { duration: 1.5, repeat: Infinity },
                boxShadow: { duration: 2.5, repeat: Infinity }
              }}
              className="w-3 h-3 rounded-full"
            />
            <span className="text-white/80 font-medium">
              cultural status: absolutely phenomenal
            </span>
          </motion.div>
          
          <div className="text-white/60 text-sm flex items-center justify-center gap-2">
            <span className="text-yellow-400">🌟</span> 
            prepare for: talent overload, jaw-dropping performances, unforgettable moments
          </div>
          
          <div className="text-white/50 text-xs">
            <span className="text-purple-400">💫</span> pro tip: try the konami code for a special surprise
          </div>
        </motion.div>
      </div>

      {/* Floating interactive cultural elements */}
      {['🎭', '🎵', '💃', '🎨', '🎪', '✨'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
          style={{
            left: `${10 + (i * 15)}%`,
            top: `${15 + (i * 15)}%`,
          }}
          animate={{
            scale: [0.8, 1.3, 0.8],
            rotate: [0, 360],
            x: (mousePos.x - 50) * (0.03 + i * 0.002),
            y: (mousePos.y - 50) * (0.03 + i * 0.002),
          }}
          transition={{
            scale: { duration: 3 + i * 0.2, repeat: Infinity },
            rotate: { duration: 8 + i * 0.5, repeat: Infinity, ease: "linear" },
            x: { duration: 1.5 },
            y: { duration: 1.5 },
          }}
          whileHover={{ scale: 2, rotate: 720 }}
          onClick={() => console.log(`Cultural element ${emoji} activated! 🎉`)}
        >
          {emoji}
        </motion.div>
      ))}

      {/* CSS for celebrate animation */}
      <style jsx>{`
        @keyframes celebrate {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.02) rotate(1deg); }
          50% { transform: scale(0.98) rotate(-1deg); }
          75% { transform: scale(1.01) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}