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
      <div className="fixed inset-0 -z-10 bg-black/40" />
      
      <Logo />
      <SidebarDock />
      
      {/* Main Content Container */}
      <div className="px-6 py-16 mt-20 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-10">Meet the Team</h1>
        <ChromaGrid />
      </div>
      
      {/* Footer outside main container */}
      <Footer />
    </div>
  );
};

export default TeamPage;
