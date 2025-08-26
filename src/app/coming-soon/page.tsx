"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function ComingSoon() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [konami, setKonami] = useState<number[]>([]);
  const [easterEgg, setEasterEgg] = useState(false);
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [bugCount, setBugCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('');
  const containerRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [glitchDots, setGlitchDots] = useState<{ left: number; top: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  const devMessages = [
    "just fixed a bug that created two more bugs... classic",
    "why does this work in dev but not prod?? 🤔",
    "refactored the entire codebase at 3am (bad idea)",
    "added a feature nobody asked for but everyone will love",
    "spent 6 hours debugging... it was a missing semicolon",
    "the code is now 69% more chaotic (nice)",
    "TODO: remove debug console.logs (narrator: they never did)",
    "accidentally deleted production DB... jk it was staging",
    "this component has gained consciousness, send help",
    "css is a mystery and i am but a humble peasant"
  ];

  // Set time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) setTimeOfDay('still awake??');
    else if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else if (hour < 22) setTimeOfDay('evening');
    else setTimeOfDay('night owl');
  }, []);

  // Cycle through dev messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % devMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Coffee count that occasionally updates
  useEffect(() => {
    setCoffeeCount(Math.floor(Math.random() * 47) + 15);
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCoffeeCount(prev => prev + 1);
      }
    }, 30000);
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
    setBugCount(Math.floor(Math.random() * 12) + 1);
    setGlitchDots(Array.from({ length: 50 }, () => ({ left: Math.random() * 100, top: Math.random() * 100 })));
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

  // Drunk text effect for late night coding vibes
  const DrunkText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const [wobble, setWobble] = useState(false);
    
    useEffect(() => {
      const interval = setInterval(() => {
        if (Math.random() > 0.93) {
          setWobble(true);
          setTimeout(() => setWobble(false), 200);
        }
      }, 1500);
      
      return () => clearInterval(interval);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 50, rotateZ: -5 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          rotateZ: wobble ? [0, 2, -1, 0] : 0,
          x: wobble ? [0, 1, -1, 0] : 0
        }}
        transition={{ 
          delay, 
          duration: 0.6, 
          type: "spring",
          rotateZ: { duration: 0.2 },
          x: { duration: 0.2 }
        }}
        className="relative"
      >
        {children}
      </motion.div>
    );
  };

  // Click to multiply bugs (because that's how it works)
  const handleBugClick = () => {
    setBugCount(prev => prev + Math.floor(Math.random() * 3) + 1);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-black relative overflow-hidden cursor-none selection:bg-purple-500/30"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* Easter egg mode */}
      {easterEgg && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl text-green-400 font-bold">KONAMI CODE ACTIVATED!</div>
            <div className="text-white/80 mt-2">you absolute legend</div>
          </div>
        </motion.div>
      )}

      {/* Custom cursor with personality */}
      <motion.div
        className="fixed mix-blend-difference pointer-events-none z-50 flex items-center justify-center"
        style={{
          left: mousePos.x * windowSize.width / 100 - 15,
          top: mousePos.y * windowSize.height / 100 - 15,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? [0, 180] : [0, 360],
        }}
        transition={{
          scale: { duration: 0.2 },
          rotate: { duration: isHovering ? 0.5 : 8, repeat: Infinity, ease: "linear" }
        }}
      >
        <div className="w-6 h-6 border-2 border-white rounded-full relative">
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Glitchy matrix-ish background */}
      <div className="absolute inset-0 opacity-10">
        {glitchDots.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500 text-xs font-mono"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [-10, 10, -10],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        
        {/* Time-based greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8 text-white/50 text-sm"
        >
          good {timeOfDay} 👋
        </motion.div>

        {/* Chaotic loading animation */}
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.8 }}
          className="mb-16 relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: isHovering ? [1, 1.3, 1] : 1
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.6 }
            }}
            className="w-32 h-32 relative"
          >
            {/* Multiple spinning rings with different speeds */}
            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
            <div className="absolute inset-2 border-2 border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 border border-pink-400/40 rounded-full animate-spin" style={{ animationDuration: '5s' }} />
            <div className="absolute inset-6 border border-green-400/50 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotateY: { duration: 2, repeat: Infinity },
                  scale: { duration: 1, repeat: Infinity }
                }}
                className="text-3xl"
              >
                {isHovering ? '🔥' : '⚡'}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main chaotic title */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {['S', 'H', 'I', 'P', 'P', 'I', 'N', 'G'].map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 200, opacity: 0, rotateZ: Math.random() * 90 - 45 }}
                animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                transition={{ 
                  delay: i * 0.1,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100 + Math.random() * 100
                }}
                className="inline-block text-6xl md:text-9xl font-black text-white mr-1 hover:text-purple-400 transition-colors cursor-pointer"
                whileHover={{ 
                  scale: 1.2, 
                  rotateZ: Math.random() * 20 - 10,
                  color: '#8b5cf6'
                }}
                onClick={() => console.log(`You clicked ${letter}! Easter egg developer here 👋`)}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          
          <DrunkText delay={0.8}>
            <h2 className="text-2xl md:text-4xl text-green-400 mb-2">
              something absolutely{' '}
              <motion.span
                animate={{ 
                  color: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  scale: { duration: 0.5, repeat: Infinity }
                }}
                className="font-bold"
              >
                unhinged
              </motion.span>
            </h2>
          </DrunkText>
        </div>

        {/* Developer commentary */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="max-w-2xl mb-12 p-6 border border-white/10 rounded-lg bg-gray-900/30 backdrop-blur"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white/40 text-sm ml-2">~/dev-thoughts.log</span>
          </div>
          
          <motion.p 
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/70 text-sm font-mono leading-relaxed"
          >
            <span className="text-green-400">$</span> {devMessages[currentMessage]}
          </motion.p>
          
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-purple-400">☕</span>
              <motion.span 
                key={coffeeCount}
                initial={{ scale: 1.5, color: '#8b5cf6' }}
                animate={{ scale: 1, color: '#9ca3af' }}
                className="text-gray-400"
              >
                {coffeeCount} cups of coffee consumed
              </motion.span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400">🐛</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBugClick}
                className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                {bugCount} bugs squashed (click me!)
              </motion.button>
            </div>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-blue-400"
              >
                ⚙️
              </motion.span>
              <span className="text-gray-400">47 features nobody asked for</span>
            </div>
          </div>
        </motion.div>

        {/* Chaotic CTA button */}
        <motion.button
          initial={{ opacity: 0, y: 100, rotateZ: -10 }}
          animate={{ opacity: 1, y: 0, rotateZ: 0 }}
          transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
          whileHover={{ 
            scale: 1.05,
            rotateZ: [0, -2, 2, 0],
            boxShadow: "0 20px 40px rgba(139, 69, 255, 0.4)",
          }}
          whileTap={{ scale: 0.95, rotateZ: 5 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="group relative px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg overflow-hidden transition-all duration-500 hover:border-purple-400"
          style={{ 
            clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
            fontFamily: "'JetBrains Mono', monospace"
          }}
          onClick={() => {
            console.log('Button clicked! You\'re now on the list of cool people 😎');
            // Add a little screen shake effect
            document.body.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
              document.body.style.animation = '';
            }, 500);
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
            initial={{ x: '-100%', skewX: 45 }}
            whileHover={{ x: '0%' }}
            transition={{ duration: 0.6 }}
          />
          
          <span className="relative flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              $
            </motion.span>
            sudo notify --me --immediately
            <motion.span
              animate={{ 
                opacity: [1, 0, 1],
                x: [0, 3, 0]
              }}
              transition={{ 
                opacity: { duration: 1, repeat: Infinity },
                x: { duration: 2, repeat: Infinity }
              }}
            >
              █
            </motion.span>
          </span>
        </motion.button>

        {/* Ridiculous status messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 text-center space-y-2"
        >
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
            }}
            className="flex items-center justify-center gap-3 text-sm font-mono"
          >
            <motion.div
              animate={{ 
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'],
                scale: [1, 1.3, 1],
                boxShadow: ['0 0 0 rgba(16, 185, 129, 0)', '0 0 20px rgba(16, 185, 129, 0.5)', '0 0 0 rgba(16, 185, 129, 0)']
              }}
              transition={{ 
                backgroundColor: { duration: 4, repeat: Infinity },
                scale: { duration: 1, repeat: Infinity },
                boxShadow: { duration: 2, repeat: Infinity }
              }}
              className="w-3 h-3 rounded-full"
            />
            <span className="text-white/70">
              system status: probably working
            </span>
          </motion.div>
          
          <div className="text-white/50 text-xs">
            <span className="text-yellow-400">⚠️</span> side effects may include: mind blown, socks knocked off, existential crisis
          </div>
          
          <div className="text-white/40 text-xs font-mono">
            hint: try the konami code 👀
          </div>
        </motion.div>
      </div>

      {/* Scattered interactive dots */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full cursor-pointer"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
          }}
          animate={{
            scale: [0.3, 1.2, 0.3],
            opacity: [0.2, 0.8, 0.2],
            x: (mousePos.x - 50) * (0.02 + i * 0.001),
            y: (mousePos.y - 50) * (0.02 + i * 0.001),
          }}
          transition={{
            scale: { duration: 2 + i * 0.1, repeat: Infinity },
            opacity: { duration: 2 + i * 0.1, repeat: Infinity },
            x: { duration: 1 },
            y: { duration: 1 },
          }}
          whileHover={{ scale: 2, opacity: 1 }}
          onClick={() => console.log(`Dot ${i} says hi! 🎉`)}
        />
      ))}

      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px) rotate(-0.5deg); }
          75% { transform: translateX(2px) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}