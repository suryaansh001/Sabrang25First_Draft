'use client';

import React, { useState } from 'react';
import Logo from '../../../components/Logo';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';
import { Home, Info, Calendar, Star, Users, HelpCircle, Handshake, Mail as MailIcon, X, Phone, MessageCircle } from 'lucide-react';

const Contact = () => {
  const router = useRouter();
  const { navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileNavItems = [
    { title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <MailIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen text-white relative">
      {/* Simple background */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/backgrounds/faq.webp)'
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70" />
      
      <Logo />

      {/* Mobile hamburger */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3"
      >
        <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
        <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
        <span className="block h-0.5 bg-white/80 rounded-full w-4" />
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/90">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="pt-20 px-6">
            <div className="space-y-4">
              {mobileNavItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => { setMobileMenuOpen(false); navigate(item.href); }}
                  className="flex items-center gap-3 p-3 w-full text-left text-white hover:bg-white/10 rounded-lg"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="pt-32 px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto">
            Have questions? Need help with registration? We're here to help make your experience smooth and memorable.
          </p>
        </div>

        {/* Main contact info */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Left side - Organizing Head */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-orange-400">Organizing Head</h2>
                <div className="bg-black/30 p-6 rounded-lg border-l-4 border-orange-400">
                  <h3 className="text-xl font-semibold mb-2">DIYA GARG</h3>
                  {/* <p className="text-orange-300 mb-4">Organizing Head</p> */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    The person behind all the coordination magic. Reach out for any event-related queries, 
                    partnerships, or if you need someone who knows exactly what's happening when and where.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MailIcon className="w-4 h-4 text-orange-400" />
                      <a href="mailto:diyagarg@jklu.edu.in" className="text-gray-300 hover:text-white">
                        diyagarg@jklu.edu.in
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-orange-400" />
                      <a href="tel:+917296859397" className="text-gray-300 hover:text-white">
                        +91 72968 59397
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-400">Usually responds within a few hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Registration Team */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-blue-400">Registration Help</h2>
                <div className="space-y-6">
                  
                  <div className="bg-black/30 p-6 rounded-lg border-l-4 border-blue-400">
                    <h3 className="text-lg font-semibold mb-1">Ayushi Kabra</h3>
                    <p className="text-blue-300 text-sm mb-4">RegistrationS Core</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <MailIcon className="w-4 h-4 text-blue-400" />
                        <a href="mailto:ayushikabra@jklu.edu.in" className="text-gray-300 hover:text-white">
                          ayushikabra@jklu.edu.in
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <a href="tel:+918949941985" className="text-gray-300 hover:text-white">
                          +91 89499 41985
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 p-6 rounded-lg border-l-4 border-purple-400">
                    <h3 className="text-lg font-semibold mb-1">Jayash Gehlot</h3>
                    <p className="text-purple-300 text-sm mb-4">Registrations Core</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <MailIcon className="w-4 h-4 text-purple-400" />
                        <a href="mailto:jayashgehlot@jklu.edu.in" className="text-gray-300 hover:text-white">
                          jayashgehlot@jklu.edu.in
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-purple-400" />
                        <a href="tel:+918306274199" className="text-gray-300 hover:text-white">
                          +91 83062 74199
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick tips section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-black/40 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Best Ways to Reach Us</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-cyan-400">Quick Questions</h3>
                <p className="text-gray-300 text-sm">
                  WhatsApp or call any of our registration team members for immediate help
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-green-400">Detailed Inquiries</h3>
                <p className="text-gray-300 text-sm">
                  Email works best for complex questions or when you need detailed information
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-yellow-400">Partnership/Sponsorship</h3>
                <p className="text-gray-300 text-sm">
                  Contact Diya directly for any collaboration or sponsorship opportunities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Simple FAQ teaser */}
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <p className="text-gray-400 mb-4">
            Can't find what you're looking for?
          </p>
          <button 
            onClick={() => navigate('/FAQ')}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Check out our FAQ section
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;