'use client';
import Events from "./Events/page";
import FlagshipEvent from "./FlagshipEvent/page";
import Gallery from "./Gallery/page";
import Team from "./Team/page";

// GradientText not used in this hero
import Contact from "./Contact/page";
import { useEffect, useState, useRef } from "react";
import FAQ from "./FAQ/page";
import Sponsors from "./Sponsors/page";

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error('Video play failed:', e));
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen text-white font-sans relative">
      <div className="flex flex-col">
        {/* Hero Section with Video Background (covers navbar + hero area visually) */}
        <section className="min-h-screen flex items-center justify-center px-4 py-16 text-center relative overflow-hidden">
          {/* Video Background - confined to the hero section height */}
          <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
            <video
              ref={videoRef}
              src="/video/Herosection.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Video overlay for better text readability */}
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Animated gradient blobs */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 bg-gradient-to-br from-fuchsia-600/40 to-indigo-600/40 rounded-full blur-3xl animate-blob" />
          <div className="pointer-events-none absolute top-1/3 -right-10 h-64 w-64 bg-gradient-to-br from-cyan-400/40 to-blue-600/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="pointer-events-none absolute -bottom-10 left-1/4 h-64 w-64 bg-gradient-to-br from-amber-400/40 to-rose-500/40 rounded-full blur-3xl animate-blob animation-delay-4000" />

          <div className="max-w-6xl mx-auto relative z-10 w-full px-2">
            <div className="flex flex-col items-center">
              {/* HERO: SABRANG */}
              <h1 className="font-hero-main hero-main-style hero-main-gradient text-[68px] md:text-[132px] mb-3 select-none">
                SABRANG
              </h1>
              {/* HERO: 2025 */}
              <div className="font-hero-year hero-year-style hero-year-gradient text-[44px] md:text-[88px] -mt-4 mb-5 select-none">
                2025
              </div>
              <p className="text-base md:text-xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                Experience the grandest cultural fest. Unleash your talent, witness captivating performances, and create unforgettable memories.
              </p>
            </div>
          </div>
        </section>

        {/* Flagship Events Section */}
        <section className="min-h-screen">
          <FlagshipEvent />
        </section>

        {/* Gallery Section */}
        <section className="min-h-screen">
          <Gallery />
        </section>

        {/* FAQ */}
        <section className="min-h-screen">
          <FAQ />
        </section>

        {/* Sponnsorship page */}
        <section className="min-h-scren">
          <Sponsors />
        </section>

        {/* Contact Section */}
        <section className="min-h-screen">
          <Contact />
        </section>
      </div>
    </div>
  );
}
