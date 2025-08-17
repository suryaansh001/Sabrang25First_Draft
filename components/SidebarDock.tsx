'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

export const SidebarDock: React.FC<SidebarDockProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  let mouseY = useMotionValue(Infinity);

  return (
    <motion.div
      className={`fixed left-4 top-[55%] transform -translate-y-1/2 z-[60] ${className}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        mouseY.set(Infinity);
      }}
      onMouseMove={(e) => mouseY.set(e.pageY)}
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
  isExpanded 
}: { 
  item: { title: string; icon: React.ReactNode; href: string };
  index: number;
  mouseY: any;
  isExpanded: boolean;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseY, (val: number) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.a
      href={item.href}
      className="group flex items-center gap-3 w-full text-white hover:text-white/80 transition-colors"
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
        className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors"
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
    </motion.a>
  );
}

export default SidebarDock;
