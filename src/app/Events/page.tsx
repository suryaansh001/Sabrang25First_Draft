'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Users, Star, Filter, Crown, Check, Share2, Home, HelpCircle, Handshake, Mail, Info, ChevronUp } from 'lucide-react';
import Logo from '../../../components/Logo';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';


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
  rules?: string[];
}

const events: Event[] = [
  // 1. Rampwalk – Panache – Theme Based
  {
    id: 1,
    title: "RAMPWALK - PANACHE",
    date: "25.12.2024",
    time: "19:00",
    shares: "567 Shares",
    image: "/images/about-section/Panache.png",
    description: "The grandest runway event of Sabrang, Panache is where elegance, charisma, and confidence collide. Teams will display original collections or concepts with full choreography, soundtrack, and fashion narratives. Expectations - Glamour, high-stakes competition, and crowd pulling visuals.",
    venue: "Main Auditorium",
    price: "₹85-120",
    capacity: "3,000 people",
    genre: "Fashion Show",
    category: "Flagship",
    details: "A single-day fashion spectacle focusing on thematic costume interpretation and runway impact. Judging criteria include costume design, thematic relevance, stage presence, and overall narrative.",
    isFlagship: true
  },
  // 2. Bandjam
  {
    id: 2,
    title: "BANDJAM",
    date: "27.12.2024",
    time: "19:30",
    shares: "189 Shares",
    image: "/images/about-section/Bandjam.png",
    description: "Get ready to experience the electrifying talent of the Band Jam Competition, where instruments roar to life with powerful melodies. This musical face-off will fill the air with rhythm and energy, leaving the audience moved by the magic of sound.",
    venue: "Open Air Amphitheater",
    price: "₹60",
    capacity: "5,000 people",
    genre: "Music Festival",
    category: "Flagship",
    details: "Bands are judged on creativity, technical prowess, audience engagement, and stage presence. Bandjam is the sonic pulse of Sabrang.",
    isFlagship: true
  },
  // 3. Dance Battle
  {
    id: 3,
    title: "DANCE BATTLE",
    date: "28.12.2024",
    time: "18:00",
    shares: "156 Shares",
    image: "/images/about-section/Dance.png",
    description: "Get ready for an electrifying crew vs. crew dance showdown! In this high-stakes elimination battle, teams of 6-12 members will face off, showcasing their best choreography and freestyle moves. With strict rules on music, props, and conduct, only the most disciplined and creative crew will be crowned champions. It's a test of skill, synchronization, and raw energy.",
    venue: "Dance Studio",
    price: "₹45",
    capacity: "1,500 people",
    genre: "Dance Competition",
    category: "Flagship",
    details: "Each round challenges rhythm, originality, and intensity. It's not just about dancing – it's about commanding the floor.",
    isFlagship: true
  },
  // 4. Step Up
  {
    id: 4,
    title: "STEP UP",
    date: "01.01.2025",
    time: "18:00",
    shares: "145 Shares",
    image: "/images/home2.png",
    description: "Step Up is the ultimate solo dance challenge where individual performers take center stage. This is a test of pure skill, creativity, and stage command. With strict rules and a two-round elimination format, only the most versatile and captivating dancer will rise to the top. Are you ready to own the spotlight?",
    venue: "Dance Studio",
    price: "₹40",
    capacity: "1,200 people",
    genre: "Solo Dance",
    category: "Flagship",
    details: "A two-round solo dance elimination where individual performers showcase their skill, creativity, and stage command.",
    isFlagship: true
  },
  // 5. Echoes of Noor
  {
    id: 5,
    title: "ECHOES OF NOOR",
    date: "02.01.2025",
    time: "16:00",
    shares: "95 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "A spoken word and poetry event celebrating the festival's theme, 'Noorwana'. Artists perform original pieces reflecting on light, cosmos, and inner luminescence.",
    venue: "Literature Hall",
    price: "Free",
    capacity: "150 people",
    genre: "Spoken Word",
    category: "Flagship",
    details: "Performances are judged on lyrical content, emotional delivery, and thematic relevance. A platform for the voices of tomorrow.",
    isFlagship: true
  },
  // 7. Bidding Before Wicket
  {
    id: 7,
    title: "BIDDING BEFORE WICKET",
    date: "03.01.2025",
    time: "20:00",
    shares: "234 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Welcome to Bidding Before Wicket, the ultimate cricket strategy showdown! This isn't just an auction; it's a high-stakes battle of wits where you build your dream team with a 100 Cr budget. Navigate the auction with special powers like 'Jump Bidding' and the risky 'Budget Boost'. Qualify through a quiz round, then dominate the auction table to assemble a squad with the highest rating. Do you have what it takes to be a champion owner?",
    venue: "Business School Auditorium",
    price: "₹25",
    capacity: "200 people",
    genre: "Cricket Auction",
    category: "Fun & Games",
    details: "Based on IPL stats and records. The goal? Build the most powerful team and outscore opponents in cricket-themed questions.",
    isFlagship: false
  },
  // 8. Seal the Deal
  {
    id: 8,
    title: "SEAL THE DEAL",
    date: "04.01.2025",
    time: "18:00",
    shares: "189 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Welcome to Seal the Deal, a premier trading event designed to challenge and sharpen your financial acumen. This competition offers a unique opportunity to experience the intensity and decision-making rigour of trading in a simulated environment. With a substantial dummy capital and a range of trading strategies, participants will need skill, precision, and strategy to emerge victorious.",
    venue: "Conference Room",
    price: "₹15",
    capacity: "150 people",
    genre: "Simulated Trading",
    category: "Fun & Games",
    details: "A solo simulated trading competition. Participants start with a dummy capital of ₹10,00,000 and aim for the highest gains within a 1-hour time limit. Judged on profit, with tie-breakers for trade success.",
    isFlagship: false
  },
  // 9. VerseVaad
  {
    id: 9,
    title: "VERSEVAAD",
    date: "05.01.2025",
    time: "15:00",
    shares: "110 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: '"Versevaad" is a two-round rap battle event designed to showcase originality, creativity, and improvisational skills. The competition emphasizes clean content, prohibiting any form of vulgarity.',
    venue: "Literature Hall",
    price: "Free",
    capacity: "100 people",
    genre: "Poetic Debate",
    category: "Flagship",
    details: "Teams are given topics and must construct their arguments in rhyming couplets or free verse. Judged on content, poetic quality, and delivery.",
    isFlagship: true
  },
  // 10. In Conversation With
  {
    id: 10,
    title: "IN CONVERSATION WITH",
    date: "12.01.2025",
    time: "16:00",
    shares: "234 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Join us for 'In Conversation With,' a curated talk series featuring distinguished guests from the worlds of art, activism, and creation. Listen as they share their personal journeys and behind-the-scenes stories in an intimate setting, followed by an interactive live Q&A session designed to spark ideas and inspire the next generation.",
    venue: "Main Auditorium",
    price: "Free",
    capacity: "1,000 people",
    genre: "Talk Series",
    category: "Workshops & Talks",
    details: "Live Q&A sessions. This is where ideas spark and inspire the next generation.",
    isFlagship: false
  },
  // 11. Clay Modelling
  {
    id: 11,
    title: "CLAY MODELLING",
    date: "06.01.2025",
    time: "14:00",
    shares: "70 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Unleash your creativity and bring your imagination to life in our hands-on clay modelling event! This is a solo artist's playground, where you'll have the time, space, and materials to translate a concept from your mind into a tangible piece of art.",
    venue: "Art Studio",
    price: "₹40",
    capacity: "80 people",
    genre: "Sculpture",
    category: "Creative Arts",
    details: "A solo competition where participants are given 2-3 hours to interpret a theme using air-dry clay. Judged on creativity, material handling, and relevance to the theme.",
    isFlagship: false
  },
  // 12. Focus (film)
  {
    id: 12,
    title: "FOCUS",
    date: "09.01.2025",
    time: "10:00",
    shares: "115 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Bring your vision to life through the lens! FOCUS is a creative photography challenge that pushes you to capture stories, colours, and reflections in their purest form — without heavy edits or digital tricks.",
    venue: "Campus Wide",
    price: "₹50",
    capacity: "150 people",
    genre: "Photography",
    category: "Creative Arts",
    details: "A two-round photography competition focused on creativity, composition, and minimal editing. Participants will tackle themed challenges within the campus.",
    isFlagship: false
  },
  // 13. BGMI
  {
    id: 13,
    title: "BGMI TOURNAMENT",
    date: "07.01.2025",
    time: "12:00",
    shares: "350 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Drop into Sabrang's official BGMI tournament, where strategy and skill collide. Squads of four will battle it out in a multi-day event with a unique scoring system that rewards both aggressive play and survival. With bonus points for kill streaks and chicken dinners, only the most versatile team will claim victory. Register your squad, gear up, and get ready for the ultimate battle royale showdown.",
    venue: "Online / E-Sports Arena",
    price: "₹50/squad",
    capacity: "256 players",
    genre: "E-Sports",
    category: "Fun & Games",
    details: "A multi-round tournament for squads of four. Points are awarded for placement and kills. The final rounds will be live-streamed.",
    isFlagship: false
  },
  // 14. Valorant
  {
    id: 14,
    title: "VALORANT TOURNAMENT",
    date: "08.01.2025",
    time: "12:00",
    shares: "410 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Gear up for Sabrang's official 5v5 Valorant tournament! This high-stakes competition tests your team's strategy, aim, and coordination across a multi-stage format, from group stages to a best-of-five grand final. With strict fair play rules and a professional map veto process, only the most skilled team will emerge as champions.",
    venue: "E-Sports Arena",
    price: "₹100/team",
    capacity: "160 players",
    genre: "E-Sports",
    category: "Fun & Games",
    details: "A 5v5, single-elimination bracket tournament. Matches are played on standard competitive settings. Defy the limits!",
    isFlagship: false
  },
  // 15. Free Fire
  {
    id: 15,
    title: "FREE FIRE TOURNAMENT",
    date: "09.01.2025",
    time: "12:00",
    shares: "290 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Dive into the ultimate mobile battle royale with Sabrang's official Free Fire Tournament. This is a high-stakes competition where only the sharpest squads will survive. With strict rules against teaming and hacking, and a point system that rewards both placement and kills, your path to victory depends on pure skill and strategy. Join the lobby, prove your worth, and fight for the Booyah!",
    venue: "Online / E-Sports Arena",
    price: "₹40/squad",
    capacity: "192 players",
    genre: "E-Sports",
    category: "Fun & Games",
    details: "Squad-based battle royale. The tournament will consist of multiple qualifying rounds leading to a grand final.",
    isFlagship: false
  },
  // 17. Dumb Show
  {
    id: 17,
    title: "DUMB SHOW",
    date: "02.01.2025",
    time: "19:00",
    shares: "67 Shares",
    image: "/images/Schedule.jpg",
    description: "Get ready for a fun and challenging game of silent acting! Dumb Show brings teams together to act out movie names, phrases, or themes without speaking, relying on gestures and body language to communicate. Test your creativity and teamwork as participants race against the clock to guess the correct answer, making for an exciting and laughter-filled experience for everyone involved.",
    venue: "Theater Hall",
    price: "Free",
    capacity: "300 people",
    genre: "Mime Acting",
    category: "Fun & Games",
    details: "It's fast, funny, and tests how well you know your teammates – and your acting chops.",
    isFlagship: false
  },
  // 18. Courtroom
  {
    id: 18,
    title: "COURTROOM",
    date: "11.01.2025",
    time: "14:00",
    shares: "50 Shares",
    image: "/images/Logo@2x.png",
    description: "Step into the shoes of detectives and unravel a thrilling murder mystery! With twists, turns, and surprising revelations, this event promises to test your problem-solving skills, creativity, and intuition.",
    venue: "Moot Court Hall",
    price: "₹30",
    capacity: "100 people",
    genre: "Mock Trial",
    category: "Special Events",
    details: "Teams will be given a case brief and must prepare arguments for prosecution and defense. Judged on legal reasoning, presentation, and courtroom etiquette.",
    isFlagship: false
  },
  // 19. Art Relay
  {
    id: 19,
    title: "ART RELAY",
    date: "11.01.2025",
    time: "11:00",
    shares: "60 Shares",
    image: "/images/Logo@2x.png",
    description: "The Art Relay is a unique event that tests an artist's flexibility and innovative thinking. Participants are tasked with creating a single artwork that evolves through multiple phases based on a series of revealed prompts.",
    venue: "Art Studio",
    price: "₹20",
    capacity: "40 people",
    genre: "Solo Art",
    category: "Creative Arts",
    details: "A solo art challenge where participants create an evolving artwork on a single canvas based on a series of prompts revealed every 10 minutes. Judged on creativity, cohesiveness, and relevance to prompts.",
    isFlagship: false
  }
];

const categories = [
  { name: "All", value: "all" },
  { name: "Cultural", value: "Flagship" },
  { name: "Fun & Games", value: "Fun & Games" },
  { name: "Creative Arts", value: "Creative Arts" },
  { name: "Workshops & Talks", value: "Workshops & Talks" },
  { name: "Special Events", value: "Special Events" }
];

export default function EventsPage() {
  const router = useRouter();
  const { navigate } = useNavigation();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showFlagshipOnly, setShowFlagshipOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  // ComingSoonOverlay removed – show main content directly
  const [isPageLoaded, setIsPageLoaded] = useState(true);
  const showComingSoon = false;

  const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
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
    setShowRules(false);
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

  // If any event is selected, immediately show the overlay and hide everything else
  if (selectedEvent) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-lg" />
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-neutral-900/30 backdrop-blur-2xl border border-white/10">
            <button
              aria-label="Close"
              onClick={handleClose}
              className="absolute top-4 right-4 z-[10001] w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
            >
              <X className="w-5 h-5 mx-auto" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto md:h-full bg-black/40">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="p-6 md:p-8 text-white space-y-5 md:space-y-6 overflow-y-auto max-h-[80vh] md:border-l md:border-white/10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{selectedEvent.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{selectedEvent.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" />{selectedEvent.time}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{selectedEvent.venue}</span>
                    <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" />{selectedEvent.capacity}</span>
                  </div>
                </div>
                <p className="text-gray-200 leading-relaxed">{selectedEvent.description}</p>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Details</h3>
                  <p className="text-gray-300 whitespace-pre-line">{selectedEvent.details}</p>
                </div>
                {showRules && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Rules</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-200">
                      {(selectedEvent.rules && selectedEvent.rules.length > 0 ? selectedEvent.rules : [
                        'Carry a valid college ID and entry pass.',
                        'Report at least 30 minutes before the event start time.',
                        'Decisions of judges are final and binding.',
                        'Any form of abuse, vandalism or misconduct leads to disqualification.',
                        'Organizers reserve the right to modify rules at any time.'
                      ]).map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm">{selectedEvent.genre}</div>
                  {selectedEvent.isFlagship ? (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-sm text-yellow-300">
                      <Crown className="w-4 h-4" /> Flagship
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm">{selectedEvent.category}</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={() => router.push(`/Events/${selectedEvent.id}/rules`)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white/10 text-white hover:bg-white/15 border-white/20 transition">
                    <Info className="w-4 h-4" /> Rules
                  </button>
                  <button onClick={() => router.push(`/checkout?event=${selectedEvent.id}`)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition shadow-lg">
                    Checkout
                  </button>
                  <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  {showCopyMessage && (
                    <span className="text-sm text-green-300">Link copied!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main content */}
      {isPageLoaded && (
        <>
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
            {
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
                    >Dive into the vibrant spirit of JKLU’s Cultural Fest – a celebration of art, music, dance, and creativity.</motion.p>
                  </div>

                  {/* Category Filters */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mb-8 lg:mb-12"
                  >
                    <div className="text-center mb-4 lg:mb-6">
                      <h3 className="text-base lg:text-2xl font-bold text-white mb-3 lg:mb-4 flex items-center justify-center">
                        <Filter className="w-4 h-4 lg:w-6 lg:h-6 mr-2" />
                        Filter by Category
                      </h3>
                    </div>
                                         <div className="flex flex-nowrap justify-start lg:justify-center gap-1.5 lg:gap-4 px-4 lg:px-0 overflow-x-auto pb-2 lg:pb-0">
                       {categories.map((category) => (
                         <motion.button
                           key={category.value}
                           onClick={() => setSelectedCategory(category.value)}
                           className={`filter-button-mobile flex-shrink-0 px-2 lg:px-6 py-1 lg:py-3 rounded-full text-xs lg:text-base font-medium transition-all duration-300 transform hover:scale-105 ${
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

                  {/* Events Grid - card with image and bottom info */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                        className="relative rounded-lg overflow-hidden border border-white/10 group cursor-pointer shadow-lg"
                        onClick={() => handleCardClick(event)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(event); } }}
                        tabIndex={0}
                      >
                        {/* Image container */}
                        <div className="relative w-full aspect-[2/3] bg-black/20">
                          <img
                            loading="lazy"
                            decoding="async"
                            sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                            fetchPriority="low"
                            draggable={false}
                            src={event.image}
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-0"
                            onError={(e) => {
                              console.error(`Failed to load image: ${event.image}`);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = document.getElementById(`fallback-${event.id}`);
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                          <div
                            className={`absolute inset-0 ${event.isFlagship ? 'bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}
                            style={{ display: 'none' }}
                            id={`fallback-${event.id}`}
                          />
                        </div>

                        {/* --- MYSTERIOUS & SUSPENSEFUL OVERLAY --- */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-slate-800 overflow-hidden p-2 md:p-4 flex flex-col justify-between">
                          
                          {/* Mysterious grid pattern */}
                          <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, #00ff88 1px, transparent 0)',
                            backgroundSize: '20px 20px',
                          }} />

                          {/* Glitch effect lines */}
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-30" />
                          <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-red-400 to-transparent animate-pulse opacity-30 delay-1000" />

                          {/* Top section - Mysterious badge */}
                          <div className="relative z-10 flex justify-between items-start">
                            <div className="px-2 md:px-3 py-0.5 md:py-1 bg-black/50 border border-green-400/50 rounded-sm backdrop-blur-sm">
                              <span className="text-[10px] md:text-xs font-bold text-green-400 uppercase tracking-widest" style={{ fontFamily: 'monospace' }}>
                                {event.isFlagship ? '⚡ CLASSIFIED' : event.category}
                              </span>
                            </div>
                            {event.isFlagship && (
                              <div className="w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-sm border border-green-400/50 flex items-center justify-center animate-pulse">
                                <span className="text-[8px] md:text-xs">🔒</span>
                              </div>
                            )}
                          </div>

                          {/* Center - Mysterious title with glitch effect */}
                          <div className="flex-grow flex items-center justify-center text-center relative z-10">
                            <div className="relative">
                              {/* Glitch overlay effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-red-400/20 animate-pulse opacity-50" />
                              
                              {/* Main title with neon effect */}
                              <h3 className="relative font-bold text-sm md:text-lg lg:text-xl text-white px-1 md:px-2 uppercase tracking-widest leading-tight" 
                                  style={{ 
                                    textShadow: '0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 255, 136, 0.4)',
                                    fontFamily: 'monospace',
                                    letterSpacing: '0.2em'
                                  }}>
                                {event.title}
                              </h3>
                              
                              {/* Scanning line effect */}
                              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" />
                            </div>
                          </div>

                          {/* Bottom section - Suspenseful elements */}
                          <div className="relative z-10 text-center space-y-2 md:space-y-3">
                            {/* Mysterious status */}
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-400 rounded-full animate-ping" />
                            </div>
                            
                            {/* Mysterious button */}
                            <div className="inline-block px-2 md:px-4 py-1 md:py-2 bg-black/50 border border-green-400/50 rounded-sm backdrop-blur-sm hover:bg-green-400/20 transition-all duration-300 transform hover:scale-105 group">
                              <span className="text-[10px] md:text-xs font-bold text-green-400 uppercase tracking-widest" style={{ fontFamily: 'monospace' }}>
                                Coming Soon ..
                              </span>
                            </div>
                          </div>

                          {/* Mysterious border with glitch */}
                          <div className="absolute inset-0 border border-green-400/30 rounded-lg" />
                          <div className="absolute inset-0 border border-red-400/20 rounded-lg animate-pulse opacity-50" />
                          
                          {/* Mysterious corner elements */}
                          <div className="absolute top-1 md:top-2 left-1 md:left-2 w-1.5 md:w-2 h-1.5 md:h-2 border-l border-t border-green-400" />
                          <div className="absolute top-1 md:top-2 right-1 md:right-2 w-1.5 md:w-2 h-1.5 md:h-2 border-r border-t border-red-400" />
                          <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 w-1.5 md:w-2 h-1.5 md:h-2 border-l border-b border-red-400" />
                          <div className="absolute bottom-1 md:bottom-2 right-1 md:right-2 w-1.5 md:w-2 h-1.5 md:h-2 border-r border-b border-green-400" />
                          
                          {/* Floating particles */}
                          <div className="absolute top-1/3 left-1/4 w-0.5 md:w-1 h-0.5 md:h-1 bg-green-400 rounded-full animate-ping delay-500" />
                          <div className="absolute bottom-1/3 right-1/4 w-0.5 md:w-1 h-0.5 md:h-1 bg-red-400 rounded-full animate-ping delay-1000" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.main>
            }
          </AnimatePresence>

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
                      onClick={() => { setMobileMenuOpen(false); navigate(item.href); }}
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

          {/* Infinity transition handled by AppShell */}

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
        </>
      )}
    </div>
  );
}

// Custom CSS animations for enhanced visual effects
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(236, 72, 153, 0.5); }
    50% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.8), 0 0 30px rgba(236, 72, 153, 0.6); }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  @keyframes wave {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(10px); }
  }
  
  .event-card-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .event-card-glow {
    animation: glow 3s ease-in-out infinite;
  }
  
  .event-card-sparkle {
    animation: sparkle 2s ease-in-out infinite;
  }
  
  .event-card-wave {
    animation: wave 4s ease-in-out infinite;
  }
  
  /* Hide scrollbar for mobile filter buttons */
  .overflow-x-auto::-webkit-scrollbar {
    display: none;
  }
  
  .overflow-x-auto {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Ensure buttons are properly sized for mobile scrolling */
  @media (max-width: 768px) {
    .filter-button-mobile {
      min-width: auto;
      white-space: nowrap;
      scroll-snap-align: start;
    }
    
    .overflow-x-auto {
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
    }
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}