'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, CheckCircle, ArrowRight, Download, Megaphone, Eye, Star as StarIcon, Briefcase, Home, Info, Calendar, Clock, HelpCircle, Handshake, Mail } from 'lucide-react';
import { useNavigation } from '../../../components/NavigationContext';

// --- Data from your sponsorship deck ---

const generalInfo = {
  festival: "Sabrang 2025",
  theme: "Noorvana: From Color to Cosmos",
  description: "Sabrang is JKLU’s premier annual cultural festival, celebrating creativity, entertainment, and immersive experiences. It attracts students, artists, and performers nationwide, creating an atmosphere of music, technology, and artistic expression.",
  heroSubtitle: "A strategic partnership opportunity to connect your brand with thousands of India's brightest young minds at the intersection of culture and innovation."
};

const flagshipEvents = [

  { name: "Panache (Fashion Show)", description: "The grandest runway event showcasing elegance, charisma, and original collections.", href: "/Events/1/rules" },
  { name: "Bandjam", description: "A showdown of student bands across genres (rock, indie, fusion, classical).", href: "/Events/2/rules" },
  { name: "Dance Battle", description: "One-on-one & crew battles across hip-hop, freestyle, krumping, fusion.", href: "/Events/3/rules" },
  { name: "Step Up (Solo Dance)", description: "The ultimate solo dance challenge testing creativity and stage command.", href: "/Events/4/rules" },


];

const whySponsor = [
  { title: "Extensive Media Coverage", description: "Wide promotion across print, digital, and social media.", icon: Megaphone },
  { title: "Unparalleled Visibility", description: "Prominent logo placement on banners, brochures, certificates, merchandise, digital creatives, and main stage backdrops.", icon: Eye },
  { title: "Engagement & Activation", description: "Premium stall space, co-hosting rights for flagship events, and high-impact social media promotions.", icon: StarIcon },
  { title: "Valuable Audience", description: "Connect with thousands of students, influencers, and young professionals from across India.", icon: Users }
];

const sponsorshipTiers = [
  {
    name: "Title Sponsor",
    price: "₹5,00,000",
    featured: true,
    sections: {
      branding: [
        "“Sabrang 2025 – Presented by [Brand Name]” across all platforms.",
        "Most prominent logo placement (stage backdrops, brochures, digital creatives, T-shirts, etc.).",
        "Top-row placement in press releases, website, and communications."
      ],
      engagement: [
        "Premium stall space.",
        "Sponsor a flagship event.",
        "Brand announcements.",
        "8+ social media promotions & sponsor reel in aftermovie."
      ],
      privileges: ["10 VIP passes", "On-stage felicitation", "Branded goodies in fest kits"]
    }
  },
  {
    name: "Co-Powered By",
    price: "₹3,50,000",
    featured: false,
    sections: {
      branding: [
        "“Co-Powered by [Brand Name]” on all digital and on-ground assets.",
        "Logo on stage panels, posters, T-shirts, digital creatives (medium prominence)."
      ],
      engagement: [
        "Premium stall space.",
        "Sponsor a flagship event.",
        "Announcements.",
        "5–6 social media promotions & mentions in newsletters."
      ],
      privileges: ["6 exclusive passes", "Felicitation on final day", "Vouchers in welcome kits"]
    }
  },
  {
    name: "Associate Sponsor",
    price: "₹2,50,000",
    featured: false,
    sections: {
      branding: ["Logo on select digital materials, posters, certificates, and venue signage."],
      engagement: [
        "Optional stall space.",
        "One-time stage acknowledgment.",
        "Branding in zones (food/exhibition).",
        "3–4 social media shout-outs."
      ],
      privileges: ["4 general passes", "Appreciation certificate", "Access to post-event media"]
    }
  },
  {
    name: "In-Kind Sponsors",
    price: "Flexible Value",
    featured: false,
    description: "Non-monetary contributions to reduce costs & enrich the fest. Visibility is equivalent to the contribution value (logos, stage mentions, stall space, social media shout-outs).",
    examples: [
      "Product sampling",
      "Merchandise",
      "Photography",
      "Food/refreshments",
      "Trophies & certificates"
    ]
  }
];

// --- Reusable Components ---

const TierCard = ({ tier, index }: { tier: any, index: number }) => (
  <motion.div
    className={`group relative bg-black/60 backdrop-blur-md border rounded-2xl p-8 flex flex-col h-full shadow-2xl ${tier.featured ? 'border-blue-400' : 'border-white/20'}`}
    variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ y: -8, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    transition={{ type: 'spring', stiffness: 400, damping: 30, delay: index * 0.1 }}
  >
    {tier.featured && <div className="absolute top-0 right-8 -mt-4 px-3 py-1 text-sm font-semibold rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/50">Most Popular</div>}
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
      <div className="text-5xl font-extrabold text-white">{tier.price}</div>
    </div>
    <div className="space-y-6 flex-grow mb-8">
      {tier.description ? (
        <p className="text-gray-400">{tier.description}</p>
      ) : tier.sections ? (
        Object.entries(tier.sections).map(([key, value]) => (
          <div key={key}>
            <h4 className="font-semibold text-blue-300 uppercase tracking-wider text-sm mb-2">{key}</h4>
            <ul className="space-y-2">
              {(value as string[]).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : null}
      {tier.examples && (
         <div>
            <h4 className="font-semibold text-blue-300 uppercase tracking-wider text-sm mb-2">Examples</h4>
            <ul className="space-y-2">
              {tier.examples.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
      )}
    </div>
  </motion.div>
);

interface FormField {
  name: string;
  label: string; 
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

const contactFields: FormField[] = [
  { name: 'companyName', label: 'Company Name', type: 'text', required: true, placeholder: 'Enter your company name' }, 
  { name: 'contactPerson', label: 'Contact Person', type: 'text', required: true, placeholder: 'Enter your name' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'Enter your email' },
  { name: 'phone', label: 'Phone Number', type: 'phone', placeholder: 'Enter your phone number' },
  { name: 'sponsorshipAmount', label: 'Sponsorship Amount', type: 'select', options: [
    { value: '50000 - 100000', label: '₹50,000 - ₹1,00,000' },
    { value: '100000 - 200000', label: '₹1,00,001 - ₹2,00,000' },
    { value: '200000 - 500000', label: '₹2,00,001 - ₹5,00,000' },
    { value: '500000+', label: '₹5,00,000+' }
  ] },
  { name: 'preferredTiming', label: 'Preferred Call Time', type: 'select', options: [
    { value: 'Morning', label: 'Morning (9 AM - 12 PM)' },
    { value: 'Afternoon', label: 'Afternoon (12 PM - 5 PM)' },
    { value: 'Evening', label: 'Evening (5 PM - 8 PM)' }
  ] },
];
// --- Main Page Component ---

export default function WhySponsorUsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigate } = useNavigation();

  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isFormOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFormOpen, mobileMenuOpen]);

  // Navigation items for mobile menu
  const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <StarIcon className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/eventpage.webp)'
        }}
      />
      
      {/* Glassy Translucent Overlay */}
      <div className="fixed inset-0 -z-10 bg-black/50 backdrop-blur-sm" />

      {/* Mobile top-left logo */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <a href="/" aria-label="Go to homepage">
          <img
            src="/images/Logo@2x.png"
            alt="Logo"
            className="h-10 w-auto cursor-pointer"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/Logo.svg'; }}
          />
        </a>
      </div>

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
          <div className="pt-20 px-6">
            <div className="grid grid-cols-1 gap-3">
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

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 text-center overflow-hidden pt-24 lg:pt-24">
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.3 }}
          variants={{ hidden: {}, visible: {} }}
        >
          <motion.div
            className="mb-8"
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
              SABRANG 2025
            </h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-1 bg-gradient-to-r from-pink-400 to-purple-400 mb-6 lg:mb-8 mx-auto"
            />
            <p className="text-xl md:text-2xl text-blue-300/80 mb-4 tracking-widest">Why Sponsor Us</p>
          </motion.div>
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
          >
            A strategic partnership opportunity to connect your brand with thousands of India's brightest young minds at the intersection of culture and innovation.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
          >
            <button
              onClick={() => setIsFormOpen(true)}
              className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105"
            > 
              Become a Partner <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="/Sponsorship_Deck_Sabrang_2025.pdf"
              download
              className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold bg-white/10 border border-white/20 rounded-full text-white transition-all duration-300 hover:bg-white/20 transform hover:scale-105"
            >
              Download Deck <Download className="w-5 h-5" /> 
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Sponsor Us Section */}
      <section className="relative z-10 py-20 px-6 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-tl from-pink-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-full blur-xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: 0.2 }}
            variants={{ hidden: {}, visible: {} }}
          >
            <motion.div
              className="inline-block mb-6"
              variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } }}
            >
              <div className="w-20 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full mx-auto animate-pulse" style={{ animationDuration: '3s' }}></div>
            </motion.div>
            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
            >
              The Sabrang Advantage
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } } }}
            >
              Leverage our platform to achieve your brand's strategic objectives and connect with India's brightest minds.
            </motion.p>
          </motion.div>
          
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.2 }}
          >
            {whySponsor.map((benefit, index) => {
              const colors = [
                'from-blue-500/20 to-cyan-500/20',
                'from-purple-500/20 to-pink-500/20', 
                'from-yellow-500/20 to-orange-500/20',
                'from-green-500/20 to-teal-500/20'
              ];
              const iconColors = [
                'text-blue-400 group-hover:text-cyan-400',
                'text-purple-400 group-hover:text-pink-400',
                'text-yellow-400 group-hover:text-orange-400', 
                'text-green-400 group-hover:text-teal-400'
              ];
              
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={{ hidden: { opacity: 0, y: 40, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {/* Glowing background effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-br ${colors[index]} rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Main card */}
                  <div className="relative bg-black/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-black/80 transition-all duration-500 h-full">
                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                      <div className="absolute top-1/2 right-2 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
                    </div>
                    
                    {/* Icon container with enhanced effects */}
                    <div className="relative mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[index]} border border-white/20 group-hover:border-white/40 transition-all duration-500`}>
                        <benefit.icon className={`w-8 h-8 ${iconColors[index]} transition-all duration-500 group-hover:scale-110`} />
                      </div>
                      {/* Icon glow effect */}
                      <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[index]} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {benefit.description}
                    </p>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Bottom decorative elements */}
          <motion.div
            className="mt-20 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.5 }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <div className="inline-flex items-center gap-4 text-gray-400">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/30"></div>
              <span className="text-sm font-medium tracking-widest uppercase">Trusted by Leading Brands</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/30"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Flagship Events Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: 0.2 }}
            variants={{ hidden: {}, visible: {} }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              A Glimpse of the Spectacle
            </motion.h2>
            <motion.p
              className="text-lg text-gray-400 max-w-3xl mx-auto"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } } }}
            >
              Our flagship events are the heart of Sabrang, drawing massive crowds and media attention.
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {flagshipEvents.map((event, index) => {
               const eventImages = [
                 '/images/about-section/Panache.png',
                 '/images/about-section/Bandjam.png', 
                 '/images/about-section/Dance.png',
                 '/images/stepup.JPG'
               ];
              
              return (
                <a href={event.href} aria-label={`View ${event.name}`} className="block group focus:outline-none focus:ring-2 focus:ring-white/40 rounded-2xl h-full" key={event.name}>
                  <motion.div
                    className="group relative overflow-hidden rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl h-full flex flex-col"
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ y: -10, scale: 1.05, boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.3)" }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.1 }}
                  >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={eventImages[index]}
                        alt={event.name}
                        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${index === 1 ? 'object-top' : ''}`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                    
                    {/* Event Info */}
                    <div className="relative p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors mb-4 flex-grow">
                        {event.description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors mt-auto">
                        Explore details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers Section */}
      <section className="relative z-10 py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: 0.2 }}
            variants={{ hidden: {}, visible: {} }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              Partnership Tiers
            </motion.h2>
            <motion.p
              className="text-lg text-gray-400 max-w-3xl mx-auto"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } } }}
            >
              Choose a level of partnership that aligns with your brand's vision and goals.
            </motion.p>
          </motion.div>
          
          <motion.div
            className="grid lg:grid-cols-3 gap-8 items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {sponsorshipTiers.map((tier, index) => (
              <TierCard key={index} tier={tier} index={index} />
            ))}
          </motion.div>
        </div>
      </section>


      <AnimatePresence>
       {isFormOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFormOpen(false)}
          >
             <motion.div
               className="bg-black/80 backdrop-blur-xl text-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               transition={{ type: 'spring', stiffness: 400, damping: 30 }}
               onClick={(e) => e.stopPropagation()}
             >
               <div className="bg-black/60 backdrop-blur-md text-white p-6 rounded-t-2xl relative flex justify-between items-center border-b border-white/20">
                <div>
                  <h2 className="text-2xl font-bold">Partnership Inquiry</h2>
                  <p className="text-gray-400">Let's create something extraordinary together.</p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

                <form  className="p-8 space-y-4">
                 {contactFields.map((field, index) => (
                 <div key={index}> 
                 <label htmlFor={field.name} className="block text-gray-300 text-sm font-medium mb-2">{field.label}</label>
                   {field.type === 'text' && (
                     <input
                     type="text"
                     id={field.name}
                     name={field.name}
                    placeholder={field.placeholder}
                       className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300" /> 
                      )}
                                {field.type === 'email' && (
                     <input
                     type="email"
                     id={field.name}
                     name={field.name}
                     placeholder={field.placeholder}
                       className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300" /> 
                      )}
                            {field.type === 'phone' && (
                     <input
                     type="tel"
                     id={field.name}
                     name={field.name}
                    placeholder={field.placeholder}
                       className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300" /> 
                      )}
                     {field.type === 'select' && (
                       <select
                          id={field.name}
                          name={field.name}
                       className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300">
                       <option value="">Select {field.label}</option>
                        {field.options && field.options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                        </select>
                    )}
                 </div>
                  ))}
        
            <div className="flex items-center justify-between">
            <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Submit
      </button>
  </div>
    </form>
       </motion.div>
          </motion.div>
         )}

            </AnimatePresence>


        
     

    

    </div>
  );
}
  