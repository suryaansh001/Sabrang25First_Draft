import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Define the Person type interface
interface Person {
  img: string;
  bg: string;
  name: string;
  role: string;
  committee: string;
  contact: string;
  phone: string;
}

// New Holographic Card Component for Committee Members
const HolographicCard = ({ 
  person, 
  cardId,
  animationDelay = 0,
  onMouseEnter,
  onMouseLeave
}: { 
  person: Person; 
  cardId: string;
  animationDelay?: number;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}) => {
  const [hoveredCard, setHoveredCard] = useState(false);
  const [activeCard, setActiveCard] = useState(false);

  // Handle mouse events for the expanded card functionality
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredCard(true);
    onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    setHoveredCard(false);
    onMouseLeave();
  };

  // Generate hologram colors based on person's role
  const getHologramColors = (role: string) => {
    const colors = [
      "from-cyan-400 via-purple-500 to-pink-500",
      "from-emerald-400 via-teal-500 to-blue-500",
      "from-orange-400 via-red-500 to-pink-500",
      "from-violet-400 via-purple-500 to-indigo-500",
      "from-lime-400 via-green-500 to-emerald-500",
      "from-rose-400 via-pink-500 to-fuchsia-500"
    ];
    const hash = role.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const hologram = getHologramColors(person.role);

  const handleCardClick = () => {
    setActiveCard(!activeCard);
  };

  const getCardTransform = (isHovered: boolean, isActive: boolean) => {
    if (isActive) return 'rotateX(-10deg) rotateY(10deg) scale(1.05)';
    if (isHovered) return 'rotateX(-5deg) rotateY(-5deg) scale(1.02)';
    return 'rotate(0deg)';
  };

  return (
    <div className="group relative">
      {/* Main Card Container */}
      <div
        className="relative cursor-pointer transition-all duration-700 ease-out transform-gpu"
        style={{
          transform: getCardTransform(hoveredCard, activeCard),
          transformStyle: 'preserve-3d'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* Holographic Border */}
        <div className={`
          absolute -inset-0.5 rounded-3xl opacity-75 transition-all duration-500
          bg-gradient-to-r ${hologram} blur-sm
          ${hoveredCard ? 'animate-pulse' : ''}
        `} />

        {/* Glass Morphism Card */}
         <div className="relative h-96 w-64 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 overflow-hidden shadow-2xl">
          {/* Liquid Animation Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`
              absolute inset-0 bg-gradient-to-br ${hologram} opacity-20
              transition-all duration-1000 ease-out
              ${hoveredCard ? 'scale-150 rotate-12' : 'scale-100'}
            `} />
            
            {/* Morphing Shapes */}
            <div className={`
              absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full
              transition-all duration-700 ease-out
              ${hoveredCard ? 'scale-150 translate-x-4 -translate-y-2' : 'scale-100'}
            `} />
            <div className={`
              absolute bottom-4 left-4 w-12 h-12 bg-white/5 rounded-full
              transition-all duration-500 ease-out
              ${hoveredCard ? 'scale-200 translate-x-8 translate-y-4' : 'scale-100'}
            `} />
          </div>

          {/* Card Content */}
          <div className="relative z-10 p-6 h-full flex flex-col">
            {/* Avatar Section */}
            <div className="relative mx-auto mb-4">
              <div className={`
                 relative w-36 h-36 rounded-lg overflow-hidden
                transition-all duration-500 ease-out transform-gpu
                ${hoveredCard ? 'scale-110 rotate-3' : 'scale-100'}
              `}>
                <img 
                  src={person.img} 
                  alt={person.name}
                  className="w-full h-full object-cover transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
              </div>
              
              {/* Floating Ring */}
              <div className={`
                 absolute -inset-3 border-2 border-white/30 rounded-lg
                transition-all duration-700 ease-out
                ${hoveredCard ? 'scale-125 rotate-12 opacity-100' : 'scale-100 opacity-0'}
              `} />
            </div>

            {/* Member Info */}
            <div className="text-center text-white flex-grow flex flex-col justify-center">
              <h3 className={`
                text-lg font-bold mb-2 transition-all duration-300
                ${hoveredCard ? 'text-white scale-105' : 'text-white/90'}
              `}>
                {person.name}
              </h3>
              <p className="text-xs font-semibold opacity-80 mb-3 uppercase tracking-widest text-purple-200">
                {person.role}
              </p>
              <p className="text-xs opacity-70 leading-relaxed line-clamp-2">
                Leading the charge in making our annual fest unforgettable with creative vision and seamless execution.
              </p>
            </div>

            {/* Magnetic Hover Indicator */}
            <div className={`
              absolute bottom-4 right-4 w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm
              border border-white/30 flex items-center justify-center text-white text-xs
              transition-all duration-300 transform-gpu
              ${hoveredCard ? 'scale-125 bg-white/30' : 'scale-100'}
            `}>
              {activeCard ? '×' : '↗'}
            </div>
          </div>

          {/* Shimmer Effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
            -skew-x-12 transition-all duration-700 ease-out
            ${hoveredCard ? 'translate-x-full' : '-translate-x-full'}
          `} />
        </div>

        {/* Floating Contact Panel */}
        <div className={`
          absolute -bottom-4 left-1/2 -translate-x-1/2 w-72 max-w-sm
           bg-black/40 backdrop-blur-2xl rounded-lg border border-white/20
          transition-all duration-500 ease-out transform-gpu origin-top
          ${activeCard 
            ? 'opacity-100 scale-100 translate-y-8 z-50' 
            : 'opacity-0 scale-90 translate-y-0 pointer-events-none z-0'
          }
        `}>
          <div className="p-4 text-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Contact Information
              </h4>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCard(false);
                }}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <span className="text-xs">×</span>
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              {[
                { icon: '✉', label: 'Email', value: person.contact },
                { icon: '📱', label: 'Phone', value: person.phone },
                { icon: '🏛', label: 'Committee', value: person.committee }
              ].map((contact, idx) => (
                <div key={idx} className="flex items-center space-x-3 group/item cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover/item:bg-white/20 transition-all duration-200">
                    <span className="text-xs">{contact.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/60 uppercase tracking-wide font-medium">{contact.label}</p>
                    <p className="text-white/90 font-medium text-xs">{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Expanded Card Component with clean hover logic
const ExpandedCard = ({ 
  hoveredPerson, 
  isVisible, 
  cardPosition, 
  onClose,
  onMouseEnter,
  onMouseLeave,
  clearCloseTimeout
}: { 
  hoveredPerson: Person | null; 
  isVisible: boolean; 
  cardPosition: { x: number; y: number; width: number; height: number }; 
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  clearCloseTimeout: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Handle expansion animation
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => setIsExpanded(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false);
    }
  }, [isVisible]);

  // Don't render if not visible
  if (!isVisible || !hoveredPerson) {
    return null;
  }

  return (
    <>
      {/* Backdrop with smooth fade */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500 ease-out"
        style={{ 
          opacity: isExpanded ? 1 : 0,
          backdropFilter: isExpanded ? 'blur(12px)' : 'blur(0px)'
        }}
      />
      
      {/* Main Card Container */}
      <div 
        ref={cardRef}
         className="fixed bg-white rounded-lg shadow-2xl overflow-hidden z-50 transition-all duration-500 ease-out"
        style={{
          left: isExpanded ? '50%' : `${cardPosition.x}px`,
          top: isExpanded ? '50%' : `${cardPosition.y}px`,
          width: isExpanded ? '105vw' : `${cardPosition.width}px`,
          maxWidth: isExpanded ? '1100px' : 'none',
          height: isExpanded ? '70vh' : `${cardPosition.height}px`,
          transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
          transformOrigin: `${cardPosition.x + cardPosition.width/2}px ${cardPosition.y + cardPosition.height/2}px`,
          boxShadow: isExpanded 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.3)' 
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          opacity: isExpanded ? 1 : 0.95,
          scale: isExpanded ? 1 : 0.98,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
          }}
          onMouseEnter={clearCloseTimeout}
          className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-200 hover:scale-110"
          aria-label="Close expanded card"
          title="Close expanded card"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
                 {/* Card Body */}
         <div className="flex flex-col lg:flex-row h-full">
           {/* Expanded Image Section */}
           <div className="lg:w-3/5 relative">
            <div className={`w-full h-full ${hoveredPerson.bg}`}>
              <img
                src={hoveredPerson.img}
                alt={hoveredPerson.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
                         {/* Image Overlay Info with staggered animation */}
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-white">
               <h2 
                 className="text-2xl lg:text-3xl font-bold mb-2 transition-all duration-700 ease-out break-words"
                 style={{ 
                   transform: isExpanded ? 'translateY(0)' : 'translateY(20px)', 
                   opacity: isExpanded ? 1 : 0 
                 }}
               >
                 {hoveredPerson.name}
               </h2>
               <p 
                 className="text-lg lg:text-xl text-blue-300 mb-1 transition-all duration-700 ease-out delay-100 break-words"
                 style={{ 
                   transform: isExpanded ? 'translateY(0)' : 'translateY(20px)', 
                   opacity: isExpanded ? 1 : 0 
                 }}
               >
                 {hoveredPerson.role}
               </p>
               <p 
                 className="text-base text-gray-300 transition-all duration-700 ease-out delay-200 break-words"
                 style={{ 
                   transform: isExpanded ? 'translateY(0)' : 'translateY(20px)', 
                   opacity: isExpanded ? 1 : 0 
                 }}
               >
                 {hoveredPerson.committee}
               </p>
             </div>
          </div>
          
                     {/* Information Section with slide-in animation */}
           <div className="lg:w-2/5 p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="space-y-6">
              {/* Contact Information */}
              <div 
                className="transition-all duration-700 ease-out delay-200"
                style={{ 
                  transform: isExpanded ? 'translateX(0)' : 'translateX(30px)', 
                  opacity: isExpanded ? 1 : 0 
                }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-3">
                                     <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                       <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                       </svg>
                     </div>
                     <div className="min-w-0 flex-1">
                       <p className="text-sm text-gray-600">Email</p>
                       <p className="text-blue-600 font-medium break-all">{hoveredPerson.contact}</p>
                     </div>
                   </div>
                  
                                     <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                       <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                       </svg>
                     </div>
                     <div className="min-w-0 flex-1">
                       <p className="text-sm text-gray-600">Phone</p>
                       <p className="text-green-600 font-medium break-all">{hoveredPerson.phone}</p>
                     </div>
                   </div>
                </div>
              </div>
              
              {/* Role Details */}
              <div 
                className="transition-all duration-700 ease-out delay-300"
                style={{ 
                  transform: isExpanded ? 'translateX(0)' : 'translateX(30px)', 
                  opacity: isExpanded ? 1 : 0 
                }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Role Details</h3>
                <div className="space-y-3">
                                     <div className="p-3 bg-gray-50 rounded-lg">
                     <p className="text-sm text-gray-600">Position</p>
                     <p className="text-gray-800 font-medium break-words">{hoveredPerson.role}</p>
                   </div>
                   <div className="p-3 bg-gray-50 rounded-lg">
                     <p className="text-sm text-gray-600">Committee</p>
                     <p className="text-gray-800 font-medium break-words">{hoveredPerson.committee}</p>
                   </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div 
                className="pt-4 transition-all duration-700 ease-out delay-400"
                style={{ 
                  transform: isExpanded ? 'translateX(0)' : 'translateX(30px)', 
                  opacity: isExpanded ? 1 : 0 
                }}
              >
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function PeopleStrip() {
  // 🚀 SUPER SMOOTH HOVER SYSTEM - Single state for hover management
  // This creates a buttery smooth experience with no flickering
  const [hoveredPerson, setHoveredPerson] = useState<Person | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Single timeout reference for ultra-smooth transitions
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent hydration mismatch by only rendering animations on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Super smooth hover handler - no delays, immediate response
  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>, person: Person) => {
    // Clear any existing close timeout immediately
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setCardPosition({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });
    
    // Immediate response - no delays
    setHoveredPerson(person);
  };

  // Super smooth hover out with minimal delay
  const handleCardHoverOut = () => {
    // Ultra-small delay to prevent flickering when moving between card and expanded window
    // This creates a buffer zone for smooth transitions
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredPerson(null);
    }, 80); // Optimized to 80ms for buttery smooth response
  };

  // Handle expanded card hover - keep it open
  const handleExpandedCardHover = () => {
    // Clear timeout when hovering over expanded card
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Handle expanded card hover out - close it with minimal delay
  const handleExpandedCardHoverOut = () => {
    // Minimal delay to prevent accidental closing when moving mouse slightly
    // This creates a small buffer zone for ultra-smooth experience
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredPerson(null);
    }, 30); // Ultra-minimal delay for buttery smooth experience
  };

  // Function to close the expanded card manually
  const handleCloseExpandedCard = () => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    setHoveredPerson(null);
  };



  // People array with detailed information for each person
  const people: Person[] = [
    // Organizing Committee
    { 
      img: "/images/Team/OH/Chetesh Sharma.png", 
      bg: "bg-gradient-to-br from-orange-500 via-rose-500 to-yellow-400",
      name: "Chetesh Sharma",
      role: "Organizing Committee",
      committee: "Organizing Committee",
      contact: "chetesh.sharma@email.com",
      phone: "+91 98765 43210"
    },
    { 
      img: "/images/Team/OH/Diya Garg.png", 
      bg: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-400",
      name: "Diya Garg",
      role: "Organizing Committee",
      committee: "Organizing Committee",
      contact: "diya.garg@email.com",
      phone: "+91 98765 43211"
    },
    { 
      img: "/images/Team/OH/Anirudh Saini.png", 
      bg: "bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500",
      name: "Anirudh Saini",
      role: "Organizing Committee",
      committee: "Organizing Committee",
      contact: "anirudh.saini@email.com",
      phone: "+91 98765 43212"
    },
    // Core Committee Members
    { 
      img: "/images/Team/Discipline/Rahul_Verma.png", 
      bg: "bg-red-500",
      name: "Rahul Verma",
      role: "Discipline",
      committee: "Discipline",
      contact: "rahul.verma@email.com",
      phone: "+91 98765 43214"
    },
    { 
      img: "/images/Team/Discipline/Kriti_Gupta.png", 
      bg: "bg-orange-500",
      name: "Kriti Gupta",
      role: "Discipline",
      committee: "Discipline",
      contact: "kriti.gupta@email.com",
      phone: "+91 98765 43215"
    },
    { 
      img: "/images/OH_images_home/sneha.jpeg", 
      bg: "bg-blue-500",
      name: "Jinal Lodha",
      role: "Decor",
      committee: "Decor",
      contact: "jinal.lodha@email.com",
       phone: "+91 98765 43216"
    },
    { 
      img: "/images/OH_images_home/arjun.jpeg", 
      bg: "bg-green-500",
      name: "Jigeesha Agarawal",
      role: "Decor",
      committee: "Decor",
      contact: "jigeesha.agarawal@email.com",
       phone: "+91 98765 43217"
    },
    { 
      img: "/images/OH_images_home/meera.jpeg", 
      bg: "bg-pink-500",
      name: "Chahat Khandelwal",
      role: "Media",
      committee: "Media",
      contact: "chahat.khandelwal@email.com",
       phone: "+91 98765 43218"
    },
    { 
      img: "/images/OH_images_home/aditya.jpeg", 
      bg: "bg-indigo-500",
      name: "Prabal Agarwal",
      role: "Report",
      committee: "Report",
      contact: "prabal.agarwal@email.com",
       phone: "+91 98765 43219"
    },
    { 
      img: "/images/OH_images_home/kavya.jpeg", 
      bg: "bg-teal-500",
      name: "Shourya Prajapat",
      role: "Photography",
      committee: "Photography",
      contact: "shourya.prajapat@email.com",
       phone: "+91 98765 43220"
    },
    { 
      img: "/images/OH_images_home/rohan.jpeg", 
      bg: "bg-yellow-500",
      name: "Ekansh Saraswat",
      role: "Photography",
      committee: "Photography",
      contact: "ekansh.saraswat@email.com",
       phone: "+91 98765 43221"
    },
    { 
      img: "/images/OH_images_home/ishita.jpeg", 
      bg: "bg-cyan-500",
      name: "Kopal Jain",
      role: "Cultural",
      committee: "Cultural",
      contact: "kopal.jain@email.com",
       phone: "+91 98765 43222"
    },
    { 
      img: "/images/OH_images_home/dev.jpeg", 
      bg: "bg-lime-500",
      name: "Satvick Vaid",
      role: "Cultural",
      committee: "Cultural",
      contact: "satvick.vaid@email.com",
       phone: "+91 98765 43223"
    },
    { 
      img: "/images/OH_images_home/tanvi.jpeg", 
      bg: "bg-amber-500",
      name: "Suryaansh Sharma",
       role: "Technical",
       committee: "Technical",
      contact: "suryaansh.sharma@email.com",
       phone: "+91 98765 43224"
    },
    { 
      img: "/images/OH_images_home/aryan.jpeg", 
      bg: "bg-emerald-500",
      name: "Lakshay Khandelwal",
      role: "Internal Arrangements",
      committee: "Internal Arrangements",
      contact: "lakshay.khandelwal@email.com",
      phone: "+91 98765 43226"
    },
    { 
      img: "/images/OH_images_home/nisha.jpeg", 
      bg: "bg-violet-500",
      name: "Dimple Ramrakhani",
      role: "Internal Arrangements",
      committee: "Internal Arrangements",
      contact: "dimple.ramrakhani@email.com",
      phone: "+91 98765 43227"
    },
    { 
      img: "/images/OH_images_home/vedant.jpeg", 
      bg: "bg-rose-500",
      name: "Anmol Sahu",
      role: "Transport",
      committee: "Transport",
      contact: "anmol.sahu@email.com",
      phone: "+91 98765 43228"
    },
    { 
      img: "/images/OH_images_home/riya.jpeg", 
      bg: "bg-sky-500",
      name: "Vandan P. Shah",
      role: "Social Media",
      committee: "Social Media",
      contact: "vandan.shah@email.com",
      phone: "+91 98765 43229"
    },
    { 
      img: "/images/OH_images_home/shaurya.jpeg", 
      bg: "bg-slate-500",
      name: "Tanveer Kanderiya",
      role: "Prize & Certificates",
      committee: "Prize & Certificates",
      contact: "tanveer.kanderiya@email.com",
      phone: "+91 98765 43230"
    },
    { 
      img: "/images/OH_images_home/aisha.jpeg", 
      bg: "bg-zinc-500",
      name: "Aayushi Meel",
      role: "Hospitality",
      committee: "Hospitality",
      contact: "aayushi.meel@email.com",
      phone: "+91 98765 43231"
    },
    { 
      img: "/images/OH_images_home/dhruv.jpeg", 
      bg: "bg-neutral-500",
      name: "Suryansh Khandelwal",
      role: "Stage & Venue",
      committee: "Stage & Venue",
      contact: "suryansh.khandelwal@email.com",
      phone: "+91 98765 43232"
    },
    { 
      img: "/images/OH_images_home/kiara.jpeg", 
      bg: "bg-stone-500",
      name: "Vinay Kumar Lunawat",
      role: "Stage & Venue",
      committee: "Stage & Venue",
      contact: "vinay.lunawat@email.com",
      phone: "+91 98765 43233"
    },
    { 
      img: "/images/OH_images_home/yash.jpeg", 
      bg: "bg-gray-500",
      name: "Ayushi Kabra",
      role: "Registrations",
      committee: "Registrations",
      contact: "ayushi.kabra@email.com",
      phone: "+91 98765 43234"
    },
    { 
      img: "/images/OH_images_home/pooja.jpeg", 
      bg: "bg-red-600",
      name: "Jayash Gehlot",
      role: "Registrations",
      committee: "Registrations",
      contact: "jayash.gehlot@email.com",
      phone: "+91 98765 43235"
    },
    { 
      img: "/images/OH_images_home/aarush.jpeg", 
      bg: "bg-blue-600",
      name: "Lead By OH",
      role: "Sponsorship & Promotion",
      committee: "Sponsorship & Promotion",
      contact: "lead.oh@email.com",
      phone: "+91 98765 43236"
    }
  ];

        // Committee data with ultra-creative layouts - reorganized as requested
   const committeeData = [
     {
       name: "Photography",
       people: [people[9], people[10]],
       layout: "time-vortex",
       color: "from-yellow-500 via-orange-500 to-red-500"
     },
     {
       name: "Cultural",
       people: [people[11], people[12]],
       layout: "cosmic-dance",
       color: "from-pink-500 via-rose-500 to-red-500"
     },
     {
       name: "Technical",
       people: [people[13]],
       layout: "matrix-code",
       color: "from-amber-500 via-orange-500 to-red-500"
     },
     {
       name: "Media & Report",
       people: [people[7], people[8]],
       layout: "holographic",
       color: "from-indigo-500 via-purple-500 to-pink-500"
     },
     {
       name: "Discipline",
       people: [people[3], people[4]],
       layout: "dna-helix",
       color: "from-red-500 via-orange-500 to-yellow-500"
     },
     {
       name: "Decor",
       people: [people[5], people[6]],
       layout: "fractal-tree",
       color: "from-blue-500 via-cyan-500 to-teal-500"
     },
     {
       name: "Internal Arrangements",
       people: [people[14], people[15]],
       layout: "galaxy-cluster",
       color: "from-emerald-500 via-green-500 to-lime-500"
     },
     {
       name: "Transport",
       people: [people[16]],
       layout: "wormhole",
       color: "from-neutral-500 via-gray-500 to-stone-500"
     },
     {
       name: "Social Media",
       people: [people[17]],
       layout: "digital-rain",
       color: "from-sky-500 via-blue-500 to-indigo-500"
     },
     {
       name: "Prize & Certificates",
       people: [people[18]],
       layout: "crystal-lattice",
       color: "from-slate-500 via-gray-500 to-zinc-500"
     },
     {
       name: "Hospitality",
       people: [people[19]],
       layout: "energy-field",
       color: "from-zinc-500 via-gray-500 to-slate-500"
     },
     {
       name: "Stage & Venue",
       people: [people[20], people[21]],
       layout: "magnetic-field",
       color: "from-neutral-500 via-stone-500 to-gray-500"
     },
     {
       name: "Registrations",
       people: [people[22], people[23]],
       layout: "particle-system",
       color: "from-red-600 via-pink-600 to-rose-600"
     },
     {
       name: "Sponsorship & Promotion",
       people: [people[24]],
       layout: "cosmic-field",
       color: "from-blue-600 via-indigo-600 to-purple-600"
     }
   ];

  // Organizing Heads section - uses first 3 people
  const totalCards = 3;
  const cards = Array.from({ length: totalCards }, (_, i) => people[i % people.length]);

  // Person Card Component with Hover to Expand
  const PersonCard = ({ 
    person, 
    className = "", 
    transformClass = "", 
    cardId,
    animationDelay = 0,
    size = "normal",
    style = {},
    isCommitteeCard = false,
    isOH = false
  }: { 
    person: Person; 
    className?: string; 
    transformClass?: string; 
    cardId: string;
    animationDelay?: number;
    size?: "normal" | "small" | "large";
    style?: React.CSSProperties;
    isCommitteeCard?: boolean;
    isOH?: boolean;
  }) => {
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      handleCardHover(e, person);
    };

    const handleMouseLeave = () => {
      handleCardHoverOut();
    };

    const sizeClasses = {
      small: "w-[160px] sm:w-[180px] md:w-[200px]",
      normal: "w-[200px] sm:w-[220px] md:w-[240px]",
      large: "w-[220px] sm:w-[240px] md:w-[260px]"
    };

    // Use static styles on server, dynamic on client
    const cardStyle = isClient ? {
      willChange: 'transform',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
      animationDelay: `${animationDelay}ms`,
      ...style
    } : {
      willChange: 'transform',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
      animationDelay: `${animationDelay}ms`
    };

    // If it's a committee card, use holographic style
    if (isCommitteeCard) {
      return (
        <HolographicCard
          key={cardId}
          person={person}
          cardId={cardId}
          animationDelay={animationDelay}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );
    }

         // Enhanced OH card style for organizing heads
     if (isOH) {
    return (
      <div
        ref={(el) => {
          cardRefs.current[cardId] = el;
        }}
        className={`relative ${sizeClasses[size]} ${className} ${transformClass} cursor-pointer transition-all duration-700 ease-out group hover:scale-110 hover:z-20`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={cardStyle}
      >
           {/* Enhanced Glow Effect for OH */}
           <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
           
           <div className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500`}>
             {/* Enhanced Background with multiple layers */}
             <div className="absolute inset-0">
               {/* Primary gradient background */}
               <div className={`absolute inset-0 ${person.bg} rounded-lg opacity-90`} />
               
               {/* Animated overlay pattern */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-lg" />
               
               {/* Floating geometric shapes */}
               <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
               <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/15 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
               <div className="absolute top-1/2 left-4 w-4 h-4 bg-white/25 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
             </div>

             {/* Enhanced splash background */}
              <img
                src="/images/BG-TEAM.png"
                alt="splash"
               className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay pointer-events-none group-hover:opacity-80 transition-all duration-500"
             />

             {/* Main Image with enhanced styling */}
             <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
               <img
                 src={person.img}
                 alt={person.name}
                 className="w-full h-full object-cover rounded-lg transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-1 relative z-20"
                 onError={(e) => {
                   console.error('Image failed to load:', person.img);
                   e.currentTarget.style.display = 'none';
                 }}
               />
               
               {/* Image border glow */}
               <div className="absolute inset-0 rounded-lg ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-500" />
             </div>
             
             {/* Enhanced text overlay with better contrast */}
             <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-30">
               {/* Background for text readability */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-b-lg" />
               
               {/* Text content */}
               <div className="relative z-10 text-center">
                 <h3 className="text-lg lg:text-xl font-bold mb-1 text-shadow-lg group-hover:text-white transition-all duration-300 truncate">
                   {person.name}
                 </h3>
                 <p className="text-sm opacity-90 font-medium text-shadow-md group-hover:text-white/90 transition-all duration-300 truncate">
                   {person.role}
                 </p>
                 
                 {/* Enhanced role indicator */}
                 <div className="mt-2 inline-flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md border border-white/30">
                   <span className="text-xs font-semibold text-white">⭐ Organizing Head</span>
                 </div>
               </div>
             </div>
           </div>
           
           {/* Enhanced hover overlay indicator */}
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-lg" />
         </div>
       );
     }

         // Original card style for committee members
     return (
       <div
         ref={(el) => {
           cardRefs.current[cardId] = el;
         }}
         className={`relative ${sizeClasses[size]} ${className} ${transformClass} cursor-pointer transition-all duration-700 ease-out group hover:scale-110 hover:z-20`}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
         style={cardStyle}
       >
         <div className={`relative w-full h-full rounded-lg overflow-hidden shadow-lg`}>
          {/* Solid background color for Core Committee Members */}
           <div className={`absolute inset-0 ${person.bg} rounded-lg`} />

          {/* Main Image */}
          <img
            src={person.img}
            alt={person.name}
             className={`w-full h-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105 relative z-10`}
            onError={(e) => {
              console.error('Image failed to load:', person.img);
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* Optional frame glow */}
           <div className="absolute inset-0 ring-1 ring-white/10 rounded-lg" />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
          
          {/* Text overlay */}
           <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
             <h3 className="text-sm font-bold mb-1 truncate">{person.name}</h3>
             <p className="text-xs opacity-90 truncate">{person.role}</p>
          </div>
        </div>
        
        {/* Hover overlay indicator */}
         <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-lg" />
      </div>
    );
  };

  // Render different layouts based on committee layout type
  const renderCommitteeLayout = (committee: any) => {
    // Don't render animated layouts on server
    if (!isClient) {
      return (
        <div key={committee.name} className="flex flex-col items-center mb-24 relative min-h-[400px] w-full">
                   {/* Enhanced background effects */}
         <div className={`absolute inset-0 bg-gradient-to-r ${committee.color} opacity-20 rounded-lg blur-3xl`}></div>
         <div className={`absolute inset-0 bg-gradient-to-br ${committee.color} opacity-10 rounded-lg blur-2xl scale-150`}></div>
          
          {/* Enhanced committee header */}
          <div className="relative z-10 text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center px-6 py-3 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 mb-4">
              <span className="text-sm text-white/80 uppercase tracking-wider">Committee</span>
            </div>
            <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r ${committee.color} bg-clip-text text-transparent uppercase tracking-widest px-4`}>
            {committee.name}
          </h3>
            <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
              Dedicated team members working together to deliver excellence
            </p>
          </div>
          
          {/* Enhanced cards layout */}
          <div className="relative flex justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full px-2 sm:px-4">
            {/* Connecting lines between cards */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[300px] h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40" />
            
             {committee.people.map((person: Person, idx: number) => (
               <PersonCard
                 key={idx}
                 person={person}
                 cardId={`${committee.name}-${idx}`}
                className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px] xl:w-[160px] 2xl:w-[200px] flex-shrink-0 relative z-10"
                 animationDelay={idx * 400}
                 size="normal"
                 isCommitteeCard={true}
               />
             ))}
           </div>
        </div>
      );
    }

    // Client-side animated layouts - Enhanced with better visual elements
    return (
      <div key={committee.name} className="flex flex-col items-center mb-24 relative min-h-[400px] w-full group">
                 {/* Enhanced background effects with animations */}
         <div className={`absolute inset-0 bg-gradient-to-r ${committee.color} opacity-20 rounded-lg blur-3xl transition-all duration-1000 group-hover:opacity-30`}></div>
         <div className={`absolute inset-0 bg-gradient-to-br ${committee.color} opacity-10 rounded-lg blur-2xl scale-150 transition-all duration-1000 group-hover:scale-175`}></div>
        
                 {/* Enhanced committee header with animations */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           viewport={{ once: true }}
           className="relative z-10 text-center mb-8 sm:mb-12"
         >
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.6, delay: 0.4 }}
             viewport={{ once: true }}
             className="inline-flex items-center px-6 py-3 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 mb-4 hover:bg-black/60 transition-all duration-300 cursor-pointer group"
             whileHover={{ scale: 1.05 }}
           >
             <span className="text-sm text-white/80 uppercase tracking-wider group-hover:text-white transition-colors duration-300">Committee</span>
             <motion.span
               className="ml-2 text-xs opacity-60 group-hover:opacity-100"
               animate={{ rotate: [0, 180, 360] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             >
               ⚡
             </motion.span>
           </motion.div>
           <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r ${committee.color} bg-clip-text text-transparent uppercase tracking-widest px-4`}>
          {committee.name}
        </h3>
           <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             viewport={{ once: true }}
             className="text-sm text-gray-400 mt-2 max-w-md mx-auto"
           >
             Dedicated team members working together to deliver excellence
           </motion.p>
           
           {/* Special committee indicator */}
           <motion.div
             className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6, delay: 0.8 }}
             viewport={{ once: true }}
           >
             <motion.div
               className="w-2 h-2 bg-green-400 rounded-full"
               animate={{ scale: [1, 1.5, 1] }}
               transition={{ duration: 1.5, repeat: Infinity }}
             />
             <span className="text-xs text-green-400 font-medium">Active Team</span>
           </motion.div>
         </motion.div>
        
        {/* Enhanced cards layout with connecting elements */}
        <div className="relative flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4">
          {/* Animated connecting lines */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40 origin-center"
          />
          
           {committee.people.map((person: Person, idx: number) => (
            <motion.div
               key={idx}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="relative z-10"
            >
              <PersonCard
               person={person}
               cardId={`${committee.name}-${idx}`}
               className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px] xl:w-[160px] 2xl:w-[200px] flex-shrink-0"
               animationDelay={idx * 200}
               size="normal"
               isCommitteeCard={true}
             />
            </motion.div>
           ))}
         </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center px-2 sm:px-4 py-4 sm:py-8 w-full">

      
                    {/* Enhanced Main "SABRANG'25" heading with cosmic styling */}
       <motion.div 
         initial={{ opacity: 0, y: 30 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1, delay: 0.2 }}
         className="text-center mb-12 sm:mb-16 lg:mb-20"
       >
         {/* Floating particles background */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-2 h-2 bg-white/20 rounded-full"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
               }}
               animate={{
                 y: [0, -20, 0],
                 opacity: [0.2, 0.8, 0.2],
                 scale: [1, 1.5, 1],
               }}
               transition={{
                 duration: 3 + Math.random() * 2,
                 repeat: Infinity,
                 delay: Math.random() * 2,
               }}
             />
           ))}
         </div>

         <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase relative z-10" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
           <motion.span
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.5 }}
           >
             SABRANG
           </motion.span>
           <motion.span
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.7 }}
             className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
           >
             '25
           </motion.span>
      </h1>
      
         {/* Enhanced decorative elements with animations */}
         <motion.div 
           initial={{ scaleX: 0 }}
           animate={{ scaleX: 1 }}
           transition={{ duration: 1.2, delay: 1 }}
           className="flex justify-center items-center gap-4 mb-6"
         >
           <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
           <motion.div 
             className="w-4 h-4 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"
             animate={{ 
               scale: [1, 1.2, 1],
               rotate: [0, 180, 360]
             }}
             transition={{ 
               duration: 3,
               repeat: Infinity,
               ease: "easeInOut"
             }}
           />
           <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
         </motion.div>
         
         <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 1.2 }}
           className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white relative z-10"
         >
           Organizing Committee
         </motion.h2>
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 1.4 }}
           className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 relative z-10"
         >
           Meet the visionary leaders who orchestrate the magic of{' '}
           <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
             SABRANG'25
           </span>
         </motion.p>
       </motion.div>
      
             {/* Organizing Heads cards - enhanced layout and styling */}
       <div className="relative mt-8 mb-16 sm:mb-20 lg:mb-24">
                 {/* Background decorative elements */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30" />
        </div>
        
         {/* Enhanced connecting elements for mobile */}
         <div className="lg:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[320px] flex justify-between items-center z-10">
           <div className="w-4 h-4 bg-purple-400 rounded-lg animate-pulse shadow-lg" />
           <div className="w-6 h-6 bg-pink-400 rounded-lg animate-pulse shadow-lg" style={{ animationDelay: '0.5s' }} />
           <div className="w-4 h-4 bg-blue-400 rounded-lg animate-pulse shadow-lg" style={{ animationDelay: '1s' }} />
         </div>
        
                 {/* Cards container with enhanced spacing */}
         <div className="flex flex-wrap justify-center lg:justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-8 sm:mt-12 lg:mt-20 w-full max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
        {cards.map((person, index) => {
          console.log(`Rendering organizing head ${index}:`, person.name, 'Image path:', person.img);
          return (
               <motion.div
              key={index}
                 initial={{ opacity: 0, y: 50, scale: 0.8 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 transition={{ 
                   duration: 0.8, 
                   delay: 1.6 + index * 0.2,
                   type: "spring",
                   stiffness: 100
                 }}
                 whileHover={{ 
                   y: -10,
                   transition: { duration: 0.3 }
                 }}
                 className="relative"
               >
                 {/* Special glow effect for each card */}
                 <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                 
                 <PersonCard
              person={person}
              cardId={`organizing-head-${index}`}
                   className={`w-[120px] sm:w-[180px] md:w-[240px] lg:w-[280px] xl:w-[320px] h-[200px] sm:h-[300px] md:h-[400px] lg:h-[480px] xl:h-[540px] overflow-hidden rounded-lg shadow-2xl flex-shrink-0 relative`}
              transformClass={
                index === 1 
                       ? 'lg:relative lg:top-[-80px] xl:top-[-100px] z-30 lg:scale-110 xl:scale-125' 
                  : index === 0 
                         ? 'lg:relative lg:top-[60px] xl:top-[80px] lg:left-[-30px] xl:left-[-40px] z-20 lg:scale-95 xl:scale-100' 
                         : 'lg:relative lg:top-[60px] xl:top-[80px] lg:right-[-30px] xl:right-[-40px] z-20 lg:scale-95 xl:scale-100'
              }
              isOH
            />
                 
                 {/* Floating achievement badges */}
                 <motion.div
                   className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                   animate={{ 
                     rotate: [0, 10, -10, 0],
                     scale: [1, 1.1, 1]
                   }}
                   transition={{ 
                     duration: 2,
                     repeat: Infinity,
                     delay: index * 0.5
                   }}
                 >
                   ⭐
                 </motion.div>
               </motion.div>
          );
        })}
         </div>
      </div>

             {/* Special Interactive Section */}
       <motion.div 
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 1, delay: 0.2 }}
         viewport={{ once: true }}
         className="text-center mb-16 sm:mb-20 relative"
       >
         {/* Animated background elements */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <motion.div
             className="w-64 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30"
             initial={{ scaleX: 0 }}
             whileInView={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5 }}
             viewport={{ once: true }}
           />
         </div>
         
                    {/* Interactive stats counter */}
           <div className="flex justify-center items-center gap-8 sm:gap-12 mb-8">
             {[
               { number: 25, label: "Committee Members", icon: "👥" },
               { number: 14, label: "Departments", icon: "🏢" },
               { number: 100, label: "Success Rate", icon: "🎯", suffix: "%" }
             ].map((stat, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, scale: 0.5 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
               viewport={{ once: true }}
               className="text-center group cursor-pointer"
               whileHover={{ scale: 1.1 }}
             >
               <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                 {stat.icon}
               </div>
               <motion.div
                 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1"
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 transition={{ duration: 1, delay: 1.2 + index * 0.2 }}
                 viewport={{ once: true }}
               >
                 {stat.number}{stat.suffix || ''}
               </motion.div>
               <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
             </motion.div>
           ))}
         </div>
       </motion.div>

       {/* Enhanced "Core Committee Members" heading */}
       <motion.div 
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 1, delay: 0.2 }}
         viewport={{ once: true }}
         className="text-center mb-8 sm:mb-12"
       >
         <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
           Core Committee Members
      </h2>
         <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mt-4">
           Dedicated teams working behind the scenes to create an unforgettable experience
         </p>
       </motion.div>


      {/* Committee Layouts - Row-based */}
      <div className="w-full max-w-7xl px-2 sm:px-4 space-y-16 relative z-10 perspective-1000 mx-auto">
        <div className="flex flex-col space-y-24">
          {committeeData.map((committee) => renderCommitteeLayout(committee))}
        </div>
      </div>

      {/* Expanded Card that appears on hover */}
      <ExpandedCard 
        hoveredPerson={hoveredPerson} 
        isVisible={!!hoveredPerson} // Use !!hoveredPerson to control visibility
        cardPosition={cardPosition} 
        onClose={handleCloseExpandedCard}
        onMouseEnter={handleExpandedCardHover}
        onMouseLeave={handleExpandedCardHoverOut}
        clearCloseTimeout={() => {
          if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
          }
        }}
      />

             {/* Special Floating Action Button */}
       <motion.div
         className="fixed bottom-8 right-8 z-50"
         initial={{ opacity: 0, scale: 0, rotate: -180 }}
         animate={{ opacity: 1, scale: 1, rotate: 0 }}
         transition={{ duration: 0.8, delay: 2, type: "spring" }}
       >
         <motion.button
           className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl border-2 border-white/20 flex items-center justify-center text-white text-2xl backdrop-blur-sm"
           whileHover={{ scale: 1.1, rotate: 180 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
         >
           <motion.span
             animate={{ y: [0, -2, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
           >
             ↑
           </motion.span>
         </motion.button>
       </motion.div>

       {/* Enhanced CSS for animations and styling */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); }
        }
        
        /* Enhanced text shadows for better readability */
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .text-shadow-md {
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
        }
        
                          /* Optimized transitions for expanded card */
         .expanded-card {
           will-change: transform, left, top, width, height, opacity, scale;
           backface-visibility: hidden;
           transform: translateZ(0);
           -webkit-transform: translateZ(0);
         }
         
         /* Smooth backdrop animation */
         .backdrop-blur-sm {
           transition: backdrop-filter 0.5s ease-out;
         }
         
         /* Smooth content transitions */
         .transition-all {
           transition-property: all;
           transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
         }
         
         /* Optimize image transitions */
         img {
           image-rendering: -webkit-optimize-contrast;
           image-rendering: crisp-edges;
         }
         
         /* Staggered animation delays for content */
         .stagger-1 { animation-delay: 0.1s; }
         .stagger-2 { animation-delay: 0.2s; }
         .stagger-3 { animation-delay: 0.3s; }
         .stagger-4 { animation-delay: 0.4s; }
        
        /* Line clamp utility for text truncation */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* 3D Transform utilities for holographic cards */
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-gpu {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        
        /* Enhanced hover effects for OH cards */
        .oh-card-hover {
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .oh-card-hover:hover {
          transform: translateY(-10px) scale(1.05);
          filter: brightness(1.1) contrast(1.1);
        }
        
        /* Floating animation for decorative elements */
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Glow animation for special elements */
        .glow-animation {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        /* Enhanced gradient backgrounds */
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        /* Glass morphism effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Enhanced shadows */
        .enhanced-shadow {
          box-shadow: 
            0 10px 25px -5px rgba(0, 0, 0, 0.3),
            0 4px 6px -2px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        
        /* Responsive improvements */
        @media (max-width: 640px) {
          .mobile-optimized {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
        }
        
        @media (min-width: 1024px) {
          .desktop-enhanced {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}
