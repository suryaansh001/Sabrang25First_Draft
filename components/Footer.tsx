'use client';

import React from 'react';
import Image from 'next/image';
import Logo from '../public/images/Logo.svg';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-pink-800 to-indigo-900 text-white">
      {/* Top Section - Three Columns */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CONTACT US */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  JK Lakshmipat University, Near Mahindra SEZ, Ajmer Road, Jaipur, Rajasthan 302026
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="w-5 h-5 text-white" />
                <p className="text-sm">+91 141 7107500</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-white" />
                <p className="text-sm">info@jklu.edu.in</p>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6 text-white">Quick Links</h3>
            <div className="space-y-3">
              <a href="/" className="block text-sm hover:text-gray-300 transition-colors">About</a>
              <a href="/FAQ" className="block text-sm hover:text-gray-300 transition-colors">Schedule</a>
              <a href="/Team" className="block text-sm hover:text-gray-300 transition-colors">Speakers</a>
              <a href="https://jklu.edu.in" target="_blank" rel="noopener noreferrer" className="block text-sm hover:text-gray-300 transition-colors">University Website</a>
              <a href="#" className="block text-sm hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="block text-sm hover:text-gray-300 transition-colors">Terms & Conditions</a>
              <a href="#" className="block text-sm hover:text-gray-300 transition-colors">Refund & Cancellation Policy</a>
              <a href="/Contact" className="block text-sm hover:text-gray-300 transition-colors">Contact Us</a>
            </div>
          </div>

          {/* FOLLOW US */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6 text-white">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
            {/* University Campus Image */}
            <div className="w-full h-32 rounded-lg overflow-hidden">
              <Image 
                src="/images/building-6011756_1280.jpg" 
                alt="JK Lakshmipat University Campus" 
                width={300} 
                height={128} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - LOCATION */}
      <div className="border-t border-white/20 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-bold uppercase mb-6 text-white text-center">Location</h3>
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full h-80 rounded-lg overflow-hidden border border-white/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.105288737097!2d75.64772927553119!3d26.836603276692568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4af4fe68f403%3A0x3bf05f95df22b8c4!2sJK%20Lakshmipat%20University!5e0!3m2!1sen!2sin!4v1749983502958!5m2!1sen!2sin"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JK Lakshmipat University Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="bg-black/30 px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-300">
          <div>
            ©2025 Sabrang - JK Lakshmipat University. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
