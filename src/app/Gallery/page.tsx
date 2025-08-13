import React from 'react';
import { InfiniteMovingCards } from '../../../components/infinite-moving-cards';
import { InfiniteMovingImages } from '../../../components/infinite-moving-images';
import SidebarDock from '../../../components/SidebarDock';
import Logo from '../../../components/Logo';
import Footer from '../../../components/Footer';

const testimonials1 = [
  {
    quote: "Sabrang '25 was an unforgettable experience! The energy and creativity on display were absolutely amazing.",
    name: "Sarah Johnson",
    title: "Event Attendee"
  },
  {
    quote: "The cultural performances were mesmerizing. Each act told a unique story that touched our hearts.",
    name: "Michael Chen",
    title: "Cultural Enthusiast"
  },
  {
    quote: "The organization and execution of Sabrang '25 was flawless. A perfect blend of tradition and innovation.",
    name: "Priya Sharma",
    title: "Event Coordinator"
  },
  {
    quote: "The atmosphere was electric! Every moment was filled with joy and celebration.",
    name: "David Kumar",
    title: "Student Participant"
  },
  {
    quote: "Sabrang '25 brought together the best of art, music, and culture in one spectacular event.",
    name: "Ananya Patel",
    title: "Art Director"
  }
];

const testimonials2 = [
  {
    quote: "The dance performances were absolutely breathtaking. Each movement told a story of its own.",
    name: "Rahul Verma",
    title: "Dance Enthusiast"
  },
  {
    quote: "The music performances were soul-stirring. I've never experienced such beautiful melodies.",
    name: "Meera Kapoor",
    title: "Music Critic"
  },
  {
    quote: "The art exhibition was a visual treat. The creativity and talent on display was inspiring.",
    name: "Arjun Singh",
    title: "Art Curator"
  },
  {
    quote: "The food festival was a gastronomic delight. Each dish was a celebration of culture.",
    name: "Zara Khan",
    title: "Food Blogger"
  },
  {
    quote: "The fashion show was a perfect blend of tradition and contemporary style.",
    name: "Neha Gupta",
    title: "Fashion Designer"
  }
];

const images = [
  {
    image: '/images/building-6011756_1280.jpg',
    alt: 'Building 1',
  },
  {
    image: '/images/building-6011756_1280.jpg',
    alt: 'Building 2',
  },
  {
    image: '/images/building-6011756_1280.jpg',
    alt: 'Building 3',
  },
  {
    image: '/images/building-6011756_1280.jpg',
    alt: 'Building 4',
  },
  {
    image: '/images/building-6011756_1280.jpg',
    alt: 'Building 5',
  },
];

const Gallery = () => {
  return (
    <div className="min-h-screen text-white font-sans relative">
      <Logo />
      <SidebarDock />
      
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight drop-shadow-lg text-purple-400 text-center">
          Gallery
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl text-center mb-16">
          Relive the moments from Sabrang '25!
        </p>
        
        <div className="w-full space-y-4">
          <InfiniteMovingImages
            items={images}
            direction="left"
            speed="normal"
            pauseOnHover={true}
            className="mt-8 h-[300px]"
          />
          <InfiniteMovingImages
            items={images}
            direction="right"
            speed="normal"
            pauseOnHover={true}
            className="mt-8 h-[300px]"
          />
        </div>
      </div>
      
      {/* Footer outside main container */}
      <Footer />
    </div>
  );
};

export default Gallery; 