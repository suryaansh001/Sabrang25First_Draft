'use client';
import React, { useState, useEffect } from 'react';
import { Clock, Zap, Star, X } from 'lucide-react';

interface EarlyBirdFloatingProps {
  onClose?: () => void;
}

const EarlyBirdFloating: React.FC<EarlyBirdFloatingProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time until event (5 days from now)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDate = new Date();
      eventDate.setDate(now.getDate() + 5); // Add 5 days
      eventDate.setHours(23, 59, 59, 999); // Set to end of day
      
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // If time has passed, reset to 5 days
        setTimeLeft({ days: 5, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show component after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 ${
      isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="relative group">
        {/* Main Early Bird Card */}
        <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl p-4 shadow-2xl border-2 border-yellow-300/50 backdrop-blur-sm min-w-[260px] max-w-[300px] pointer-events-auto">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl animate-pulse pointer-events-none" style={{ animationDuration: '2s' }}></div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg z-50"
            type="button"
            style={{ zIndex: 50 }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="relative z-10 flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-bounce" style={{ animationDuration: '1.5s' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Early Bird Special!</h3>
              <p className="text-white/90 text-xs">Limited Time Offer</p>
            </div>
          </div>

          {/* Discount Badge */}
          <div className="relative z-10 mb-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
              <div className="text-center">
                <div className="text-2xl font-black text-white mb-1">25% OFF</div>
                <div className="text-white/90 text-xs">Registration Fee</div>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="relative z-10 mb-3">
            <div className="flex items-center gap-1 mb-2">
              <Clock className="w-3 h-3 text-white/80" />
              <span className="text-white/90 text-xs font-medium">Offer Ends In:</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-white/15 rounded-md p-1.5 text-center">
                  <div className="text-white font-bold text-sm">{item.value}</div>
                  <div className="text-white/70 text-xs">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="relative z-50" style={{ zIndex: 50 }}>
            <a
              href="/checkout"
              className="block w-full bg-white text-orange-600 font-bold py-2 px-3 rounded-lg text-center hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg text-sm relative z-50"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/checkout';
              }}
              style={{ zIndex: 50, position: 'relative' }}
            >
              Claim Offer Now
            </a>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"
                style={{
                  left: `${20 + (i * 20)}%`,
                  top: `${30 + (i * 25)}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse pointer-events-none" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>

        {/* Floating stars around the card */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping"
              style={{
                left: `${-15 + (i * 20)}%`,
                top: `${-5 + (i * 25)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        {/* Pulsing ring effect */}
        <div className="absolute inset-0 rounded-xl border-2 border-yellow-400/50 animate-ping pointer-events-none" style={{ animationDuration: '3s' }}></div>
      </div>
    </div>
  );
};

export default EarlyBirdFloating;
