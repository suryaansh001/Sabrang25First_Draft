'use client'

import Navbar from "../../components/Navbar";
  

import { useEffect, useState } from "react";

export default function Homepage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoids hydration mismatch by not rendering on the server initially
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white font-sans relative overflow-hidden">
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16 text-center">
        {/* Hero Section */}
        <section className="mb-16 animate-fade-in-down">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Welcome to <span className="text-purple-400">Sabrang '25</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the grandest cultural fest. Unleash your talent, witness captivating performances, and create unforgettable memories.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
            Explore Events
          </button>
        </section>

        {/* Call to Action / Register Section */}
        <section className="bg-gray-800 bg-opacity-70 p-8 rounded-xl shadow-xl max-w-2xl mx-auto animate-fade-in-up border border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-300 mb-4">
            Ready to be a part of Sabrang '25?
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Don't miss out on the excitement! Register now to secure your spot and participate in various competitions and workshops.
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
            Register Now
          </button>
        </section>
      </main>

      {/* Optional: Background animation elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
        <div className="absolute w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 top-1/4 left-1/4"></div>
        <div className="absolute w-48 h-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 bottom-1/3 right-1/4"></div>
        <div className="absolute w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
     
    </div>
  );
}