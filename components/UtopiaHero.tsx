'use client';

import Image from 'next/image';
import React from 'react';

type UtopiaHeroProps = {
  title?: string;
  subtitle?: string;
  eventImageSrc: string;
  videoSrc: string;
  posterSrc?: string;
  fallbackVideoSrc?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function UtopiaHero(props: UtopiaHeroProps) {
  const { title, subtitle, eventImageSrc, videoSrc, posterSrc, fallbackVideoSrc, ctaText, ctaHref } = props;

  return (
    <section className="relative w-full h-[80vh] md:h-screen overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        poster={posterSrc}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        {fallbackVideoSrc ? <source src={fallbackVideoSrc} /> : null}
      </video>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {title ? (
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
            {title}
          </h1>
        ) : null}
        {subtitle ? (
          <p className="mt-2 text-lg md:text-2xl text-gray-200 max-w-3xl">
            {subtitle}
          </p>
        ) : null}

        <div className="mt-8 md:mt-12">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 blur opacity-60" />
            <div className="relative rounded-2xl bg-black/30 backdrop-blur p-2">
              <Image
                src={eventImageSrc}
                alt="Event"
                width={720}
                height={720}
                className="w-[260px] h-auto md:w-[420px] object-contain rounded-xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {ctaText && ctaHref ? (
          <a
            href={ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-white border border-white/20 hover:bg-white/15 transition"
          >
            {ctaText}
          </a>
        ) : null}
      </div>
    </section>
  );
}


