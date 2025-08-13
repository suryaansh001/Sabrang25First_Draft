"use client";
import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion } from 'framer-motion';
import { CardSpotlight } from '../../../components/CardSpotlight';
import { cn } from '../../../components/lib/utils';
import { gsap } from "gsap";
import "./MagicBento.css";
import SidebarDock from '../../../components/SidebarDock';


const sponsors = [
  {
    id: "gold-1",
    name: "Sponsor",
    image: "/images/building-6011756_1280.jpg",
    description: "Our premium partner supporting excellence",
    category: "gold"
  },
  {
    id: "gold-2",
    name: "Sponsor",
    image: "/images/building-6011756_1280.jpg",
    description: "lingaguli guli gli ga",
    category: "gold"
  },
  {
    id: "gold-3",
    name: "Sponsor",
    image: "/images/building-6011756_1280.jpg",
    description: "lorem ispum",
    category: "gold"
  },
  {
    id: "silver-1",
    name: "Sponsor",
    image: "/images/building-6011756_1280.jpg",
    description: "Dedicated to fostering innovation",
    category: "silver"
  },
  {
    id: "silver-2",
    name: "Sponsor",
    image: "/images/building-6011756_1280.jpg",
    description: "Dedicated to fostering innovation",
    category: "silver"
  },
  {
    id: "silver-3",
    name: "Sponsor",
    image: "/images/building-6011756_1280.jpg",
    description: "Dedicated to fostering innovation",
    category: "silver"
  },
  {
    id: "bronze-1",
    name: "Sponsor",
    image: "/images/building-6011756_1280.jpg",
    description: "Supporting cultural growth",
    category: "bronze"
  },
  // Add more sponsors as needed
];

const categories = {
  gold: "Gold Sponsors",
  silver: "Silver Sponsors",
  bronze: "Bronze Sponsors"
};

// Minimal ParticleCard implementation
const ParticleCard = ({
  children,
  className = '',
  particleCount,
  glowColor,
  enableTilt,
  clickEffect,
  enableMagnetism,
  disableAnimations,
  ...rest
}: any) => {
  // Pass custom props as data- attributes
  const dataAttrs: any = {};
  if (particleCount !== undefined) dataAttrs['data-particle-count'] = particleCount;
  if (glowColor !== undefined) dataAttrs['data-glow-color'] = glowColor;
  if (enableTilt !== undefined) dataAttrs['data-enable-tilt'] = enableTilt;
  if (clickEffect !== undefined) dataAttrs['data-click-effect'] = clickEffect;
  if (enableMagnetism !== undefined) dataAttrs['data-enable-magnetism'] = enableMagnetism;
  if (disableAnimations !== undefined) dataAttrs['data-disable-animations'] = disableAnimations;
  return (
    <div className={`particle-container ${className}`} {...dataAttrs} {...rest}>
      {children}
    </div>
  );
};

// Minimal GlobalSpotlight implementation (accepts any props)
const GlobalSpotlight = (props: any) => null;

export default function Sponsors() {
  // Track hover state for each card by sponsor id
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const gridRef = useRef(null);

    return (
    <div className="min-h-screen text-white">
      <SidebarDock />
      <main className="pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            Our Sponsors
          </h1>

          <div className="relative py-12 bento-section" style={{ background: "#060010" }}>
            <GlobalSpotlight gridRef={gridRef} glowColor="132, 0, 255" spotlightRadius={300} />
            <div ref={gridRef} className="card-grid">
              {sponsors.map((sponsor, i) => (
                <ParticleCard
                      key={sponsor.id}
                  className={`card card--border-glow`}
                  particleCount={12}
                  glowColor="132, 0, 255"
                  enableTilt={true}
                  clickEffect={true}
                  enableMagnetism={true}
                >
                  {/* Remove the card__header and label */}
                  <div className="card__content">
                    <div className="flex items-center justify-center mb-4">
                      <div className="rounded-full bg-white/90 shadow-lg flex items-center justify-center w-20 h-20 border-2 border-white/80">
                        <img src={sponsor.image} alt={sponsor.name} className="object-contain rounded-full w-16 h-16" />
                          </div>
                        </div>
                    <h2 className="card__title font-extrabold text-lg text-white text-center mb-1" style={{ color: '#ffe066', textShadow: '0 2px 8px #232946' }}>{sponsor.name}</h2>
                    <p className="card__description text-white/90 text-center mb-2">{sponsor.description}</p>
                  </div>
                </ParticleCard>
                  ))}
              </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16"
          >
            
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
