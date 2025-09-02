import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { 
  Linkedin, Instagram, Twitter, ClipboardList, Music, Cpu, Theater, Newspaper, Handshake, Settings, Palette, Megaphone, Camera, Share2, Mic, Award, Bus, Shield 
, Code2, Github, Facebook, Mail } from 'lucide-react';

// Define the Person type interface
interface Person {
  img: string;
  bg: string;
  name: string;
  role: string;
  committee: string;
  contact: string;
  phone: string;
  socials?: { linkedin?: string; instagram?: string; twitter?: string; github?: string; facebook?: string; };
}

// New component to render committee-specific icons
const CommitteeIcon = ({ committee }: { committee: string }) => {
  const icons: { [key: string]: React.ElementType } = {
    "Registrations": ClipboardList,
    "Cultural": Music,
    "Technical": Code2,
    "Stage & Venue": Theater,
    "Media & Report": Newspaper,
    "Hospitality": Handshake,
    "Internal Arrangements": Settings,
    "Decor": Palette,
    "Sponsorship & Promotion": Megaphone,
    "Photography": Camera,
    "Social Media": Share2,
    "anchors": Mic,
    "anchorz": Mic, // Handling both cases for consistency
    "Prize & Certificates": Award,
    "Transport": Bus,
    "Discipline": Shield,
  };

  const IconComponent = icons[committee];

  if (!IconComponent) {
    return null; // No icon for this committee
  }

  return (
    <div className="committee-vector-icon absolute z-0 w-3/5 h-3/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
      <IconComponent 
        stroke="url(#icon-gradient)" 
        strokeWidth={0.4} 
        className="w-full h-full"
      />
    </div>
  );
};

// New Social Icon Component using Framer Motion for robust animations
const SocialIcon = ({ href, brand, children }: { href: string; brand: string; children: React.ReactNode }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`social-icon-link ${brand} relative z-50`}
      style={{ transformOrigin: 'center 250%' }} // Creates a swing/arc effect on rotation
    >
      {children}
    </motion.a>
  );
};
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
  const [isFlipped, setIsFlipped] = useState(false);
  // Lazily initialize isTouchDevice to avoid re-renders and ensure it's only checked on the client.
  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  const handleCardClick = (event: MouseEvent | TouchEvent | PointerEvent) => {
    // On touch devices, a tap will flip the card.
    // First, we check if the tap originated from a social media link.
    // The `closest()` method is the most reliable way to do this, as it checks the tapped element
    // and its parents to see if they match the '.social-icon-link' selector.
    const target = event.target as HTMLElement;
    if (target.closest('.social-icon-link')) {
      return; // If it's a link, we do nothing and let the browser handle the navigation.
    }

    if (isTouchDevice) {
      setIsFlipped(prev => !prev);
    }
  };
  // Add error handling for undefined person
  if (!person) {
    return (
      <div className="relative h-80 w-full sm:h-96 sm:w-72 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-center h-full text-white">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const hasSocials = person.socials && Object.values(person.socials).some(v => v);
  const hasEmail = person.contact && person.contact.includes('@');

  return (
    <motion.div 
      className="group relative h-80 w-full sm:h-96 sm:w-72 cursor-pointer"
      // On non-touch devices (desktops), flip on hover.
      onMouseEnter={() => !isTouchDevice && setIsFlipped(true)}
      onMouseLeave={() => !isTouchDevice && setIsFlipped(false)}
      onTap={handleCardClick} // Use onTap for more robust touch/click handling
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className="relative w-full h-full"
      >
        {/* FRONT FACE */}
        <div className="absolute w-full h-full">
          <div className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-white/20`}>
            {/* Main Image */}
            <img
              src={person.img || '/images/building-6011756_1280.jpg'}
              alt={person.name || 'Team Member'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/Logo.svg';
                e.currentTarget.classList.remove('object-cover');
                e.currentTarget.classList.add('object-contain');
              }}
            />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
              {/* Background for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              {/* Content */}
              <div className="relative z-10 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-shadow-md truncate">{person.name || 'Unknown'}</h3>
                <p className="text-sm sm:text-md text-purple-200/90 truncate">{person.role || 'Member'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <motion.div 
          className="absolute w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFlipped ? 1 : 0, pointerEvents: isFlipped ? 'auto' : 'none' }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className={`relative w-full h-full rounded-lg p-[1.5px] bg-gradient-to-br from-purple-500/80 via-pink-500/80 to-blue-500/80 shadow-2xl`}>
            <div className="relative z-10 w-full h-full rounded-[7px] overflow-hidden text-white p-4 sm:p-6 bg-white/10 backdrop-blur-lg">
              {/* Background with person's image as backdrop */}
              <div className="absolute inset-0">
                <img
                  src={person.img || '/images/building-6011756_1280.jpg'}
                  alt={person.name || 'Team Member'}
                  className="w-full h-full object-cover opacity-10 blur-lg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/60" />
                {/* Vector icon is now part of the background layer, ensuring it's overlapped */}
                <CommitteeIcon committee={person.committee} />
              </div>

              <div className="relative z-10 flex flex-col h-full items-center justify-center gap-2 text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                  {person.name || 'Unknown'}
                </h3>
                <p className="text-md text-purple-200/90 mb-4">{person.role || 'Member'}</p>
                
                <div className="w-24 h-0.5 bg-white/25 my-2 mx-auto" />

                <div 
                  className="flex items-center justify-center gap-4 sm:gap-5 mt-4"
                >
                  {hasEmail && (
                    <SocialIcon href={`mailto:${person.contact}`} brand="email">
                      <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
                    </SocialIcon>
                  )}
                  {person.socials?.linkedin && (
                    <SocialIcon href={person.socials.linkedin} brand="linkedin">
                      <Linkedin className="w-6 h-6 sm:w-7 sm:h-7" />
                    </SocialIcon>
                  )}
                  {person.socials?.instagram && (
                    <SocialIcon href={person.socials.instagram} brand="instagram">
                      <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
                    </SocialIcon>
                  )}
                  {person.socials?.twitter && (
                    <SocialIcon href={person.socials.twitter} brand="twitter">
                      <Twitter className="w-6 h-6 sm:w-7 sm:h-7" />
                    </SocialIcon>
                  )}
                  {person.socials?.github && (
                    <SocialIcon href={person.socials.github} brand="github">
                      <Github className="w-6 h-6 sm:w-7 sm:h-7" />
                    </SocialIcon>
                  )}
                  {person.socials?.facebook && (
                    <SocialIcon href={person.socials.facebook} brand="facebook">
                      <Facebook className="w-6 h-6 sm:w-7 sm:h-7" />
                    </SocialIcon>
                  )}
                </div>
                {!hasSocials && !hasEmail && (
                     <p className="text-white/70 text-sm mt-4">No contact links available</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
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
      img: "/images/Team/kriti.webp", 
      bg: "bg-orange-500",
      name: "Kriti Gupta",
      role: "Discipline",
      committee: "Discipline",
      contact: "kriti.gupta@email.com",
      phone: "+91 98765 43215"
    },
    { 
      img: "/images/Team/Jinal Lodha.webp", 
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
      img: "/images/Team/Jigeesha Agarawal.webp", 
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
      img: "/images/Team/Prabal agarwal2.webp", 
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
      img: "/images/Team/ShouryaPrajapat.webp", 
      bg: "bg-teal-500",
      name: "Shourya Prajapat",
      role: "Photography",
      committee: "Photography",
      contact: "shourya.prajapat@email.com",
       phone: "+91 98765 43220"
    },
    { 
      img: "/images/Team/Ekansh Saraswat 2.webp", 
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
      name: "Satvick Vaid",
      role: "Cultural",
      committee: "Cultural",
      contact: "satvick.vaid@email.com",
       phone: "+91 98765 43223",
       socials: {
        instagram: "https://www.instagram.com/satvick_vaid?utm_source=qr&igsh=NHI2ZjE0c3VsNGY4"
      }
    },
    { 
      img: "/images/Team/SuryaanshSharma.webp", 
      bg: "bg-amber-500",
      name: "Suryaansh Sharma",
      role: "Technical",
      committee: "Technical",
      contact: "suryaansh.sharma@email.com",
      phone: "+91 98765 43224",
      socials: {
        linkedin: "https://www.linkedin.com/in/suryaansh-sharma-05a811284/",
        github: "https://github.com/suryaansh-sharma"
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
      img: "/images/Team/Anmol Sahu.webp", 
      bg: "bg-rose-500",
      name: "Anmol Sahu",
      role: "Transport",
      committee: "Transport",
      contact: "anmol.sahu@email.com",
      phone: "+91 98765 43228"
    },
    { 
      img: "/images/Team/vandanshah.webp", 
      bg: "bg-sky-500",
      name: "Vandan P. Shah",
      role: "Social Media",
      committee: "Social Media",
      contact: "vandan.shah@email.com",
      phone: "+91 98765 43229"
    },
    { 
      img: "/images/Team/Tanveer Kanderiya.webp", 
      bg: "bg-slate-500",
      name: "Tanveer Kanderiya",
      role: "Prize & Certificates",
      committee: "Prize & Certificates",
      contact: "tanveer.kanderiya@email.com",
      phone: "+91 98765 43230",
      socials: {
        instagram: "https://instagram.com/tanveer_kumawatt",
        facebook: "https://facebook.com/tanveer.kanderiya"
      }
    },
    { 
      img: "/images/Team/Aayushi Meel.webp", 
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
      img: "/images/Team/suryanshkhandelwal.jpg", 
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
      img: "/images/Team/akashSaraswatCropped.webp", 
      bg: "bg-neutral-500",
      name: "Akshat Saraswat",
      role: "Stage & Venue",
      committee: "Stage & Venue",
      contact: "AKASH@jklu.edu.in",
      phone: "+91 7014647818",
      socials: {
        linkedin: "https://www.linkedin.com/in/",
        instagram: "https://www.instagram.com/"
      }
    },
    { 
      img: "/images/Team/AyushiKabra.webp", 
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
      name: "Jayash Gahlot",
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
      committee: "anchors",
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

    const cardStyle = { ...style };

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
      <motion.div 
        className={`relative ${sizeClasses[size]} ${className} ${transformClass} cursor-pointer`} 
        style={cardStyle}
        whileHover={{ scale: 1.05, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
           <div className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-white/20`}>
             {/* Enhanced Background with multiple layers */}
             <div className="absolute inset-0">
               {/* Primary gradient background */}
               <div className={`absolute inset-0 ${person.bg} rounded-lg opacity-90`} />
               
               {/* Animated overlay pattern */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-lg" />
             </div>

             {/* Enhanced splash background */}
              <img
                src="/images/BG-TEAM.png"
                alt="splash"
               className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay pointer-events-none"
             />

             {/* Main Image with enhanced styling */}
             <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
               <img
                 src={person.img}
                 alt={person.name}
                 className="w-full h-full object-cover rounded-lg relative z-20"
                 onError={(e) => {
                   console.error('Image failed to load:', person.img);
                   e.currentTarget.style.display = 'none';
                 }}
               />
               
               {/* Image border glow */}
               <div className="absolute inset-0 rounded-lg ring-2 ring-white/30" />
             </div>
             
             {/* Enhanced text overlay with better contrast */}
             <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-30">
               {/* Background for text readability */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-b-lg" />
               
               {/* Text content */}
               <div className="relative z-10 text-center">
                 <h3 className="text-lg lg:text-xl font-bold mb-1 text-shadow-lg truncate">
                   {person.name}
                 </h3>
                 <p className="text-sm opacity-90 font-medium text-shadow-md truncate">
                   {person.role}
                 </p>
                 
                 {/* Enhanced role indicator */}
                 {person.role === 'Organizing Head' && <div className="mt-2 inline-flex items-center px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md border border-white/30">
                   <span className="text-xs font-semibold text-white">⭐ Organizing Head</span>
                 </div>}
               </div>
             </div>
           </div>
         </motion.div>
       );
    }
  };

  // Render different layouts based on committee name
  const renderCommitteeLayout = (committeeName: string) => {
    const committeeMembers = people.filter(p => p.committee === committeeName);
    if (committeeMembers.length === 0) return null;    

    return (
      <div key={committeeName} className="flex flex-col items-center mb-16 sm:mb-24 relative min-h-[400px] w-full group">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-neutral-700 opacity-20 rounded-lg blur-3xl"></div>
        <div className="absolute inset-0 bg-neutral-700 opacity-10 rounded-lg blur-2xl scale-150"></div>
        
        {/* Enhanced committee header */}
        <div className="relative z-10 text-center mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-widest px-4">
            {committeeName}
          </h3>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            Dedicated team members working together to deliver excellence
          </p>
        </div>
        
        {/* Enhanced cards layout with connecting elements */}
        <div className="relative grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-8 md:gap-12 w-full max-w-7xl mx-auto px-2 sm:px-4">
          {committeeMembers.filter(Boolean).map((person: Person, idx: number) => (
            <div
              key={idx}
              className="relative z-10"
            >
              <PersonCard
                person={person}
                cardId={`${committeeName}-${idx}`}
                size="normal"
                isCommitteeCard={true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center px-2 sm:px-4 py-4 sm:py-8 w-full overflow-x-hidden">
      {/* Gradient definition for committee icons, rendered once */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" /> {/* purple-400 */}
            <stop offset="50%" stopColor="#f472b6" /> {/* pink-400 */}
            <stop offset="100%" stopColor="#60a5fa" /> {/* blue-400 */}
          </linearGradient>
        </defs>
      </svg>

      {/* Enhanced Main "SABRANG'25" heading with cosmic styling */}
      <div className="text-center mb-12 sm:mb-16 lg:mb-20 relative">
        <h1 className="animated-gradient text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.fuchsia.400),theme(colors.purple.500),theme(colors.sky.400),theme(colors.cyan.400),theme(colors.pink.400),theme(colors.fuchsia.400))] drop-shadow-2xl tracking-widest uppercase relative z-10 sabrang-title" >
           <span>
             SABRANG
           </span>
           <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
             '25
           </span>
        </h1>
      
        {/* Enhanced decorative elements */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-16 h-1 bg-purple-400 rounded-full" />
          <div className="w-4 h-4 bg-pink-400 rounded-full" />
           <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
        </div>
         
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white relative z-10">
           Organizing Committee
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 relative z-10">
           Meet the visionary leaders who orchestrate the magic of{' '}
          <span className="text-purple-400 font-bold">
             SABRANG'25
           </span>
        </p>
      </div>
 
      {/* Student Affairs heading */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
          Student Affairs
        </h2>
      </div>

      {/* Student Affairs cards - styled like OH and placed above OH */}
      <div className="relative mt-6 mb-12">
        <div className="flex flex-wrap justify-center lg:justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
          {studentAffairsPeople.map((person, index) => (
            <div
              key={`student-affairs-${index}`}
              className="relative"
            >
              <PersonCard
                person={person}
                cardId={`student-affairs-${index}`}
                className={`w-full max-w-xs h-[450px] sm:w-64 sm:h-[400px] md:w-72 md:h-[450px] lg:w-[280px] lg:h-[480px] xl:w-[320px] xl:h-[540px] overflow-hidden rounded-lg shadow-2xl flex-shrink-0 relative`}
                transformClass=""
                isOH
              />
            </div>
          ))}
        </div>
      </div>

      {/* Organizing Head heading */}
      <div className="text-center mt-24">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
          Organizing Head
        </h2>
      </div>
      
             {/* Organizing Heads cards - enhanced layout and styling */}
       <div className="relative mt-[-8] mb-24 sm:mb-28 lg:mb-32">
                 {/* Background decorative elements */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30" />
        </div>
        
                 {/* Cards container with enhanced spacing */}
         <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10 mt-8 sm:mt-12 lg:mt-20 w-full max-w-7xl mx-auto px-2 sm:px-4 relative z-10">
        {cards.map((person, index) => (
            <div
              key={index}
              className="relative"
            >
              <PersonCard
                person={person}
                cardId={`organizing-head-${index}`}
                className={`w-full max-w-xs h-[450px] sm:w-64 sm:h-[400px] md:w-72 md:h-[450px] lg:w-[280px] lg:h-[480px] xl:w-[320px] xl:h-[540px] overflow-hidden rounded-lg shadow-2xl flex-shrink-0 relative`}
                transformClass={
                index === 1 
                       ? 'lg:relative lg:top-[-80px] xl:top-[-100px] z-30 lg:scale-110 xl:scale-125' 
                  : index === 0 
                         ? 'lg:relative lg:top-[60px] xl:top-[80px] lg:left-[-30px] xl:left-[-40px] z-20 lg:scale-95 xl:scale-100' 
                         : 'lg:relative lg:top-[60px] xl:top-[80px] lg:right-[-30px] xl:right-[-40px] z-20 lg:scale-95 xl:scale-100'
              }
              isOH
              />
            </div>
        ))}
         </div>
      </div>

       {/* Enhanced "Core Committee Members" heading */}
       <div 
         className="text-center mb-8 sm:mb-12"
       >

         <h2 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white drop-shadow-2xl tracking-widest uppercase px-4" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
           Core Committee Members
      </h2>
         <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto mt-4 px-4">
           Dedicated teams working behind the scenes to create an unforgettable experience
         </p>
       </div>

 
      {/* Committee Layouts - Row-based */}
      <div className="w-full max-w-7xl px-2 sm:px-4 relative z-10 perspective-1000 mx-auto">
        <div className="flex flex-col space-y-16 sm:space-y-24">
          {committeeNames.map((committeeName) => {
            return renderCommitteeLayout(committeeName);
          })}
        </div>
      </div>

       {/* Enhanced CSS for animations and styling */}
      <style jsx global>{`
        .social-icon-link {
          display: inline-block; /* Ensures motion component behaves correctly */
        }

        .social-icon-link svg {
          color: #d8b4fe; /* Light purple from the theme */
          transition: color 0.3s ease;
        }
        
        /* Ripple effect on hover */
        .social-icon-link::after {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border-radius: 50%;
          border: 2px solid transparent;
          opacity: 0;
          pointer-events: none; /* Allow clicks to pass through */
        }
        
        .social-icon-link.linkedin:hover svg {
          color: #0077B5;
        }
        .social-icon-link.linkedin:hover::after { border-color: #0077B5; }
        .social-icon-link.instagram:hover svg {
          color: #E1306C;
        }
        .social-icon-link.instagram:hover::after { border-color: #E1306C; }
        .social-icon-link.twitter:hover svg {
          color: #1DA1F2;
        }
        .social-icon-link.twitter:hover::after { border-color: #1DA1F2; }
        .social-icon-link.github:hover svg {
          color: #FFFFFF;
        }
        .social-icon-link.github:hover::after { border-color: #FFFFFF; }
        .social-icon-link.facebook:hover svg {
          color: #1877F2;
        }
        .social-icon-link.facebook:hover::after { border-color: #1877F2; }
        .social-icon-link.email:hover svg {
          color: #D44638; /* A common email red */
        }
        .social-icon-link.email:hover::after { 
          border-color: #D44638; 
        }
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

        /* Animated Gradient for Titles */
        .animated-gradient {
          background-size: 250% 250%;
          animation: gradient-animation 10s ease-in-out infinite;
        }

        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .transform-gpu {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        
        /* Enhanced gradient backgrounds */
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        /* Enhanced shadows */
        .card-front-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
          opacity: 0;
          transform: scale(1.1) rotate(-10deg);
          transition: opacity 0.5s ease, transform 0.5s ease;
          pointer-events: none;
        }
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