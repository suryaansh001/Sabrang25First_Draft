import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Linkedin, Instagram, Twitter } from 'lucide-react';

// Define the Person type interface
interface Person {
  img: string;
  bg: string;
  name: string;
  role: string;
  committee: string;
  contact: string;
  phone: string;
  socials?: { linkedin?: string; instagram?: string; twitter?: string; };
}

// New Holographic Card Component for Committee Members
const HolographicCard = ({ 
  person, 
  cardId,
  animationDelay = 0,
  description
}: { 
  person: Person; 
  cardId: string;
  animationDelay?: number;
  description?: string;
}) => {
  const [hoveredCard, setHoveredCard] = useState(false);

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

  // Handle mouse events for flip card functionality
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredCard(true);
  };

  const handleMouseLeave = () => {
    setHoveredCard(false);
  };

  return (
    <div className="group relative">
      {/* Main Card Container */}
      <div
        className="relative cursor-pointer transition-all duration-700 ease-out transform-gpu"
        style={{
          transformStyle: 'preserve-3d'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Holographic Border */}
        <div className={`
          absolute -inset-0.5 rounded-3xl opacity-75 transition-all duration-500 
          bg-neutral-800 blur-sm
          ${hoveredCard ? 'animate-pulse' : ''}
        `} />

        {/* Flip Card Container */}
        <div className="relative h-96 w-72 sm:w-80 md:w-96 perspective-1000">
          <div
            className="relative w-full h-full transition-transform duration-700 ease-out transform-style-preserve-3d"
            style={{ 
              transform: hoveredCard ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* FRONT */}
            <div className={`absolute inset-0 w-full h-full rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 overflow-hidden shadow-2xl backface-hidden transition-opacity duration-300 ${hoveredCard ? 'opacity-0' : 'opacity-100'}`}>
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Morphing Shapes */}
                <div className={`absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full transition-all duration-700 ease-out ${hoveredCard ? 'scale-150 translate-x-4 -translate-y-2' : 'scale-100'}`} />
                <div className={`absolute bottom-4 left-4 w-12 h-12 bg-white/5 rounded-full transition-all duration-500 ease-out ${hoveredCard ? 'scale-200 translate-x-8 translate-y-4' : 'scale-100'}`} />
              </div>

              {/* Card Content */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Avatar Section */}
                <div className="relative mx-auto mb-4">
                  <div className={`relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-lg overflow-hidden transition-all duration-500 ease-out transform-gpu ${hoveredCard ? 'scale-110 rotate-3' : 'scale-100'}`}>
                    <img
                      src={person.img || '/images/building-6011756_1280.jpg'}
                      alt={person.name || 'Team Member'}
                      className="w-full h-full object-cover transition-all duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/Logo.svg';
                        e.currentTarget.classList.remove('object-cover');
                        e.currentTarget.classList.add('object-contain');
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
                  </div>
                  {/* Floating Ring */}
                  <div className={`absolute -inset-3 border-2 border-white/30 rounded-lg transition-all duration-700 ease-out ${hoveredCard ? 'scale-125 rotate-12 opacity-100' : 'scale-100 opacity-0'}`} />
                </div>

                {/* Member Info */}
                <div className="text-center text-white flex-grow flex flex-col justify-center">
                  <h3 className={`text-lg font-bold mb-2 transition-all duration-300 ${hoveredCard ? 'text-white scale-105' : 'text-white/90'}`}>
                    {person.name || 'Unknown'}
                  </h3>
                  <p className="text-xs font-semibold opacity-80 mb-3 uppercase tracking-widest text-purple-200">
                    {person.role || 'Member'}
                  </p>
                  <p className="text-xs opacity-70 leading-relaxed line-clamp-2">
                    {description || 'Leading the charge in making our annual fest unforgettable with creative vision and seamless execution.'}
                  </p>
                </div>

              </div>

              {/* Shimmer Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transition-all duration-700 ease-out ${hoveredCard ? 'translate-x-full' : '-translate-x-full'}`} />
            </div>

            {/* BACK */}
            <div className={`absolute inset-0 w-full h-full rounded-lg border border-white/30 overflow-hidden shadow-2xl text-white p-6 backface-hidden rotate-y-180 transition-opacity duration-300 ${hoveredCard ? 'opacity-100' : 'opacity-0'}`} style={{ transform: 'rotateY(180deg)' }}>
              {/* Enhanced background pattern */} 
              <div className="absolute inset-0 bg-black/30" />
              
              <div className="relative z-10 flex flex-col h-full items-center justify-center gap-2 text-center">
                <h3 className="text-2xl font-bold text-white">{person.name || 'Unknown'}</h3>
                <p className="text-md text-purple-200/90">{person.committee || 'General'}</p>
                
                <div className="w-28 h-0.5 bg-white/25 my-4" />

                <div className="space-y-3">
                    <p className="text-sm text-white/80 uppercase tracking-widest">Social Links</p>
                    <div className="flex items-center justify-center gap-6">
                        <a href={person.socials?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#0077B5] transition-all duration-300 hover:scale-125"><Linkedin size={28} /></a>
                        <a href={person.socials?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#E1306C] transition-all duration-300 hover:scale-125"><Instagram size={28} /></a>
                        {person.socials?.twitter && (
                        <a href={person.socials?.twitter} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#1DA1F2] transition-all duration-300 hover:scale-125"><Twitter size={28} /></a>
                        )}
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
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only rendering animations on client
  useEffect(() => {
    setIsClient(true);
  }, []);


  // People array with detailed information for each person
  const people: Person[] = [
    // Student Affairs
    { 
      img: "/images/OH_images_home/Deepak_Sogani.png", 
      bg: "bg-gradient-to-br from-orange-500 via-rose-500 to-yellow-400",
      name: "Mr. Deepak Sogani",
      role: "Head-Student Affairs",
      committee: "Student Affairs",
      contact: "",
      phone: "+91 98765 43210"
    },
    { 
      img: "/images/OH_images_home/Pro_VC.png", 
      bg: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-400",
      name: "Dr.Alka Mahajan",
      role: "Pro Vice Chancellor",
      committee: "Student Affairs",
      contact: "",
      phone: "+91 98765 43211"
    },
    // Core Committee Members
    { 
      img: "/images/Team/Discipline/Rahul_Verma.png", 
      bg: "bg-red-500",
      name: "Rahul Verma",
      role: "Discipline",
      committee: "Discipline",
      contact: "rahul.verma@email.com",
      phone: "+91 98765 43214",
      socials: {
        linkedin: "https://www.linkedin.com/",
        instagram: "https://www.instagram.com/"
      }
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
       phone: "+91 98765 43216",
       socials: {
        instagram: "https://www.instagram.com/jinal_lodha7?igsh=MXVmajA1d25obWd1bg=="
      }
    },
    { 
      img: "/images/OH_images_home/arjun.jpeg", 
      bg: "bg-green-500",
      name: "Jigeesha Agarawal",
      role: "Decor",
      committee: "Decor",
      contact: "jigeesha.agarawal@email.com",
       phone: "+91 98765 43217",
       socials: {
        instagram: "https://www.instagram.com/jigeeeshaaa?igsh=emNubTcyM28yNHVi"
      }
    },
    { 
      img: "/images/Team/Prabal agrawal.webp", 
      bg: "bg-indigo-500",
      name: "Prabal Agarwal",
      role: "Report",
      committee: "Media & Report",
      contact: "prabal.agarwal@email.com",
      phone: "+91 98765 43219",
       socials: { 
        instagram: "https://www.instagram.com/agrawal.prabal?igsh=cmoyMXU4NGQyZ3h0",
        linkedin: "https://www.linkedin.com/in/prabal-agrawal23?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      }
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
      img: "/images/Team/Satvik vaid.webp", 
      bg: "bg-lime-500",
      name: "Satvik Vaid",
      role: "Cultural",
      committee: "Cultural",
      contact: "satvick.vaid@email.com",
       phone: "+91 98765 43223",
       socials: {
        instagram: "https://www.instagram.com/satvick_vaid?utm_source=qr&igsh=NHI2ZjE0c3VsNGY4"
      }
    },
    { 
      img: "/images/Team/Suryaansh Sharma.webp", 
      bg: "bg-amber-500",
      name: "Suryaansh Sharma",
      role: "Technical",
      committee: "Technical",
      contact: "suryaansh.sharma@email.com",
      phone: "+91 98765 43224",
      socials: {
        linkedin: "https://www.linkedin.com/in/suryaansh-sharma-05a811284/"
      }
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
      phone: "+91 98765 43230",
      socials: {
        instagram: "https://instagram.com/tanveer_kumawatt"
      }
    },
    { 
      img: "/images/OH_images_home/aisha.jpeg", 
      bg: "bg-zinc-500",
      name: "Aayushi Meel",
      role: "Hospitality",
      committee: "Hospitality",
      contact: "aayushi.meel@email.com",
      phone: "+91 98765 43231",
      socials: {
        linkedin: "https://www.linkedin.com/in/aayushi-meel-01505a2b7/"
      }
    },
    { 
      img: "/images/OH_images_home/dhruv.jpeg", 
      bg: "bg-neutral-500",
      name: "Suryansh Khandelwal",
      role: "Stage & Venue",
      committee: "Stage & Venue",
      contact: "suryansh.khandelwal@email.com",
      phone: "+91 98765 43232",
      socials: {
        linkedin: "https://www.linkedin.com/in/suryansh-khandelwal-bb495b322",
        instagram: "https://www.instagram.com/_.hrshhh?igsh=MTRnNHRwMjNqc3RmdQ=="
      }
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
      img: "/images/Team/Chahat Khandelwal.webp",
      bg: "bg-fuchsia-600",
      name: "Chahat Khandelwal",
      role: "Anchor",
      committee: "anchorz",
      contact: "",
      phone: "",
      socials: {
        instagram: "https://www.instagram.com/okchahat_?igsh=YTR1am1ldXoxOThk&utm_source=qr"
      }
    },
    {
      img: "/images/OH_images_home/Anushka_Pathak.png",
      bg: "bg-purple-600",
      name: "Anushka Pathak",
      role: "Executive Student Affairs",
      committee: "Student Affairs",
      contact: "",
      phone: ""
    },
    {
      img: "/images/Team/Dheevi_Fozdar.png",
      bg: "bg-zinc-600",
      name: "Dheevi Fozdar",
      role: "Hospitality",
      committee: "Hospitality",
      contact: "dheevi.fozdar@email.com",
      phone: "+91 98765 43238"
    },
    {
      img: "/images/Team/Naman_Shukla.png",
      bg: "bg-stone-600",
      name: "Naman Shukla",
      role: "Sponsorship & Promotion",
      committee: "Sponsorship & Promotion",
      contact: "naman.shukla@email.com",
      phone: "+91 98765 43239"
    }
  ];

  // Student Affairs people (rendered using OH card style)
  const studentAffairsPeople: Person[] = people.filter((p) => p.committee === 'Student Affairs');

  // Single OH card (Diya Garg)
  const ohPeople: Person[] = [
    {
      img: "/images/Team/OH/Diya Garg.webp",
      bg: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-400",
      name: "Diya Garg",
      role: "Organizing Head",
      committee: "Organizing Committee",
      contact: "",
      phone: ""
    }
  ];

        // Committee data with ultra-creative layouts - reorganized as requested
   const committeeData = [
     {
       name: "Photography",
       description: "Capturing the vibrant moments and timeless memories of Sabrang'25 through a creative lens.",
       layout: "time-vortex",
       color: "bg-neutral-700"
     },
     {
       name: "Cultural",
       description: "Orchestrating the artistic heartbeat of the fest with captivating performances and cultural showcases.",
       layout: "cosmic-dance",
       color: "bg-neutral-700"
     },
     {
       name: "Technical",
       description: "Powering the fest's digital and on-ground experiences with cutting-edge technology and seamless execution.",
       layout: "matrix-code",
       color: "bg-neutral-700"
     },
     {
       name: "Media & Report",
       description: "Crafting the narrative of Sabrang'25 and documenting its legacy for the world to see.",
       layout: "holographic",
       color: "bg-neutral-700"
     },
     {
       name: "Discipline",
       description: "Ensuring a safe, smooth, and enjoyable experience for all attendees with professionalism and care.",
       layout: "dna-helix",
       color: "bg-neutral-700"
     },
     {
       name: "Decor",
       description: "Transforming campus spaces into breathtaking thematic wonderlands that define the fest's atmosphere.",
       layout: "fractal-tree",
       color: "bg-neutral-700"
     },
     {
       name: "Internal Arrangements",
       description: "Managing the logistical backbone of the fest to ensure every event runs flawlessly behind the scenes.",
       layout: "galaxy-cluster",
       color: "bg-neutral-700"
     },
     {
       name: "Transport",
       description: "Coordinating the seamless movement of guests, participants, and materials to keep the fest on schedule.",
       layout: "wormhole",
       color: "bg-neutral-700"
     },
     {
       name: "Social Media",
       description: "Amplifying the fest's buzz and engaging our online community with creative and timely content.",
       layout: "digital-rain",
       color: "bg-neutral-700"
     },
     {
       name: "Prize & Certificates",
       description: "Recognizing and celebrating the incredible talent and achievement of all our participants.",
       layout: "crystal-lattice",
       color: "bg-neutral-700"
     },
     {
       name: "Hospitality",
       description: "Providing a warm welcome and impeccable support to our esteemed guests, judges, and artists.",
       layout: "energy-field",
       color: "bg-neutral-700"
     },
     {
       name: "Stage & Venue",
       description: "Setting the stage for unforgettable moments and managing the core infrastructure of our event spaces.",
       layout: "magnetic-field",
       color: "bg-neutral-700"
     },
     {
       name: "Registrations",
       description: "Streamlining the entry point for all participants, ensuring a smooth and welcoming start to their fest journey.",
       layout: "particle-system",
       color: "bg-neutral-700"
     },
     {
       name: "Sponsorship & Promotion",
       description: "Forging key partnerships and driving the promotional strategies that elevate the fest's reach and impact.",
       layout: "cosmic-field",
       color: "bg-neutral-700"
     },
     {
       name: "anchorz",
       description: "Commanding the stage with charisma and energy, guiding the audience through the spectacular journey of Sabrang'25.",
       layout: "energy-field",
       color: "bg-neutral-700"
     }
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
    description?: string;
  }) => {
    // Removed hover handlers for expanded card

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
          description={description}
        />
      );
    }

         // Enhanced OH card style for organizing heads
     if (isOH) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className} ${transformClass} cursor-pointer transition-all duration-700 ease-out group hover:scale-110 hover:z-20`} style={cardStyle}>
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
                 {person.role === 'Organizing Head' && <div className="mt-2 inline-flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md border border-white/30">
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
  };

  // Render different layouts based on committee layout type
  const renderCommitteeLayout = (committee: any) => {
    // Don't render animated layouts on server
    if (!isClient) {
      return (
        <div key={committee.name} className="flex flex-col items-center mb-24 relative min-h-[400px] w-full">
                   {/* Enhanced background effects */}
         <div className={`absolute inset-0 ${committee.color} opacity-20 rounded-lg blur-3xl`}></div>
         <div className={`absolute inset-0 ${committee.color} opacity-10 rounded-lg blur-2xl scale-150`}></div>
          
          {/* Enhanced committee header */}
          <div className="relative z-10 text-center mb-8 sm:mb-12">
            <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-widest px-4`}>
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
            {(committee.people || []).filter(Boolean).map((person: Person, idx: number) => (
              <PersonCard
                key={idx}
                person={person}
                cardId={`${committee.name}-${idx}`}
                className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px] xl:w-[160px] 2xl:w-[200px] flex-shrink-0 relative z-10"
                animationDelay={idx * 400}
                size="normal"
                isCommitteeCard={true}
                description={committee.description}
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
         <div className={`absolute inset-0 ${committee.color} opacity-20 rounded-lg blur-3xl transition-all duration-1000 group-hover:opacity-30`}></div>
         <div className={`absolute inset-0 ${committee.color} opacity-10 rounded-lg blur-2xl scale-150 transition-all duration-1000 group-hover:scale-175`}></div>
        
                 {/* Enhanced committee header with animations */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           viewport={{ once: true }}
           className="relative z-10 text-center mb-8 sm:mb-12"
         >
           <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-widest px-4`}>
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
          {(committee.people || []).filter(Boolean).map((person: Person, idx: number) => (
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
                description={committee.description}
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
           {useMemo(() => {
             let seed = 123456;
             const rand = () => {
               seed = (seed * 1664525 + 1013904223) % 4294967296;
               return seed / 4294967296;
             };
             return Array.from({ length: 20 }).map((_, i) => (
               <motion.div
                 key={i}
                 className="absolute w-2 h-2 bg-white/20 rounded-full"
                 style={{
                   left: `${rand() * 100}%`,
                   top: `${rand() * 100}%`,
                 }}
                 animate={{
                   y: [0, -20, 0],
                   opacity: [0.2, 0.8, 0.2],
                   scale: [1, 1.5, 1],
                 }}
                 transition={{
                   duration: 3 + rand() * 2,
                   repeat: Infinity,
                   delay: rand() * 2,
                 }}
               />
             ));
           }, [])}
         </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 text-white drop-shadow-2xl tracking-widest uppercase relative z-10" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
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
          <div className="w-16 h-1 bg-purple-400 rounded-full" />
           <motion.div 
            className="w-4 h-4 bg-pink-400 rounded-full"
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
          <span className="text-purple-400 font-bold">
             SABRANG'25
           </span>
         </motion.p>
       </motion.div>
 
      {/* Student Affairs heading */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
          Student Affairs
        </h2>
      </motion.div>

      {/* Student Affairs cards - styled like OH and placed above OH */}
      <div className="relative mt-6 mb-12">
        <div className="flex flex-wrap justify-center lg:justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
          {studentAffairsPeople.map((person, index) => (
            <motion.div
              key={`student-affairs-${index}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="relative"
            >
              <PersonCard
                person={person}
                cardId={`student-affairs-${index}`}
                className={`w-[120px] sm:w-[180px] md:w-[240px] lg:w-[280px] xl:w-[320px] h-[200px] sm:h-[300px] md:h-[400px] lg:h-[480px] xl:h-[540px] overflow-hidden rounded-lg shadow-2xl flex-shrink-0 relative`}
                transformClass=""
                isOH
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Organizing Head heading */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
        className="text-center mt-24"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
          Organizing Head
        </h2>
      </motion.div>
      
             {/* Organizing Heads cards - enhanced layout and styling */}
       <div className="relative mt-[-8] mb-564 sm:mb-28 lg:mb-32">
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
        {cards.map((person, index) => (
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
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
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
                
              </motion.div>
        ))}
         </div>
      </div>

       {/* Enhanced "Core Committee Members" heading */}
       <motion.div 
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 1, delay: 0.2 }}
         viewport={{ once: true }}
         className="text-center mb-8 sm:mb-12"
       >
        <h2 className="py-18 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
           Core Committee Members
      </h2>
         <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mt-4">
           Dedicated teams working behind the scenes to create an unforgettable experience
         </p>
       </motion.div>


      {/* Committee Layouts - Row-based */}
      <div className="w-full max-w-7xl px-2 sm:px-4 space-y-16 relative z-10 perspective-1000 mx-auto">
        <div className="flex flex-col space-y-24">
          {committeeData.map((committee) => {
            const committeeMembers = people.filter(p => p.committee === committee.name);
            if (committeeMembers.length === 0) return null;
            const committeeWithPeople = { ...committee, people: committeeMembers };
            return renderCommitteeLayout(committeeWithPeople);
          })}
        </div>
      </div>

             {/* Special Floating Action Button */}
       <motion.div
         className="fixed bottom-8 right-8 z-50"
         initial={{ opacity: 0, scale: 0, rotate: -180 }}
         animate={{ opacity: 1, scale: 1, rotate: 0 }}
         transition={{ duration: 0.8, delay: 2, type: "spring" }}
       >
         <motion.button
          className="w-16 h-16 bg-purple-500 rounded-full shadow-2xl border-2 border-white/20 flex items-center justify-center text-white text-2xl backdrop-blur-sm"
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