import React from 'react';

export interface EventCardEvent {
  id: number;
  title: string;
  image?: string;
  category?: string;
  isFlagship?: boolean;
}

interface EventCardProps {
  event: EventCardEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isFlagship = event.isFlagship ?? event.category === 'Flagship';

  return (
    <div className="relative w-[300px] aspect-[2/3] rounded-lg overflow-hidden border border-white/10 shadow-lg">
        {/* --- MYSTERIOUS & SUSPENSEFUL OVERLAY --- */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-slate-800 overflow-hidden p-4 flex flex-col justify-between">
            
            {/* Mysterious grid pattern */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #00ff88 1px, transparent 0)',
                backgroundSize: '20px 20px',
            }} />

            {/* Glitch effect lines */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-30" />
            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-red-400 to-transparent animate-pulse opacity-30 delay-1000" />

            {/* Top section - Mysterious badge */}
            <div className="relative z-10 flex justify-between items-start">
                <div className="px-3 py-1 bg-black/50 border border-green-400/50 rounded-sm backdrop-blur-sm">
                    <span className="text-xs font-bold text-green-400 uppercase tracking-widest" style={{ fontFamily: 'monospace' }}>
                        {isFlagship ? '⚡ CLASSIFIED' : (event.category || 'Event')}
                    </span>
                </div>
                {isFlagship && (
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-sm border border-green-400/50 flex items-center justify-center animate-pulse">
                        <span className="text-xs">🔒</span>
                    </div>
                )}
            </div>

            {/* Center - Mysterious title with glitch effect */}
            <div className="flex-grow flex items-center justify-center text-center relative z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-red-400/20 animate-pulse opacity-50" />
                    <h3 className="relative font-bold text-xl text-white px-2 uppercase tracking-widest leading-tight"
                        style={{
                            textShadow: '0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 255, 136, 0.4)',
                            fontFamily: 'monospace',
                            letterSpacing: '0.2em'
                        }}>
                        {event.title}
                    </h3>
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" />
                </div>
            </div>

            {/* Bottom section - Suspenseful elements */}
            <div className="relative z-10 text-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                </div>
                <div className="inline-block px-4 py-2 bg-black/50 border border-green-400/50 rounded-sm backdrop-blur-sm">
                    <span className="text-xs font-bold text-green-400 uppercase tracking-widest" style={{ fontFamily: 'monospace' }}>
                        Coming Soon ..
                    </span>
                </div>
            </div>

            {/* Mysterious border with glitch */}
            <div className="absolute inset-0 border border-green-400/30 rounded-lg" />
            <div className="absolute inset-0 border border-red-400/20 rounded-lg animate-pulse opacity-50" />
            
            {/* Mysterious corner elements */}
            <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-green-400" />
            <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-red-400" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-red-400" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-green-400" />
            
            {/* Floating particles */}
            <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping delay-500" />
            <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-red-400 rounded-full animate-ping delay-1000" />
        </div>
    </div>
  );
};

export default EventCard;