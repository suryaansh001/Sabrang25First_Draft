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

  const getNextMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // today to 24:00 => next day 00:00
    return midnight;
  };

  const resolvedTarget = useMemo(() => (targetDate ? new Date(targetDate) : getNextMidnight()), [targetDate]);
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
        // roll over to next midnight automatically
        const next = getNextMidnight();
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Neon Glowing Orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse delay-500"></div>
      <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-px bg-cyan-400 opacity-30 animate-pulse" style={{ top: '20%' }}></div>
        <div className="absolute w-full h-px bg-purple-500 opacity-30 animate-pulse delay-500" style={{ top: '40%' }}></div>
        <div className="absolute w-full h-px bg-pink-500 opacity-30 animate-pulse delay-1000" style={{ top: '60%' }}></div>
        <div className="absolute w-full h-px bg-yellow-400 opacity-30 animate-pulse delay-300" style={{ top: '80%' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl w-full">
        {/* Header */}
        <div className="mb-16">
          <h1 className={`text-4xl md:text-6xl font-bold mb-3 tracking-wide ${isFinalMinute ? 'text-red-300 animate-pulse' : 'text-white'}`}>
            Midnight Reveal Incoming
          </h1>
          <p className="text-base md:text-lg text-gray-300/90 max-w-2xl mx-auto">
            Stay tuned — the countdown below ticks to tonight’s 12:00 AM. Something exciting awaits at midnight.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <h2 className="text-lg md:text-xl font-light text-gray-400 tracking-[0.5em] uppercase font-mono">
              {isActive ? 'REVEAL IN' : 'REVEALED'}
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </div>
        </div>

        {/* Futuristic Clock Interface */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-16 mb-16">
          <div className="group">
            <HexagonalClock value={timeLeft.hours} max={24} color="#00ff88" label="HOURS">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white font-mono mb-2 tracking-wider">
                  {formatTime(timeLeft.hours)}
                </div>
                <div className="text-xs text-green-400 font-bold tracking-[0.3em] font-mono opacity-80">
                  H:R:S
                </div>
                <div className="mt-2 w-8 h-px bg-green-400 mx-auto opacity-60"></div>
              </div>
            </HexagonalClock>
          </div>

          <div className="group">
            <HexagonalClock value={timeLeft.minutes} max={60} color="#00d4ff" label="MINUTES">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white font-mono mb-2 tracking-wider">
                  {formatTime(timeLeft.minutes)}
                </div>
                <div className="text-xs text-cyan-400 font-bold tracking-[0.3em] font-mono opacity-80">
                  M:I:N
                </div>
                <div className="mt-2 w-8 h-px bg-cyan-400 mx-auto opacity-60"></div>
              </div>
            </HexagonalClock>
          </div>

          <div className="group">
            <HexagonalClock value={timeLeft.seconds} max={60} color="#ff0080" label="SECONDS">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white font-mono mb-2 tracking-wider">
                  {formatTime(timeLeft.seconds)}
                </div>
                <div className="text-xs text-pink-500 font-bold tracking-[0.3em] font-mono opacity-80">
                  S:E:C
                </div>
                <div className="mt-2 w-8 h-px bg-pink-500 mx-auto opacity-60"></div>
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
      <div className="relative w-48 h-48 flex items-center justify-center">
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
        <div className="absolute top-2 left-8 w-4 h-4 border-l-2 border-t-2 border-gray-500"></div>
        <div className="absolute top-2 right-8 w-4 h-4 border-r-2 border-t-2 border-gray-500"></div>
        <div className="absolute bottom-2 left-8 w-4 h-4 border-l-2 border-b-2 border-gray-500"></div>
        <div className="absolute bottom-2 right-8 w-4 h-4 border-r-2 border-b-2 border-gray-500"></div>
        
        {/* Center Content */}
        <div className="relative z-10 text-center">
          {children}
        </div>
        
        {/* Progress Bars around hexagon */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-gray-800 transition-all duration-500"
              style={{
                height: '20px',
                background: percentage > (i * 16.67) ? color : '#1f2937',
                filter: percentage > (i * 16.67) ? `drop-shadow(0 0 5px ${color})` : 'none',
                transform: `rotate(${i * 60}deg)`,
                transformOrigin: 'center 96px',
                top: '50%',
                left: '50%',
                marginLeft: '-2px',
                marginTop: '-96px'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center mt-4">
        <div className="text-xs font-mono tracking-widest" style={{ color }}>
          [{label}]
        </div>
      </div>
    </div>
  );
};

export default CountdownClock;