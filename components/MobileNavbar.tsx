"use client";

import React from 'react';
import { useNavigation } from './NavigationContext';
import { Home, Info, Calendar, Star, Clock, Users, HelpCircle, Handshake, Mail, X } from 'lucide-react';

export interface MobileNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface MobileNavbarProps {
  items?: MobileNavItem[];
}

const defaultItems: MobileNavItem[] = [
  { title: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
  { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
  { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
  { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
  { title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
  { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
  { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
  { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
  { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
];

const MobileNavbar: React.FC<MobileNavbarProps> = ({ items = defaultItems }) => {
  const { navigate } = useNavigation();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Hamburger */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition"
      >
        <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
        <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
        <span className="block h-0.5 bg-white/80 rounded-full w-4" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="absolute top-4 right-4">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="pt-20 px-6 h-full overflow-y-auto">
            <div className="grid grid-cols-1 gap-3 pb-8">
              {items.map((item) => (
                <button
                  key={item.title}
                  onClick={() => { setOpen(false); navigate(item.href); }}
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
    </>
  );
};

export default MobileNavbar;


