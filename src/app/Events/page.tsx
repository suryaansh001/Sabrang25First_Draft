'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, Users, Star, Filter, Crown, Check, Share2, Home, HelpCircle, Handshake, Mail, Info, ChevronUp, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import Logo from '../../../components/Logo';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';
import { events as EVENTS_DATA } from './[id]/rules/events.data';
import { EVENT_CATALOG, EventCatalogItem } from '../../lib/eventCatalog';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  shares: string;
  image: string;
  modalImage?: string; // This new property will hold the unique image for the detail modal
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
    date: "10.10.2025",
    time: "18:00",
    shares: "567 Shares",
    image: "/posters/PANACHE.webp",
    modalImage: "/images/gallery/image1.webp", // Example: Assign a unique image
    description: "The grandest runway event of Sabrang, Panache is where elegance, charisma, and confidence collide. Teams will display original collections or concepts with full choreography, soundtrack, and fashion narratives. Expectations - Glamour, high-stakes competition, and crowd pulling visuals.",
    venue: "Main Stage",
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
    date: "11.10.2025",
    time: "17:00",
    shares: "189 Shares",
    image: "/posters/BANDJAM.webp",
    modalImage: "/images/gallery/image2.webp", // Example: Assign a unique image
    description: "Get ready to experience the electrifying talent of the Band Jam Competition, where instruments roar to life with powerful melodies. This musical face-off will fill the air with rhythm and energy, leaving the audience moved by the magic of sound.",
    venue: "Main Stage",
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
    date: "11.10.2025",
    time: "19:30",
    shares: "156 Shares",
    image: "/posters/DANCE_BATTLE.webp",
    modalImage: "/images/gallery/image3.webp", // Example: Assign a unique image
    description: "Get ready for an electrifying crew vs. crew dance showdown! In this high-stakes elimination battle, teams of 6-12 members will face off, showcasing their best choreography and freestyle moves. With strict rules on music, props, and conduct, only the most disciplined and creative crew will be crowned champions. It's a test of skill, synchronization, and raw energy.",
    venue: "Main Stage",
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
    date: "12.10.2025",
    time: "11:30",
    shares: "145 Shares",
    image: "/posters/STEPUP.webp",
    modalImage: "/images/gallery/image4.webp", // Example: Assign a unique image
    description: "Step Up is the ultimate solo dance challenge where individual performers take center stage. This is a test of pure skill, creativity, and stage command. With strict rules and a two-round elimination format, only the most versatile and captivating dancer will rise to the top. Are you ready to own the spotlight?",
    venue: "Main Stage",
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
    date: "10.10.2025",
    time: "11:30",
    shares: "95 Shares",
    image: "/posters/Echoes of noor Draft-05.4.webp", // Placeholder image
    modalImage: "/images/gallery/image5.webp", // Example: Assign a unique image
    description: "A spoken word and poetry event celebrating the festival's theme, 'Noorwana'. Artists perform original pieces reflecting on light, cosmos, and inner luminescence.",
    venue: "Main Stage",
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
    date: "11.10.2025",
    time: "09:00",
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
    date: "10.10.2025",
    time: "11:00",
    shares: "189 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Welcome to Seal the Deal, a premier trading event designed to challenge and sharpen your financial acumen. This competition offers a unique opportunity to experience the intensity and decision-making rigour of trading in a simulated environment. With a substantial dummy capital and a range of trading strategies, participants will need skill, precision, and strategy to emerge victorious.",
    venue: "-",
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
    date: "10.10.2025",
    time: "16:00",
    shares: "110 Shares",
    image: "/posters/VERSEVAAD_page-0001.webp", // Placeholder image
    description: '"Versevaad" is a two-round rap battle event designed to showcase originality, creativity, and improvisational skills. The competition emphasizes clean content, prohibiting any form of vulgarity.',
    venue: "Main Stage",
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
    date: "10.10.2025",
    time: "14:00",
    shares: "234 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Join us for 'In Conversation With,' a curated talk series featuring distinguished guests from the worlds of art, activism, and creation. Listen as they share their personal journeys and behind-the-scenes stories in an intimate setting, followed by an interactive live Q&A session designed to spark ideas and inspire the next generation.",
    venue: "Tech Lawn",
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
    date: "12.10.2025",
    time: "10:00",
    shares: "70 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Unleash your creativity and bring your imagination to life in our hands-on clay modelling event! This is a solo artist's playground, where you'll have the time, space, and materials to translate a concept from your mind into a tangible piece of art.",
    venue: "Tech Lawn",
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
    date: "10.10.2025",
    time: "10:00",
    shares: "115 Shares",
    image: "/images/Logo@2x.png", // Placeholder image
    description: "Bring your vision to life through the lens! FOCUS is a creative photography challenge that pushes you to capture stories, colours, and reflections in their purest form — without heavy edits or digital tricks.",
    venue: "Amphitheatre",
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
    date: "12.10.2025",
    time: "11:00",
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
    date: "10.10.2025",
    time: "11:00",
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
    date: "11.10.2025",
    time: "11:00",
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
    date: "12.10.2025",
    time: "11:00",
    shares: "67 Shares",
    image: "/posters/DUMBSHOW.webp",
    description: "Get ready for a fun and challenging game of silent acting! Dumb Show brings teams together to act out movie names, phrases, or themes without speaking, relying on gestures and body language to communicate. Test your creativity and teamwork as participants race against the clock to guess the correct answer, making for an exciting and laughter-filled experience for everyone involved.",
    venue: "Amphitheatre",
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
    date: "11.10.2025",
    time: "13:00",
    shares: "50 Shares",
    image: "/images/Logo@2x.png",
    description: "Step into the shoes of detectives and unravel a thrilling murder mystery! With twists, turns, and surprising revelations, this event promises to test your problem-solving skills, creativity, and intuition.",
    venue: "Amphitheatre",
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
    date: "12.10.2025",
    time: "14:00",
    shares: "60 Shares",
    image: "/images/Logo@2x.png",
    description: "The Art Relay is a unique event that tests an artist's flexibility and innovative thinking. Participants are tasked with creating a single artwork that evolves through multiple phases based on a series of revealed prompts.",
    venue: "Tech Lawn",
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const [clickedEventId, setClickedEventId] = useState<number | null>(null);
  const [cartIds, setCartIds] = useState<number[]>([]);


  // Prevent background scrolling when modal or mobile menu is open
  useEffect(() => {
    if (selectedEvent || mobileMenuOpen) {
      // Save current scroll position
      setScrollPosition(window.scrollY);
      
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPosition);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [selectedEvent, mobileMenuOpen, scrollPosition]);

  // Prefetch rules page for the selected event to speed up navigation
  useEffect(() => {
    if (selectedEvent) {
      try {
        router.prefetch(`/Events/${selectedEvent.id}/rules`);
      } catch {}
    }
  }, [selectedEvent, router]);

  const [showScrollTop, setShowScrollTop] = useState(false);
  // ComingSoonOverlay removed – show main content directly
  const [isPageLoaded, setIsPageLoaded] = useState(true);
  const showComingSoon = false;

  // Map EVENT_CATALOG by id for accurate prices
  const catalogById = useMemo(() => {
    const m = new Map<number, EventCatalogItem>();
    EVENT_CATALOG.forEach(ev => m.set(ev.id, ev));
    return m;
  }, []);

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
    // Save current scroll position and event ID before opening modal
    setScrollPosition(window.scrollY);
    setClickedEventId(event.id);
    try {
      router.prefetch(`/Events/${event.id}/rules`);
    } catch {}
    setSelectedEvent(event);
  };

  const handleClose = () => {
    setSelectedEvent(null);
    setShowRules(false);
    
    // Smooth scroll back to the saved position after a short delay
    setTimeout(() => {
      if (clickedEventId) {
        // Try to scroll to the specific event card
        const eventElement = document.querySelector(`[data-event-id="${clickedEventId}"]`);
        if (eventElement) {
          eventElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        } else {
          // Fallback to saved scroll position
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      } else {
        // Fallback to saved scroll position
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
      setClickedEventId(null);
    }, 100);
  };
  
  const toggleCart = (eventId: number) => {
    setCartIds(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
  };

  // Load cart from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sabrang_cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const ids = parsed.map(n => parseInt(String(n), 10)).filter(n => !Number.isNaN(n));
          setCartIds(ids);
        }
      }
    } catch {}
  }, []);

  // Persist cart whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sabrang_cart', JSON.stringify(cartIds));
    } catch {}
  }, [cartIds]);
  

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

  // IDs of events to show with the poster style (no overlay)
  const posterEventIds = [1, 2, 3, 4, 5, 9, 17];

  // Calculate navigation state
  const currentEventIndex = selectedEvent ? filteredEvents.findIndex(event => event.id === selectedEvent.id) : -1;
  const hasPrevious = currentEventIndex > 0;
  const hasNext = currentEventIndex < filteredEvents.length - 1;

  // Navigation functions for event modal
  const handlePreviousEvent = () => {
    if (hasPrevious) {
      setSelectedEvent(filteredEvents[currentEventIndex - 1]);
    }
  };

  const handleNextEvent = () => {
    if (hasNext) {
      setSelectedEvent(filteredEvents[currentEventIndex + 1]);
    }
  };

  // Keyboard navigation for event modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedEvent) return;
      
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious) {
            e.preventDefault();
            handlePreviousEvent();
          }
          break;
        case 'ArrowRight':
          if (hasNext) {
            e.preventDefault();
            handleNextEvent();
          }
          break;
      }
    };

    if (selectedEvent) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedEvent, hasPrevious, hasNext]);

  // A helper to get catalog data for an event
  const getEventCatalogData = (eventId: number) => {
    // The EVENT_CATALOG is 1-indexed on `id` and might not be a complete list.
    return EVENT_CATALOG.find(e => e.id === eventId);
  };

  const getEventPrizePool = (eventId: number) => {
    // Get prize pool from EVENTS_DATA
    const eventData = EVENTS_DATA.find(e => e.id === eventId);
    return eventData?.prizePool;
  };

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

            {/* Navigation Arrows */}
            {hasPrevious && (
              <button
                aria-label="Previous event"
                onClick={handlePreviousEvent}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-[10001] w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            )}

            {hasNext && (
              <button
                aria-label="Next event"
                onClick={handleNextEvent}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-[10001] w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            )}


            {/* Event Counter */}
            <div className="absolute top-4 left-4 z-[10001] px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm">
              {currentEventIndex + 1} / {filteredEvents.length}
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 max-h-[85vh] md:max-h-[80vh]">
              <div className="relative aspect-video md:aspect-auto md:h-full bg-neutral-900 overflow-hidden flex-shrink-0">
                <img
                  src={selectedEvent.modalImage || '/images/backgrounds/eventpage.webp'}
                  alt={`A unique visual for ${selectedEvent.title}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                  onError={(e) => {
                    // Fallback to a default image if the specified one fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/backgrounds/eventpage.webp';
                  }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FFF 1px, transparent 0)', backgroundSize: '25px 25px' }} />
              </div>
              <div className="p-6 text-white space-y-4 overflow-y-auto md:p-8 md:space-y-6 md:border-l md:border-white/10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{selectedEvent.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                    <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />{getEventCatalogData(selectedEvent.id)?.date || selectedEvent.date}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getEventCatalogData(selectedEvent.id)?.time12hr || selectedEvent.time}
                      {getEventCatalogData(selectedEvent.id)?.endTime12hr && ` - ${getEventCatalogData(selectedEvent.id)?.endTime12hr}`}
                    </span>
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
                  <button onClick={() => router.push(`/checkout`)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition shadow-lg">
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
            className="hidden lg:fixed lg:top-6 lg:right-[120px] lg:z-50 lg:block"
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

          {/* Cart button - to the left of flagship toggle on large screens */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="hidden lg:fixed lg:top-6 lg:right-[360px] lg:z-50 lg:block"
          >
            <button
              onClick={() => {
                router.push('/checkout');
              }}
              className="relative px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 transition cursor-pointer"
            >
              <span className="mr-2">Cart</span>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-semibold">
                {cartIds.length}
              </span>
            </button>
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
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                    {filteredEvents.map((event, index) => {
                      const showPosterStyle = posterEventIds.includes(event.id);
                      return showPosterStyle ? (
                        <motion.div
                          key={event.id}
                          data-event-id={event.id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.04 }}
                          className="rounded-lg overflow-hidden border border-white/10 group cursor-pointer shadow-lg bg-neutral-900/60 flex flex-col"
                          onClick={() => handleCardClick(event)}
                          onMouseEnter={() => { try { router.prefetch(`/Events/${event.id}/rules`); } catch {} }}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(event); } }}
                          tabIndex={0}
                        >
                          {/* Image container */}
                          <div className="relative w-full aspect-[3/4] sm:aspect-[2/3] overflow-hidden">
                            <img
                              loading="lazy"
                              decoding="async"
                              sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                              fetchPriority="low"
                              draggable={false}
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                console.error(`Failed to load image: ${event.image}`);
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/Logo@2x.png'; // Fallback image
                              }}
                            />
                          </div>

                          {/* Content container */}
                          <div className="p-3 md:p-4 flex flex-col flex-grow">
                            <div className="flex flex-col items-start gap-y-1.5 sm:flex-row sm:justify-between sm:items-center mb-2">
                              <div className={`px-2 py-0.5 rounded-sm text-white text-[10px] font-bold uppercase tracking-widest ${event.isFlagship ? 'bg-yellow-500/20 border border-yellow-400/30 text-yellow-300' : 'bg-black/50 border border-white/20'}`}>
                                {event.isFlagship ? '⚡ Flagship' : event.category}
                              </div>
                              <div className="text-white text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded-full border border-white/20">
                                {catalogById.get(event.id)?.price || event.price}
                              </div>
                            </div>

                            <h3 className="font-bold text-sm md:text-base text-white uppercase tracking-wider flex-grow mb-3">
                              {event.title}
                            </h3>

                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); toggleCart(event.id); }}
                              className={`w-full flex items-center justify-center gap-2 rounded-full px-2 py-1.5 md:px-4 md:py-2 border text-[9px] md:text-xs transition-all duration-200 cursor-pointer ${cartIds.includes(event.id) ? 'bg-purple-600/80 border-purple-400/60 text-white shadow-[0_0_12px_rgba(168,85,247,0.45)]' : 'bg-white/10 border-white/30 text-white/90 hover:bg-white/15 backdrop-blur-sm'}`}
                              aria-pressed={cartIds.includes(event.id)}
                            >
                              <ShoppingCart className="w-3 h-3 md:w-3.5 md:h-3.5" />
                              <span className="uppercase tracking-wider">
                                {cartIds.includes(event.id) ? 'Added' : 'Add to cart'}
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={event.id}
                          data-event-id={event.id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.04 }}
                          className="relative rounded-lg overflow-hidden border border-white/10 group cursor-pointer shadow-lg"
                          onClick={() => handleCardClick(event)}
                          onMouseEnter={() => { try { router.prefetch(`/Events/${event.id}/rules`); } catch {} }}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(event); } }}
                          tabIndex={0}
                        >
                          {/* Image container (hidden) */}
                          <div className="relative w-full aspect-[3/4] sm:aspect-[2/3] bg-black/20">
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
                            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #00ff88 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-30" />
                            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-red-400 to-transparent animate-pulse opacity-30 delay-1000" />
                            <div className="relative z-10 flex justify-between items-start">
                              <div className="px-2 md:px-3 py-0.5 md:py-1 bg-black/50 border border-green-400/50 rounded-sm backdrop-blur-sm">
                                <span className="text-[10px] md:text-xs font-bold text-green-400 uppercase tracking-widest" style={{ fontFamily: 'monospace' }}>
                                  {event.isFlagship ? '⚡ FLAGSHIP' : event.category}
                                </span>
                              </div>
                              {event.isFlagship && (<div className="w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-sm border border-green-400/50 flex items-center justify-center animate-pulse"><span className="text-[8px] md:text-xs">🔒</span></div>)}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <div className="relative text-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-red-400/20 animate-pulse opacity-50" />
                                <h3 className="relative font-bold text-sm md:text-lg lg:text-xl text-white px-1 md:px-2 uppercase tracking-widest leading-tight" style={{ textShadow: '0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 255, 136, 0.4)', fontFamily: 'monospace', letterSpacing: '0.2em' }}>{event.title}</h3>
                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" />
                              </div>
                            </div>
                            <div className="relative z-10 flex flex-col justify-end h-full">
                              {getEventPrizePool(event.id) && (<div className="flex justify-center mb-20"><div className="text-white text-[8px] md:text-xs font-bold"><div className="flex items-center gap-1"><Crown className="w-2 h-2 md:w-3 md:h-3" /><span className="font-extrabold tracking-wide">Prize Pool: {getEventPrizePool(event.id)}</span></div></div></div>)}
                              <div className="flex justify-center mb-1.5"><div className="text-white text-[9px] md:text-[10px] font-medium bg-black/40 px-2 py-0.5 rounded-full border border-white/20">{catalogById.get(event.id)?.price || event.price}</div></div>
                              <div className="px-2 md:px-3 py-2 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                                <button type="button" onClick={(e) => { e.stopPropagation(); toggleCart(event.id); }} className={`w-full flex items-center justify-center gap-2 rounded-full px-2 py-1.5 md:px-4 md:py-2 border text-[9px] md:text-xs transition-all duration-200 cursor-pointer ${cartIds.includes(event.id) ? 'bg-purple-600/30 border-purple-400/60 text-white shadow-[0_0_12px_rgba(168,85,247,0.45)]' : 'bg-white/10 border-white/30 text-white/90 hover:bg-white/15'}`} aria-pressed={cartIds.includes(event.id)}>
                                  <span className={`inline-block w-3 h-3 md:w-4 md:h-4 rounded-full ring-1 ${cartIds.includes(event.id) ? 'bg-purple-500 ring-purple-300' : 'bg-transparent ring-white/40'}`}></span>
                                  <span className="uppercase tracking-wider" style={{ fontFamily: 'monospace' }}>{cartIds.includes(event.id) ? 'Added' : 'Add to cart'}</span>
                                </button>
                              </div>
                            </div>
                            <div className="absolute inset-0 border border-green-400/30 rounded-lg" />
                            <div className="absolute inset-0 border border-red-400/20 rounded-lg animate-pulse opacity-50" />
                            <div className="absolute top-1 md:top-2 left-1 md:left-2 w-1.5 md:w-2 h-1.5 md:h-2 border-l border-t border-green-400" />
                            <div className="absolute top-1 md:top-2 right-1 md:right-2 w-1.5 md:w-2 h-1.5 md:h-2 border-r border-t border-red-400" />
                            <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 w-1.5 md:w-2 h-1.5 md:h-2 border-l border-b border-red-400" />
                            <div className="absolute bottom-1 md:bottom-2 right-1 md:right-2 w-1.5 md:w-2 h-1.5 md:h-2 border-r border-b border-green-400" />
                            <div className="absolute top-1/3 left-1/4 w-0.5 md:w-1 h-0.5 md:h-1 bg-green-400 rounded-full animate-ping delay-500" />
                            <div className="absolute bottom-1/3-right-1/4 w-0.5 md:w-1 h-0.5 md:h-1 bg-red-400 rounded-full animate-ping delay-1000" />
                          </div>
                        </motion.div>
                      );
                    })}
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

          {/* Mobile cart button at top-right with 100px right padding */}
          <button
            aria-label="Open cart"
            onClick={() => {
              router.push('/checkout');
            }}
            className={`lg:hidden fixed top-4 right-[100px] z-50 w-12 h-12 rounded-full flex items-center justify-center text-white active:scale-95 transition shadow-xl ${cartIds.length ? 'bg-gradient-to-r from-purple-600 to-pink-600 ring-2 ring-white/20' : 'bg-black/60 backdrop-blur-md border border-white/20 hover:bg-white/10'}`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className={`absolute -top-2 -right-2 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] font-semibold shadow-md ${cartIds.length ? 'bg-white text-black animate-pulse' : 'bg-white/20 text-white'}`}>
                {cartIds.length}
              </span>
            </div>
          </button>

          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-hidden">
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