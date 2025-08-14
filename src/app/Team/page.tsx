"use client";
import React from "react";
import ChromaGrid from "./ChromaGrid";
import SidebarDock from "../../../components/SidebarDock";
import Logo from "../../../components/Logo";
import Footer from "../../../components/Footer";

const TeamPage = () => {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
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
      
      {/* Main Content Container */}
      <div className="relative z-10 pt-24 pb-16">
        <div className="px-4 sm:px-6 py-8 sm:py-16">
          <ChromaGrid />
        </div>
      </div>
      
      {/* Footer outside main container */}
      <Footer />
    </div>
  );
};

export default TeamPage;
