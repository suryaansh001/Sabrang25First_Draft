"use client";
import React from "react";
import ChromaGrid from "./ChromaGrid";
import Logo from "../../../components/Logo";
import SidebarDock from "../../../components/SidebarDock";
import Footer from "../../../components/Footer";

const TeamPage = () => {
  return (
    <div className="flex flex-col min-h-screen text-white relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/teampage.webp)'
        }}
      />

      {/* Black Overlay for better text readability */}
      <div className="fixed inset-0 -z-10 bg-black/60" />

      <Logo />
      <SidebarDock />

      {/* Main Content Container - flex-1 makes it take remaining space */}
      <div className="relative z-10 pt-24 flex-1">
        <div className="px-4 sm:px-6 py-8 sm:py-16">
          <ChromaGrid />
        </div>
      </div>

      {/* Footer at absolute bottom with higher z-index */}
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
};

export default TeamPage;
