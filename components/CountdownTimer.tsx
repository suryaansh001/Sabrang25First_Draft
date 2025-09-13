'use client';
import React, { useState, useEffect, useMemo } from 'react';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface HexagonalClockProps {
  value: number;
  max: number;
  children: React.ReactNode;
  color?: string;
  label: string;
}

interface CountdownClockProps {
  targetDate?: string;
}

const CountdownClock: React.FC<CountdownClockProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(true);

  const getNextMondayMidnight = () => {
    const now = new Date();
    const target = new Date(now);
    // Compute days until next Monday (1 = Monday)
    const day = now.getDay(); // 0 (Sun) - 6 (Sat)
    const daysUntilNextMonday = (8 - day) % 7 || 7; // ensures 7 when today is Monday
    target.setDate(now.getDate() + daysUntilNextMonday);
    target.setHours(0, 0, 0, 0); // set to 00:00 of that Monday
    return target;
  };

  const resolvedTarget = useMemo(() => (targetDate ? new Date(targetDate) : getNextMondayMidnight()), [targetDate]);
  const [effectiveTarget, setEffectiveTarget] = useState<Date>(resolvedTarget);

  useEffect(() => {
    setEffectiveTarget(resolvedTarget);
  }, [resolvedTarget]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const tick = () => {
      const now = new Date();
      const endTime = effectiveTarget;
      let difference = endTime.getTime() - now.getTime();

      if (difference <= 0) {
        // roll over to next Monday midnight automatically
        const next = getNextMondayMidnight();
        setEffectiveTarget(next);
        difference = next.getTime() - now.getTime();
        setIsActive(true);
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    // run immediately so UI updates without waiting a second
    tick();
    interval = setInterval(tick, 1000);

    return () => { if (interval) clearInterval(interval); };
  }, [effectiveTarget]);

  const isFinalMinute = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds <= 59;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      ></div>

      {/* Neon Glowing Orbs - Mobile Optimized */}
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-8 right-4 sm:top-20 sm:right-20 w-12 h-12 sm:w-24 sm:h-24 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-16 left-1/4 sm:bottom-20 w-14 h-14 sm:w-28 sm:h-28 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse delay-500"></div>
      <div className="absolute bottom-24 right-1/3 sm:bottom-32 w-10 h-10 sm:w-20 sm:h-20 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-px bg-cyan-400 opacity-30 animate-pulse" style={{ top: '20%' }}></div>
        <div className="absolute w-full h-px bg-purple-500 opacity-30 animate-pulse delay-500" style={{ top: '40%' }}></div>
        <div className="absolute w-full h-px bg-pink-500 opacity-30 animate-pulse delay-1000" style={{ top: '60%' }}></div>
        <div className="absolute w-full h-px bg-yellow-400 opacity-30 animate-pulse delay-300" style={{ top: '80%' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl w-full px-2 sm:px-0">
        {/* Header */}
        <div className="mb-8 sm:mb-16">
          <h1 className={`text-2xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-3 tracking-wide px-2 ${isFinalMinute ? 'text-red-300 animate-pulse' : 'text-white'}`}>
            Midnight Reveal Incoming
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300/90 max-w-2xl mx-auto px-4">
            Stay tuned — the countdown below ticks to tonight's 12:00 AM. Something exciting awaits at midnight.
          </p>
          <div className="flex justify-center items-center space-x-2 sm:space-x-4 mt-4">
            <div className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <h2 className="text-sm sm:text-lg md:text-xl font-light text-gray-400 tracking-[0.3em] sm:tracking-[0.5em] uppercase font-mono">
              {isActive ? 'REVEAL IN' : 'REVEALED'}
            </h2>
            <div className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </div>
        </div>

         {/* Futuristic Clock Interface - One Line Layout */}
         <div className="flex flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 sm:mb-16 overflow-x-auto px-2">
          <div className="group">
            <HexagonalClock value={timeLeft.hours} max={24} color="#00ff88" label="HOURS">
              <div className="text-center">
                 <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-mono mb-1 sm:mb-2 tracking-wider">
                  {formatTime(timeLeft.hours)}
                </div>
                <div className="text-xs text-green-400 font-bold tracking-[0.2em] sm:tracking-[0.3em] font-mono opacity-80">
                  H:R:S
                </div>
                <div className="mt-1 sm:mt-2 w-6 sm:w-8 h-px bg-green-400 mx-auto opacity-60"></div>
              </div>
            </HexagonalClock>
          </div>

          <div className="group">
            <HexagonalClock value={timeLeft.minutes} max={60} color="#00d4ff" label="MINUTES">
              <div className="text-center">
                 <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-mono mb-1 sm:mb-2 tracking-wider">
                  {formatTime(timeLeft.minutes)}
                </div>
                <div className="text-xs text-cyan-400 font-bold tracking-[0.2em] sm:tracking-[0.3em] font-mono opacity-80">
                  M:I:N
                </div>
                <div className="mt-1 sm:mt-2 w-6 sm:w-8 h-px bg-cyan-400 mx-auto opacity-60"></div>
              </div>
            </HexagonalClock>
          </div>

          <div className="group">
            <HexagonalClock value={timeLeft.seconds} max={60} color="#ff0080" label="SECONDS">
              <div className="text-center">
                 <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-mono mb-1 sm:mb-2 tracking-wider">
                  {formatTime(timeLeft.seconds)}
                </div>
                <div className="text-xs text-pink-500 font-bold tracking-[0.2em] sm:tracking-[0.3em] font-mono opacity-80">
                  S:E:C
                </div>
                <div className="mt-1 sm:mt-2 w-6 sm:w-8 h-px bg-pink-500 mx-auto opacity-60"></div>
              </div>
            </HexagonalClock>
          </div>
        </div>

        {/* Removed progress bar and additional status sections as requested */}
      </div>
    </div>
  );
}

const formatTime = (time: number) => time.toString().padStart(2, '0');

const HexagonalClock: React.FC<HexagonalClockProps> = ({ value, max, children, color = '#00ff88', label }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="relative">
      {/* Hexagonal Container */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center flex-shrink-0">
        {/* Background Hexagon */}
        <div 
          className="absolute inset-0 border-2 border-gray-700"
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            background: 'linear-gradient(45deg, #0a0a0a, #1a1a1a)'
          }}
        ></div>
        
        {/* Glowing Border */}
        <div 
          className="absolute inset-0 border-2 opacity-60"
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            borderColor: color,
            filter: `drop-shadow(0 0 15px ${color})`
          }}
        ></div>
        
        {/* Progress Fill */}
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            background: `linear-gradient(180deg, ${color}20 0%, ${color}10 ${100-percentage}%, transparent ${100-percentage}%)`,
            filter: `drop-shadow(0 0 20px ${color}40)`
          }}
        ></div>
        
         {/* Corner Brackets */}
         <div className="absolute top-1 left-4 sm:top-2 sm:left-8 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-l-2 border-t-2 border-gray-500"></div>
         <div className="absolute top-1 right-4 sm:top-2 sm:right-8 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-r-2 border-t-2 border-gray-500"></div>
         <div className="absolute bottom-1 left-4 sm:bottom-2 sm:left-8 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-l-2 border-b-2 border-gray-500"></div>
         <div className="absolute bottom-1 right-4 sm:bottom-2 sm:right-8 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 border-r-2 border-b-2 border-gray-500"></div>
        
        {/* Center Content */}
        <div className="relative z-10 text-center">
          {children}
        </div>
        
        {/* Progress Bars around hexagon */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 sm:w-1 bg-gray-800 transition-all duration-500"
               style={{
                 height: '8px',
                 background: percentage > (i * 16.67) ? color : '#1f2937',
                 filter: percentage > (i * 16.67) ? `drop-shadow(0 0 5px ${color})` : 'none',
                 transform: `rotate(${i * 60}deg)`,
                 transformOrigin: 'center 48px',
                 top: '50%',
                 left: '50%',
                 marginLeft: '-1px',
                 marginTop: '-48px'
               }}
            />
          ))}
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center mt-2 sm:mt-4">
        <div className="text-xs font-mono tracking-widest" style={{ color }}>
          [{label}]
        </div>
      </div>
    </div>
  );
};

export default CountdownClock;