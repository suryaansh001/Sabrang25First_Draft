"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '../public/images/Logo.svg';
import Link from 'next/link';
import Button from './Button';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

const AuthNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="hidden md:flex items-center space-x-4 mr-14">
          <div className="w-20 h-10 bg-gray-600 rounded animate-pulse"></div>
          <div className="w-20 h-10 bg-gray-600 rounded animate-pulse"></div>
        </div>
      );
    }

    if (user) {
      return (
        <div className="hidden md:flex items-center space-x-4 mr-14">
          {user.isAdmin && (
            <Link href="/admin">
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition">
                Admin
              </button>
            </Link>
          )}
          <Link href="/dashboard">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition">
              Dashboard
            </button>
          </Link>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center space-x-4 mr-14">
        <Button text="Login" href="/Login" />
        <Button text="Register" href="/Signup" />
      </div>
    );
  };

  const renderMobileAuthButtons = () => {
    if (user) {
      return (
        <>
          {user.isAdmin && (
            <Link href="/admin" className="block mt-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-2 rounded-full">
              Admin Dashboard
            </Link>
          )}
          <Link href="/dashboard" className="block mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-2 rounded-full">
            Dashboard
          </Link>
          <button 
            onClick={handleLogout}
            className="block w-full mt-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-center py-2 rounded-full"
          >
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <a href="/Login" className="block mt-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-2 rounded-full">Login</a>
        <a href="/Signup" className="block mt-2 bg-gradient-to-r from-green-400 to-cyan-400 text-white text-center py-2 rounded-full">Register</a>
      </>
    );
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
            {renderMobileAuthButtons()}
          </div>
        )}
      </div>

      {/* Right: Login/Register or User Buttons */}
      {renderAuthButtons()}
    </nav>
  );
};

export default AuthNavbar;
