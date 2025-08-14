"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '../public/images/Logo.svg';
import Link from 'next/link';
// Replaced old Button with custom gradient-pill buttons inline
import createApiUrl from '../src/lib/api';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for login/logout events
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('userLoggedIn', handleAuthChange);
    window.addEventListener('userLoggedOut', handleAuthChange);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleAuthChange);
      window.removeEventListener('userLoggedOut', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking authentication status...');
      const response = await fetch(createApiUrl('/api/user'), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User authenticated:', userData.email);
        setIsAuthenticated(true);
        setIsAdmin(userData.isAdmin || false);
        setUserEmail(userData.email);
      } else {
        console.log('User not authenticated, status:', response.status);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.log('Auth check error:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(createApiUrl('/logout'), {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserEmail('');
      
      // Dispatch custom event to notify other components about logout
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="w-full fixed top-0 z-50 flex items-center justify-between pl-4 pr-4 sm:pl-25 sm:pr-0">
      {/* Left: Logo */}
      <div className="flex items-center ml-4 sm:ml-14">
        <Link href="/" className="mr-4"></Link>
        <Image src={Logo} alt="Logo" width={70} height={70} />
      </div>

      {/* Center: Main Navbar Links */}
      <div className="flex items-center justify-center flex-1">
		<div className="flex items-center justify-between md:w-fit md:px-6 md:py-3 md:bg-black/40 md:backdrop-blur-xl md:border md:border-white/10 text-white md:rounded-full md:shadow-[0_10px_40px_rgba(168,85,247,0.25)]" data-no-splash="true">
          {/* Desktop Nav Links */}
			<div className="hidden md:flex items-center space-x-6">
				<a href="/" className="text-white/90 font-medium transition relative hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.35)]">Home</a>
				<a href="/Events" className="text-white/90 font-medium transition relative hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.35)]">Events</a>
				<a href="/Gallery" className="text-white/90 font-medium transition relative hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.35)]">Gallery</a>
				<a href="/Team" className="text-white/90 font-medium transition relative hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.35)]">Team</a>
				<a href="/FAQ" className="text-white/90 font-medium transition relative hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.35)]">FAQ</a>
				<a href="/Contact" className="text-white/90 font-medium transition relative hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.35)]">Contact</a>
            
            {/* Authenticated User Links */}
            {isAuthenticated && (
              <>
                <a href="/dashboard" className="text-white font-medium hover:text-yellow-300 transition">Dashboard</a>
                {isAdmin && (
                  <a href="/admin" className="text-white font-medium hover:text-yellow-300 transition">Admin</a>
                )}
              </>
            )}
          </div>

          {/* Hamburger: Mobile */}
			<div className="md:hidden ml-50">
				<button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu" className="text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
			{isOpen && (
				<div className="md:hidden absolute top-20 left-0 right-0 mx-auto w-11/12 bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-2xl px-4 py-4 shadow-[0_10px_40px_rgba(168,85,247,0.25)] z-40">
            <a href="/" className="block text-white py-2 hover:text-yellow-300">Home</a>
            <a href="/Events" className="block text-white py-2 hover:text-yellow-300">Events</a>
            <a href="/Gallery" className="block text-white py-2 hover:text-yellow-300">Gallery</a>
            <a href="/Team" className="block text-white py-2 hover:text-yellow-300">Team</a>
            <a href="/FAQ" className="block text-white py-2 hover:text-yellow-300">FAQ</a>
            <a href="/Contact" className="block text-white py-2 hover:text-yellow-300">Contact</a>
            
            {/* Authenticated Mobile Links */}
            {isAuthenticated ? (
              <>
                <a href="/dashboard" className="block text-white py-2 hover:text-yellow-300">Dashboard</a>
                {isAdmin && (
                  <a href="/admin" className="block text-white py-2 hover:text-yellow-300">Admin</a>
                )}
						<button 
							onClick={handleLogout}
							className="block w-full mt-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-center py-2 rounded-full shadow-[0_8px_30px_rgba(236,72,153,0.35)] hover:scale-[1.02] transition"
						>
							Logout ({userEmail})
						</button>
              </>
            ) : (
              <>
						<a href="/Login" className="block mt-3 w-full">
							<span className="relative inline-flex w-full justify-center items-center gap-2 rounded-full px-5 py-2 text-white font-medium bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(168,85,247,0.25)] overflow-hidden">Login</span>
						</a>
						<a href="/Signup" className="block mt-2 w-full">
							<span className="relative inline-flex w-full justify-center items-center gap-2 rounded-full px-5 py-2 text-white font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 shadow-[0_10px_40px_rgba(236,72,153,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/40 overflow-hidden">Register</span>
						</a>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right: Login/Register Buttons or User Menu */}
		<div className="hidden md:flex items-center space-x-4 mr-14">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">Welcome, {userEmail}</span>
					<button 
						onClick={handleLogout}
						className="relative group overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 px-4 py-2 rounded-full text-white shadow-[0_8px_30px_rgba(236,72,153,0.35)] transition-all duration-500 hover:scale-105"
					>
						<span className="relative z-10">Logout</span>
						<span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
					</button>
          </div>
        ) : (
          <>
					<a href="/Login" className="relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-white text-sm font-medium bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(168,85,247,0.25)] transition overflow-hidden">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 12h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
						<span className="relative z-10">Login</span>
						<span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 opacity-0 hover:opacity-100 transition-opacity duration-500"></span>
            </a>
					<a href="/Signup" className="relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-white text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 shadow-[0_10px_40px_rgba(236,72,153,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/40 transition overflow-hidden">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
						<span className="relative z-10">Register</span>
						<span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-500"></span>
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;