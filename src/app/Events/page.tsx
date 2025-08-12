'use client';
import { useMemo } from 'react';
import EventCarousel from '../../../components/EventCarousel';

const categories = [
  {
    name: 'Cultural',
    events: [
      { title: 'Panache', image: '/images/building-6011756_1280.jpg', description: 'A grand fashion show showcasing creativity and style.', date: 'March 15, 2025', prize: '₹50,000', registration: 'Team of 4-6', video: '/video/853828-hd_1920_1080_25fps.mp4' },
      { title: 'Band Jam', image: '/events/bandjam.jpg', description: 'Battle of the bands - rock, metal, and fusion.', date: 'March 16, 2025', prize: '₹40,000', registration: 'Team of 4-8', video: '/video/2421545-uhd_3840_2160_30fps.mp4' },
      { title: 'Fashion Show', image: '/events/fashionshow.jpg', description: 'Showcase your unique style and creativity.', date: 'March 17, 2025', prize: '₹35,000', registration: 'Team of 3-5', video: '/video/854569-hd_1920_1080_25fps.mp4' },
      { title: 'Street Play', image: '/events/streetplay.jpg', description: 'Express social issues through street theater.', date: 'March 18, 2025', prize: '₹30,000', registration: 'Team of 8-12', video: '/video/1528503-uhd_3840_2160_25fps.mp4' },
      { title: 'Dance Battle', image: '/events/dancebattle.jpg', description: 'Show your moves in this electrifying dance competition.', date: 'March 19, 2025', prize: '₹25,000', registration: 'Solo/Duo', video: '/video/2018959-hd_1920_1080_30fps.mp4' },
      { title: 'Nukkad Natak', image: '/events/nukkadnatak.jpg', description: 'Street play competition with social messages.', date: 'March 20, 2025', prize: '₹20,000', registration: 'Team of 6-10', video: '/video/853828-hd_1920_1080_25fps.mp4' },
      { title: 'Solo Singing', image: '/events/solosinging.jpg', description: 'Showcase your vocal talent in this solo competition.', date: 'March 21, 2025', prize: '₹15,000', registration: 'Individual', video: '/video/2421545-uhd_3840_2160_30fps.mp4' },
      { title: 'Group Dance', image: '/events/groupdance.jpg', description: 'Synchronized group dance performance.', date: 'March 22, 2025', prize: '₹20,000', registration: 'Team of 6-12', video: '/video/854569-hd_1920_1080_25fps.mp4' },
    ],
  },
  {
    name: 'Technical',
    events: [
      { title: 'Hackathon', image: '/events/hackathon.jpg', description: '24-hour coding competition to solve real-world problems.', date: 'March 15, 2025', prize: '₹1,00,000', registration: 'Team of 2-4', video: '/video/1528503-uhd_3840_2160_25fps.mp4' },
      { title: 'Tech Quiz', image: '/events/techquiz.jpg', description: 'Test your knowledge in technology and science.', date: 'March 16, 2025', prize: '₹50,000', registration: 'Team of 2', video: '/video/2018959-hd_1920_1080_30fps.mp4' },
      { title: 'Robo Wars', image: '/events/robowars.jpg', description: 'Battle of the robots in an epic arena.', date: 'March 17, 2025', prize: '₹75,000', registration: 'Team of 3-4', video: '/video/853828-hd_1920_1080_25fps.mp4' },
      { title: 'Circuit Design', image: '/events/circuitdesign.jpg', description: 'Design and implement innovative circuits.', date: 'March 18, 2025', prize: '₹40,000', registration: 'Team of 2-3', video: '/video/2421545-uhd_3840_2160_30fps.mp4' },
      { title: 'Code Golf', image: '/events/codegolf.jpg', description: 'Write the shortest possible code to solve problems.', date: 'March 19, 2025', prize: '₹25,000', registration: 'Individual', video: '/video/854569-hd_1920_1080_25fps.mp4' },
      { title: 'Robo Race', image: '/events/roborace.jpg', description: 'Race your autonomous robot through obstacles.', date: 'March 20, 2025', prize: '₹30,000', registration: 'Team of 2-3', video: '/video/1528503-uhd_3840_2160_25fps.mp4' },
      { title: 'Web Dev', image: '/events/webdev.jpg', description: 'Build innovative web applications.', date: 'March 21, 2025', prize: '₹35,000', registration: 'Team of 2-3', video: '/video/2018959-hd_1920_1080_30fps.mp4' },
      { title: 'App Dev', image: '/events/appdev.jpg', description: 'Create mobile applications for real-world problems.', date: 'March 22, 2025', prize: '₹40,000', registration: 'Team of 2-3', video: '/video/853828-hd_1920_1080_25fps.mp4' },
    ],
  },
  {
    name: 'Management',
    events: [
      { title: 'Business Plan', image: '/events/businessplan.jpg', description: 'Present your innovative business ideas to industry experts.', date: 'March 15, 2025', prize: '₹60,000', registration: 'Team of 3-4', video: '/video/2421545-uhd_3840_2160_30fps.mp4' },
      { title: 'Case Study', image: '/events/casestudy.jpg', description: 'Analyze and solve real business case studies.', date: 'March 16, 2025', prize: '₹45,000', registration: 'Team of 2-3', video: '/video/854569-hd_1920_1080_25fps.mp4' },
      { title: 'Startup Pitch', image: '/events/startuppitch.jpg', description: 'Pitch your startup idea to potential investors.', date: 'March 17, 2025', prize: '₹55,000', registration: 'Team of 2-4', video: '/video/1528503-uhd_3840_2160_25fps.mp4' },
      { title: 'Stock Trading', image: '/events/stocktrading.jpg', description: 'Virtual stock market trading competition.', date: 'March 18, 2025', prize: '₹40,000', registration: 'Individual', video: '/video/2018959-hd_1920_1080_30fps.mp4' },
      { title: 'Stock Market', image: '/events/stockmarket.jpg', description: 'Learn and compete in stock market analysis.', date: 'March 19, 2025', prize: '₹25,000', registration: 'Team of 2', video: '/video/853828-hd_1920_1080_25fps.mp4' },
      { title: 'Marketing', image: '/events/marketing.jpg', description: 'Create innovative marketing campaigns.', date: 'March 20, 2025', prize: '₹30,000', registration: 'Team of 3-4', video: '/video/2421545-uhd_3840_2160_30fps.mp4' },
      { title: 'HR Challenge', image: '/events/hrchallenge.jpg', description: 'Solve real HR management challenges.', date: 'March 21, 2025', prize: '₹20,000', registration: 'Team of 2-3', video: '/video/854569-hd_1920_1080_25fps.mp4' },
      { title: 'Business Quiz', image: '/events/businessquiz.jpg', description: 'Test your business and management knowledge.', date: 'March 22, 2025', prize: '₹25,000', registration: 'Team of 2', video: '/video/1528503-uhd_3840_2160_25fps.mp4' },
    ],
  },
];

export default function EventsPage() {
  const allEvents = useMemo(() => categories.flatMap((c) => c.events), []);

  return (
    <div className="relative min-h-screen text-white font-sans">
      <EventCarousel events={allEvents} />
    </div>
  );
}