'use client';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Events from "./Events/page";
import FlagshipEvent from "./FlagshipEvent/page";
import Gallery from "./Gallery/page";
import Team from "./Team/page";

import GradientText from '../../components/GradientText'
import Contact from "./Contact/page";
import { useEffect, useState } from "react";
import FAQ from "./FAQ/page";
import Sponsors from "./Sponsors/page";

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen text-white font-sans">
      
      
      <div className="flex flex-col pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-16 text-center relative">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg">
  Welcome to{" "}
  <GradientText
    colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
    animationSpeed={3}
    showBorder={false}
    className="custom-class"
  >
    Sabrang '25
  </GradientText>
</h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the grandest cultural fest. Unleash your talent, witness captivating performances, and create unforgettable memories.
            </p>
            <a href="/Events" className="inline-block py-3 px-8 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white mb-8">
              Explore Events
            </a>

            {/* Register Section within Hero */}
            <div className="p-8 rounded-2xl shadow-2xl animate-fade-in-up border border-purple-600/50 max-w-2xl mx-auto bg-gradient-to-br from-purple-950/60 to-indigo-950/60 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/30">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-rose-400 text-transparent bg-clip-text mb-4">
                Ready to be a part of Sabrang '25?
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Don't miss out on the excitement! Register now to secure your spot and participate in various competitions and workshops.
              </p>
              <a href="/Signup" className="inline-block py-3 px-8 rounded-full text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white">
                Register Now
              </a>
            </div>
          </div>
        </section>

      

        {/* Flagship Events Section */}
        <section className="min-h-screen">
          <FlagshipEvent />
        </section>

        {/* Gallery Section */}
        <section className="min-h-screen">
          <Gallery />
        </section>

       

       

        {/* Sponnsorship page */}
        <section className="min-h-scren">
          <Sponsors />
        </section>

 {/* FAQ */}
        <section className="min-h-screen">
          <FAQ />
        </section> 
        
        {/* Contact Section */}
        <section className="min-h-screen">
          <Contact />
        </section>

        
      </div>

     
    </div>
  );
}
