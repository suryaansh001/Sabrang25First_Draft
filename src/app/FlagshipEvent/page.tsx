'use client';
import React, { useRef, useEffect, useState } from 'react';
import PixelCard from './PixelCard';
import Image from 'next/image';
import { PixelationContext } from './PixelCard';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Panache',
    date: 'March 15, 2025',
    description: 'A grand fashion show showcasing creativity and style. Experience the fusion of traditional and contemporary fashion.',
    image: '/images/building-6011756_1280.jpg',
  },
  {
    id: 2,
    title: 'Hackathon',
    date: 'March 16, 2025',
    description: '24-hour coding competition to solve real-world problems. Showcase your technical skills and win exciting prizes.',
    image: '/images/building-6011756_1280.jpg',
  },
  {
    id: 3,
    title: 'Business Plan',
    date: 'March 17, 2025',
    description: 'Present your innovative business ideas to industry experts. Get mentorship and funding opportunities.',
    image: '/images/building-6011756_1280.jpg',
  },
  {
    id: 4,
    title: 'Band Jam',
    date: 'March 18, 2025',
    description: 'Battle of the bands - rock, metal, and fusion. Let your music speak and win amazing prizes.',
    image: '/images/building-6011756_1280.jpg',
  },
  {
    id: 5,
    title: 'Robo Wars',
    date: 'March 19, 2025',
    description: 'Battle of the robots in an epic arena. Design, build, and compete with your robotic warriors.',
    image: '/images/building-6011756_1280.jpg',
  }
];

const FlagshipEvent: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const velocity = useRef(0);
  const isScrolling = useRef(false);

  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scaledDelta = e.deltaY * 0.3; // reduce sensitivity for trackpads
      velocity.current += scaledDelta;
      if (!isScrolling.current) animate();
    };

    const animate = () => {
      isScrolling.current = true;
      const step = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollLeft += velocity.current;
        velocity.current *= 0.85;

        if (Math.abs(velocity.current) > 0.5) {
          requestAnimationFrame(step);
        } else {
          isScrolling.current = false;
        }
      };
      requestAnimationFrame(step);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section className="min-h-screen py-20">
      <div className="w-[80%] mx-auto px-4 py-8 bg-white/5 backdrop-blur-md border border-white/5 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-center cosmic-text mb-12">Flagship Events</h2>
        <div
          ref={scrollRef}
          className="relative h-[600px] flex overflow-x-auto scrollbar-hide space-x-8 p-4"
          style={{ scrollBehavior: 'auto' }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="flex-none w-80 min-w-[320px] h-[500px] carnival-card rounded-lg shadow-lg flex flex-col relative overflow-hidden"
              onMouseEnter={() => setHoveredCardId(event.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <PixelCard>
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-filter duration-300"
                  style={{ filter: hoveredCardId === event.id ? 'brightness(100%)' : 'brightness(30%)' }}
                />
                <PixelationContext.Consumer>
                  {isPixelated => (
                    isPixelated && (
              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end text-white z-10">
                <div className="bg-black/50 p-2 rounded-lg">
                  <h3 className="text-xl font-semibold cosmic-text">{event.title}</h3>
                  <p className="text-gray-300">{event.date}</p>
                  <p className="text-gray-200 mt-2">{event.description}</p>
                </div>
                <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                  Learn More
                </button>
              </div>
                    )
                  )}
                </PixelationContext.Consumer>
              </PixelCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlagshipEvent;
