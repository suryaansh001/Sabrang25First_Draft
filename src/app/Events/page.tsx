'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Users, Star, Filter, Crown, Check, Share2 } from 'lucide-react';
import SidebarDock from '../../../components/SidebarDock';
import Logo from '../../../components/Logo';
import Footer from '../../../components/Footer';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  shares: string;
  image: string;
  description: string;
  venue: string;
  price: string;
  capacity: string;
  genre: string;
  category: string;
  details: string;
  isFlagship: boolean;
}

const events: Event[] = [
  // Cultural Events (First 3 are Flagship)
  {
    id: 1,
    title: "PANACHE",
    date: "25.12.2024",
    time: "21:00",
    shares: "156 Shares",
    image: "/images/Events/Cultural/Panache.jpg",
    description: "Experience the most glamorous fashion showcase of the year featuring emerging designers and stunning runway presentations.",
    venue: "Main Auditorium",
    price: "₹85",
    capacity: "2,500 people",
    genre: "Fashion Show",
    category: "Cultural",
    details: "Join us for an unforgettable evening featuring the latest trends in fashion, exclusive designer collections, and celebrity appearances. The event includes runway shows, designer meet & greets, and exclusive merchandise opportunities.",
    isFlagship: true
  },
  {
    id: 2,
    title: "BAND JAM",
    date: "15.1.2025",
    time: "19:30",
    shares: "567 Shares",
    image: "/images/Events/Cultural/BandJam.jpg",
    description: "The biggest musical festival featuring college bands competing for the ultimate prize and recognition.",
    venue: "Open Air Amphitheater",
    price: "₹120",
    capacity: "50,000 people",
    genre: "Music Festival",
    category: "Cultural",
    details: "Three stages of non-stop music featuring college bands from across the country. VIP packages available with backstage access and exclusive merchandise.",
    isFlagship: true
  },
  {
    id: 3,
    title: "DANCE BATTLE",
    date: "20.3.2025",
    time: "18:00",
    shares: "189 Shares",
    image: "/images/Events/Cultural/DanceBattle.jpg",
    description: "Witness epic dance battles as talented dancers showcase their skills in intense competition.",
    venue: "Dance Studio",
    price: "₹15",
    capacity: "1,000 people",
    genre: "Dance Competition",
    category: "Cultural",
    details: "Experience the thrill of dance battles as teams compete with their choreographed routines. Features multiple dance styles and special awards for innovation.",
    isFlagship: true
  },
  {
    id: 4,
    title: "NUKKAD NATAK",
    date: "12.4.2025",
    time: "19:00",
    shares: "78 Shares",
    image: "/images/Events/Cultural/Nukkad Natak.jpg",
    description: "Street theater performances that bring social issues to life through powerful storytelling.",
    venue: "Open Air Stage",
    price: "Free",
    capacity: "800 people",
    genre: "Street Theater",
    category: "Cultural",
    details: "A night of cultural expression featuring street plays, folk performances, and social commentary through theater.",
    isFlagship: false
  },
  {
    id: 5,
    title: "SPOTLIGHT",
    date: "28.4.2025",
    time: "16:00",
    shares: "45 Shares",
    image: "/images/Events/Cultural/spotlight.jpg",
    description: "Individual performance showcase for solo artists and performers.",
    venue: "Performance Hall",
    price: "Free",
    capacity: "300 people",
    genre: "Solo Performance",
    category: "Cultural",
    details: "Showcase your individual talent in music, dance, or any performing art form.",
    isFlagship: false
  },
  {
    id: 6,
    title: "SINGING PALOOZA",
    date: "05.5.2025",
    time: "08:00",
    shares: "123 Shares",
    image: "/images/Events/Cultural/Singing.jpg",
    description: "Singing competition for vocal talents across all genres.",
    venue: "Music Hall",
    price: "Free",
    capacity: "2,000 people",
    genre: "Singing Competition",
    category: "Cultural",
    details: "Competitive singing events including classical, contemporary, and fusion music. Medals and trophies for winners.",
    isFlagship: false
  },
  {
    id: 7,
    title: "STEP UP",
    date: "15.6.2025",
    time: "18:00",
    shares: "92 Shares",
    image: "/images/Events/Cultural/step-up.jpg",
    description: "Dance competition focusing on individual and group performances.",
    venue: "Dance Studio",
    price: "Free",
    capacity: "300 people",
    genre: "Dance",
    category: "Cultural",
    details: "Showcase your dance skills in various styles including contemporary, hip-hop, and classical forms.",
    isFlagship: false
  },
  {
    id: 8,
    title: "DUMB SHOW",
    date: "25.6.2025",
    time: "19:00",
    shares: "67 Shares",
    image: "/images/Events/Cultural/Dumb Show.jpg",
    description: "Silent acting competition where performers tell stories without words.",
    venue: "Theater Hall",
    price: "Free",
    capacity: "200 people",
    genre: "Mime Acting",
    category: "Cultural",
    details: "Express emotions and tell stories through body language and facial expressions only.",
    isFlagship: false
  },

  // Management Events
  {
    id: 9,
    title: "BIDDING BEFORE WICKET",
    date: "10.2.2025",
    time: "20:00",
    shares: "234 Shares",
    image: "/images/Events/Management/BiddingBeforeWicket.png",
    description: "Auction-based event where participants bid on various items and experiences.",
    venue: "Business School Auditorium",
    price: "₹25",
    capacity: "200 people",
    genre: "Auction",
    category: "Management",
    details: "Experience the thrill of bidding in a competitive auction environment. Features unique items and experiences up for grabs.",
    isFlagship: false
  },
  {
    id: 10,
    title: "SEAL THE DEAL",
    date: "20.2.2025",
    time: "18:00",
    shares: "189 Shares",
    image: "/images/Events/Management/SealTheDeal.png",
    description: "Negotiation and deal-making competition for business-minded students.",
    venue: "Conference Room",
    price: "₹15",
    capacity: "150 people",
    genre: "Negotiation",
    category: "Management",
    details: "Test your negotiation skills in real-world business scenarios and compete for the best deal.",
    isFlagship: false
  },

  // Technical Events
  {
    id: 11,
    title: "RADIANT",
    date: "05.3.2025",
    time: "14:00",
    shares: "156 Shares",
    image: "/images/Events/Technical/Radiant.jpg",
    description: "Gaming tournament featuring popular competitive games.",
    venue: "Gaming Arena",
    price: "₹30",
    capacity: "500 people",
    genre: "Gaming",
    category: "Technical",
    details: "Compete in various gaming tournaments with exciting prizes and recognition.",
    isFlagship: false
  },
  {
    id: 12,
    title: "CODEUREKA",
    date: "15.3.2025",
    time: "16:00",
    shares: "89 Shares",
    image: "/images/Events/Technical/Codeureka.jpg",
    description: "Coding competition for programmers and developers.",
    venue: "Computer Lab",
    price: "Free",
    capacity: "300 people",
    genre: "Coding",
    category: "Technical",
    details: "Solve complex programming challenges and compete with fellow coders.",
    isFlagship: false
  },
  {
    id: 13,
    title: "SYNERGY",
    date: "25.3.2025",
    time: "18:00",
    shares: "123 Shares",
    image: "/images/Events/Technical/Synergy.jpg",
    description: "DJ mixing and music production competition.",
    venue: "Music Studio",
    price: "₹20",
    capacity: "200 people",
    genre: "Music Production",
    category: "Technical",
    details: "Showcase your DJ skills and music production abilities in this exciting competition.",
    isFlagship: false
  },
  {
    id: 14,
    title: "FOCUS",
    date: "05.4.2025",
    time: "14:00",
    shares: "78 Shares",
    image: "/images/Events/Technical/Focus.jpg",
    description: "Photography competition focusing on creative and technical skills.",
    venue: "Photo Studio",
    price: "Free",
    capacity: "150 people",
    genre: "Photography",
    category: "Technical",
    details: "Capture stunning moments and showcase your photography skills in various categories.",
    isFlagship: false
  },
  {
    id: 15,
    title: "MAKE A MEME",
    date: "15.4.2025",
    time: "16:00",
    shares: "92 Shares",
    image: "/images/Events/Technical/MakeAMeme.jpg",
    description: "Creative meme-making competition for digital artists.",
    venue: "Digital Lab",
    price: "Free",
    capacity: "100 people",
    genre: "Digital Art",
    category: "Technical",
    details: "Create hilarious and creative memes in this fun digital art competition.",
    isFlagship: false
  },
  {
    id: 16,
    title: "UNKNOWN BATTLEGROUND",
    date: "25.4.2025",
    time: "18:00",
    shares: "134 Shares",
    image: "/images/Events/Technical/Battleground.jpg",
    description: "PUBG tournament for gaming enthusiasts.",
    venue: "Gaming Arena",
    price: "₹25",
    capacity: "400 people",
    genre: "Battle Royale",
    category: "Technical",
    details: "Compete in intense PUBG battles with your squad for exciting prizes.",
    isFlagship: false
  },

  // Design Events
  {
    id: 17,
    title: "MINDSCAPE",
    date: "05.5.2025",
    time: "14:00",
    shares: "123 Shares",
    image: "/images/Events/Design/MINDSCAPE.jpg",
    description: "Art and drawing competition for creative minds.",
    venue: "Art Studio",
    price: "₹30",
    capacity: "150 people",
    genre: "Drawing",
    category: "Design",
    details: "Express your creativity through various art forms and compete with fellow artists.",
    isFlagship: false
  },
  {
    id: 18,
    title: "COLOR & CONTOUR",
    date: "15.5.2025",
    time: "16:00",
    shares: "89 Shares",
    image: "/images/Events/Design/COLOR&CONTOUR.jpg",
    description: "Makeup and face painting competition.",
    venue: "Beauty Studio",
    price: "₹20",
    capacity: "100 people",
    genre: "Makeup Art",
    category: "Design",
    details: "Showcase your makeup and face painting skills in this creative competition.",
    isFlagship: false
  },
  {
    id: 19,
    title: "E-TEE",
    date: "25.5.2025",
    time: "18:00",
    shares: "67 Shares",
    image: "/images/Events/Design/E-TEE.jpg",
    description: "Digital art and illustration competition.",
    venue: "Digital Studio",
    price: "Free",
    capacity: "120 people",
    genre: "Digital Art",
    category: "Design",
    details: "Create stunning digital illustrations using tablets and digital tools.",
    isFlagship: false
  },
  {
    id: 20,
    title: "CHAMELEON CANVAS",
    date: "05.6.2025",
    time: "14:00",
    shares: "78 Shares",
    image: "/images/Events/Design/CHAMELON_CANVAS.jpg",
    description: "Painting competition with various mediums.",
    venue: "Art Studio",
    price: "₹25",
    capacity: "100 people",
    genre: "Painting",
    category: "Design",
    details: "Express yourself through various painting techniques and mediums.",
    isFlagship: false
  },
  {
    id: 21,
    title: "RECREATION",
    date: "15.6.2025",
    time: "16:00",
    shares: "92 Shares",
    image: "/images/Events/Design/RECREATION.jpg",
    description: "Recycled art and sculpture competition.",
    venue: "Art Workshop",
    price: "Free",
    capacity: "80 people",
    genre: "Recycled Art",
    category: "Design",
    details: "Create amazing art pieces using recycled materials and sustainable practices.",
    isFlagship: false
  },
  {
    id: 22,
    title: "FRAME BY FRAME",
    date: "25.6.2025",
    time: "18:00",
    shares: "67 Shares",
    image: "/images/Events/Design/FRAMEBYFRAME.jpg",
    description: "Photography and videography competition.",
    venue: "Media Studio",
    price: "₹20",
    capacity: "100 people",
    genre: "Media Arts",
    category: "Design",
    details: "Capture stunning moments and create compelling visual stories.",
    isFlagship: false
  },

  // Literary Events
  {
    id: 23,
    title: "DIALECTIC",
    date: "05.7.2025",
    time: "14:00",
    shares: "89 Shares",
    image: "/images/Events/literary/dialectic.jpg",
    description: "Debate and public speaking competition.",
    venue: "Debate Hall",
    price: "Free",
    capacity: "200 people",
    genre: "Debate",
    category: "Literary",
    details: "Engage in intellectual debates on current topics and showcase your public speaking skills.",
    isFlagship: false
  },
  {
    id: 24,
    title: "COURTROOM",
    date: "15.7.2025",
    time: "16:00",
    shares: "123 Shares",
    image: "/images/Events/literary/courtroom.jpg",
    description: "Mock trial and legal debate competition.",
    venue: "Courtroom",
    price: "₹25",
    capacity: "150 people",
    genre: "Mock Trial",
    category: "Literary",
    details: "Experience the legal system through mock trials and courtroom debates.",
    isFlagship: false
  },

  // Mini Events
  {
    id: 25,
    title: "HOUSE FULL",
    date: "05.8.2025",
    time: "14:00",
    shares: "78 Shares",
    image: "/images/Events/minievent/HouseFull.jpg",
    description: "Bingo (Housie) game with exciting prizes.",
    venue: "Game Room",
    price: "Free",
    capacity: "100 people",
    genre: "Bingo",
    category: "Mini Event",
    details: "Play the classic game of Bingo with friends and win exciting prizes.",
    isFlagship: false
  },
  {
    id: 26,
    title: "Q FACTOR",
    date: "15.8.2025",
    time: "16:00",
    shares: "92 Shares",
    image: "/images/Events/minievent/QFACTOR.jpg",
    description: "Trivia night with general knowledge questions.",
    venue: "Quiz Hall",
    price: "Free",
    capacity: "120 people",
    genre: "Quiz",
    category: "Mini Event",
    details: "Test your general knowledge in this exciting trivia competition.",
    isFlagship: false
  },
  {
    id: 27,
    title: "METAPHOR",
    date: "25.8.2025",
    time: "18:00",
    shares: "67 Shares",
    image: "/images/Events/minievent/METaphor.jpg",
    description: "Creative writing and poetry competition.",
    venue: "Literature Hall",
    price: "Free",
    capacity: "80 people",
    genre: "Creative Writing",
    category: "Mini Event",
    details: "Express yourself through creative writing and poetry in this intimate competition.",
    isFlagship: false
  },
  {
    id: 28,
    title: "DARE AND CHAIR",
    date: "05.9.2025",
    time: "14:00",
    shares: "89 Shares",
    image: "/images/Events/minievent/DAREANDCHAIR.jpg",
    description: "Fun challenges and dares with friends.",
    venue: "Activity Room",
    price: "Free",
    capacity: "60 people",
    genre: "Fun Games",
    category: "Mini Event",
    details: "Take on exciting challenges and dares in this fun-filled event.",
    isFlagship: false
  }
];

const categories = [
  { name: "All", value: "all" },
  { name: "Cultural", value: "Cultural" },
  { name: "Management", value: "Management" },
  { name: "Technical", value: "Technical" },
  { name: "Design", value: "Design" },
  { name: "Literary", value: "Literary" },
  { name: "Mini Event", value: "Mini Event" }
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFlagshipOnly, setShowFlagshipOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const handleCardClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleClose = () => {
    setSelectedEvent(null);
  };
  

  const handleShare = async () => {
    if (!selectedEvent) return;
    
    try {
      // Create a shareable URL for the event
      const eventUrl = `${window.location.origin}/Events?event=${selectedEvent.id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(eventUrl);
      
      // Show success message
      setShowCopyMessage(true);
      
      // Hide message after 2 seconds
      setTimeout(() => {
        setShowCopyMessage(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/Events?event=${selectedEvent.id}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowCopyMessage(true);
      setTimeout(() => {
        setShowCopyMessage(false);
      }, 2000);
    }
  };

  // Filter events based on category and flagship toggle
  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === "all" || event.category === selectedCategory;
    const flagshipMatch = !showFlagshipOnly || event.isFlagship;
    return categoryMatch && flagshipMatch;
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/eventpage.webp)'
        }}
      />
      
      {/* Black Overlay */}
      <div className="fixed inset-0 -z-10 bg-black/50" />
      <Logo />
      <SidebarDock />
      
      {/* Flagship Events Toggle - Absolute top right */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-6 right-6 z-50"
      >
        <div className="relative">
          {/* Main toggle container */}
          <div 
            onClick={() => setShowFlagshipOnly(!showFlagshipOnly)}
            className="cursor-pointer group"
          >
            {/* Background card */}
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl">
              {/* Icon and text container */}
              <div className="flex items-center space-x-3">
                {/* Crown icon with animation */}
                <div className="relative">
                  <Crown className={`w-6 h-6 ${showFlagshipOnly ? 'text-yellow-400' : 'text-gray-400'} transition-colors duration-300`} />
                  {showFlagshipOnly && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                    />
                  )}
                </div>
                
                {/* Text content */}
                <div className="text-white">
                  <div className="text-sm font-semibold">
                    {showFlagshipOnly ? 'All Events' : 'Flagship Only'}
                  </div>
                  <div className="text-xs text-gray-300">
                    {showFlagshipOnly ? 'View all events' : 'Premium events only'}
                  </div>
                </div>
                
                {/* Toggle indicator */}
                <div className={`w-8 h-4 rounded-full transition-all duration-300 ${
                  showFlagshipOnly ? 'bg-yellow-400' : 'bg-gray-600'
                }`}>
                  <motion.div
                    animate={{ x: showFlagshipOnly ? 16 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </div>
              </div>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedEvent ? (
          <motion.main
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="px-6 py-12"
          >
            <div className="max-w-7xl mx-auto">
              {/* Title Section */}
              <div className="mb-16 text-center">
                <motion.h1 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-6xl md:text-8xl font-bold text-white mb-4"
                >
                  SABRANG 2025
                </motion.h1>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100px" }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-1 bg-gradient-to-r from-pink-400 to-purple-400 mb-8 mx-auto"
                />
                <motion.p 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-gray-300 text-lg max-w-md mx-auto"
                >
                  It is a long established fact that a reader will be distracted by
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="mt-6 px-6 py-3 border border-white text-white hover:bg-white hover:text-purple-900 transition-all duration-300 rounded"
                >
                  TIMETABLE
                </motion.button>
              </div>

              {/* Category Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mb-12"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
                    <Filter className="w-6 h-6 mr-2" />
                    Filter by Category
                  </h3>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {categories.map((category) => (
                    <motion.button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category.value
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => {
                  console.log(`Rendering event: ${event.title}, Image path: ${event.image}`);
                  return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => handleCardClick(event)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 relative">
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {event.category}
                        </div>
                      </div>
                      
                      {/* Flagship Event Badge */}
                      {event.isFlagship && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            ⭐ FLAGSHIP
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced border for flagship events */}
                      {event.isFlagship && (
                        <div className="absolute inset-0 rounded-lg border-2 border-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      )}
                      
                      <div className="relative h-64">
                        {/* Event Image */}
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-contain bg-gray-800 p-2"
                          onError={(e) => {
                            console.error(`Failed to load image: ${event.image}`);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = document.getElementById(`fallback-${event.id}`);
                            if (fallback) fallback.style.display = 'block';
                          }}
                          onLoad={() => console.log(`Successfully loaded image: ${event.image}`)}
                        />
                        {/* Fallback gradient background */}
                        <div className={`absolute inset-0 ${event.isFlagship ? 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`} style={{ display: 'none' }} id={`fallback-${event.id}`}>
                          <div className="absolute inset-0 bg-black/20" />
                        </div>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white text-sm opacity-80 mb-2">
                            {event.date} / {event.shares}
                          </p>
                          <h3 className="text-white font-semibold text-lg leading-tight">
                            {event.title}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between text-gray-300 text-sm mb-2">
                          <span>{event.time}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            event.isFlagship 
                              ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30' 
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {event.genre}
                          </span>
                        </div>
                        {/* Flagship event indicator */}
                        {event.isFlagship && (
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-yellow-400 text-xs font-bold">🎯 PREMIUM EVENT</span>
                            <span className="text-yellow-400 text-xs">•</span>
                            <span className="text-yellow-400 text-xs font-medium">High Priority</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
                })}
              </div>
            </div>
          </motion.main>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 z-50 overflow-hidden"
          >
            <div className="flex h-full">
              {/* Left Side - Event Card */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-1/2 p-8 flex items-center justify-center"
              >
                <div className="w-full max-w-md">
                  <motion.div
                    layoutId={`card-${selectedEvent.id}`}
                    className={`${selectedEvent.isFlagship ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-yellow-500/50' : 'bg-black/40'} backdrop-blur-sm rounded-lg overflow-hidden border border-white/20`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {/* Flagship Badge in Modal */}
                    {selectedEvent.isFlagship && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                          ⭐ FLAGSHIP EVENT
                        </div>
                      </div>
                    )}
                    
                    <div className="relative h-80">
                      {/* Event Image in Modal */}
                                              <img 
                          src={selectedEvent.image} 
                          alt={selectedEvent.title}
                          className="w-full h-full object-contain bg-gray-800 p-3"
                          onError={(e) => {
                            console.error(`Failed to load modal image: ${selectedEvent.image}`);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = document.getElementById(`modal-fallback-${selectedEvent.id}`);
                            if (fallback) fallback.style.display = 'block';
                          }}
                          onLoad={() => console.log(`Successfully loaded modal image: ${selectedEvent.image}`)}
                        />
                                                                      {/* Fallback gradient background for modal */}
                        <div className={`absolute inset-0 ${selectedEvent.isFlagship ? 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`} style={{ display: 'none' }} id={`modal-fallback-${selectedEvent.id}`}>
                          <div className="absolute inset-0 bg-black/20" />
                        </div>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm opacity-80 mb-2">
                          {selectedEvent.date} / {selectedEvent.shares}
                        </p>
                        <h3 className="text-white font-semibold text-xl leading-tight">
                          {selectedEvent.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-300">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{selectedEvent.time}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{selectedEvent.venue}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{selectedEvent.capacity}</span>
                        </div>
                        {/* Flagship Event Priority */}
                        {selectedEvent.isFlagship && (
                          <div className="flex items-center text-yellow-400 font-medium">
                            <span className="mr-2">🎯</span>
                            <span>High Priority Event</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Side - Event Details */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="w-1/2 p-8 overflow-y-auto"
              >
                <div className="max-w-lg">
                  {/* Close Button */}
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleClose}
                    className="absolute top-8 right-8 w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/20"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>

                  {/* Event Details Content */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="mb-6">
                      <span className="inline-block px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm mb-4">
                        {selectedEvent.genre}
                      </span>
                      <h2 className="text-4xl font-bold text-white mb-4">
                        {selectedEvent.title}
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        {selectedEvent.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Event Details</h3>
                        {/* Flagship Event Info */}
                        {selectedEvent.isFlagship && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-center space-x-2 text-yellow-300">
                              <span className="text-lg">⭐</span>
                              <span className="font-semibold">This is a Flagship Event</span>
                            </div>
                            <p className="text-yellow-200 text-sm mt-1">
                              Flagship events are our most prestigious and high-priority events featuring top-tier content and exclusive experiences.
                            </p>
                          </div>
                        )}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-white/10">
                            <span className="text-gray-300">Date & Time</span>
                            <span className="text-white">{selectedEvent.date} at {selectedEvent.time}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/10">
                            <span className="text-gray-300">Venue</span>
                            <span className="text-white">{selectedEvent.venue}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/10">
                            <span className="text-gray-300">Price</span>
                            <span className="text-white font-semibold">{selectedEvent.price}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/10">
                            <span className="text-gray-300">Capacity</span>
                            <span className="text-white">{selectedEvent.capacity}</span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-white/10">
                            <span className="text-gray-300">Event Type</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              selectedEvent.isFlagship 
                                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30' 
                                : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {selectedEvent.isFlagship ? '⭐ Flagship' : 'Regular Event'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">About This Event</h3>
                        <p className="text-gray-300 leading-relaxed">
                          {selectedEvent.details}
                        </p>
                      </div>

                      <div className="flex space-x-4 pt-6">
                        <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                          BUY TICKETS
                        </button>
                        <button 
                          onClick={handleShare}
                          className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>SHARE</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Copy Success Message */}
            <AnimatePresence>
              {showCopyMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-60"
                >
                  <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">Link copied to clipboard!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Footer properly positioned at bottom */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}