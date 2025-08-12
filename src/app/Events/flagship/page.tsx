"use client";

import EventCard from "../EventCard";

type EventItem = {
  title: string;
  image: string;
  description?: string;
  date?: string;
  prize?: string;
  registration?: string;
  video?: string;
};

const flagshipEvent: EventItem = {
  title: "Panache",
  image: "/images/building-6011756_1280.jpg",
  description: "A grand fashion show showcasing creativity and style.",
  date: "March 15, 2025",
  prize: "₹50,000",
  registration: "Team of 4-6",
  video: "/video/853828-hd_1920_1080_25fps.mp4",
};

export default function FlagshipEventsPage() {
  return (
    <div className="min-h-screen text-white px-4 py-10 md:px-8 lg:px-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Flagship Event</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex justify-center">
          <EventCard event={flagshipEvent} outline="gold" variant="glass" />
        </div>
        <div className="w-full">
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <video
              src={flagshipEvent.video}
              controls
              className="w-full h-full max-h-[420px] object-cover"
              poster={flagshipEvent.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


