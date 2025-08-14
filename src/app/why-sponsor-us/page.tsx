"use client";

import React from 'react';
import { FloatingDock } from '../../../components/FloatingDock';
import {
  IconHome,
  IconUsers,
  IconPhoto,
  IconCalendarEvent,
  IconInfoCircle,
  IconMail,
  IconCircle,
} from "@tabler/icons-react";

const WhySponsorUs = () => {
  const images = [
    '/images/Why Sponsor us/1.webp',
    '/images/Why Sponsor us/2.webp',
    '/images/Why Sponsor us/3.webp',
    '/images/Why Sponsor us/4.webp',
    '/images/Why Sponsor us/5.webp',
    '/images/Why Sponsor us/6.webp',
    '/images/Why Sponsor us/7.webp',
    '/images/Why Sponsor us/8.webp',
    '/images/Why Sponsor us/9.webp',
    '/images/Why Sponsor us/10.webp',
    '/images/Why Sponsor us/11.webp'
  ];

  const navigationItems = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Events",
      icon: (
        <IconCalendarEvent className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Events",
    },
    {
      title: "Team",
      icon: (
        <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Team",
    },
    {
      title: "Why Sponsor Us",
      icon: (
        <IconCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/why-sponsor-us",
    },
    {
      title: "Gallery",
      icon: (
        <IconPhoto className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Gallery",
    },
    {
      title: "FAQ",
      icon: (
        <IconInfoCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/FAQ",
    },
    {
      title: "Contact",
      icon: (
        <IconMail className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Contact",
    },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Side Floating Navigation Bar */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50">
        <FloatingDock
          mobileClassName="translate-y-0"
          items={navigationItems}
        />
      </div>

      {/* Images Container */}
      {images.map((image, index) => (
        <div key={index} className="w-full">
          <img 
            src={image} 
            alt={`Sponsorship slide ${index + 1}`}
            className="w-full h-auto object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default WhySponsorUs;

