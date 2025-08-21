'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
}

const navigationItems = [
  { title: 'Home', icon: <Home className="w-5 h-5" />, href: '/?skipLoading=true' },
  { title: 'About', icon: <Info className="w-5 h-5" />, href: '/About' },
  { title: 'Events', icon: <Calendar className="w-5 h-5" />, href: '/Events' },
  { title: 'Highlights', icon: <Star className="w-5 h-5" />, href: '/Gallery' },
  { title: 'Schedule', icon: <Clock className="w-5 h-5" />, href: '/schedule' },
  { title: 'Team', icon: <Users className="w-5 h-5" />, href: '/Team' },
  { title: 'FAQ', icon: <HelpCircle className="w-5 h-5" />, href: '/FAQ' },
  { title: 'Why Sponsor Us', icon: <Handshake className="w-5 h-5" />, href: '/why-sponsor-us' },
  { title: 'Contact', icon: <Mail className="w-5 h-5" />, href: '/Contact' },
];

// Add a global state to track pending navigation
let pendingNavigation: string | null = null;
let navigationCallback: ((href: string) => void) | null = null;

export const setNavigationCallback = (callback: (href: string) => void) => {
  navigationCallback = callback;
};

export const SidebarDock: React.FC<SidebarDockProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const mouseY = useMotionValue(Infinity);

  const handleMouseEnter = useCallback(() => setIsExpanded(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false);
    mouseY.set(Infinity);
  }, [mouseY]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => mouseY.set(e.pageY), [mouseY]);

  return (
    <motion.div
      className={`hidden md:block fixed left-4 top-[55%] transform -translate-y-1/2 z-[60] transform-gpu ${className}`}
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
  router
}: { 
  item: { title: string; icon: React.ReactNode; href: string };
  index: number;
  mouseY: any;
  isExpanded: boolean;
  router: any;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseY, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

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
  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Store the pending navigation
    pendingNavigation = item.href;
    
    // Trigger the transition first
    if (navigationCallback) {
      navigationCallback(item.href);
    } else {
      // Fallback to direct navigation if callback not set
      router.push(item.href);
    }
  }, [item.href, router]);

  return (
    <motion.button
      onClick={handleClick}
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
