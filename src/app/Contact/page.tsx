'use client';

import React, { useState } from 'react';
import Logo from '../../../components/Logo';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';
import { Home, Info, Calendar, Star, Users, HelpCircle, Handshake, Mail as MailIcon, X, Phone, MessageCircle, Send, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const router = useRouter();
  const { navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.query) {
      setSubmitMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setSubmitMessage('Please enter a valid phone number.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Initialize EmailJS
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_CONTACT_PUBLIC_KEY || '');

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        query: formData.query,
        to_email: process.env.NEXT_PUBLIC_CONTACT_RECIPIENT_EMAIL || 'info@sabrang.com',
        submission_date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      };

      // Send email using EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || '',
        templateParams
      );

      setSubmitMessage('Thank you! Your query has been sent successfully. We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        query: ''
      });
      
      // Close form after 3 seconds
      setTimeout(() => {
        setShowForm(false);
        setSubmitMessage('');
      }, 3000);

    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitMessage('There was an error sending your message. Please try again or contact us directly.');
    }
    
    setIsSubmitting(false);
  };

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
                    <p className="text-blue-300 text-sm mb-4">Registration Core</p>
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
                    <h3 className="text-lg font-semibold mb-1">Jayash Gahlot</h3>
                    <p className="text-purple-300 text-sm mb-4">Registration Core</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <MailIcon className="w-4 h-4 text-purple-400" />
                        <a href="mailto:jayashgahlot@jklu.edu.in" className="text-gray-300 hover:text-white">
                          jayashgahlot@jklu.edu.in
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

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Have a Query?</h2>
            <p className="text-gray-300 mb-6">
              Can't find the information you need? Send us your question and we'll get back to you quickly.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Send us a Message
            </button>
          </div>
        </div>

        {/* Contact Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
            >
              <motion.div
                className="bg-black/90 backdrop-blur-xl text-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-black/60 backdrop-blur-md text-white p-6 rounded-t-2xl relative flex justify-between items-center border-b border-white/20">
                  <div>
                    <h2 className="text-2xl font-bold">Contact Us</h2>
                    <p className="text-gray-400">We'd love to hear from you. Send us a message!</p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  {/* Important Notice */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-200 text-sm font-medium mb-1">Important Notice</p>
                      <p className="text-yellow-100 text-sm">
                        Please ensure that the phone number and email address you enter are valid. 
                        We will use these to contact you regarding your query.
                      </p>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter a valid email address"
                      required
                      className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-gray-300 text-sm font-medium mb-2">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter a valid phone number (with country code if international)"
                      required
                      className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300"
                    />
                  </div>

                  {/* Query Field */}
                  <div>
                    <label htmlFor="query" className="block text-gray-300 text-sm font-medium mb-2">
                      Your Query <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="query"
                      name="query"
                      value={formData.query}
                      onChange={handleInputChange}
                      placeholder="Please describe your question or concern in detail..."
                      required
                      rows={5}
                      className="w-full py-3 px-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all duration-300 resize-vertical"
                    />
                  </div>

                  {/* Submit Message */}
                  {submitMessage && (
                    <div className={`p-4 rounded-lg text-center ${submitMessage.includes('successfully') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {submitMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-end">
                    <button
                      className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
