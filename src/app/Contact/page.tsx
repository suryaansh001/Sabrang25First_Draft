'use client';

import React from 'react';
import ProfileCard from '../../../components/Contact_homepage_OH';

const Contact = () => {
  return (
    <div
      className="min-h-screen text-white font-sans flex flex-col items-center justify-center px-4 py-20"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    >
      <h1 className="text-5xl md:text-7xl font-extrabold mb-16 leading-tight drop-shadow-lg cosmic-text text-center">
        Contact Us
      </h1>

      {/* Row of Profile Cards */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-stretch gap-20 w-full max-w-6xl px-4">
        
        {/* Left Aligned */}
        <div className="flex justify-start w-full md:w-1/3">
          <ProfileCard
            name="Anni"
            title="Organising Head"
            handle="anni_organizer"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/images/OH_images_home/anni.jpeg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={true}
            onContactClick={() => {
              console.log('Contact clicked - Opening contact form or redirecting to contact info');
            }}
          />
        </div>

        {/* Center Aligned */}
        <div className="flex justify-center w-full md:w-1/3">
          <ProfileCard
            name="Diya"
            title="Organising head"
            handle="john_cohead"
            status="Online"
            contactText="Reach Out"
            avatarUrl="/images/OH_images_home/diya.jpeg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={true}
            onContactClick={() => {
              console.log('Contact clicked - Center profile');
            }}
          />
        </div>

        {/* Right Aligned */}
        <div className="flex justify-end w-full md:w-1/3">
          <ProfileCard
            name="Chetesh Sharma"
            title="Organising Head"
            handle="chetsh"
            
            contactText="Message Me"
            avatarUrl="/images/OH_images_home/chetesh.jpeg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={true}
            onContactClick={() => {
              console.log('Contact clicked - Right profile');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
