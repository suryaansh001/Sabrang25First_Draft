"use client";

import React from "react";
import { CardSpotlight } from "../../../components/CardSpotlight";
import { cn } from "../../../components/lib/utils";

interface EventProps {
  event: {
    title: string;
    image: string;
    description?: string;
    date?: string;
    prize?: string;
    registration?: string;
  };
  outline?: 'gold' | 'silver';
}

export default function EventCard({ event, outline }: EventProps) {
  if (!event) return null;

  let borderClass = 'border-t-2';
  if (outline === 'gold') borderClass += ' border-yellow-400';
  else if (outline === 'silver') borderClass += ' border-gray-300';
  else borderClass += ' border-transparent';

  return (
    <div className={cn('relative p-2 rounded-2xl group metallic-border')}> 
      <div className={cn('w-96 rounded-xl', borderClass)}>
        <CardSpotlight className="h-[32rem] bg-black rounded-xl p-6 relative z-10 flex flex-col overflow-hidden">
          <h2 className="text-3xl font-extrabold text-white mb-2 font-['Playfair_Display']">{event.title}</h2>
          <p className="text-lg font-normal text-white mb-4 font-['Playfair_Display']">{event.description}</p>
          <img
            src={event.image}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl mb-4"
            alt={event.title}
          />
          <div className="flex justify-between items-center mt-10">
            <span className="text-base font-bold text-white font-['Playfair_Display']">{event.date} →</span>
            <a
              href="/Signup"
              className="px-6 py-2 rounded-xl bg-white text-black text-base font-bold font-['Playfair_Display'] shadow"
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