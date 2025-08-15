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
      <div className={cn('w-80 rounded-xl', borderClass)}>
        <CardSpotlight
          className={cn(
            'h-[40rem] rounded-xl relative z-10 flex flex-col overflow-hidden',
            variant === 'glass'
              ? 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl'
              : 'bg-black'
          )}
        >
          {/* Full Size Event Poster Image */}
          <div className="relative h-full w-full rounded-xl overflow-hidden">
            <img
              src={event.image || "/images/building-6011756_1280.jpg"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            
            {/* Event Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {/* Event Title */}
              <h2 className="text-3xl font-bold mb-4 font-['Playfair_Display'] leading-tight drop-shadow-lg">
                {event.title}
              </h2>
              
              {/* Event Description */}
              <p className="text-base text-white/90 mb-6 font-['Playfair_Display'] leading-relaxed drop-shadow-lg">
                {event.description}
              </p>
              
              {/* Event Details */}
              <div className="space-y-3 mb-6">
                {event.date && (
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 font-semibold">📅</span>
                    <span className="text-white/90">{event.date}</span>
                  </div>
                )}
                {event.prize && (
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 font-semibold">🏆</span>
                    <span className="text-white/90">Prize: {event.prize}</span>
                  </div>
                )}
              </div>
              
              {/* Register Button */}
              <a
                href="/Signup"
                className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                {event.registration || "Register Now"}
              </a>
            </div>
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
          display: none;
        }
      `}</style>
    </div>
  );
}