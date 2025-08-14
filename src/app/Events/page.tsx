'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Users, Star, Filter, Crown } from 'lucide-react';
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
  {
    id: 1,
    title: "Panache - Fashion Show",
    date: "25.12.2024",
    time: "21:00",
    shares: "156 Shares",
    image: "/images/building-6011756_1280.jpg",
    description: "Experience the most glamorous fashion showcase of the year featuring emerging designers and stunning runway presentations.",
    venue: "Main Auditorium",
    price: "$85",
    capacity: "2,500 people",
    genre: "Fashion Show",
    category: "Cultural",
    details: "Join us for an unforgettable evening featuring the latest trends in fashion, exclusive designer collections, and celebrity appearances. The event includes runway shows, designer meet & greets, and exclusive merchandise opportunities.",
    isFlagship: true
  },
  {
    id: 2,
    title: "Hackathon - Code & Create",
    date: "15.1.2025",
    time: "19:30",
    shares: "89 Shares",
    image: "/images/building-6011756_1280.jpg",
    description: "24-hour coding challenge where developers compete to create innovative solutions for real-world problems.",
    venue: "Computer Science Lab",
    price: "Free",
    capacity: "500 people",
    genre: "Tech Competition",
    category: "Technical",
    details: "Learn about the latest developments in technology and software development. Network with fellow developers and industry professionals. Prizes worth $10,000+ for winning teams.",
    isFlagship: true
  },
  {
    id: 3,
    title: "Business Plan Competition",
    date: "10.2.2025",
    time: "20:00",
    shares: "234 Shares",
    image: "/images/building-6011756_1280.jpg",
    description: "Pitch your innovative business ideas to a panel of industry experts and investors.",
    venue: "Business School Auditorium",
    price: "$25",
    capacity: "200 people",
    genre: "Business",
    category: "Business",
    details: "Discover the next generation of entrepreneurs and business leaders. This event features multiple rounds of pitching, mentorship sessions, and networking opportunities with investors.",
    isFlagship: true
  },
  {
    id: 4,
    title: "Band Jam - Musical Extravaganza",
    date: "05.3.2025",
    time: "22:00",
    shares: "567 Shares",
    image: "/images/building-6011756_1280.jpg",
    description: "The biggest musical festival featuring college bands competing for the ultimate prize and recognition.",
    venue: "Open Air Amphitheater",
    price: "$120",
    capacity: "50,000 people",
    genre: "Music Festival",
    category: "Cultural",
    details: "Three stages of non-stop music featuring college bands from across the country. VIP packages available with backstage access and exclusive merchandise.",
    isFlagship: true
  },
  {
    id: 5,
    title: "Robo Wars - Battle of Bots",
    date: "20.3.2025",
    time: "18:00",
    shares: "189 Shares",
    image: "/images/building-6011756_1280.jpg",
    description: "Witness epic robot battles as engineering students showcase their mechanical creations in intense combat.",
    venue: "Engineering Workshop",
    price: "$15",
    capacity: "1,000 people",
    genre: "Robotics",
    category: "Technical",
    details: "Experience the thrill of robot combat as teams battle it out with their custom-built machines. Features multiple weight categories and special awards for innovation.",
    isFlagship: true
  },
  {
    id: 6,
    title: "Cultural Night",
    date: "12.4.2025",
    time: "19:00",
    shares: "78 Shares",
    image: "/images/building-6011756_1280.jpg",
    description: "Celebrate diversity through dance, music, and cultural performances from around the world.",
    venue: "Cultural Center",
    price: "Free",
    capacity: "800 people",
    genre: "Cultural",
    category: "Cultural",
    details: "A night of cultural exchange featuring traditional dances, folk music, and ethnic performances. Food stalls serving international cuisine.",
    isFlagship: false
  },
  {
    id: 7,
    title: "Tech Talk Series",
    date: "28.4.2025",
    time: "16:00",
    shares: "45 Shares",
    image: "/images/building-6011756_1280.jpg",
    description: "Interactive sessions with industry leaders sharing insights on emerging technologies and career guidance.",
    venue: "Seminar Hall",
    price: "Free",
    capacity: "300 people",
    genre: "Workshop",
    category: "Technical",
    details: "Learn from experts in AI, blockchain, cybersecurity, and more. Includes Q&A sessions and networking opportunities.",
    isFlagship: false
  },
  {
    id: 8,
    title: "Sports Meet",
    date: "05.5.2025",
    time: "08:00",
    shares: "123 Shares",
    image: "/images/building-6011756_1280.jpg",
    description: "Annual sports competition featuring athletics, team sports, and individual events.",
    venue: "Sports Complex",
    price: "Free",
    capacity: "2,000 people",
    genre: "Sports",
    category: "Sports",
    details: "Competitive sports events including track & field, football, basketball, and more. Medals and trophies for winners.",
    isFlagship: false
  }
];

const categories = [
  { name: "All", value: "all" },
  { name: "Cultural", value: "Cultural" },
  { name: "Technical", value: "Technical" },
  { name: "Business", value: "Business" },
  { name: "Sports", value: "Sports" }
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFlagshipOnly, setShowFlagshipOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCardClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleClose = () => {
    setSelectedEvent(null);
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
                  Events
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
                {filteredEvents.map((event, index) => (
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
                      
                      <div className={`relative h-48 ${event.isFlagship ? 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}>
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
                ))}
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
                    
                    <div className={`relative h-64 ${selectedEvent.isFlagship ? 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}>
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
                        <button className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300">
                          SHARE
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}