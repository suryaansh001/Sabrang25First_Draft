'use client';

import React from 'react';
import Logo from '../../../components/Logo';
import SidebarDock from '../../../components/SidebarDock';
import Footer from '../../../components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/aboutpage.webp)'
        }}
      />
      
      {/* Black Overlay for better text readability */}
      <div className="fixed inset-0 -z-10 bg-black/60" />
      
      <Logo />
      <SidebarDock />
      
      {/* Main Content Container */}
      <div className="relative z-10 pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-0 px-6">
          <div className="max-w-7xl mx-auto text-center">
                         <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight text-white">
               CONTACT US
             </h1>
          </div>
        </section>

                 {/* Organizing Heads Section */}
         <section className="py-12 px-6">
           <div className="max-w-7xl mx-auto">
             <div className="text-center mb-8">
               <h2 className="text-5xl md:text-6xl font-bold mb-6">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                   Organizing Heads
                 </span>
               </h2>
             </div>
             
             <div className="grid lg:grid-cols-3 gap-8">
               {/* Anni */}
               <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                 <div className="relative h-80 overflow-hidden">
                   <img 
                     src="/images/OH_images_home/anni.jpeg" 
                     alt="Anni - Organizing Head"
                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 
                 <div className="p-6">
                   <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                     Anni
                   </h3>
                   <p className="text-purple-300 font-medium mb-3">Organizing Head</p>
                   <p className="text-gray-300 leading-relaxed mb-4">
                     Leading the charge with creativity and innovation. Your go-to person for all things Sabrang.
                   </p>
                   <div className="space-y-2">
                     <div className="flex items-center space-x-2 text-sm">
                       <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                       <span className="text-green-300">Available for queries</span>
                     </div>
                     <div className="flex items-center space-x-2 text-sm">
                       <span className="text-gray-400">📧</span>
                       <span className="text-gray-300">anni@jklu.ac.in</span>
                     </div>
                     <div className="flex items-center space-x-2 text-sm">
                       <span className="text-gray-400">📱</span>
                       <span className="text-gray-300">+91 98765 43210</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="text-white text-lg">👑</span>
                 </div>
               </div>

               {/* Diya */}
               <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                 <div className="relative h-80 overflow-hidden">
                   <img 
                     src="/images/OH_images_home/diya.jpeg" 
                     alt="Diya - Organizing Head"
                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 
                 <div className="p-6">
                   <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                     Diya
                   </h3>
                   <p className="text-cyan-300 font-medium mb-3">Organizing Head</p>
                   <p className="text-gray-300 leading-relaxed mb-4">
                     Mastermind of logistics and coordination. Ensuring everything runs smoothly behind the scenes.
                   </p>
                   <div className="space-y-2">
                     <div className="flex items-center space-x-2 text-sm">
                       <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                       <span className="text-green-300">Available for queries</span>
                     </div>
                     <div className="flex items-center space-x-2 text-sm">
                       <span className="text-gray-400">📧</span>
                       <span className="text-gray-300">diya@jklu.ac.in</span>
                     </div>
                     <div className="flex items-center space-x-2 text-sm">
                       <span className="text-gray-400">📱</span>
                       <span className="text-gray-300">+91 98765 43211</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="text-white text-lg">⚡</span>
                 </div>
               </div>

               {/* Chetesh */}
               <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                 <div className="relative h-80 overflow-hidden">
                   <img 
                     src="/images/OH_images_home/chetesh.jpeg" 
                     alt="Chetesh Sharma - Organizing Head"
                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 
                 <div className="p-6">
                   <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                     Chetesh Sharma
                   </h3>
                   <p className="text-green-300 font-medium mb-3">Organizing Head</p>
                   <p className="text-gray-300 leading-relaxed mb-4">
                     Strategic planner and execution expert. Making sure every detail is perfect for the ultimate experience.
                   </p>
                   <div className="space-y-2">
                     <div className="flex items-center space-x-2 text-sm">
                       <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                       <span className="text-green-300">Available for queries</span>
                     </div>
                     <div className="flex items-center space-x-2 text-sm">
                       <span className="text-gray-400">📧</span>
                       <span className="text-gray-300">chetesh@jklu.ac.in</span>
                     </div>
                     <div className="flex items-center space-x-2 text-sm">
                       <span className="text-gray-400">📱</span>
                       <span className="text-gray-300">+91 98765 43212</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="text-white text-lg">🎯</span>
                 </div>
               </div>
             </div>
           </div>
         </section>

         {/* Registration Team Section */}
         <section className="py-12 px-6 bg-black/20 backdrop-blur-sm">
           <div className="max-w-7xl mx-auto">
             <div className="text-center mb-8">
               <h2 className="text-5xl md:text-6xl font-bold mb-6">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                   Registration Team
                 </span>
               </h2>
               <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                 Our dedicated team ready to help you with registrations and event queries
               </p>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {/* Rahul Sharma */}
               <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                 <div className="p-6 text-center">
                   <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                     <span className="text-white text-2xl font-bold">RS</span>
                   </div>
                   <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                     Rahul Sharma
                   </h3>
                   <p className="text-blue-300 font-medium mb-3">Registration Lead</p>
                   <p className="text-gray-300 text-sm leading-relaxed mb-4">
                     Handles all registration processes and event coordination
                   </p>
                   <div className="space-y-2">
                     <div className="flex items-center justify-center space-x-2 text-sm">
                       <span className="text-gray-400">📧</span>
                       <span className="text-gray-300">rahul@jklu.ac.in</span>
                     </div>
                     <div className="flex items-center justify-center space-x-2 text-sm">
                       <span className="text-gray-400">📱</span>
                       <span className="text-gray-300">+91 98765 43213</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="text-white text-sm">📋</span>
                 </div>
               </div>

               {/* Priya Patel */}
               <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                 <div className="p-6 text-center">
                   <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                     <span className="text-white text-2xl font-bold">PP</span>
                   </div>
                   <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                     Priya Patel
                   </h3>
                   <p className="text-pink-300 font-medium mb-3">Event Coordinator</p>
                   <p className="text-gray-300 text-sm leading-relaxed mb-4">
                     Manages event logistics and participant communications
                   </p>
                   <div className="space-y-2">
                     <div className="flex items-center justify-center space-x-2 text-sm">
                       <span className="text-gray-400">📧</span>
                       <span className="text-gray-300">priya@jklu.ac.in</span>
                     </div>
                     <div className="flex items-center justify-center space-x-2 text-sm">
                       <span className="text-gray-400">📱</span>
                       <span className="text-gray-300">+91 98765 43214</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="text-white text-sm">🎯</span>
                 </div>
               </div>

               {/* Arjun Singh */}
               <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                 <div className="p-6 text-center">
                   <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                     <span className="text-white text-2xl font-bold">AS</span>
                   </div>
                   <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                     Arjun Singh
                   </h3>
                   <p className="text-green-300 font-medium mb-3">Support Specialist</p>
                   <p className="text-gray-300 text-sm leading-relaxed mb-4">
                     Provides technical support and registration assistance
                   </p>
                   <div className="space-y-2">
                     <div className="flex items-center justify-center space-x-2 text-sm">
                       <span className="text-gray-400">📧</span>
                       <span className="text-gray-300">arjun@jklu.ac.in</span>
                     </div>
                     <div className="flex items-center justify-center space-x-2 text-sm">
                       <span className="text-gray-400">📱</span>
                       <span className="text-gray-300">+91 98765 43215</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="text-white text-sm">🛠️</span>
                 </div>
               </div>

               {/* Meera Kapoor */}
               <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                 <div className="p-6 text-center">
                   <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center">
                     <span className="text-white text-2xl font-bold">MK</span>
                   </div>
                   <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                     Meera Kapoor
                   </h3>
                   <p className="text-orange-300 font-medium mb-3">Query Handler</p>
                   <p className="text-gray-300 text-sm leading-relaxed mb-4">
                     Addresses all participant queries and concerns
                   </p>
                   <div className="space-y-2">
                     <div className="flex items-center justify-center space-x-2 text-sm">
                       <span className="text-gray-400">📧</span>
                       <span className="text-gray-300">meera@jklu.ac.in</span>
                     </div>
                     <div className="flex items-center justify-center space-x-2 text-sm">
                       <span className="text-gray-400">📱</span>
                       <span className="text-gray-300">+91 98765 43216</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <span className="text-white text-sm">💬</span>
                 </div>
               </div>
             </div>
           </div>
         </section>

        
      </div>

      {/* Footer outside main container */}
      <Footer />

      <style jsx>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #7c3aed, #db2777);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Animation for floating elements */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Contact;
