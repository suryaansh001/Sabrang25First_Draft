import React, { useState, useRef, useEffect } from "react";
import PolaroidFrame from "../../../PolaroidGrid";

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

// Expanded Card Component that appears on hover
const ExpandedCard = ({ 
  hoveredPerson, 
  isHovered, 
  cardPosition, 
  onClose 
}: { 
  hoveredPerson: Person | null; 
  isHovered: boolean; 
  cardPosition: { x: number; y: number; width: number; height: number }; 
  onClose: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  console.log('ExpandedCard render:', { hoveredPerson: hoveredPerson?.name, isHovered, cardPosition });
  
  useEffect(() => {
    console.log('ExpandedCard useEffect:', { isHovered, hoveredPerson: hoveredPerson?.name });
    if (isHovered && hoveredPerson) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isHovered, hoveredPerson]);

  if (!hoveredPerson || !isHovered) {
    console.log('ExpandedCard returning null:', { hoveredPerson: !!hoveredPerson, isHovered });
    return null;
  }

  const handleMouseLeave = () => {
    setIsExpanded(false);
    // Faster response for shrinking animation
    setTimeout(() => {
      onClose();
    }, 150);
  };

  const handleMouseEnter = () => {
    // Immediate expansion for smooth animation
    setIsExpanded(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-200"
        style={{ 
          opacity: isExpanded ? 1 : 0.6,
          backdropFilter: isExpanded ? 'blur(8px)' : 'blur(4px)'
        }}
      />
      
      {/* Growing Card - starts small and grows smoothly */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl overflow-hidden growing-card ${isExpanded ? 'expanded' : ''}`}
        style={{
          position: 'fixed',
          left: isExpanded ? '50%' : `${cardPosition.x}px`,
          top: isExpanded ? '50%' : `${cardPosition.y}px`,
          width: isExpanded ? '90vw' : `${cardPosition.width}px`,
          maxWidth: isExpanded ? '1200px' : 'none',
          height: isExpanded ? '80vh' : `${cardPosition.height}px`,
          zIndex: 50,
          transition: isExpanded 
            ? 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
            : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isExpanded ? 'translate(-50%, -50%)' : 'none',
          transformOrigin: `${cardPosition.x + cardPosition.width/2}px ${cardPosition.y + cardPosition.height/2}px`,
          boxShadow: isExpanded ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          opacity: isExpanded ? 1 : 0.9,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setIsExpanded(false);
            setTimeout(() => {
              onClose();
            }, 150);
          }}
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
          <div className="lg:w-2/3 relative">
            <div className={`w-full h-full ${hoveredPerson.bg}`}>
              <img
                src={hoveredPerson.img}
                alt={hoveredPerson.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            {/* Image Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white transition-all duration-500">
              <h2 className="text-3xl lg:text-4xl font-bold mb-2 transition-all duration-500" style={{ transform: isExpanded ? 'translateY(0)' : 'translateY(10px)', opacity: isExpanded ? 1 : 0.8 }}>{hoveredPerson.name}</h2>
              <p className="text-xl lg:text-2xl text-blue-300 mb-1 transition-all duration-500 delay-100" style={{ transform: isExpanded ? 'translateY(0)' : 'translateY(10px)', opacity: isExpanded ? 1 : 0.8 }}>{hoveredPerson.role}</p>
              <p className="text-lg text-gray-300 transition-all duration-500 delay-200" style={{ transform: isExpanded ? 'translateY(0)' : 'translateY(10px)', opacity: isExpanded ? 1 : 0.8 }}>{hoveredPerson.committee}</p>
            </div>
          </div>
          
          {/* Information Section */}
          <div className="lg:w-1/3 p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="transition-all duration-500" style={{ transform: isExpanded ? 'translateX(0)' : 'translateX(20px)', opacity: isExpanded ? 1 : 0.8 }}>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-blue-600 font-medium">{hoveredPerson.contact}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-green-600 font-medium">{hoveredPerson.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Role Details */}
              <div className="transition-all duration-500 delay-100" style={{ transform: isExpanded ? 'translateX(0)' : 'translateX(20px)', opacity: isExpanded ? 1 : 0.8 }}>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Role Details</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="text-gray-800 font-medium">{hoveredPerson.role}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Committee</p>
                    <p className="text-gray-800 font-medium">{hoveredPerson.committee}</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="pt-4 transition-all duration-500 delay-200" style={{ transform: isExpanded ? 'translateX(0)' : 'translateX(20px)', opacity: isExpanded ? 1 : 0.8 }}>
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
  const [hoveredPerson, setHoveredPerson] = useState<Person | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Prevent hydration mismatch by only rendering animations on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to close the expanded card
  const handleCloseExpandedCard = () => {
    setIsHovered(false);
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
      img: "/images/OH_images_home/karan.jpeg", 
      bg: "bg-purple-500",
      name: "Priyanshu Kullu",
      role: "Design",
      committee: "Design",
      contact: "priyanshu.kullu@email.com",
      phone: "+91 98765 43216"
    },
    { 
      img: "/images/OH_images_home/sneha.jpeg", 
      bg: "bg-blue-500",
      name: "Jinal Lodha",
      role: "Decor",
      committee: "Decor",
      contact: "jinal.lodha@email.com",
      phone: "+91 98765 43217"
    },
    { 
      img: "/images/OH_images_home/arjun.jpeg", 
      bg: "bg-green-500",
      name: "Jigeesha Agarawal",
      role: "Decor",
      committee: "Decor",
      contact: "jigeesha.agarawal@email.com",
      phone: "+91 98765 43218"
    },
    { 
      img: "/images/OH_images_home/meera.jpeg", 
      bg: "bg-pink-500",
      name: "Chahat Khandelwal",
      role: "Media",
      committee: "Media",
      contact: "chahat.khandelwal@email.com",
      phone: "+91 98765 43219"
    },
    { 
      img: "/images/OH_images_home/aditya.jpeg", 
      bg: "bg-indigo-500",
      name: "Prabal Agarwal",
      role: "Report",
      committee: "Report",
      contact: "prabal.agarwal@email.com",
      phone: "+91 98765 43220"
    },
    { 
      img: "/images/OH_images_home/kavya.jpeg", 
      bg: "bg-teal-500",
      name: "Shourya Prajapat",
      role: "Photography",
      committee: "Photography",
      contact: "shourya.prajapat@email.com",
      phone: "+91 98765 43221"
    },
    { 
      img: "/images/OH_images_home/rohan.jpeg", 
      bg: "bg-yellow-500",
      name: "Ekansh Saraswat",
      role: "Photography",
      committee: "Photography",
      contact: "ekansh.saraswat@email.com",
      phone: "+91 98765 43222"
    },
    { 
      img: "/images/OH_images_home/ishita.jpeg", 
      bg: "bg-cyan-500",
      name: "Kopal Jain",
      role: "Cultural",
      committee: "Cultural",
      contact: "kopal.jain@email.com",
      phone: "+91 98765 43223"
    },
    { 
      img: "/images/OH_images_home/dev.jpeg", 
      bg: "bg-lime-500",
      name: "Satvick Vaid",
      role: "Cultural",
      committee: "Cultural",
      contact: "satvick.vaid@email.com",
      phone: "+91 98765 43224"
    },
    { 
      img: "/images/OH_images_home/tanvi.jpeg", 
      bg: "bg-amber-500",
      name: "Suryaansh Sharma",
      role: "Tech & Support",
      committee: "Tech & Support",
      contact: "suryaansh.sharma@email.com",
      phone: "+91 98765 43225"
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

  // Committee data with ultra-creative layouts
  const committeeData = [
    {
      name: "Discipline",
      people: [people[3], people[4]],
      layout: "dna-helix",
      color: "from-red-500 via-orange-500 to-yellow-500"
    },
    {
      name: "Design", 
      people: [people[5]],
      layout: "quantum-field",
      color: "from-purple-500 via-pink-500 to-rose-500"
    },
    {
      name: "Decor",
      people: [people[6], people[7]],
      layout: "fractal-tree",
      color: "from-blue-500 via-cyan-500 to-teal-500"
    },
    {
      name: "Media",
      people: [people[8]],
      layout: "neural-network",
      color: "from-indigo-500 via-purple-500 to-pink-500"
    },
    {
      name: "Report",
      people: [people[9]],
      layout: "holographic",
      color: "from-green-500 via-emerald-500 to-cyan-500"
    },
    {
      name: "Photography",
      people: [people[10], people[11]],
      layout: "time-vortex",
      color: "from-yellow-500 via-orange-500 to-red-500"
    },
    {
      name: "Cultural",
      people: [people[12], people[13]],
      layout: "cosmic-dance",
      color: "from-pink-500 via-rose-500 to-red-500"
    },
    {
      name: "Tech & Support",
      people: [people[14]],
      layout: "matrix-code",
      color: "from-amber-500 via-orange-500 to-red-500"
    },
    {
      name: "Internal Arrangements",
      people: [people[15], people[16]],
      layout: "galaxy-cluster",
      color: "from-emerald-500 via-green-500 to-lime-500"
    },
    {
      name: "Transport",
      people: [people[17]],
      layout: "wormhole",
      color: "from-neutral-500 via-gray-500 to-stone-500"
    },
    {
      name: "Social Media",
      people: [people[18]],
      layout: "digital-rain",
      color: "from-sky-500 via-blue-500 to-indigo-500"
    },
    {
      name: "Prize & Certificates",
      people: [people[19]],
      layout: "crystal-lattice",
      color: "from-slate-500 via-gray-500 to-zinc-500"
    },
    {
      name: "Hospitality",
      people: [people[20]],
      layout: "energy-field",
      color: "from-zinc-500 via-gray-500 to-slate-500"
    },
    {
      name: "Stage & Venue",
      people: [people[21], people[22]],
      layout: "magnetic-field",
      color: "from-neutral-500 via-stone-500 to-gray-500"
    },
    {
      name: "Registrations",
      people: [people[23], people[24]],
      layout: "particle-system",
      color: "from-red-600 via-pink-600 to-rose-600"
    },
    {
      name: "Sponsorship & Promotion",
      people: [people[25]],
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
      console.log('Mouse enter on card:', person.name);
      const rect = e.currentTarget.getBoundingClientRect();
      console.log('Card position:', rect);
      setCardPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });
      setHoveredPerson(person);
      setIsHovered(true);
      console.log('Hover state set:', { person: person.name, isHovered: true });
    };

    const handleMouseLeave = () => {
      console.log('Mouse leave on card:', person.name);
      setIsHovered(false);
      setHoveredPerson(null);
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

    // If it's a committee card, use polaroid style
    if (isCommitteeCard) {
      // Create deterministic values based on cardId to avoid hydration mismatches
      const cardHash = cardId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const rotation = (cardHash % 6) - 3; // -3 to 2 degrees
      const zIndex = (cardHash % 5) + 1; // 1 to 5
      const shadowRotation = (cardHash % 6 - 3) * 0.5; // -1.5 to 1.5 degrees
      
      return (
        <div
          ref={(el) => {
            cardRefs.current[cardId] = el;
          }}
          className={`relative group cursor-pointer ${className}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            zIndex: zIndex,
          }}
        >
          {/* Polaroid Frame */}
          <div className="p-3 pb-12 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-50 border-2 border-white">
                         {/* Hollow Photo Area - completely transparent with border frame */}
             <div className="relative overflow-hidden aspect-[4/5] mb-3 border-2 border-gray-300 bg-transparent">
               {/* Photo area with person's actual image */}
               <img 
                 src={person.img} 
                 alt={person.name}
                 className="w-full h-full object-cover"
                 onError={(e) => {
                   // Fallback to colored background if image fails
                   e.currentTarget.style.display = 'none';
                 }}
               />
               {/* Fallback colored background if image fails */}
               <div className={`absolute inset-0 ${person.bg} -z-10`} />
               {/* Optional overlay gradient for better text contrast on hover */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
             </div>
            
            {/* Text Area */}
            <div className="text-center space-y-1">
              <h3 className="font-bold text-white-800 text-sm leading-tight">
                {person.name}
              </h3>
              <p className="text-gray-600 text-xs font-medium leading-tight">
                {person.role}
              </p>
            </div>
            
            {/* Tape Effect */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-yellow-100 opacity-80 rotate-12 shadow-sm border border-yellow-200" />
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-yellow-100 opacity-60 -rotate-6 shadow-sm border border-yellow-200" />
          </div>
          
          {/* Drop Shadow */}
          <div 
            className="absolute top-1 left-1 w-full h-full bg-black/20 -z-10 blur-sm"
            style={{
              transform: `rotate(${shadowRotation}deg)`,
            }}
          />
        </div>
      );
    }

    // Original card style for organizing heads
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
        <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg`}>
          {/* Splash gradient rectangle behind OH members */}
          {isOH && (
            <>
              <div className={`absolute inset-0 ${person.bg} rounded-2xl opacity-90`} />
              <img
                src="/images/BG-TEAM.png"
                alt="splash"
                className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen pointer-events-none"
              />
            </>
          )}

          {/* Solid background color for Core Committee Members */}
          {!isOH && (
            <div className={`absolute inset-0 ${person.bg} rounded-2xl`} />
          )}

          {/* Main Image */}
          <img
            src={person.img}
            alt={person.name}
            className={`w-full h-full ${isOH ? 'object-cover' : 'object-contain p-4'} transition-transform duration-500 ease-out group-hover:scale-105 relative z-10`}
            onError={(e) => {
              console.error('Image failed to load:', person.img);
              // Hide the image and show fallback
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* Optional frame glow */}
          <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl" />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
          
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <h3 className="text-lg font-bold mb-1">{person.name}</h3>
            <p className="text-sm opacity-90">{person.role}</p>
          </div>
          
          {/* Always visible name for OH members */}
          {isOH && (
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white relative z-30">
              <h3 className="text-lg font-bold mb-1 text-center">{person.name}</h3>
              <p className="text-sm opacity-90 text-center">{person.role}</p>
            </div>
          )}
        </div>
        
        {/* Hover overlay indicator */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-2xl" />
      </div>
    );
  };

  // Render different layouts based on committee layout type
  const renderCommitteeLayout = (committee: any) => {
    // Don't render animated layouts on server
    if (!isClient) {
      return (
        <div key={committee.name} className="flex flex-col items-center mb-24 relative min-h-[400px]">
          <div className={`absolute inset-0 bg-gradient-to-r ${committee.color} opacity-20 rounded-full blur-3xl`}></div>
          <h3 className={`text-2xl md:text-4xl font-black mb-12 bg-gradient-to-r ${committee.color} bg-clip-text text-transparent uppercase tracking-widest relative z-10`}>
            {committee.name}
          </h3>
          <div className="relative flex justify-center items-center gap-8">
            {committee.people.map((person: Person, idx: number) => (
              <PersonCard
                key={idx}
                person={person}
                cardId={`${committee.name}-${idx}`}
                className="w-[160px] sm:w-[180px] md:w-[200px]"
                animationDelay={idx * 400}
                size="normal"
                isCommitteeCard={true}
              />
            ))}
          </div>
        </div>
      );
    }

    // Client-side animated layouts - Row-based layout with adaptive spacing
    return (
      <div key={committee.name} className="flex flex-col items-center mb-24 relative min-h-[400px]">
        <div className={`absolute inset-0 bg-gradient-to-r ${committee.color} opacity-20 rounded-full blur-3xl`}></div>
        <h3 className={`text-2xl md:text-4xl font-black mb-12 bg-gradient-to-r ${committee.color} bg-clip-text text-transparent uppercase tracking-widest relative z-10`}>
          {committee.name}
        </h3>
        <div className="relative flex justify-center items-center gap-8">
          {committee.people.map((person: Person, idx: number) => (
            <PersonCard
              key={idx}
              person={person}
              cardId={`${committee.name}-${idx}`}
              className="w-[160px] sm:w-[180px] md:w-[200px]"
              animationDelay={idx * 200}
              size="normal"
              isCommitteeCard={true}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center px-2 sm:px-4 py-4 sm:py-8">

      
      {/* Main "SABRANG'25" heading with cosmic styling - responsive */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
        SABRANG'25
      </h1>
      
      {/* Subtitle */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-white text-center">
        Names of Organising
      </h2>
      
      {/* Organizing Heads cards - responsive sizing */}
      <div className="flex overflow-hidden mb-12 sm:mb-16">
        {cards.map((person, index) => {
          console.log(`Rendering organizing head ${index}:`, person.name, 'Image path:', person.img);
          return (
            <PersonCard
              key={index}
              person={person}
              cardId={`organizing-head-${index}`}
              className={`w-[200px] sm:w-[250px] md:w-[300px] h-[380px] sm:h-[460px] md:h-[520px] overflow-hidden rounded-2xl shadow-2xl`}
              transformClass={index === 1 ? 'transform -translate-y-8 sm:-translate-y-12 md:-translate-y-15' : 'transform translate-y-8 sm:translate-y-12 md:translate-y-12'}
              isOH
            />
          );
        })}
      </div>
      
      {/* "Names of Core Committee Members" heading - responsive */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
        Names of Core Committee Members
      </h2>

      {/* Committee Layouts - Row-based */}
      <div className="w-full max-w-7xl px-2 sm:px-4 space-y-16 relative z-10">
        <div className="flex flex-col space-y-24">
          {committeeData.map((committee) => renderCommitteeLayout(committee))}
        </div>
      </div>

      {/* Expanded Card that appears on hover */}
      <ExpandedCard 
        hoveredPerson={hoveredPerson} 
        isHovered={isHovered} 
        cardPosition={cardPosition} 
        onClose={handleCloseExpandedCard} 
      />

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .growing-card {
          will-change: transform, left, top, width, height;
          backface-visibility: hidden;
          /* Simplified transforms for better performance */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        
        .growing-card.expanded {
          transform: translate(-50%, -50%) translateZ(0) !important;
        }
        

        
        /* Optimized transitions for better performance */
        .growing-card {
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Remove conflicting animations that might cause jank */
        .animate-in {
          animation: none !important;
        }
        
        /* Smooth backdrop animation */
        .backdrop-blur-sm {
          transition: backdrop-filter 0.2s ease-out;
        }
        
        /* Additional performance optimizations */
        .growing-card * {
          will-change: auto;
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
        
        /* Performance optimizations for shrinking animation */
        .growing-card:not(.expanded) {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
      `}</style>
    </div>
  );
}
