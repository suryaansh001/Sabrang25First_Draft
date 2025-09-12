import React, { useState, useEffect } from 'react';

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

const CountdownClock: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 48,
    minutes: 0,
    seconds: 0
  });

  const [startTime] = useState(() => new Date());
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        const now = new Date();
        const endTime = new Date(startTime.getTime() + (48 * 60 * 60 * 1000));
        const difference = endTime.getTime() - now.getTime();
        
        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          setTimeLeft({ hours, minutes, seconds });
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          setIsActive(false);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  const totalSeconds = 48 * 60 * 60;
  const remainingSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

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
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider font-mono">
            48:<span className="text-cyan-400">00:</span><span className="text-purple-400">00</span>
          </h1>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <h2 className="text-lg md:text-xl font-light text-gray-400 tracking-[0.5em] uppercase font-mono">
              COUNTDOWN
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </div>
        </div>

        {/* Futuristic Clock Interface */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-16 mb-16">
          <div className="group">
            <HexagonalClock value={timeLeft.hours} max={48} color="#00ff88" label="HOURS">
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

        {/* Digital Progress Bar */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6">
            <div className="flex justify-between text-sm text-gray-400 mb-4 font-mono">
              <span className="text-green-400">[START]</span>
              <span className="text-white">{progress.toFixed(2)}% COMPLETE</span>
              <span className="text-red-400">[END]</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-600">
              <div 
                className="h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #00ff88, #00d4ff, #ff0080)',
                  boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse delay-600"></div>
            </div>
            {isActive ? (
              <div className="text-green-400 font-mono text-lg">
                SYSTEM ACTIVE - COUNTDOWN IN PROGRESS
              </div>
            ) : (
              <div className="text-red-400 font-mono text-lg animate-pulse">
                SEQUENCE COMPLETE - MISSION SUCCESS
              </div>
            )}
          </div>
        </div>

        {/* Terminal Info */}
        <div className="bg-black border border-gray-700 rounded p-4 font-mono text-sm text-gray-400 max-w-lg mx-auto">
          <div className="text-green-400">$ system_info</div>
          <div>Started: {startTime.toLocaleString()}</div>
          <div>Duration: 48:00:00</div>
          <div>Status: <span className={isActive ? 'text-green-400' : 'text-red-400'}>{isActive ? 'RUNNING' : 'TERMINATED'}</span></div>
        </div>

        {/* Corner HUD Elements */}
        <div className="absolute top-4 left-4 text-green-400 font-mono text-xs opacity-60">
          [SYS_01]
        </div>
        <div className="absolute top-4 right-4 text-cyan-400 font-mono text-xs opacity-60">
          [ONLINE]
        </div>
        <div className="absolute bottom-4 left-4 text-pink-500 font-mono text-xs opacity-60">
          [ACTIVE]
        </div>
        <div className="absolute bottom-4 right-4 text-purple-400 font-mono text-xs opacity-60">
          [CNTR_48]
        </div>
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