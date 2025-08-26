'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Users, Star, Filter, Crown, Check, Share2, Home, HelpCircle, Handshake, Mail, Info, ChevronUp } from 'lucide-react';
import SidebarDock from '../../../components/SidebarDock';
import Logo from '../../../components/Logo';
import { useRouter } from 'next/navigation';
import InfinityTransition from '../../../components/InfinityTransition';

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
  // Flagship Events (First 8 events)
  {
    id: 1,
    title: "PANACHE - FASHION SHOW",
    date: "25-26.12.2024",
    time: "Day 1: 19:00 | Day 2: 21:00",
    shares: "567 Shares",
    image: "/images/Events/Cultural/Panache.jpg",
    description: "Sabrang's grandest fashion extravaganza spanning two spectacular days. Day 1 features THEME WALK where fashion meets narrative, while Day 2 showcases the ultimate PANACHE runway with original collections and full choreography.",
    venue: "Main Auditorium",
    price: "₹85-120",
    capacity: "3,000 people",
    genre: "Fashion Show",
    category: "Flagship",
    details: "A two-day fashion spectacle where Day 1 focuses on thematic costume interpretation and Day 2 showcases original collections with full choreography, soundtrack, and fashion narratives. Judging criteria include costume design, thematic relevance, stage presence, group coordination, and overall runway impact.",
    isFlagship: true
  },
  {
    id: 2,
    title: "BANDJAM",
    date: "27.12.2024",
    time: "19:30",
    shares: "189 Shares",
    image: "/images/Events/Cultural/BandJam.jpg",
    description: "A showdown of student bands performing original compositions and covers. From rock and indie to classical fusion.",
    venue: "Open Air Amphitheater",
    price: "₹60",
    capacity: "5,000 people",
    genre: "Music Festival",
    category: "Flagship",
    details: "Bands are judged on creativity, technical prowess, audience engagement, and stage presence. Bandjam is the sonic pulse of Sabrang.",
    isFlagship: true
  },
  {
    id: 3,
    title: "DANCE BATTLE",
    date: "28.12.2024",
    time: "18:00",
    shares: "156 Shares",
    image: "/images/Events/Cultural/DanceBattle.jpg",
    description: "A one-on-one and crew vs. crew elimination dance face-off featuring hip-hop, freestyle, krumping, and fusion styles.",
    venue: "Dance Studio",
    price: "₹45",
    capacity: "1,500 people",
    genre: "Dance Competition",
    category: "Flagship",
    details: "Each round challenges rhythm, originality, and intensity. It's not just about dancing – it's about commanding the floor.",
    isFlagship: true
  },
  {
    id: 4,
    title: "NUKKAD NATAK",
    date: "29.12.2024",
    time: "19:00",
    shares: "78 Shares",
    image: "/images/Events/Cultural/Nukkad Natak.jpg",
    description: "A raw, high-impact street play competition where teams perform powerful acts in open spaces.",
    venue: "Open Air Stage",
    price: "Free",
    capacity: "800 people",
    genre: "Street Theater",
    category: "Flagship",
    details: "These performances focus on social awareness, political commentary, or cultural satire. Props are minimal – the message is everything.",
    isFlagship: true
  },
  {
    id: 5,
    title: "SPOTLIGHT",
    date: "30.12.2024",
    time: "16:00",
    shares: "92 Shares",
    image: "/images/Events/Cultural/spotlight.jpg",
    description: "A solo and duet acting competition testing an actor's range, expression, and stage dynamism.",
    venue: "Performance Hall",
    price: "₹25",
    capacity: "500 people",
    genre: "Acting Competition",
    category: "Flagship",
    details: "Participants can choose original scripts or well-known dramatic pieces. This is the stage where emotions are unfiltered, and performances, unforgettable.",
    isFlagship: true
  },
  {
    id: 6,
    title: "SINGING PALOOZA",
    date: "31.12.2024",
    time: "20:00",
    shares: "123 Shares",
    image: "/images/Events/Cultural/Singing.jpg",
    description: "A vocal competition celebrating musical talent across genres like Bollywood, Indie, Western Classical, and more.",
    venue: "Music Hall",
    price: "₹35",
    capacity: "2,000 people",
    genre: "Singing Competition",
    category: "Flagship",
    details: "Solo and duet performances are allowed. Judging considers pitch, modulation, emotive expression, and creativity.",
    isFlagship: true
  },
  {
    id: 7,
    title: "STEP UP",
    date: "01.01.2025",
    time: "18:00",
    shares: "145 Shares",
    image: "/images/Events/Cultural/step-up.jpg",
    description: "A high-energy group dance event where choreography, synchronization, stage usage, and innovation are key.",
    venue: "Dance Studio",
    price: "₹40",
    capacity: "1,200 people",
    genre: "Group Dance",
    category: "Flagship",
    details: "Teams bring pre-prepared routines and must light up the stage with drama, unity, and movement.",
    isFlagship: true
  },

  // Fun & Games Events
  {
    id: 8,
    title: "DUMB SHOW",
    date: "02.01.2025",
    time: "19:00",
    shares: "67 Shares",
    image: "/images/Events/Cultural/Dumb Show.jpg",
    description: "A classic non-verbal guessing game with a Sabrang twist. Teams mime phrases, movie titles, or idioms under time pressure.",
    venue: "Theater Hall",
    price: "Free",
    capacity: "300 people",
    genre: "Mime Acting",
    category: "Fun & Games",
    details: "It's fast, funny, and tests how well you know your teammates – and your acting chops.",
    isFlagship: false
  },
  {
    id: 9,
    title: "BIDDING BEFORE WICKET",
    date: "03.01.2025",
    time: "20:00",
    shares: "234 Shares",
    image: "/images/Events/Management/BiddingBeforeWicket.png",
    description: "Cricket trivia meets auction drama. Participants receive virtual budgets to 'bid' on cricket players or scenarios.",
    venue: "Business School Auditorium",
    price: "₹25",
    capacity: "200 people",
    genre: "Cricket Auction",
    category: "Fun & Games",
    details: "Based on IPL stats and records. The goal? Build the most powerful team and outscore opponents in cricket-themed questions.",
    isFlagship: false
  },
  {
    id: 10,
    title: "SEAL THE DEAL",
    date: "04.01.2025",
    time: "18:00",
    shares: "189 Shares",
    image: "/images/Events/Management/SealTheDeal.png",
    description: "A mock marketing game where participants act as salespeople trying to 'sell' unconventional or humorous items.",
    venue: "Conference Room",
    price: "₹15",
    capacity: "150 people",
    genre: "Sales Competition",
    category: "Fun & Games",
    details: "Creativity, persuasion, and comic timing are key to winning the deal.",
    isFlagship: false
  },
  {
    id: 11,
    title: "UNKNOWN BATTLEGROUND",
    date: "05.01.2025",
    time: "18:00",
    shares: "134 Shares",
    image: "/images/Events/Technical/Battleground.jpg",
    description: "A campus-based survival game with elements of physical tasks, strategic decisions, and mental challenges.",
    venue: "Campus Grounds",
    price: "₹30",
    capacity: "400 people",
    genre: "Survival Game",
    category: "Fun & Games",
    details: "Inspired by battle royale video games, participants face a new surprise at each level. Only the sharpest survive till the end.",
    isFlagship: false
  },

  // Creative Arts Events
  {
    id: 12,
    title: "FOCUS",
    date: "06.01.2025",
    time: "14:00",
    shares: "78 Shares",
    image: "/images/Events/Technical/Focus.jpg",
    description: "A photography competition capturing 'Sabrang in Motion' — the moods, events, and essence of the fest.",
    venue: "Photo Studio",
    price: "Free",
    capacity: "150 people",
    genre: "Photography",
    category: "Creative Arts",
    details: "Categories include portrait, candid, and creative photography. Submissions are judged on composition, storytelling, and innovation.",
    isFlagship: false
  },
  {
    id: 13,
    title: "COLOR & CONTOUR",
    date: "07.01.2025",
    time: "16:00",
    shares: "89 Shares",
    image: "/images/Events/Design/COLOR&CONTOUR.jpg",
    description: "A live painting competition. Participants interpret a surprise theme through visual storytelling.",
    venue: "Art Studio",
    price: "₹30",
    capacity: "100 people",
    genre: "Live Painting",
    category: "Creative Arts",
    details: "Using acrylics, pastels, or watercolors. Technique, interpretation, and aesthetics will be judged.",
    isFlagship: false
  },
  {
    id: 14,
    title: "MINDSCAPE",
    date: "08.01.2025",
    time: "14:00",
    shares: "123 Shares",
    image: "/images/Events/Design/MINDSCAPE.jpg",
    description: "A literary challenge involving short story writing, flash fiction, or spoken word poetry based on prompts.",
    venue: "Literature Hall",
    price: "Free",
    capacity: "80 people",
    genre: "Creative Writing",
    category: "Creative Arts",
    details: "Participants are evaluated on imagination, language, and narrative impact.",
    isFlagship: false
  },
  {
    id: 15,
    title: "FRAME BY FRAME",
    date: "09.01.2025",
    time: "16:00",
    shares: "67 Shares",
    image: "/images/Events/Design/FRAMEBYFRAME.jpg",
    description: "A digital art event for animation enthusiasts. Participants create 10–60 second original 2D or 3D animation clips.",
    venue: "Digital Studio",
    price: "₹20",
    capacity: "100 people",
    genre: "Animation",
    category: "Creative Arts",
    details: "That convey a story or emotion. Judged on frame transitions, visual storytelling, and technical finesse.",
    isFlagship: false
  },
  {
    id: 16,
    title: "RECREATION",
    date: "10.01.2025",
    time: "18:00",
    shares: "92 Shares",
    image: "/images/Events/Design/RECREATION.jpg",
    description: "Artists are challenged to recreate iconic artworks, photos, or scenes either traditionally or digitally.",
    venue: "Art Workshop",
    price: "Free",
    capacity: "80 people",
    genre: "Art Recreation",
    category: "Creative Arts",
    details: "Evaluation is based on accuracy, attention to detail, and medium mastery.",
    isFlagship: false
  },
  {
    id: 17,
    title: "RAP BATTLE",
    date: "11.01.2025",
    time: "18:00",
    shares: "156 Shares",
    image: "/images/Events/Cultural/BandJam.jpg",
    description: "Participants spit bars in head-to-head freestyle and pre-written rap battles.",
    venue: "Music Hall",
    price: "₹25",
    capacity: "300 people",
    genre: "Rap Competition",
    category: "Creative Arts",
    details: "Creativity, rhythm, rhyme schemes, and crowd engagement all matter. Originality and message-heavy content get extra points.",
    isFlagship: false
  },

  // Workshops & Talks Events
  {
    id: 18,
    title: "IN CONVERSATION WITH",
    date: "12.01.2025",
    time: "16:00",
    shares: "234 Shares",
    image: "/images/Events/literary/dialectic.jpg",
    description: "A curated talk series with distinguished guests—artists, activists, creators—sharing personal journeys and behind-the-scenes stories.",
    venue: "Main Auditorium",
    price: "Free",
    capacity: "1,000 people",
    genre: "Talk Series",
    category: "Workshops & Talks",
    details: "Live Q&A sessions. This is where ideas spark and inspire the next generation.",
    isFlagship: false
  },
  {
    id: 19,
    title: "CREATIVE WORKSHOPS",
    date: "13.01.2025",
    time: "14:00",
    shares: "189 Shares",
    image: "/images/Events/Technical/Synergy.jpg",
    description: "Themed workshops ranging from storytelling, beatboxing, photography, to theatre and graffiti.",
    venue: "Workshop Rooms",
    price: "₹50",
    capacity: "200 people",
    genre: "Skill Building",
    category: "Workshops & Talks",
    details: "Conducted by professionals, these sessions offer hands-on guidance and skill-building for participants.",
    isFlagship: false
  },
  {
    id: 20,
    title: "MAKE A FILM ON CAMPUS",
    date: "14.01.2025",
    time: "10:00",
    shares: "145 Shares",
    image: "/images/Events/Technical/Codeureka.jpg",
    description: "A 48-hour filmmaking challenge where teams must script, shoot, and edit a short film entirely within the university campus.",
    venue: "Campus Wide",
    price: "₹75",
    capacity: "100 people",
    genre: "Filmmaking",
    category: "Workshops & Talks",
    details: "Themes will be disclosed at kickoff. Creativity under time pressure is the game.",
    isFlagship: false
  },
  {
    id: 21,
    title: "GROUP CANVAS PAINTING",
    date: "15.01.2025",
    time: "16:00",
    shares: "78 Shares",
    image: "/images/Events/Design/CHAMELON_CANVAS.jpg",
    description: "A collaborative art installation where teams work on a large canvas divided into sections.",
    venue: "Art Studio",
    price: "Free",
    capacity: "120 people",
    genre: "Collaborative Art",
    category: "Workshops & Talks",
    details: "Each section must reflect part of a larger theme, resulting in a unified piece of art representing the fest.",
    isFlagship: false
  },

  // Special Events
  {
    id: 22,
    title: "TREASURE HUNT",
    date: "16.01.2025",
    time: "14:00",
    shares: "167 Shares",
    image: "/images/Events/minievent/HouseFull.jpg",
    description: "A fast-paced, multi-clue campus hunt where logic, teamwork, and stamina are tested.",
    venue: "Campus Wide",
    price: "₹20",
    capacity: "300 people",
    genre: "Adventure Game",
    category: "Special Events",
    details: "Teams decipher riddles, complete mini-tasks, and race to the final prize. Expect twists and a lot of running.",
    isFlagship: false
  },
  {
    id: 23,
    title: "FOOD COMPETITION",
    date: "17.01.2025",
    time: "16:00",
    shares: "134 Shares",
    image: "/images/Events/minievent/QFACTOR.jpg",
    description: "A culinary showdown where participants compete in taste, presentation, or creativity.",
    venue: "Food Court",
    price: "₹40",
    capacity: "200 people",
    genre: "Culinary Arts",
    category: "Special Events",
    details: "Categories may include 'No-Fire Dishes,' 'Fusion Experiments,' or 'Snack on a Budget.' Judging balances taste and innovation.",
    isFlagship: false
  },
  {
    id: 24,
    title: "DIGITAL 2D/3D COMPETITION",
    date: "18.01.2025",
    time: "14:00",
    shares: "89 Shares",
    image: "/images/Events/Design/E-TEE.jpg",
    description: "A design event inviting submissions of illustrations, concept art, or models in 2D/3D.",
    venue: "Digital Lab",
    price: "Free",
    capacity: "100 people",
    genre: "Digital Design",
    category: "Special Events",
    details: "Participants are expected to interpret a theme using digital tools. Scoring emphasizes creativity and technique.",
    isFlagship: false
  },
  {
    id: 25,
    title: "ORIGAMI WORKSHOP",
    date: "19.01.2025",
    time: "16:00",
    shares: "67 Shares",
    image: "/images/Events/minievent/DAREANDCHAIR.jpg",
    description: "A calming and precision-focused session teaching participants the intricate Japanese art of paper folding.",
    venue: "Workshop Room",
    price: "₹15",
    capacity: "60 people",
    genre: "Paper Art",
    category: "Special Events",
    details: "From basic cranes to complex floral designs, participants will walk away with skills and creations.",
    isFlagship: false
  },
  {
    id: 26,
    title: "2-DAY RIDDLE RUSH",
    date: "20.01.2025",
    time: "10:00",
    shares: "123 Shares",
    image: "/images/Events/minievent/METaphor.jpg",
    description: "A fest-wide riddle and puzzle challenge hosted in stages across two days.",
    venue: "Campus Wide",
    price: "Free",
    capacity: "500 people",
    genre: "Puzzle Challenge",
    category: "Special Events",
    details: "Participants solve physical, verbal, and digital clues in real-time to accumulate points. A leaderboard keeps the pressure high.",
    isFlagship: false
  }
];

const categories = [
  { name: "All", value: "all" },
  { name: "Flagship", value: "Flagship" },
  { name: "Fun & Games", value: "Fun & Games" },
  { name: "Creative Arts", value: "Creative Arts" },
  { name: "Workshops & Talks", value: "Workshops & Talks" },
  { name: "Special Events", value: "Special Events" }
];

export default function EventsPage() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFlagshipOnly, setShowFlagshipOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule', icon: <Clock className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
  ];

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

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter events based on category and flagship toggle
  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === "all" || event.category === selectedCategory;
    const flagshipMatch = !showFlagshipOnly || event.isFlagship;
    return categoryMatch && flagshipMatch;
  });

  // Temporary: route all rules to Coming Soon
  const getRulesPath = (_event: any) => '/coming-soon';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/eventpage.webp)'
        }}
      />
      
      {/* Glassy Translucent Overlay with 0.4 opacity */}
      <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-sm" />
      {/* Logo and sidebar */}
      <Logo className="block" />
      <SidebarDock className="hidden lg:block" />

      {/* Mobile hamburger */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition"
      >
        <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
        <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
        <span className="block h-0.5 bg-white/80 rounded-full w-4" />
      </button>
      
      {/* Flagship Events Toggle - hide on mobile to avoid overlapping navbar */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="hidden lg:fixed lg:top-6 lg:right-6 lg:z-50 lg:block"
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
              <div className="mb-12 lg:mb-16 text-center pt-8 lg:pt-12">
                <motion.h1 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-6xl md:text-8xl font-bold text-white mb-4"
                >
                  SABRANG 2025
                </motion.h1>
                {/* Mobile subtitle only */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="lg:hidden -mt-2 mb-4"
                >
                  <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300">
                    Noorwana & Color to Cosmos
                  </p>
                </motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100px" }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="h-1 bg-gradient-to-r from-pink-400 to-purple-400 mb-6 lg:mb-8 mx-auto"
                />
                <motion.p 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-gray-300 text-lg max-w-md mx-auto"
                >
                  It is a long established fact that a reader will be distracted by
                </motion.p>
              </div>

              {/* Category Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mb-8 lg:mb-12"
              >
                <div className="text-center mb-4 lg:mb-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4 flex items-center justify-center">
                    <Filter className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                    Filter by Category
                  </h3>
                </div>
                <div className="grid grid-cols-2 lg:flex lg:flex-wrap justify-center gap-2 lg:gap-4 px-4 lg:px-0">
                  {categories.map((category) => (
                    <motion.button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-3 lg:px-6 py-2 lg:py-3 rounded-full text-sm lg:text-base font-medium transition-all duration-300 transform hover:scale-105 ${
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
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className=" overflow-hidden border border-white/0 bg-black/40 shadow-2xl hover:border-white/30 transition-all duration-300">
                      <div className="relative">
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 relative">
                      {/* Category Badge */}
                      <div className="absolute top-2 md:top-3 left-2 md:left-3 z-10">
                        <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-2 md:px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {event.category}
                        </div>
                      </div>
                      
                      {/* Flagship Event Badge */}
                      {event.isFlagship && (
                        <div className="absolute top-2 md:top-3 right-2 md:right-3 z-10">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 md:px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                            ⭐ FLAGSHIP
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced border for flagship events */}
                      {event.isFlagship && (
                        <div className="absolute inset-0 rounded-lg border-2 border-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      )}
                      
                      {/* Poster Section */}
                      <div className="relative h-64 md:h-80">
                        {/* Event Image */}
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="block w-full h-auto"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">{event.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.category && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white bg-white/10 border border-white/20">
                              {event.category}
                            </span>
                          )}
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${event.isFlagship ? 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30' : 'text-blue-300 bg-blue-500/10 border-blue-500/30'}`}>
                            {event.isFlagship ? 'Flagship' : 'Regular'}
                          </span>
                        </div>
                        {/* Fallback gradient background */}
                        <div className={`absolute inset-0 ${event.isFlagship ? 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`} style={{ display: 'none' }} id={`fallback-${event.id}`}>
                          <div className="absolute inset-0 bg-black/20" />
                        </div>
                        <div className="absolute inset-0 bg-black/20" />
                        
                        {/* Click for more info overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-2xl mb-2">👆</div>
                            <div className="text-sm font-medium">Click for more info</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Details Bar */}
                      <div className="p-3 md:p-4 bg-black/60">
                        <div className="flex items-center justify-between text-gray-300 text-xs md:text-sm mb-2">
                          <span className="font-medium">{event.title}</span>
                          <span className={`px-1 md:px-2 py-1 rounded text-xs font-medium ${
                            event.isFlagship 
                              ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30' 
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {event.genre}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-400 text-xs">
                          <span>{event.date} • {event.time}</span>
                          <span className="hidden sm:inline">{event.venue}</span>
                        </div>
                        {/* Click hint */}
                        <div className="mt-2 text-center">
                          <span className="text-gray-500 text-xs">👆 Click for details</span>
                        </div>
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
              {/* Left Side - Poster Image only (no card UI) */}
            <div className="flex flex-col lg:flex-row h-full">
              {/* Left Side - Event Card */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full lg:w-1/2 p-4 lg:p-8 flex items-center justify-center"
              >
                <div className="w-full max-w-md">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="rounded-2xl shadow-2xl border border-white/10 w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
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
                    
                                        <div className="relative h-64 lg:h-80">
                      {/* Event Image in Modal */}
                      <img 
                        src={selectedEvent.image} 
                        alt={selectedEvent.title}
                        className="w-full h-full object-contain"
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
                className="w-full lg:w-1/2 p-4 lg:p-8 overflow-y-auto"
              >
                <div className="max-w-lg mx-auto lg:mx-0">
                  {/* Close Button */}
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleClose}
                    className="absolute top-4 lg:top-8 right-4 lg:right-8 w-10 h-10 lg:w-12 lg:h-12 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/20"
                  >
                    <X className="w-5 h-5 lg:w-6 lg:h-6" />
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
                      <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
                        {selectedEvent.title}
                      </h2>
                      <p className="text-gray-300 text-base lg:text-lg leading-relaxed mb-6">
                        {selectedEvent.description}
                      </p>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      <div>
                        <h3 className="text-lg lg:text-xl font-semibold text-white mb-3">Event Details</h3>
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
                        <a
                          href={getRulesPath(selectedEvent)}
                          className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                        >
                          <span>RULES</span>
                        </a>
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


             {/* Mobile menu overlay */}
       {mobileMenuOpen && (
         <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
           <div className="absolute top-4 right-4">
             <button
               aria-label="Close menu"
               onClick={() => setMobileMenuOpen(false)}
               className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
             >
               <X className="w-6 h-6 text-white" />
             </button>
           </div>
           <div className="pt-20 px-6 h-full overflow-y-auto">
             <div className="grid grid-cols-1 gap-3 pb-8">
               {mobileNavItems.map((item) => (
                 <button
                   key={item.title}
                   onClick={() => { setMobileMenuOpen(false); setTargetHref(item.href); setShowTransition(true); }}
                   className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-base hover:bg-white/15 active:scale-[0.99] transition text-left"
                 >
                   <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/20">
                     {item.icon}
                   </span>
                   <span className="font-medium">{item.title}</span>
                 </button>
               ))}
             </div>
           </div>
         </div>
       )}

      {/* Infinity transition for mobile nav */}
      <InfinityTransition
        isActive={showTransition}
        onComplete={() => {
          if (targetHref) router.push(targetHref);
          setShowTransition(false);
          setTargetHref(null);
        }}
      />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 active:scale-95"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}