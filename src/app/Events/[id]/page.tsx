use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Star, ArrowLeft, Share2, Heart, Download, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  date: string;
  time: string;
  venue: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  image: string;
  featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
  tags: string[];
  rules: string[];
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  requirements: string[];
  timeline: {
    date: string;
    event: string;
    time: string;
  }[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  gallery: string[];
}

// Sample detailed event data
const getEventDetails = (id: string): Event | null => {
  const events: { [key: string]: Event } = {
    '1': {
      id: '1',
      title: 'Panache - Fashion Show',
      category: 'Cultural',
      description: 'The grandest runway event showcasing elegance, charisma, and original collections.',
      fullDescription: 'Panache is the flagship fashion show of Sabrang 2025, featuring the most talented designers and models from across the region. This event celebrates creativity, style, and innovation in fashion. Participants will showcase their original collections, from haute couture to streetwear, in front of a distinguished panel of judges and a captivated audience. The event includes multiple rounds: preliminary screening, theme-based collections, and the grand finale. Winners will receive cash prizes, certificates, and opportunities to showcase their work at professional fashion events.',
      date: '2024-03-15',
      time: '19:00',
      venue: 'Main Auditorium',
      maxParticipants: 50,
      currentParticipants: 32,
      price: 299,
      image: '/posters/PANACHE.webp',
      featured: true,
      status: 'upcoming',
      tags: ['fashion', 'runway', 'creative'],
      rules: [
        'Each participant can showcase a maximum of 8 outfits',
        'Original designs are mandatory - no copied designs allowed',
        'Time limit: 3-5 minutes per participant',
        'Music should be provided by participants',
        'Professional makeup and styling recommended',
        'No offensive or inappropriate content',
        'Judges decision will be final'
      ],
      prizes: {
        first: '₹10,000 + Certificate + Trophy',
        second: '₹5,000 + Certificate + Medal',
        third: '₹3,000 + Certificate + Medal'
      },
      requirements: [
        'Valid college ID',
        'Completed registration form',
        'Portfolio of designs (if applicable)',
        'Music file in MP3 format',
        'Emergency contact details'
      ],
      timeline: [
        { date: '2024-03-10', event: 'Registration Deadline', time: '23:59' },
        { date: '2024-03-12', event: 'Preliminary Screening', time: '14:00' },
        { date: '2024-03-14', event: 'Rehearsal & Setup', time: '16:00' },
        { date: '2024-03-15', event: 'Main Event', time: '19:00' }
      ],
      contact: {
        name: 'Sarah Johnson',
        phone: '+91 98765 43210',
        email: 'panache@sabrang2025.com'
      },
      gallery: [
        '/images/gallery_desktop/gallery1.webp',
        '/images/gallery_desktop/gallery2.webp',
        '/images/gallery_desktop/gallery3.webp'
      ]
    },
    '2': {
      id: '2',
      title: 'Bandjam - Music Competition',
      category: 'Cultural',
      description: 'A showdown of student bands across genres including rock, indie, fusion, and classical music.',
      fullDescription: 'Bandjam brings together the most talented musical groups from colleges across the region for an epic musical battle. Bands will compete across multiple genres including rock, indie, fusion, classical, and contemporary music. The competition features multiple rounds: preliminaries, semi-finals, and the grand finale. Each band will get 15 minutes to perform, including setup time. Original compositions are encouraged and will receive bonus points. The event is judged by professional musicians and industry experts.',
      date: '2024-03-16',
      time: '18:30',
      venue: 'Open Air Theatre',
      maxParticipants: 20,
      currentParticipants: 15,
      price: 199,
      image: '/posters/BANDJAM.webp',
      featured: true,
      status: 'upcoming',
      tags: ['music', 'bands', 'competition'],
      rules: [
        'Maximum 6 members per band',
        'Performance time: 12 minutes (including setup)',
        'Original compositions get bonus points',
        'All instruments must be brought by participants',
        'Sound check will be provided 30 minutes before performance',
        'No explicit content in lyrics',
        'Judges decision will be final'
      ],
      prizes: {
        first: '₹15,000 + Certificate + Trophy',
        second: '₹8,000 + Certificate + Medal',
        third: '₹5,000 + Certificate + Medal'
      },
      requirements: [
        'Valid college ID for all members',
        'Completed registration form',
        'List of songs to be performed',
        'Technical requirements list',
        'Band profile and bio'
      ],
      timeline: [
        { date: '2024-03-10', event: 'Registration Deadline', time: '23:59' },
        { date: '2024-03-13', event: 'Preliminary Round', time: '14:00' },
        { date: '2024-03-15', event: 'Semi-finals', time: '16:00' },
        { date: '2024-03-16', event: 'Grand Finale', time: '18:30' }
      ],
      contact: {
        name: 'Michael Chen',
        phone: '+91 87654 32109',
        email: 'bandjam@sabrang2025.com'
      },
      gallery: [
        '/images/gallery_desktop/gallery1.webp',
        '/images/gallery_desktop/gallery2.webp',
        '/images/gallery_desktop/gallery3.webp'
      ]
    }
  };
  
  return events[id] || null;
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const eventData = getEventDetails(params.id);
    setEvent(eventData);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-3xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-8">The event you're looking for doesn't exist.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/Events')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </motion.button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/images/backgrounds/herobg.webp')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/Events')}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                  {event.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  event.status === 'upcoming' ? 'bg-green-500/20 text-green-300' :
                  event.status === 'ongoing' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {event.status}
                </span>
                {event.featured && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <p className="text-xl text-gray-300">
                {event.description}
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-lg transition-all duration-300"
              >
                <Share2 className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-80 md:h-96 rounded-2xl overflow-hidden"
            >
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
              <p className="text-gray-300 leading-relaxed">
                {event.fullDescription}
              </p>
            </motion.div>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Rules & Guidelines</h2>
              <ul className="space-y-3">
                {event.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{rule}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Event Timeline</h2>
              <div className="space-y-4">
                {event.timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-300 font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{item.event}</h3>
                      <p className="text-gray-400">{item.date} at {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery.map((image, index) => (
                  <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">{event.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">{event.venue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">{event.currentParticipants}/{event.maxParticipants} registered</span>
                </div>
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Registration Fee</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">₹{event.price}</div>
                <p className="text-gray-400">Per participant</p>
              </div>
            </motion.div>

            {/* Prizes */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Prizes</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-white font-semibold">1st Place</div>
                    <div className="text-gray-400 text-sm">{event.prizes.first}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-white font-semibold">2nd Place</div>
                    <div className="text-gray-400 text-sm">{event.prizes.second}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-white font-semibold">3rd Place</div>
                    <div className="text-gray-400 text-sm">{event.prizes.third}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
              <ul className="space-y-2">
                {event.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-white font-semibold">{event.contact.name}</div>
                  <div className="text-gray-400 text-sm">{event.contact.phone}</div>
                  <div className="text-gray-400 text-sm">{event.contact.email}</div>
                </div>
              </div>
            </motion.div>

            {/* Registration Button */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="sticky top-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRegistration(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                Register Now - ₹{event.price}
              </motion.button>
              <p className="text-center text-gray-400 text-sm mt-2">
                {event.maxParticipants - event.currentParticipants} spots remaining
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Registration</h3>
            <p className="text-gray-300 mb-6">
              Registration for {event.title} will open soon. Stay tuned for updates!
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRegistration(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Close
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRegistration(false)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Notify Me
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
