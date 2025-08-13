import React, { useState, useRef, useEffect } from "react";

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
    // Allow animation to complete before hiding
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleMouseEnter = () => {
    // Immediate expansion for smooth animation
    setIsExpanded(true);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        style={{ opacity: isExpanded ? 1 : 0.6 }}
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
          transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
            }, 300);
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
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Function to close the expanded card
  const handleCloseExpandedCard = () => {
    setIsHovered(false);
    setHoveredPerson(null);
  };

  // People array with detailed information for each person
  const people: Person[] = [
    { 
      img: "/images/OH_images_home/anni.jpeg", 
      bg: "bg-orange-500",
      name: "Aarav Sharma",
      role: "Lead Organizer",
      committee: "Organizing Heads",
      contact: "aarav.sharma@email.com",
      phone: "+91 98765 43210"
    },
    { 
      img: "/images/OH_images_home/chetesh.jpeg", 
      bg: "bg-green-500",
      name: "Zara Khan",
      role: "Event Coordinator",
      committee: "Organizing Heads",
      contact: "zara.khan@email.com",
      phone: "+91 98765 43211"
    },
    { 
      img: "/images/OH_images_home/diya.jpeg", 
      bg: "bg-blue-900",
      name: "Vikram Patel",
      role: "Technical Director",
      committee: "Organizing Heads",
      contact: "vikram.patel@email.com",
      phone: "+91 98765 43212"
    },
    { 
      img: "/images/OH_images_home/priya.jpeg", 
      bg: "bg-orange-300",
      name: "Priya Singh",
      role: "Discipline Head",
      committee: "Discipline",
      contact: "priya.singh@email.com",
      phone: "+91 98765 43213"
    },
    { 
      img: "/images/OH_images_home/rahul.jpeg", 
      bg: "bg-blue-900",
      name: "Rahul Verma",
      role: "Discipline Coordinator",
      committee: "Discipline",
      contact: "rahul.verma@email.com",
      phone: "+91 98765 43214"
    },
    { 
      img: "/images/OH_images_home/ananya.jpeg", 
      bg: "bg-red-500",
      name: "Ananya Das",
      role: "Design Lead",
      committee: "Design",
      contact: "ananya.das@email.com",
      phone: "+91 98765 43215"
    },
    { 
      img: "/images/OH_images_home/karan.jpeg", 
      bg: "bg-orange-500",
      name: "Karan Malhotra",
      role: "Decor Head",
      committee: "Decor",
      contact: "karan.malhotra@email.com",
      phone: "+91 98765 43216"
    },
    { 
      img: "/images/OH_images_home/sneha.jpeg", 
      bg: "bg-green-500",
      name: "Sneha Reddy",
      role: "Decor Coordinator",
      committee: "Decor",
      contact: "sneha.reddy@email.com",
      phone: "+91 98765 43217"
    },
    { 
      img: "/images/OH_images_home/arjun.jpeg", 
      bg: "bg-purple-500",
      name: "Arjun Kapoor",
      role: "Media Head",
      committee: "Media",
      contact: "arjun.kapoor@email.com",
      phone: "+91 98765 43218"
    },
    { 
      img: "/images/OH_images_home/meera.jpeg", 
      bg: "bg-pink-500",
      name: "Meera Iyer",
      role: "Report Lead",
      committee: "Report",
      contact: "meera.iyer@email.com",
      phone: "+91 98765 43219"
    },
    { 
      img: "/images/OH_images_home/aditya.jpeg", 
      bg: "bg-indigo-500",
      name: "Aditya Rao",
      role: "Photography Head",
      committee: "Photography",
      contact: "aditya.rao@email.com",
      phone: "+91 98765 43220"
    },
    { 
      img: "/images/OH_images_home/kavya.jpeg", 
      bg: "bg-teal-500",
      name: "Kavya Menon",
      role: "Photography Coordinator",
      committee: "Photography",
      contact: "kavya.menon@email.com",
      phone: "+91 98765 43221"
    },
    { 
      img: "/images/OH_images_home/rohan.jpeg", 
      bg: "bg-yellow-500",
      name: "Rohan Gupta",
      role: "Cultural Head",
      committee: "Cultural",
      contact: "rohan.gupta@email.com",
      phone: "+91 98765 43222"
    },
    { 
      img: "/images/OH_images_home/ishita.jpeg", 
      bg: "bg-cyan-500",
      name: "Ishita Sharma",
      role: "Cultural Coordinator",
      committee: "Cultural",
      contact: "ishita.sharma@email.com",
      phone: "+91 98765 43223"
    },
    { 
      img: "/images/OH_images_home/dev.jpeg", 
      bg: "bg-lime-500",
      name: "Dev Malhotra",
      role: "Hospitality Head",
      committee: "Hospitality",
      contact: "dev.malhotra@email.com",
      phone: "+91 98765 43224"
    },
    { 
      img: "/images/OH_images_home/tanvi.jpeg", 
      bg: "bg-amber-500",
      name: "Tanvi Singh",
      role: "Stage & Venue Head",
      committee: "Stage & Venue",
      contact: "tanvi.singh@email.com",
      phone: "+91 98765 43225"
    },
    { 
      img: "/images/OH_images_home/aryan.jpeg", 
      bg: "bg-emerald-500",
      name: "Aryan Kumar",
      role: "Stage & Venue Coordinator",
      committee: "Stage & Venue",
      contact: "aryan.kumar@email.com",
      phone: "+91 98765 43226"
    },
    { 
      img: "/images/OH_images_home/nisha.jpeg", 
      bg: "bg-violet-500",
      name: "Nisha Patel",
      role: "Registrations Head",
      committee: "Registrations",
      contact: "nisha.patel@email.com",
      phone: "+91 98765 43227"
    },
    { 
      img: "/images/OH_images_home/vedant.jpeg", 
      bg: "bg-rose-500",
      name: "Vedant Sharma",
      role: "Registrations Coordinator",
      committee: "Registrations",
      contact: "vedant.sharma@email.com",
      phone: "+91 98765 43228"
    },
    { 
      img: "/images/OH_images_home/riya.jpeg", 
      bg: "bg-sky-500",
      name: "Riya Khanna",
      role: "Tech & Support Head",
      committee: "Tech & Support",
      contact: "riya.khanna@email.com",
      phone: "+91 98765 43229"
    },
    { 
      img: "/images/OH_images_home/shaurya.jpeg", 
      bg: "bg-slate-500",
      name: "Shaurya Verma",
      role: "Internal Arrangements Head",
      committee: "Internal Arrangements",
      contact: "shaurya.verma@email.com",
      phone: "+91 98765 43230"
    },
    { 
      img: "/images/OH_images_home/aisha.jpeg", 
      bg: "bg-zinc-500",
      name: "Aisha Khan",
      role: "Internal Arrangements Coordinator",
      committee: "Internal Arrangements",
      contact: "aisha.khan@email.com",
      phone: "+91 98765 43231"
    },
    { 
      img: "/images/OH_images_home/dhruv.jpeg", 
      bg: "bg-neutral-500",
      name: "Dhruv Singh",
      role: "Transport Head",
      committee: "Transport",
      contact: "dhruv.singh@email.com",
      phone: "+91 98765 43232"
    },
    { 
      img: "/images/OH_images_home/kiara.jpeg", 
      bg: "bg-stone-500",
      name: "Kiara Reddy",
      role: "Social Media Head",
      committee: "Social Media",
      contact: "kiara.reddy@email.com",
      phone: "+91 98765 43233"
    },
    { 
      img: "/images/OH_images_home/yash.jpeg", 
      bg: "bg-gray-500",
      name: "Yash Malhotra",
      role: "Prize & Certificates Head",
      committee: "Prize & Certificates",
      contact: "yash.malhotra@email.com",
      phone: "+91 98765 43234"
    },
    { 
      img: "/images/OH_images_home/pooja.jpeg", 
      bg: "bg-red-600",
      name: "Pooja Iyer",
      role: "Committee Member",
      committee: "General",
      contact: "pooja.iyer@email.com",
      phone: "+91 98765 43235"
    },
    { 
      img: "/images/OH_images_home/aarush.jpeg", 
      bg: "bg-blue-600",
      name: "Aarush Kapoor",
      role: "Committee Member",
      committee: "General",
      contact: "aarush.kapoor@email.com",
      phone: "+91 98765 43236"
    },
    { 
      img: "/images/OH_images_home/zara.jpeg", 
      bg: "bg-green-600",
      name: "Zara Malhotra",
      role: "Committee Member",
      committee: "General",
      contact: "zara.malhotra@email.com",
      phone: "+91 98765 43237"
    },
    { 
      img: "/images/OH_images_home/vivaan.jpeg", 
      bg: "bg-purple-600",
      name: "Vivaan Sharma",
      role: "Committee Member",
      committee: "General",
      contact: "vivaan.sharma@email.com",
      phone: "+91 98765 43238"
    },
    { 
      img: "/images/OH_images_home/anvi.jpeg", 
      bg: "bg-pink-600",
      name: "Anvi Patel",
      role: "Committee Member",
      committee: "General",
      contact: "anvi.patel@email.com",
      phone: "+91 98765 43239"
    }
  ];

  // Committee definitions with name and number of cards required
  const committees = [
    { name: "Discipline", cards: 2 },           // Uses person4, person5
    { name: "Design", cards: 1 },               // Uses person6
    { name: "Decor", cards: 2 },                // Uses person7, person8
    { name: "Media", cards: 1 },                // Uses person9
    { name: "Report", cards: 1 },               // Uses person10
    { name: "Photography", cards: 2 },          // Uses person11, person12
    { name: "Cultural", cards: 2 },             // Uses person13, person14
    { name: "Hospitality", cards: 1 },          // Uses person15
    { name: "Stage & Venue", cards: 2 },        // Uses person16, person17
    { name: "Registrations", cards: 2 },        // Uses person18, person19
    { name: "Tech & Support", cards: 1 },       // Uses person20
    { name: "Internal Arrangements", cards: 2 }, // Uses person21, person22
    { name: "Transport", cards: 1 },            // Uses person23
    { name: "Social Media", cards: 1 },         // Uses person24
    { name: "Prize & Certificates", cards: 1 }  // Uses person25
  ];

  // Organizing Heads section - uses first 3 people
  const totalCards = 3;
  const cards = Array.from({ length: totalCards }, (_, i) => people[i % people.length]);

  // Separate committees by card count for better mobile layout
  const doubleCardCommittees = committees.filter(c => c.cards === 2);
  const singleCardCommittees = committees.filter(c => c.cards === 1);
  
  // Special layout: 3 single cards beside Internal Arrangements
  const specialSingleCards = singleCardCommittees.filter(c => 
    ['Design', 'Media', 'Report'].includes(c.name)
  );
  const remainingSingleCards = singleCardCommittees.filter(c => 
    !['Design', 'Media', 'Report'].includes(c.name)
  );

  // Person Card Component with Hover to Expand
  const PersonCard = ({ person, className = "", transformClass = "", cardId }: { person: Person; className?: string; transformClass?: string; cardId: string }) => {
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

    return (
      <div
        ref={(el) => {
          cardRefs.current[cardId] = el;
        }}
        className={`relative ${className} ${transformClass} cursor-pointer transition-all duration-500 ease-out group hover:scale-105 hover:z-10`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)'
        }}
      >
        <img
          src={person.img}
          alt={person.name}
          className="absolute bottom-0 left-0 w-full h-2/3 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          onError={(e) => {
            console.log('Image failed to load:', person.img);
            // Fallback to a colored background if image fails
            e.currentTarget.style.display = 'none';
          }}
        />
        
        {/* Fallback colored background if image fails */}
        <div className={`absolute bottom-0 left-0 w-full h-2/3 ${person.bg} transition-transform duration-500 ease-out group-hover:scale-110`} />
        
        {/* Card Label */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-center transition-all duration-500 ease-out group-hover:bg-black/80">
          <p className="text-xs font-semibold group-hover:text-sm transition-all duration-500 ease-out">{person.name}</p>
        </div>
        
        {/* Hover overlay indicator */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-lg" />
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-2 sm:px-4 py-4 sm:py-8">
      {/* Debug info */}
      <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded z-50 text-xs">
        Debug: Hovered: {isHovered ? 'Yes' : 'No'} | Person: {hoveredPerson?.name || 'None'}
      </div>
      
      {/* Main "Organizing Heads" heading with cosmic styling - responsive */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
        Organizing Heads
      </h1>
      
      {/* Organizing Heads cards - responsive sizing */}
      <div className="flex overflow-hidden mb-12 sm:mb-16">
        {cards.map((person, index) => (
          <PersonCard
            key={index}
            person={person}
            cardId={`organizing-head-${index}`}
            className={`w-[120px] sm:w-[150px] md:w-[180px] overflow-hidden aspect-[1/2.5] ${person.bg}`}
            transformClass={index === 1 ? 'transform -translate-y-8 sm:-translate-y-12 md:-translate-y-15' : 'transform translate-y-8 sm:translate-y-12 md:translate-y-12'}
          />
        ))}
      </div>
      
      {/* "Committee Cores" heading - responsive */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl tracking-widest uppercase" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
        Committee Cores
      </h2>

      {/* Committee grid - responsive layout with double-card committees first */}
      <div className="w-full max-w-6xl px-2 sm:px-4 space-y-8">
        {/* Double card committees with special single cards beside Internal Arrangements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {doubleCardCommittees.map((committee, committeeIndex) => {
            const originalIndex = committees.findIndex(c => c.name === committee.name);
            
            // Special case for Internal Arrangements - add 3 single cards beside it
            if (committee.name === "Internal Arrangements") {
              return (
                <div key={committeeIndex} className="col-span-1 sm:col-span-2 md:col-span-3">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-8">
                    {/* Internal Arrangements on the left */}
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide text-center" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
                        {committee.name}
                      </h3>
                      
                      {/* Internal Arrangements cards with V-shape */}
                      <div className="flex overflow-hidden">
                        {Array.from({ length: committee.cards }, (_, cardIndex) => {
                          const personIndex = originalIndex * 3 + cardIndex;
                          const person = people[personIndex % people.length];
                          return (
                            <PersonCard
                              key={cardIndex}
                              person={person}
                              cardId={`${committee.name}-${cardIndex}`}
                              className={`w-[120px] sm:w-[130px] md:w-[150px] overflow-hidden aspect-[1/2.5] ${person.bg}`}
                              transformClass={cardIndex === 1 ? 'transform -translate-y-6 sm:-translate-y-8' : 'transform translate-y-6 sm:translate-y-8'}
                            />
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* 3 single cards beside Internal Arrangements */}
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                      {specialSingleCards.map((singleCommittee, singleIndex) => {
                        const singleOriginalIndex = committees.findIndex(c => c.name === singleCommittee.name);
                        return (
                          <div key={singleIndex} className="flex flex-col items-center">
                            <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide text-center" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
                              {singleCommittee.name}
                            </h4>
                            <div className="flex overflow-hidden">
                              {Array.from({ length: singleCommittee.cards }, (_, cardIndex) => {
                                const personIndex = singleOriginalIndex * 3 + cardIndex;
                                const person = people[personIndex % people.length];
                                return (
                                  <PersonCard
                                    key={cardIndex}
                                    person={person}
                                    cardId={`${singleCommittee.name}-${cardIndex}`}
                                    className={`w-[110px] sm:w-[120px] md:w-[130px] overflow-hidden aspect-[1/2.5] ${person.bg}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            
            // Regular double card committees
            return (
              <div key={committeeIndex} className="flex flex-col items-center">
                {/* Committee subheading - responsive size */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide text-center" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
                  {committee.name}
                </h3>
                
                {/* Double committee cards with V-shape */}
                <div className="flex overflow-hidden">
                  {Array.from({ length: committee.cards }, (_, cardIndex) => {
                    const personIndex = originalIndex * 3 + cardIndex;
                    const person = people[personIndex % people.length];
                    return (
                      <PersonCard
                        key={cardIndex}
                        person={person}
                        cardId={`${committee.name}-${cardIndex}`}
                        className={`w-[120px] sm:w-[130px] md:w-[150px] overflow-hidden aspect-[1/2.5] ${person.bg}`}
                        transformClass={cardIndex === 1 ? 'transform -translate-y-6 sm:-translate-y-8' : 'transform translate-y-6 sm:translate-y-8'}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Remaining single card committees - max 4 per row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {remainingSingleCards.map((committee, committeeIndex) => {
            const originalIndex = committees.findIndex(c => c.name === committee.name);
            return (
              <div key={committeeIndex} className="flex flex-col items-center">
                {/* Committee subheading - responsive size */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide text-center" style={{ fontFamily: 'Impact, Charcoal, sans-serif' }}>
                  {committee.name}
                </h3>
                
                {/* Single committee card - matching double card width */}
                <div className="flex overflow-hidden">
                  {Array.from({ length: committee.cards }, (_, cardIndex) => {
                    const personIndex = originalIndex * 3 + cardIndex;
                    const person = people[personIndex % people.length];
                    return (
                      <PersonCard
                        key={cardIndex}
                        person={person}
                        cardId={`${committee.name}-${cardIndex}`}
                        className={`w-[120px] sm:w-[130px] md:w-[150px] overflow-hidden aspect-[1/2.5] ${person.bg}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
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
          perspective: 1000px;
          transform-style: preserve-3d;
          /* Hardware acceleration */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          /* Smooth transitions */
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .growing-card.expanded {
          transform: translate(-50%, -50%) translateZ(0) !important;
        }
        
        /* Enhanced hover effects for cards */
        .group:hover {
          animation: pulse 2s ease-in-out infinite;
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition-property: transform, opacity, background-color, box-shadow;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Remove conflicting animations that might cause jank */
        .animate-in {
          animation: none !important;
        }
        
        /* Optimize transforms for better performance */
        .growing-card {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        
        /* Smooth backdrop animation */
        .backdrop-blur-sm {
          transition: backdrop-filter 0.3s ease-out;
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
      `}</style>
    </div>
  );
}
