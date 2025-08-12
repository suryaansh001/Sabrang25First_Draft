'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Play, Github, Linkedin, Home, Calendar, Users, CheckCircle, Info, Clock, Image, Mail } from 'lucide-react';
import { FloatingDock } from '../../components/FloatingDock';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700" />
});


export default function LayeredLandingPage() {
  const navigationItems = [
    { title: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
    { title: 'Event', icon: <Calendar className="w-5 h-5" />, href: '/Events' },
    { title: 'Team', icon: <Users className="w-5 h-5" />, href: '/Team' },
    { title: 'Sponsors', icon: <CheckCircle className="w-5 h-5" />, href: '/Sponsors' },
    { title: 'About', icon: <Info className="w-5 h-5" />, href: '/Contact' },
    { title: 'Schedule', icon: <Clock className="w-5 h-5" />, href: '/FAQ' },
    { title: 'Event Gallery', icon: <Image className="w-5 h-5" />, href: '/Gallery' },
    { title: 'Contact', icon: <Mail className="w-5 h-5" />, href: '/Contact' },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* Top Right Black Pill Notch */}
      <div 
        className="absolute top-0 right-30 z-20"
        style={{
          width: '500px',
          height: '70px',
          background: 'black',
          borderRadius: '30px',
          transform: 'translateX(50%)',
        }}
      />
      
      {/* Auth Buttons - Positioned above everything */}
      <div className="absolute top-2 right-8 z-50 flex items-center space-x-4">
        <a href="/Login" className="px-8 py-4 bg-black/40 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-black/60 transition-all duration-300 border border-white/30">
          Log In
        </a>
        <a href="/Signup" className="px-8 py-4 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium transition-all duration-300 border border-white/40">
          Sign Up
        </a>
      </div>
      
      {/* Right Panel - Blue Section with Notch Cutout */}
      <div 
        className="absolute top-0 h-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 p-6 sm:p-8 md:p-12 lg:p-16"
        style={{
          left: '16.67%',
          right: '0',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% calc(100% - 100px), 200px calc(100% - 100px), 200px calc(100% - 60px), 0% calc(100% - 60px))'
        }}
      >
        {/* Spline background - positioned within right panel */}
        <div className="absolute inset-0 -z-10">
          <Spline scene="https://prod.spline.design/3O0nwQNm6dcILIOA/scene.splinecode" />
        </div>

        {/* Background 3D Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-500/40 rounded-full blur-3xl transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-tl from-indigo-400/40 to-blue-600/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-pink-500/40 rounded-full blur-2xl"></div>
        </div>
        
        {/* Top Navigation */}
        <nav className="relative z-40 flex items-center justify-between p-8 pt-0">
          <div className="flex items-center space-x-4 ml-12">
            {/* Navigation links moved to left panel as icons */}
          </div>
          
          
        </nav>
        
        {/* Main Content Area */}
        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-12 items-start">
            
            {/* Left Content */}
            <div className="ml-4">
              <h1 className="text-7xl font-extrabold text-white leading-tight mb-8 tracking-wide">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-300">
                  Experience
                </span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 drop-shadow-2xl">
                  Color
                </span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-2xl">
                  to Cosmos
                </span>
              </h1>
              
              <p className="text-white/90 text-xl mb-8 leading-relaxed font-medium tracking-wide">
                Create, Customize and Enhance 3D Models<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 font-semibold">
                  Effortlessly
                </span>
              </p>
            </div>
            
            {/* Right Content - Stats & Features */}
            <div className="space-y-6 mt-4">
              
              {/* Sponsor Cards */}
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <h4 className="text-white text-lg font-semibold mb-4">Sponsored by</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S1</span>
                    </div>
                    <span className="text-white/70 text-sm">TechCorp Solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S2</span>
                    </div>
                    <span className="text-white/70 text-sm">InnovateLabs</span>
                  </div>
                </div>
              </div>
              
              {/* Second Sponsor Card */}
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <h4 className="text-white text-lg font-semibold mb-4">Partners</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P1</span>
                    </div>
                    <span className="text-white/70 text-sm">Creative Studios</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P2</span>
                    </div>
                    <span className="text-white/70 text-sm">Design Hub</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        
        {/* Social Media Icons - Bottom Right of Right Panel */}
        <div className="absolute bottom-8 right-8 z-20 bg-black rounded-full mb-[-6]">
          <div className="flex space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer border border-white/20 backdrop-blur-sm">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer border border-white/20 backdrop-blur-sm">
              <Github className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer border border-white/20 backdrop-blur-sm">
              <Linkedin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Left Panel - Black Section */}
      <div className="absolute top-0 left-0 w-1/6 h-full bg-black flex flex-col">
        
        {/* Logo */}
        <div className="p-8 pt-12">
            <div className="w-30 h-26 ml-12 flex items-center justify-center top-0">
            <img src="/images/Logo@2x.png" alt="Logo" className="w-36 h-25" onError={(e) => { (e.target as HTMLImageElement).src = '/images/Logo.svg'; }} />
          </div>
        </div>
        
        {/* Navigation Icons */}
        <div className="pl-8 pr-30 pb-4 mb-2">
          <FloatingDock items={navigationItems} desktopClassName="-ml-2" />
        </div>
        
        {/* Get Started Button - Creates True Notch Effect */}
        <div className="absolute bottom-0 left-8 z-50">
          <a 
            href="/Signup"
            className="py-4 px-8 bg-black rounded-full text-white text-base font-medium hover:bg-gray-900 transition-all duration-300 border border-white/30 inline-block cursor-pointer flex items-center justify-center"
            style={{
              width: '380px', // Extends deep into blue panel
              height: '60px' // Much smaller height like reference
            }}
            onClick={() => console.log('Register Now clicked')}
          >
            Register Now
          </a>
        </div>
      </div>
      
      {/* Bottom Search Bar - Only on Blue Panel */}
      
    </div>
  );
};