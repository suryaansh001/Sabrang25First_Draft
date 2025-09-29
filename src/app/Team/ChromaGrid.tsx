import React, { useState, useRef, useMemo } from "react";
import { Linkedin, Instagram, Twitter } from 'lucide-react';
import CommitteePopup from '../../../components/CommitteePopup';
import { getCommitteeByName, CommitteeData } from '../../lib/teamData';

// Define the Person type interface
interface Person {
  img: string;
  bg: string;
  name: string;
  committee: string;
  socials?: { linkedin?: string; instagram?: string; twitter?: string; };
}

// New Holographic Card Component for Committee Members
const HolographicCard = ({ 
  person, 
  cardId,
  animationDelay = 0,
  description,
  onViewCommittee
}: { 
  person: Person; 
  cardId: string;
  animationDelay?: number;
  description?: string;
  onViewCommittee?: (committeeName: string) => void;
}) => {
  const [hoveredCard, setHoveredCard] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMediumLaptop, setIsMediumLaptop] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Check screen size for responsive design
  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      setIsMediumLaptop(width >= 1024 && width < 1280);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Add error handling for undefined person
  if (!person) {
    return (
      <div className="group relative">
        <div className="relative h-96 w-64 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-center h-full text-white">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle mouse events for flip card functionality (desktop only)
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      setHoveredCard(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHoveredCard(false);
    }
  };

  // Handle click events for mobile flip functionality
  const handleClick = () => {
    if (isMobile) {
      setIsClicked(!isClicked);
    }
  };

  // Handle touch events for better mobile interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      e.preventDefault();
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  return (
    <div className="group relative">
      {/* Main Card Container */}
      <div
        className="relative cursor-pointer transition-all duration-700 ease-out transform-gpu active:scale-95"
        style={{
          transformStyle: 'preserve-3d'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
      >
        {/* Thick Holographic Border with Name */}
        <div className={`
          absolute -inset-1 rounded-lg opacity-75 transition-all duration-500 
          bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-blue-500/40 blur-sm
          ${(hoveredCard || (isMobile && isClicked)) ? 'opacity-100' : ''}
        `} />
        
        {/* Name on Border - Top */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-blue-500/90 px-3 py-1 rounded-full border-2 border-white/30 backdrop-blur-sm">
            <h3 className={`text-xs sm:text-sm font-bold text-white whitespace-nowrap transition-all duration-300 ${(hoveredCard || (isMobile && isClicked)) ? 'scale-105' : ''}`}>
              {person.name || 'Unknown'}
            </h3>
          </div>
        </div>


        {/* Flip Card Container */}
        <div className="relative h-80 w-full sm:h-96 sm:w-72 perspective-1000">
          <div
            className="relative w-full h-full transition-transform duration-700 ease-out transform-style-preserve-3d"
            style={{ 
              transform: (hoveredCard || (isMobile && isClicked)) ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* FRONT - Image Only */}
            <div className={`absolute inset-0 w-full h-full rounded-lg backdrop-blur-xl bg-white/10 border-4 border-white/30 overflow-hidden shadow-2xl backface-hidden transition-opacity duration-300 ${(hoveredCard || (isMobile && isClicked)) ? 'opacity-0' : 'opacity-100'}`}>
              {/* Main Image */}
              <img
                src={person.img || ''}
                alt={person.name || 'Team Member'}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Subtle overlay for better image quality */}
              <div className="absolute inset-0 bg-black/5" />
              
              {/* Hidden name overlay - keeping in code but not displaying */}
              <div className="hidden absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="text-center">
                  <h3 className={`text-sm sm:text-base font-bold text-white transition-all duration-300 ${hoveredCard ? 'scale-105' : ''}`}>
                    {person.name || 'Unknown'}
                  </h3>
                </div>
              </div>
              
              {/* Hidden description text - keeping in code but not displaying */}
              <div className="hidden text-center text-white flex-grow flex-col justify-center">
                {/* Responsive description for mobile (full) and desktop (clamped) */}
                <p className="text-[11px] opacity-80 leading-snug sm:hidden">
                  Leading the charge in making our annual fest unforgettable with creative vision and seamless execution.
                </p>
                <p className="hidden sm:block text-xs opacity-80 leading-relaxed line-clamp-2">
                  Leading the charge in making our annual fest unforgettable with creative vision and seamless execution.
                </p>
              </div>
            </div>

            {/* BACK - Mobile Optimized Social Media Links */}
            <div className={`absolute inset-0 w-full h-full rounded-lg border-4 border-white/40 overflow-hidden shadow-2xl text-white p-2 sm:p-4 md:p-6 backface-hidden rotate-y-180 transition-opacity duration-300 ${(hoveredCard || (isMobile && isClicked)) ? 'opacity-100' : 'opacity-0'}`} style={{ transform: 'rotateY(180deg)' }}>
              {/* Enhanced background with person's image as backdrop */}
              <div className="absolute inset-0">
                <img
                  src={person.img || ''}
                  alt={person.name || 'Team Member'}
                  className="w-full h-full object-cover opacity-30 blur-sm"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
              
               <div className="relative z-10 flex flex-col h-full items-center justify-center gap-2 sm:gap-4 text-center p-2 sm:p-4">
                 <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/20 w-full">
                   {/* Mobile optimized name */}
                   <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-4 break-words leading-tight">{person.name || 'Unknown'}</h3>
                   
                   <div className="w-16 sm:w-20 md:w-28 h-0.5 bg-white/25 my-2 sm:my-4 mx-auto" />

                  <div className="space-y-2 sm:space-y-4">
                    {/* Mobile optimized connect text */}
                    <p className="text-xs sm:text-sm text-white/80 uppercase tracking-widest font-medium">Connect With Me</p>
                    
                     {/* Mobile optimized social icons - Clean design */}
                     <div className="flex items-center justify-center gap-6 sm:gap-8">
                       <a 
                         href={person.socials?.linkedin || "#"} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="text-white/80 hover:text-[#0077B5] transition-all duration-300 hover:scale-125 active:scale-110"
                       >
                         <Linkedin size={isMobile ? 28 : 32} />
                       </a>
                       <a 
                         href={person.socials?.instagram || "#"} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="text-white/80 hover:text-[#E1306C] transition-all duration-300 hover:scale-125 active:scale-110"
                       >
                         <Instagram size={isMobile ? 28 : 32} />
                       </a>
                       {person.socials?.twitter && (
                         <a 
                           href={person.socials.twitter} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="text-white/80 hover:text-[#1DA1F2] transition-all duration-300 hover:scale-125 active:scale-110"
                         >
                           <Twitter size={isMobile ? 28 : 32} />
                         </a>
                       )}
                     </div>
                    
                    {/* Mobile optimized View Complete Committee Button */}
                    <div className="mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-white/20">
                      <button 
                        className="bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-blue-500/80 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg border border-white/30 hover:border-white/50 w-full sm:w-auto"
                        onClick={() => {
                          if (onViewCommittee) {
                            onViewCommittee(person.committee);
                          }
                        }}
                      >
                        <span className="block sm:hidden">View Committee</span>
                        <span className="hidden sm:block">View Complete Committee</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function PeopleStrip() {
  // State for popup
  const [selectedCommittee, setSelectedCommittee] = useState<CommitteeData | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCommittee, setActiveCommittee] = useState<string | null>(null);

  // Function to handle committee popup
  const handleViewCommittee = (committeeName: string) => {
    const committeeData = getCommitteeByName(committeeName);
    if (committeeData) {
      setSelectedCommittee(committeeData);
      setIsPopupOpen(true);
    }
  };

  // Function to close popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCommittee(null);
  };

  // Mobile detection
  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mobile committee navigation
  const handleCommitteeClick = (committeeName: string) => {
    if (isMobile) {
      setActiveCommittee(activeCommittee === committeeName ? null : committeeName);
      // Scroll to committee
      const element = document.getElementById(`committee-${committeeName}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

   // People array with detailed information for each person
   const people: Person[] = [
     // Student Affairs
     { 
       img: "/images/Team/final/Deepak_Sogani.webp", 
       bg: "bg-gradient-to-br from-orange-500 via-rose-500 to-yellow-400",
       name: "Mr. Deepak Sogani",
       committee: "Student Affairs"
     },
     // Core Committee Members
     { 
       img: "/images/Team/final/Rahul_Verma.webp", 
       bg: "bg-red-500",
       name: "Rahul Verma",
       committee: "Discipline",
       socials: {
         linkedin: "https://www.linkedin.com/",
         instagram: "https://www.instagram.com/"
       }
     },
     { 
       img: "/images/Team/final/kriti.webp", 
       bg: "bg-orange-500",
       name: "Kriti Gupta",
       committee: "Discipline"
     },
     { 
       img: "/images/Team/final/Jinal.webp", 
       bg: "bg-blue-500",
       name: "Jinal Lodha",
       committee: "Decor",
       socials: {
         instagram: "https://www.instagram.com/jinal_lodha7?igsh=MXVmajA1d25obWd1bg=="
       }
     },
     { 
       img: "/images/Team/final/Jigeesha Agarwal.webp", 
       bg: "bg-green-500",
       name: "Jigeesha Agarawal",
       committee: "Decor",
       socials: {
         instagram: "https://www.instagram.com/jigeeeshaaa?igsh=emNubTcyM28yNHVi"
       }
     },
     { 
       img: "/images/Team/final/Prabal agarwal2.webp", 
       bg: "bg-indigo-500",
       name: "Prabal Agarwal",
       committee: "Media & Report",
       socials: { 
         instagram: "https://www.instagram.com/agrawal.prabal?igsh=cmoyMXU4NGQyZ3h0",
         linkedin: "https://www.linkedin.com/in/prabal-agrawal23?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
       }
     },
     { 
       img: "/images/Team/final/Shorya Prajapat.jpg", 
       bg: "bg-teal-500",
       name: "Shorya Prajapat",
       committee: "Photography"
     },
     { 
       img: "/images/Team/final/Ekansh Saraswat.webp", 
       bg: "bg-yellow-500",
       name: "Ekansh Saraswat",
       committee: "Photography"
     },
     { 
       img: "/images/Team/final/Satvick.webp", 
       bg: "bg-lime-500",
       name: "Satvick Vaid",
       committee: "Cultural",
       socials: {
         instagram: "https://www.instagram.com/satvick_vaid?utm_source=qr&igsh=NHI2ZjE0c3VsNGY4"
       }
     },
     { 
       img: "/images/Team/final/Suryaansh Sharma.webp", 
       bg: "bg-amber-500",
       name: "Suryaansh Sharma",
       committee: "Technical",
       socials: {
         linkedin: "https://www.linkedin.com/in/suryaansh-sharma-05a811284/"
       }
     },
     { 
       img: "/images/Team/final/Lakshay.webp", 
       bg: "bg-emerald-500",
       name: "Lakshay Khandelwal",
       committee: "Internal Arrangements"
     },
     { 
       img: "/images/Team/final/Anmol Sahu.webp", 
       bg: "bg-rose-500",
       name: "Anmol Sahu",
       committee: "Transport"
     },
     { 
       img: "/images/Team/final/vandanshah.webp", 
       bg: "bg-sky-500",
       name: "Vandan P. Shah",
       committee: "Social Media"
     },
     { 
       img: "/images/Team/final/Tanveer.webp", 
       bg: "bg-slate-500",
       name: "Tanveer Kanderiya",
       committee: "Prize & Certificates",
       socials: {
         instagram: "https://instagram.com/tanveer_kumawatt"
       }
     },
     { 
       img: "/images/Team/final/Aayushi Meel.webp", 
       bg: "bg-zinc-500",
       name: "Aayushi Meel",
       committee: "Hospitality",
       socials: {
         linkedin: "https://www.linkedin.com/in/aayushi-meel-01505a2b7/"
       }
     },
     { 
       img: "/images/Team/final/suryanshkhandelwal.webp", 
       bg: "bg-neutral-500",
       name: "Suryansh Khandelwal",
       committee: "Stage & Venue",
       socials: {
         linkedin: "https://www.linkedin.com/in/suryansh-khandelwal-bb495b322",
         instagram: "https://www.instagram.com/_.hrshhh?igsh=MTRnNHRwMjNqc3RmdQ=="
       }
     },
     { 
       img: "/images/Team/final/Ayushi Kabra.webp", 
       bg: "bg-gray-500",
       name: "Ayushi Kabra",
       committee: "Registrations"
     },
     { 
       img: "/images/Team/final/Jayash Gehlot.webp", 
       bg: "bg-red-600",
       name: "Jayash Gahlot",
       committee: "Registrations"
     },
     {
       img: "/images/Team/final/Chahat Khandelwal.webp",
       bg: "bg-fuchsia-600",
       name: "Chahat Khandelwal",
       committee: "anchors",
       socials: {
         instagram: "https://www.instagram.com/okchahat_?igsh=YTR1am1ldXoxOThk&utm_source=qr"
       }
     },
     {
       img: "/images/Team/final/Anushka_Pathak.webp",
       bg: "bg-purple-600",
       name: "Anushka Pathak",
       committee: "Student Affairs"
     },
    //  {
    //    img: "/images/Team/final/Dheevi Fozdar.webp",
    //    bg: "bg-zinc-600",
    //    name: "Dheevi Fozdar",
    //    committee: "Hospitality"
    //  },
     {
       img: "/images/Team/final/Naman Shukla.webp",
       bg: "bg-stone-600",
       name: "Naman Shukla",
       committee: "Sponsorship & Promotion"
     }
   ];

  // Student Affairs people (rendered using OH card style)
  const studentAffairsPeople: Person[] = people.filter((p) => p.committee === 'Student Affairs');

   // Single OH card (Diya Garg)
   const ohPeople: Person[] = [
     {
       img: "/images/Team/final/Diya Garg.webp",
       bg: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-400",
       name: "Diya Garg",
       committee: "Organizing Committee"
     }
   ];

  // Committee names for grouping - simple array
  const committeeNames = [
    "Registrations",
    "Cultural", 
    "Technical",
    "Stage & Venue",
    "Media & Report",
    "Hospitality",
    "Internal Arrangements",
    "Decor",
    "Sponsorship & Promotion",
    "Photography",
    "Social Media",
    "anchors",
    "Prize & Certificates",
    "Transport",
    "Discipline"
  ];

  // Organizing Heads section - uses ohPeople
  const cards = ohPeople;

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
    isOH = false,
    isStudentAffairs = false,
    description
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
    isStudentAffairs?: boolean;
    description?: string;
  }) => {
    // Removed hover handlers for expanded card

    const sizeClasses = {
      small: "w-[160px] sm:w-[180px] md:w-[200px]",
      normal: "w-[200px] sm:w-[220px] md:w-[240px]",
      large: "w-[220px] sm:w-[240px] md:w-[260px]"
    };

    // Use consistent styles
    const cardStyle = {
      willChange: 'transform',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
      animationDelay: `${animationDelay}ms`,
      ...style
    };

    // If it's a committee card, use holographic style
    if (isCommitteeCard) {
      return (
        <div className="team-member-card">
          <HolographicCard
            key={cardId}
            person={person}
            cardId={cardId}
            animationDelay={animationDelay}
            description={description}
            onViewCommittee={handleViewCommittee}
          />
        </div>
      );
    }

         // Enhanced OH card style for organizing heads
     if (isOH) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className} ${transformClass} cursor-pointer transition-all duration-700 ease-out group hover:scale-110 hover:z-20 team-member-card`} style={cardStyle}>
           {/* Enhanced Glow Effect for OH */}
           <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
           
           <div className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500`}>
             {/* Main Image with enhanced styling - no background gradients */}
             <div className="relative z-10 w-full h-full flex items-center justify-center">
               <img
                 src={person.img}
                 alt={person.name}
                 className="w-full h-full object-cover rounded-lg transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-1 relative z-20"
                 loading="lazy"
                 onError={(e) => {
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
                   <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 text-shadow-lg group-hover:text-white transition-all duration-300 break-words leading-tight">
                     {person.name}
                   </h3>
                   
                   {/* Enhanced role indicator */}
                   {person.name === 'Diya Garg' && <div className="mt-2 inline-flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md border border-white/30">
                     <span className="text-xs font-semibold text-white">⭐ Organizing Head</span>
                   </div>}
                 </div>
             </div>
           </div>
           
           {/* Enhanced hover overlay indicator */}
           <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-lg" />
         </div>
       );
    }

    // Student Affairs card style with gradient backgrounds
    if (isStudentAffairs) {
      return (
        <div className={`relative ${sizeClasses[size]} ${className} ${transformClass} cursor-pointer transition-all duration-700 ease-out group hover:scale-110 hover:z-20 team-member-card`} style={cardStyle}>
          {/* Enhanced Glow Effect for Student Affairs */}
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
          
          <div className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500`}>
            {/* Enhanced Background with multiple layers */}
            <div className="absolute inset-0">
              {/* Primary gradient background */}
              <div className={`absolute inset-0 ${person.bg} rounded-lg opacity-90`} />
              
              {/* Animated overlay pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-lg" />
              
              {/* Floating geometric shapes */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full" />
              <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/15 rounded-full" />
              <div className="absolute top-1/2 left-4 w-4 h-4 bg-white/25 rounded-full" />
            </div>

            {/* Enhanced splash background */}
            <img
              src="/images/BG-TEAM.png"
              alt="splash"
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay pointer-events-none group-hover:opacity-80 transition-all duration-500"
              loading="lazy"
            />

            {/* Main Image with enhanced styling */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
              <img
                src={person.img}
                alt={person.name}
                className="w-full h-full object-cover rounded-lg transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-1 relative z-20"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Image border glow */}
              <div className="absolute inset-0 rounded-lg ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-500" />
            </div>
            
            {/* Enhanced text overlay with better contrast */}
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-white z-30">
              {/* Background for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-b-lg" />
              
              {/* Text content */}
              <div className="relative z-10 text-center">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 text-shadow-lg group-hover:text-white transition-all duration-300 break-words leading-tight">
                  {person.name}
                </h3>
                
                {/* Student Affairs role indicator */}
                <div className="mt-2 inline-flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md border border-white/30">
                  <span className="text-xs font-semibold text-white">⭐ Student Affairs</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced hover overlay indicator */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-lg" />
        </div>
      );
    }

    // Default card style for other cases
    return (
      <div className={`relative ${sizeClasses[size]} ${className} ${transformClass} cursor-pointer transition-all duration-700 ease-out group hover:scale-110 hover:z-20 team-member-card`} style={cardStyle}>
        <div className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500`}>
          <div className="absolute inset-0">
            <div className={`absolute inset-0 ${person.bg} rounded-lg opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-lg" />
          </div>
          
          <img
            src="/images/BG-TEAM.png"
            alt="splash"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay pointer-events-none group-hover:opacity-80 transition-all duration-500"
            loading="lazy"
          />

          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            <img
              src={person.img}
              alt={person.name}
              className="w-full h-full object-cover rounded-lg transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-1 relative z-20"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            
            <div className="absolute inset-0 rounded-lg ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-500" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-white z-30">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-b-lg" />
            <div className="relative z-10 text-center">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 text-shadow-lg group-hover:text-white transition-all duration-300 break-words leading-tight">
                {person.name}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-lg" />
      </div>
    );
  };

  // Render different layouts based on committee name
  const renderCommitteeLayout = (committeeName: string) => {
    const committeeMembers = people.filter(p => p.committee === committeeName);
    if (committeeMembers.length === 0) return null;
    
    const isSingleMember = committeeMembers.length === 1;
    const isActive = activeCommittee === committeeName;

    // Enhanced layouts with better visual elements
    return (
      <div 
        key={committeeName} 
        id={`committee-${committeeName}`}
        className={`flex flex-col items-center mb-24 relative min-h-[400px] w-full group transition-all duration-500 ${
          isMobile && activeCommittee && !isActive ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Enhanced background effects with animations */}
        <div className={`absolute inset-0 bg-neutral-700 opacity-20 rounded-lg blur-3xl transition-all duration-1000 group-hover:opacity-30`}></div>
        <div className={`absolute inset-0 bg-neutral-700 opacity-10 rounded-lg blur-2xl scale-150 transition-all duration-1000 group-hover:scale-175`}></div>
        
        {/* Enhanced committee header with mobile interactions */}
        <div 
          className={`relative z-10 text-center mb-8 sm:mb-12 transition-all duration-300 ${
            isMobile ? 'cursor-pointer active:scale-95' : ''
          }`}
          onClick={() => isMobile && handleCommitteeClick(committeeName)}
        >
          <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-widest px-4 transition-all duration-300 ${
            isMobile && isActive ? 'text-yellow-400 scale-105' : ''
          }`}>
            {committeeName}
            {isMobile && (
              <span className="ml-2 text-lg">
                {isActive ? '▼' : '▶'}
              </span>
            )}
          </h3>
          <p 
            className="text-sm text-gray-400 mt-2 max-w-md mx-auto"
          >
            {isMobile ? 'Tap to focus • ' : ''}Dedicated team members working together to deliver excellence
          </p>
        </div>
        
        {/* Enhanced cards layout with connecting elements - Mobile optimized */}
        <div className={`relative flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 w-full max-w-7xl mx-auto px-2 sm:px-4`}>
          {committeeMembers.filter(Boolean).map((person: Person, idx: number) => (
            <div
              key={idx}
              className={`relative z-10 h-full w-auto transform transition-all duration-300 hover:scale-105 active:scale-95`}
            >
              <PersonCard
                person={person}
                cardId={`${committeeName}-${idx}`}
                animationDelay={idx * 200}
                size="normal"
                isCommitteeCard={true}
                className="w-[180px] sm:w-[200px] md:w-[240px] lg:w-[280px] xl:w-[320px] h-[280px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[540px] overflow-hidden rounded-lg shadow-2xl flex-shrink-0 relative touch-manipulation"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

   return (
     <div className="flex flex-col items-center justify-center px-2 sm:px-4 py-4 sm:py-8 w-full overflow-x-hidden mobile-scroll">
      {/* Committee Popup */}
      <CommitteePopup
        committee={selectedCommittee}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />

      
 
      {/* Student Affairs heading */}
      <div 
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
          Student Affairs
        </h2>
      </div>

      {/* Student Affairs cards - styled like OH and placed above OH */}
      <div className="relative mt-6 mb-12">
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
          {studentAffairsPeople.map((person, index) => (
            <div
              key={`student-affairs-${index}`}
              className="relative"
            >
              <PersonCard
                person={person}
                cardId={`student-affairs-${index}`}
                className={`w-[200px] sm:w-[180px] md:w-[240px] lg:w-[280px] xl:w-[320px] h-[320px] sm:h-[300px] md:h-[400px] lg:h-[480px] xl:h-[540px] overflow-hidden rounded-lg shadow-2xl flex-shrink-0 relative`}
                transformClass=""
                isStudentAffairs
              />
            </div>
          ))}
        </div>
      </div>

      {/* Organizing Head heading */}
      <div 
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
          Organizing Head
        </h2>
      </div>
      
             {/* Organizing Heads cards - enhanced layout and styling */}
       <div className="relative -mt-8 mb-24 sm:mb-28 lg:mb-32">
                 {/* Background decorative elements */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30" />
        </div>
        
         {/* Enhanced connecting elements for mobile */}
         <div className="lg:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[320px] flex justify-between items-center z-10">
           <div className="w-4 h-4 bg-purple-400 rounded-lg shadow-lg" />
           <div className="w-6 h-6 bg-pink-400 rounded-lg shadow-lg" />
           <div className="w-4 h-4 bg-blue-400 rounded-lg shadow-lg" />
         </div>
        
                 {/* Cards container with enhanced spacing */}
         <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-8 sm:mt-12 lg:mt-20 w-full max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
        {cards.map((person, index) => (
            <div
            key={index}
                className="relative"
              >
                 {/* Special glow effect for each card */}
                 <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-lg blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                 
                 <PersonCard
              person={person}
              cardId={`organizing-head-${index}`}
                   className={`w-[200px] sm:w-[180px] md:w-[240px] lg:w-[280px] xl:w-[320px] h-[320px] sm:h-[300px] md:h-[400px] lg:h-[480px] xl:h-[540px] overflow-hidden rounded-lg shadow-2xl flex-shrink-0 relative`}
              transformClass=""
              isOH
            />
                 
                 {/* Floating achievement badges */}
                
              </div>
        ))}
         </div>
      </div>

       {/* Enhanced "Core Committee Members" heading */}
       <div 
         className="text-center mb-4 sm:mb-12"
       >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
           Core Committee Members
      </h2>
         <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mt-4">
           Dedicated teams working behind the scenes to create an unforgettable experience
         </p>
       </div>


      {/* Committee Layouts - Row-based */}
      <div className="w-full max-w-7xl px-2 sm:px-4 space-y-16 relative z-10 perspective-1000 mx-auto">
        <div className="flex flex-col items-center space-y-24">
          {committeeNames.map((committeeName) => {
            return renderCommitteeLayout(committeeName);
          })}
        </div>
      </div>



       {/* Enhanced CSS for animations and styling */}
      <style jsx global>{`
        /* Flip card base */
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        
        /* Enhanced text shadows for better readability */
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
        
        .text-shadow-md {
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
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
          
          /* Ensure team member photos are visible on mobile */
          .team-member-card {
            min-height: 200px;
            min-width: 150px;
          }
          
          .team-member-card img {
            display: block !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }

          /* Enhanced mobile touch interactions */
          .touch-manipulation {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }

          /* Mobile card hover effects */
          .team-member-card:active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
          }

          /* Mobile committee navigation */
          .mobile-nav-button {
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            -webkit-user-select: none;
          }

          /* Mobile scroll improvements */
          .mobile-scroll {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }

          /* Mobile text sizing */
          .mobile-text {
            font-size: 0.875rem;
            line-height: 1.4;
          }

          /* Mobile spacing */
          .mobile-spacing {
            padding: 0.75rem;
            margin: 0.5rem 0;
          }

          /* Mobile flipped card optimizations */
          .mobile-flipped-card {
            padding: 0.5rem;
          }

          .mobile-flipped-card .social-icon {
            padding: 0.75rem;
            min-width: 3rem;
            min-height: 3rem;
          }

          .mobile-flipped-card .social-icon svg {
            width: 1.5rem;
            height: 1.5rem;
          }

          .mobile-flipped-card .btn-mobile {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            border-radius: 2rem;
          }

          /* Better mobile text hierarchy */
          .mobile-flipped-card h3 {
            font-size: 1rem;
            line-height: 1.2;
            margin-bottom: 0.75rem;
          }

          .mobile-flipped-card p {
            font-size: 0.75rem;
            margin-bottom: 0.75rem;
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