"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '../public/images/Logo.svg';
import Link from 'next/link';
import Button from './Button';
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
    <nav className="w-full fixed top-4 z-50 flex items-center justify-between pl-4 pr-4 sm:pl-25 sm:pr-0">
      {/* Left: Logo */}
      <div className="flex items-center ml-4 sm:ml-14">
        <Link href="/" className="mr-4"></Link>
        <Image src={Logo} alt="Logo" width={70} height={70} />
      </div>

      {/* Center: Main Navbar Links */}
      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center justify-between md:w-fit md:px-6 md:py-3 md:bg-white/10 md:backdrop-blur-md md:border md:border-white/20 text-white md:rounded-full md:shadow-lg">
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-white font-medium hover:text-yellow-300 transition">Home</a>
            <a href="/Events" className="text-white font-medium hover:text-yellow-300 transition">Events</a>
            <a href="/Gallery" className="text-white font-medium hover:text-yellow-300 transition">Gallery</a>
            <a href="/Team" className="text-white font-medium hover:text-yellow-300 transition">Team</a>
            <a href="/FAQ" className="text-white font-medium hover:text-yellow-300 transition">FAQ</a>
            <a href="/Contact" className="text-white font-medium hover:text-yellow-300 transition">Contact</a>
            
            {/* Authenticated User Links */}
            {isAuthenticated && (
              <>
                <a href="/dashboard" className="text-white font-medium hover:text-yellow-300 transition">Dashboard</a>
                {isAdmin && (
                  <a href="/admin_dashboard" className="text-white font-medium hover:text-yellow-300 transition">Admin</a>
                )}
              </>
            )}
          </div>

          {/* Hamburger: Mobile */}
          <div className="md:hidden ml-50">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 mx-auto w-11/12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-4 shadow-lg z-40">
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
                  <a href="/admin_dashboard" className="block text-white py-2 hover:text-yellow-300">Admin</a>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left mt-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-2 rounded-full"
                >
                  Logout ({userEmail})
                </button>
              </>
            ) : (
              <>
                <a href="/Login" className="block mt-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-2 rounded-full">Login</a>
                <a href="/Signup" className="block mt-2 bg-gradient-to-r from-green-400 to-cyan-400 text-white text-center py-2 rounded-full">Register</a>
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
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-red-600 hover:to-pink-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Button text="Login" href="/Login" />
            <Button text="Register" href="/Signup" />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;