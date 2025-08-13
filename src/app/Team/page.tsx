"use client";
import React from "react";
import ChromaGrid from "./ChromaGrid";
import { FloatingDock } from "../../../components/FloatingDock";
import {
  IconHome,
  IconUsers,
  IconPhoto,
  IconCalendarEvent,
  IconInfoCircle,
  IconMail,
  IconBrandGithub,
} from "@tabler/icons-react";

const TeamPage = () => {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Team",
      icon: (
        <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Team",
    },
    {
      title: "Events",
      icon: (
        <IconCalendarEvent className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Events",
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
    <div className="min-h-screen text-white px-4 sm:px-6 py-8 sm:py-16 relative">
      <ChromaGrid />
      
      {/* Floating Dock positioned at left center */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50">
        <FloatingDock
          mobileClassName="translate-y-0"
          items={links}
        />
      </div>
    </div>
  );
};

export default TeamPage;
