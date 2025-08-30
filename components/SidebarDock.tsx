'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  Handshake, 
  Info, 
  Clock, 
  Star, 
  Mail,
  Home,
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';

interface SidebarDockProps {
  className?: string;
  onNavigate?: (href: string) => void;
}

const navigationItems = [
  { title: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
  { title: 'About', icon: <Info className="w-5 h-5" />, href: '/About' },
  { title: 'Events', icon: <Calendar className="w-5 h-5" />, href: '/Events' },
  { title: 'Highlights', icon: <Star className="w-5 h-5" />, href: '/Gallery' },
  { title: 'Schedule', icon: <Clock className="w-5 h-5" />, href: '/schedule/progress' },
  { title: 'Team', icon: <Users className="w-5 h-5" />, href: '/Team' },
  { title: 'FAQ', icon: <HelpCircle className="w-5 h-5" />, href: '/FAQ' },
  { title: 'Why Sponsor Us', icon: <Handshake className="w-5 h-5" />, href: '/why-sponsor-us' },
  { title: 'Contact', icon: <Mail className="w-5 h-5" />, href: '/Contact' },
];

export const SidebarDock: React.FC<SidebarDockProps> = ({ className = '', onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const mouseY = useMotionValue(Infinity);

  const handleMouseEnter = useCallback(() => setIsExpanded(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false);
    mouseY.set(Infinity);
  }, [mouseY]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => mouseY.set(e.clientY), [mouseY]);

  return (
    <motion.div
      className={`hidden md:block fixed left-4 top-[55%] transform -translate-y-1/2 z-[90] transform-gpu ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      initial={false}
    >
      <motion.div
        className="flex flex-col items-start gap-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 px-3 py-4 shadow-2xl"
        animate={{
          width: isExpanded ? 200 : 60,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
      >
        {navigationItems.map((item, index) => (
          <IconContainer 
            key={item.title} 
            item={item} 
            index={index} 
            mouseY={mouseY}
            isExpanded={isExpanded}
            onNavigate={onNavigate}
            router={router}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

function IconContainer({ 
  item, 
  index, 
  mouseY, 
  isExpanded,
  router,
  onNavigate
}: {
  item: { title: string; icon: React.ReactNode; href: string };
  index: number;
  mouseY: MotionValue<number>;
  isExpanded: boolean;
  router: ReturnType<typeof useRouter>;
  onNavigate?: (href: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ y: 0, height: 0 });

  const distance = useTransform(mouseY, (val: number) => {
    return val - bounds.y - bounds.height / 2;
  });

  // The use of `useTransform` here creates a "magnetic" or "fisheye" effect on the icons.
  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  // Derive icon size from the container's animated size for better performance.
  const widthIcon = useTransform(width, (w) => w * 0.5);
  const heightIcon = useTransform(height, (h) => h * 0.5);

  useEffect(() => {
    if (ref.current) {
      setBounds(ref.current.getBoundingClientRect());
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  const handleClick = useCallback(() => {
    if (onNavigate) {
      onNavigate(item.href);
    } else {
      // Fallback to direct navigation if no handler is provided.
      router.push(item.href);
    }
  }, [item.href, router, onNavigate]);
  return (
    <motion.button
      onClick={handleClick}
      aria-label={item.title}
      className="group flex items-center gap-3 w-full text-white hover:text-white/80 transition-colors transform-gpu"
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        transition: { delay: index * 0.05 }
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors transform-gpu"
      >
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-white"
        >
          {item.icon}
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default SidebarDock;
