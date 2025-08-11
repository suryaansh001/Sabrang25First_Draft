'use client';

import React, { useEffect, useRef } from 'react';

export default function Homepage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error('Video play failed:', e));
    }
  }, []);

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden">
      {/* Video Background - Full Screen */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: -1 }}>
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
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <ul>
            <li>Home</li>
            <li>Events</li>
            <li>Highlights</li>
            <li>Register</li>
          </ul>
        </div>
      </nav>

      {/* Logo */}
      <div className="logo">
        <img src="/Logo.png" alt="Sabrang Logo" />
      </div>

      {/* Login/Signup Buttons */}
      <div className="nav-buttons">
        <button className="btn-3d btn-login">Login</button>
        <button className="btn-3d btn-signup">Sign Up</button>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-title">
          <div className="co-title">Sabrang</div>
          <div className="subtitle">2025</div>
        </div>
        <div className="dis">Experience the grandest cultural fest. Unleash your talent, witness captivating performances, and create unforgettable memories.</div>
      </div>
    </div>
  );
}