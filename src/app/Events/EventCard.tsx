"use client";

import { cn } from '../../../components/lib/utils';
import { CardSpotlight } from '../../../components/CardSpotlight';

interface EventProps {
  event: {
    title: string;
    image: string;
    description?: string;
    date?: string;
    prize?: string;
    registration?: string;
    video?: string;
  };
  outline?: 'gold' | 'silver';
  variant?: 'default' | 'glass';
}

export default function EventCard({ event, outline, variant = 'default' }: EventProps) {
  if (!event) return null;

  let borderClass = 'border-t-2';
  if (outline === 'gold') borderClass += ' border-yellow-400';
  else if (outline === 'silver') borderClass += ' border-gray-300';
  else borderClass += ' border-transparent';

  return (
    <div className={cn('relative p-2 rounded-2xl group metallic-border')} data-no-splash="true"> 
      <div className={cn('w-96 rounded-xl', borderClass)}>
        <CardSpotlight
          className={cn(
            'h-[28rem] rounded-xl p-6 relative z-10 flex flex-col overflow-hidden',
            variant === 'glass'
              ? 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl'
              : 'bg-black'
          )}
        >
          {/* Event Image */}
          <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4">
            <img
              src={event.image || "/images/building-6011756_1280.jpg"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Event Title */}
          <h2 className="text-2xl font-bold text-white mb-3 font-['Playfair_Display'] leading-tight">
            {event.title}
          </h2>
          
          {/* Event Description */}
          <p className="text-sm text-white/90 mb-6 font-['Playfair_Display'] leading-relaxed flex-1">
            {event.description}
          </p>
          
          {/* Bottom Section */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-white/70 font-medium">
              {event.date}
            </div>
            <a
              href="/Signup"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              {event.registration || "Register Now"}
            </a>
          </div>
        </CardSpotlight>
      </div>
      <style jsx>{`
        .group:hover.card-border-gradient,
        .group:focus.card-border-gradient {
          background: transparent !important;
        }
        .metallic-border {
          position: relative;
        }
        .metallic-border::before {
          display: none;
        }
      `}</style>
    </div>
  );
}