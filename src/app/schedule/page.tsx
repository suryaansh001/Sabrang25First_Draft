'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronRight, ChevronDown, Home, Info, Star, Users, HelpCircle, Handshake, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';
import Logo from '../../../components/Logo';

interface TimelineEvent {
	time: string;
	event: string;
	description: string;
	location: string;
	category?: string;
	isSpecialArtist?: boolean;
}

interface TimelineData {
	[key: number]: TimelineEvent[];
}

export default function SchedulePage() {
	const router = useRouter();
	const { navigate } = useNavigation();
	const [activeDay, setActiveDay] = useState<number>(1);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isMediumLaptop, setIsMediumLaptop] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [scrollX, setScrollX] = useState(0);
	const timelineContainerRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Per-day timeline design (path shape, colors, stroke width, duration)
	const getDayDesign = (day: number, eventCount: number) => {
		// Generate dynamic path based on number of events
		const generatePath = (baseY: number, variation: number) => {
			let path = `M 100,${baseY}`;
			
			// Add path points for all events
			for (let i = 0; i < eventCount; i++) {
				const x = 200 + (i * 400);
				const y = baseY + (i % 2 === 0 ? 0 : variation);
				if (i === 0) {
					path += ` Q ${x - 100},${y - 50} ${x},${y}`;
				} else {
					path += ` T ${x},${y}`;
				}
			}
			
			// Extend the path beyond the last event
			if (eventCount > 0) {
				const lastEventX = 200 + ((eventCount - 1) * 400);
				const lastEventY = baseY + ((eventCount - 1) % 2 === 0 ? 0 : variation);
				const extendX = lastEventX + 200; // Extend 200px beyond last event
				const extendY = lastEventY;
				path += ` T ${extendX},${extendY}`;
			}
			
			return path;
		};

		switch (day) {
			case 1:
				return {
					stops: { start: '#8b5cf6', mid1: '#ec4899', mid2: '#6366f1', end: '#8b5cf6' },
					pathD: generatePath(400, -100),
					strokeWidth: 15,
					duration: 5
				};
			case 2:
				return {
					stops: { start: '#06b6d4', mid1: '#10b981', mid2: '#84cc16', end: '#06b6d4' },
					pathD: generatePath(420, -80),
					strokeWidth: 18,
					duration: 4.5
				};
			case 3:
				return {
					stops: { start: '#f59e0b', mid1: '#f97316', mid2: '#ef4444', end: '#f59e0b' },
					pathD: generatePath(380, 80),
					strokeWidth: 16,
					duration: 5.5
				};
			default:
				return {
					stops: { start: '#8b5cf6', mid1: '#ec4899', mid2: '#6366f1', end: '#8b5cf6' },
					pathD: generatePath(400, -100),
					strokeWidth: 15,
					duration: 5
				};
		}
	};

	const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
		{ title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
		{ title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
		{ title: 'Events', href: '/Events', icon: <Star className="w-5 h-5" /> },
		{ title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
		{ title: 'Schedule', href: '/schedule', icon: <Clock className="w-5 h-5" /> },
		{ title: 'Our Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
		{ title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
		{ title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
		{ title: 'Contact Us', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
	];

	const timelineData: TimelineData = {
		1: [
			{ time: "9:45 – 10:20", event: "Inauguration", description: "Opening ceremony of Sabrang 2025", location: "Admin Block", category: "Ceremony" },
			{ time: "10:30 – 11:00", event: "Focus", description: "Concentration and mindfulness session", location: "IET Amphi", category: "Wellness" },
			{ time: "11:00 – 1:00", event: "Seal the Deal", description: "Business competition and networking", location: "IM Amphi", category: "Competition" },
			{ time: "11:00 – 4:00", event: "Valorant", description: "Gaming tournament", location: "Online", category: "Gaming" },
			{ time: "12:00 – 1:30", event: "Echoes of Noor", description: "Cultural performance", location: "Main Stage", category: "Cultural" },
			{ time: "2:00 – 4:00", event: "In Convo With", description: "Interactive discussion session", location: "IM Amphi", category: "Discussion" },
			{ time: "4:00 – 5:30", event: "Verse Vaad", description: "Poetry and literary event", location: "Main Stage", category: "Cultural" },
			{ time: "6:00 – 8:30", event: "Panache", description: "Fashion and style showcase", location: "Main Stage", category: "Fashion" },
			{ time: "8:30 – 10:00", event: "DJ Night", description: "Music and dance party", location: "Main Stage", category: "Entertainment" },
		],
		2: [
			{ time: "11:00 – 2:00", event: "Bidding Before Wicket", description: "Cricket auction and bidding event", location: "IET Amphi", category: "Sports" },
			{ time: "11:00 – 2:00", event: "Free Fire", description: "Mobile gaming tournament", location: "IM 102", category: "Gaming" },
			{ time: "11:30 – 1:30", event: "Courtroom", description: "Debate and legal discussion", location: "IM Amphi", category: "Debate" },
			{ time: "11:30 – 1:00", event: "Step Up", description: "Dance competition", location: "Main Stage", category: "Dance" },
			{ time: "3:00 – 4:00", event: "Clay Modelling", description: "Art and craft workshop", location: "Tech Lawn", category: "Art" },
			{ time: "3:30 – 5:00", event: "Band Jam", description: "Musical performance", location: "Main Stage", category: "Music" },
			{ time: "5:30 – 8:30", event: "Dance Battle", description: "Dance competition finals", location: "Main Stage", category: "Dance" },
			{ time: "8:30 – 9:30", event: "Judge Performance", description: "Special judge performance", location: "Main Stage", category: "Cultural" },
			{ time: "9:30 – 10:15", event: "DJ Night", description: "Music and dance party", location: "Main Stage", category: "Entertainment" },
		],
		3: [
			{ time: "10:00 – 3:00", event: "BGMI", description: "Mobile gaming tournament", location: "IM 105", category: "Gaming" },
			{ time: "11:00 – 1:00", event: "Dumb Show", description: "Silent performance art", location: "IM Amphitheatre", category: "Performance" },
			{ time: "2:00 – 4:00", event: "Art Relay", description: "Collaborative art creation", location: "Tech Lawn", category: "Art" },
			{ time: "4:00 – 7:00", event: "Valedictory Ceremony", description: "Closing ceremony and awards", location: "Main Stage", category: "Ceremony" },
			{ time: "7:30 – 9:00", event: "Artist Performance", description: "Special artist performance", location: "Main Stage", category: "Music", isSpecialArtist: true },
			{ time: "9:00 – 10:00", event: "DJ Night", description: "Final music and dance party", location: "Main Stage", category: "Entertainment" },
		]
	};

	useEffect(() => {
		const checkScreenSize = () => {
			const width = window.innerWidth;
			setIsMobile(width < 1024);
			setIsMediumLaptop(width >= 1024 && width < 1280);
		};
		
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		
		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	// Horizontal scroll effect for desktop
	useEffect(() => {
		if (isMobile) return;

		const handleScroll = (e: WheelEvent) => {
			// Only handle horizontal scrolling for the timeline section
			if (!timelineContainerRef.current?.contains(e.target as Node)) return;
			
			e.preventDefault();
			
			const container = scrollContainerRef.current;
			if (!container) return;

			const maxScrollLeft = container.scrollWidth - container.clientWidth;
			const scrollSpeed = 3; // Increased scroll sensitivity
			
			// Handle both vertical and horizontal wheel events
			const deltaX = e.deltaX || 0;
			const deltaY = e.deltaY || 0;
			const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
			
			setScrollX(prevScrollX => {
				const newScrollX = Math.max(0, Math.min(maxScrollLeft, prevScrollX + delta * scrollSpeed));
				container.scrollLeft = newScrollX;
				return newScrollX;
			});
		};

		// Add scroll listener to timeline container
		const timelineContainer = timelineContainerRef.current;
		if (timelineContainer) {
			timelineContainer.addEventListener('wheel', handleScroll, { passive: false });
			
			return () => {
				timelineContainer.removeEventListener('wheel', handleScroll);
			};
		}
	}, [isMobile]);

	// Handle touch/drag scrolling for desktop
	useEffect(() => {
		if (isMobile) return;

		let isMouseDown = false;
		let startX = 0;
		let scrollLeft = 0;

		const handleMouseDown = (e: MouseEvent) => {
			if (!scrollContainerRef.current?.contains(e.target as Node)) return;
			isMouseDown = true;
			startX = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
			scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
			if (scrollContainerRef.current) {
				scrollContainerRef.current.style.cursor = 'grabbing';
			}
		};

		const handleMouseLeave = () => {
			isMouseDown = false;
			if (scrollContainerRef.current) {
				scrollContainerRef.current.style.cursor = 'grab';
			}
		};

		const handleMouseUp = () => {
			isMouseDown = false;
			if (scrollContainerRef.current) {
				scrollContainerRef.current.style.cursor = 'grab';
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!isMouseDown || !scrollContainerRef.current) return;
			e.preventDefault();
			const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
			const walk = (x - startX) * 2; // Scroll speed multiplier
			const newScrollLeft = scrollLeft - walk;
			scrollContainerRef.current.scrollLeft = newScrollLeft;
			setScrollX(newScrollLeft);
		};

		const container = scrollContainerRef.current;
		if (container) {
			container.style.cursor = 'grab';
			container.addEventListener('mousedown', handleMouseDown);
			container.addEventListener('mouseleave', handleMouseLeave);
			container.addEventListener('mouseup', handleMouseUp);
			container.addEventListener('mousemove', handleMouseMove);

			return () => {
				container.removeEventListener('mousedown', handleMouseDown);
				container.removeEventListener('mouseleave', handleMouseLeave);
				container.removeEventListener('mouseup', handleMouseUp);
				container.removeEventListener('mousemove', handleMouseMove);
			};
		}
	}, [isMobile]);

	// Keyboard navigation for timeline scrolling
	useEffect(() => {
		if (isMobile) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			const container = scrollContainerRef.current;
			if (!container) return;

			const maxScrollLeft = container.scrollWidth - container.clientWidth;
			const scrollAmount = 200; // Pixels to scroll per key press

			switch (e.key) {
				case 'ArrowLeft':
					e.preventDefault();
					setScrollX(prevScrollX => {
						const newScrollX = Math.max(0, prevScrollX - scrollAmount);
						container.scrollLeft = newScrollX;
						return newScrollX;
					});
					break;
				case 'ArrowRight':
					e.preventDefault();
					setScrollX(prevScrollX => {
						const newScrollX = Math.min(maxScrollLeft, prevScrollX + scrollAmount);
						container.scrollLeft = newScrollX;
						return newScrollX;
					});
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isMobile]);

	const getCategoryColor = (category: string) => {
		const colors: { [key: string]: string } = {
			'Ceremony': 'from-purple-500 to-pink-500',
			'Competition': 'from-yellow-500 to-green-500',
			'Gaming': 'from-blue-500 to-cyan-500',
			'Cultural': 'from-orange-500 to-red-500',
			'Discussion': 'from-indigo-500 to-blue-500',
			'Fashion': 'from-pink-500 to-purple-500',
			'Entertainment': 'from-pink-500 to-purple-500',
			'Sports': 'from-yellow-500 to-orange-500',
			'Debate': 'from-red-500 to-pink-500',
			'Dance': 'from-purple-500 to-pink-500',
			'Art': 'from-red-500 to-pink-500',
			'Music': 'from-blue-500 to-purple-500',
			'Wellness': 'from-green-500 to-emerald-500',
			'Performance': 'from-orange-500 to-yellow-500'
		};
		return colors[category] || 'from-gray-500 to-gray-600';
	};

	// Derived UI values for current day
	const design = getDayDesign(activeDay, timelineData[activeDay].length);
	const mobileGradientClass = activeDay === 1
		? 'from-purple-500 via-pink-500 to-indigo-600'
		: activeDay === 2
			? 'from-cyan-500 via-emerald-500 to-lime-500'
			: 'from-amber-500 via-orange-500 to-rose-500';

	return (
		<div className="min-h-screen text-white font-sans relative overflow-hidden flex flex-col">
			{/* Background Image */}
			<div 
				className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: 'url(/images/Schedule.jpg)'
				}}
			/>
			
			{/* Glass Effect Overlay - Darker for reduced background visibility */}
			<div className="fixed inset-0 -z-10 bg-black/50 backdrop-blur-[2px]" />

			{/* Logo and sidebar */}
			<Logo className="block" />

			{/* Mobile hamburger */}
			<button
				aria-label="Open menu"
				onClick={() => setMobileMenuOpen(true)}
				className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition"
			>
				<span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
				<span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
				<span className="block h-0.5 bg-white/80 rounded-full w-4" />
			</button>

			{/* Mobile menu overlay */}
			{mobileMenuOpen && (
				<div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xl">
					<div className="absolute top-4 right-4">
						<button
							aria-label="Close menu"
							onClick={() => setMobileMenuOpen(false)}
							className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/35 hover:bg-white/25 transition"
						>
							<Calendar className="w-6 h-6 text-white" />
						</button>
					</div>
					<div className="pt-20 px-6 h-full overflow-y-auto">
						<div className="grid grid-cols-1 gap-3 pb-8">
							{mobileNavItems.map((item) => (
								<button
									key={item.title}
									onClick={() => { setMobileMenuOpen(false); navigate(item.href); }}
									className="flex items-center gap-3 p-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/35 text-white text-base hover:bg-white/25 active:scale-[0.99] transition text-left"
								>
									<span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/35">
										{item.icon}
									</span>
									<span className="font-medium">{item.title}</span>
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Infinity transition handled by AppShell */}

			{/* Main Content Container */}
			<div className="relative z-10 pb-16 flex-grow pt-20 lg:pt-0">
				{/* Header */}
				<div className="text-center mb-8 sm:mb-12">
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="px-4 sm:px-6 pt-10 sm:pt-14 lg:pt-16"
					>
						<h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 ${isMediumLaptop ? 'text-6xl' : ''}`}>
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600">
								SCHEDULE
							</span>
						</h1>
						<p className={`text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow-lg ${isMediumLaptop ? 'text-xl' : ''}`}>
							Experience the magic of Sabrang 2025
						</p>
					</motion.div>
				</div>

				{/* Day Tabs */}
				<div className={`px-4 sm:px-6 mb-8 ${isMediumLaptop ? 'px-8' : ''}`}>
					<div className={`flex justify-center space-x-2 sm:space-x-4 ${isMediumLaptop ? 'space-x-6' : ''}`}>
						{[
							{ day: 1, date: "10 Oct 25" },
							{ day: 2, date: "11 Oct 25" },
							{ day: 3, date: "12 Oct 25" }
						].map(({ day, date }) => (
							<motion.button
								key={day}
								onClick={() => setActiveDay(day)}
								className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 backdrop-blur-md ${isMediumLaptop ? 'px-8 py-4 text-lg' : ''} ${
									activeDay === day
										? 'bg-gradient-to-r from-purple-500/95 to-pink-500/95 text-white shadow-lg shadow-purple-500/50 border border-purple-400/40'
										: 'bg-gray-800/60 text-gray-200 hover:bg-gray-700/70 hover:text-white border border-gray-600/40'
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{date}
							</motion.button>
						))}
					</div>
				</div>

				{/* Scroll Hint for Desktop */}
				{!isMobile && (
					<div className="hidden lg:flex justify-center mb-6">
						<div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
							<span className="text-sm text-gray-300">Scroll horizontally or use arrow keys to view all events</span>
							<motion.div
								animate={{ x: [0, 3, 0] }}
								transition={{ duration: 1.5, repeat: Infinity }}
							>
								<ChevronRight className="w-4 h-4 text-purple-400" />
							</motion.div>
						</div>
					</div>
				)}

				{/* Timeline Content */}
				<div className={`px-4 sm:px-6 ${isMediumLaptop ? 'px-8' : ''}`} ref={timelineContainerRef}>
					{/* Desktop: Horizontal Timeline */}
					{!isMobile && (
						<div className="hidden lg:block">
							<div 
								ref={scrollContainerRef}
								className="w-full overflow-x-auto scrollbar-hide focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-lg"
								style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
								tabIndex={0}
							>
								<motion.svg
									viewBox={`0 0 ${Math.max(2400, 200 + (timelineData[activeDay].length * 400) + 400)} 800`}
									className={`h-[600px] min-w-full select-none ${isMediumLaptop ? 'h-[500px]' : ''}`}
									style={{ 
										width: `${Math.max(2400, 200 + (timelineData[activeDay].length * 400) + 400)}px`
									}}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.8 }}
								>
									<defs>
										<linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
											<stop offset="0%" stopColor={design.stops.start} />
											<stop offset="25%" stopColor={design.stops.mid1} />
											<stop offset="50%" stopColor={design.stops.mid2} />
											<stop offset="75%" stopColor={design.stops.mid1} />
											<stop offset="100%" stopColor={design.stops.end} />
										</linearGradient>
									</defs>

									{/* Horizontal Timeline Path - Glow Effect */}
									<defs>
										<filter id="glow">
											<feGaussianBlur stdDeviation="4" result="coloredBlur"/>
											<feMerge> 
												<feMergeNode in="coloredBlur"/>
												<feMergeNode in="SourceGraphic"/>
											</feMerge>
										</filter>
									</defs>
									
									{/* Timeline Path with Glow */}
									<motion.path
										key={activeDay}
										d={design.pathD}
										fill="none"
										stroke="url(#timelineGradient)"
										strokeWidth={design.strokeWidth + 4}
										strokeLinecap="round"
										filter="url(#glow)"
										initial={{ strokeDasharray: 3000, strokeDashoffset: 3000 }}
										animate={{ strokeDashoffset: 0 }}
										transition={{ duration: design.duration, ease: 'easeInOut' }}
									/>
									
									{/* Main Timeline Path */}
									<motion.path
										key={`main-${activeDay}`}
										d={design.pathD}
										fill="none"
										stroke="url(#timelineGradient)"
										strokeWidth={design.strokeWidth}
										strokeLinecap="round"
										initial={{ strokeDasharray: 3000, strokeDashoffset: 3000 }}
										animate={{ strokeDashoffset: 0 }}
										transition={{ duration: design.duration, ease: 'easeInOut' }}
									/>

									{/* Timeline Events */}
									{timelineData[activeDay].map((event, index) => {
										const x = 200 + (index * 400);
										const y = 400 + (index % 2 === 0 ? 0 : -100);
										const isSpecialArtist = (event as any).isSpecialArtist;
										
										return (
											<g
												key={index}
												className="cursor-pointer"
												onMouseEnter={() => setHoveredIndex(index)}
												onMouseLeave={() => setHoveredIndex(null)}
												style={{ pointerEvents: 'all' }}
											>
												<motion.circle
													cx={x}
													cy={y}
													r={isSpecialArtist ? "35" : "25"}
													fill={isSpecialArtist ? "#fbbf24" : "#ffffff"}
													className={isSpecialArtist ? "drop-shadow-[0_0_30px_rgba(251,191,36,0.9)]" : "drop-shadow-[0_0_25px_rgba(139,92,246,0.9)]"}
													initial={{ scale: 0, opacity: 0 }}
													animate={{ scale: hoveredIndex === index ? 1.25 : (isSpecialArtist ? 1.15 : 1), opacity: 1 }}
													transition={{ delay: 0.5 + index * 0.2, type: 'spring', stiffness: 250, damping: 15 }}
												>
													{isSpecialArtist && (
														<animate attributeName="r" values="35;38;35" dur="2s" repeatCount="indefinite" />
													)}
												</motion.circle>

												{/* Special star decoration for artist */}
												{isSpecialArtist && (
													<>
														<motion.polygon
															points={`${x},${y-20} ${x+6},${y-6} ${x+20},${y-6} ${x+10},${y+2} ${x+15},${y+16} ${x},${y+8} ${x-15},${y+16} ${x-10},${y+2} ${x-20},${y-6} ${x-6},${y-6}`}
															fill="#fbbf24"
															className="drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
															initial={{ scale: 0, rotate: 0 }}
															animate={{ scale: 1, rotate: 360 }}
															transition={{ delay: 1.5 + index * 0.2, duration: 2, repeat: Infinity, repeatType: "loop" }}
														/>
													</>
												)}
												
												<motion.rect
													x={x - 220}
													y={y + (index % 2 === 0 ? 50 : -250)}
													width="440"
													height={isSpecialArtist ? "220" : "200"}
													rx="20"
													fill={isSpecialArtist ? "rgba(20,20,20,0.85)" : "rgba(0,0,0,0.75)"}
													stroke={hoveredIndex === index ? '#ec4899' : (isSpecialArtist ? '#fbbf24' : 'url(#timelineGradient)')}
													strokeWidth={hoveredIndex === index ? 5 : (isSpecialArtist ? 4 : 3)}
													initial={{ opacity: 0, y: 30 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 1 + index * 0.2 }}
												>
													{isSpecialArtist && (
														<animate attributeName="stroke" values="#fbbf24;#f59e0b;#fbbf24" dur="3s" repeatCount="indefinite" />
													)}
												</motion.rect>
												
												<motion.text
													x={x}
													y={y + (index % 2 === 0 ? 95 : -205)}
													textAnchor="middle"
													className={isSpecialArtist ? "text-xl font-bold fill-yellow-400" : "text-xl font-bold fill-white"}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1.2 + index * 0.2 }}
												>
													{event.time}
												</motion.text>

												{/* Special Artist Badge */}
												{isSpecialArtist && (
													<motion.text
														x={x}
														y={y + (index % 2 === 0 ? 115 : -185)}
														textAnchor="middle"
														className="text-sm font-bold fill-yellow-300"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														transition={{ delay: 1.25 + index * 0.2 }}
													>
														⭐ SPECIAL ARTIST ⭐
													</motion.text>
												)}
												
												<motion.text
													x={x}
													y={y + (index % 2 === 0 ? (isSpecialArtist ? 140 : 130) : (isSpecialArtist ? -160 : -170))}
													textAnchor="middle"
													className={isSpecialArtist ? "text-lg font-bold fill-yellow-200" : "text-lg font-semibold fill-purple-300"}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1.3 + index * 0.2 }}
												>
													{event.event}
												</motion.text>
												
												<motion.text
													x={x}
													y={y + (index % 2 === 0 ? (isSpecialArtist ? 175 : 165) : (isSpecialArtist ? -125 : -135))}
													textAnchor="middle"
													className={isSpecialArtist ? "text-base fill-yellow-100" : "text-base fill-gray-300"}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1.4 + index * 0.2 }}
												>
													{event.description}
												</motion.text>
												
												<motion.text
													x={x}
													y={y + (index % 2 === 0 ? (isSpecialArtist ? 210 : 200) : (isSpecialArtist ? -90 : -100))}
													textAnchor="middle"
													className={isSpecialArtist ? "text-base fill-yellow-300" : "text-base fill-pink-300"}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ delay: 1.5 + index * 0.2 }}
												>
													📍 {event.location}
												</motion.text>
											</g>
										);
									})}
								</motion.svg>
								
								{/* Custom scrollbar styles */}
								<style jsx>{`
									.scrollbar-hide::-webkit-scrollbar {
										display: none;
									}
								`}</style>
							</div>
						</div>
					)}

					{/* Mobile: Vertical Timeline */}
					{isMobile && (
						<div className="lg:hidden">
							<div className="relative">
								{/* Vertical Timeline Line */}
								<div className={`absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b ${mobileGradientClass} rounded-full`}>
									<motion.div
										key={activeDay}
										className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${mobileGradientClass} rounded-full origin-top`}
										initial={{ scaleY: 0 }}
										animate={{ scaleY: 1 }}
										transition={{ duration: 2, ease: "easeInOut" }}
									/>
								</div>

								{/* Timeline Events */}
								<motion.div
									key={`mobile-list-${activeDay}`}
									className="space-y-6 ml-16"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
								>
									{timelineData[activeDay].map((event, index) => {
										const isSpecialArtist = (event as any).isSpecialArtist;
										return (
											<motion.div
												key={index}
												initial={{ opacity: 0, y: 24, scale: 0.98 }}
												whileInView={{ opacity: 1, y: 0, scale: 1 }}
												viewport={{ amount: 0.2, once: false }}
												transition={{ type: 'spring', stiffness: 220, damping: 20, delay: index * 0.1 }}
												whileTap={{ scale: 0.985 }}
												className="relative group"
											>
												{/* Event Circle */}
												<div className={`absolute -left-12 top-6 w-6 h-6 rounded-full border-4 shadow-lg ${
													isSpecialArtist 
														? 'bg-yellow-400 border-yellow-500 shadow-yellow-500/50' 
														: 'bg-white border-purple-500 shadow-purple-500/50'
												}`}>
													{isSpecialArtist && (
														<div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
													)}
												</div>

												{/* Event Card */}
												<div className={`backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl ${
													isSpecialArtist 
														? 'bg-gradient-to-br from-yellow-900/60 via-orange-900/40 to-gray-900/80 border border-yellow-500/50' 
														: 'bg-gray-900/80 border border-gray-600/50'
												}`}>
													{/* Special Artist Header */}
													{isSpecialArtist && (
														<div className="flex items-center justify-center mb-4">
															<div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-full">
																<Star className="w-4 h-4 text-yellow-400 animate-pulse" />
																<span className="text-yellow-300 text-xs font-bold uppercase tracking-wider">Featured Artist</span>
																<Star className="w-4 h-4 text-yellow-400 animate-pulse" />
															</div>
														</div>
													)}

													{/* Category Badge */}
													<div className="flex items-center justify-between mb-3">
														<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(event.category || '')} text-white`}>
															{event.category}
														</span>
														<ChevronRight className="w-4 h-4 text-gray-400" />
													</div>

													{/* Event Title */}
													<h3 className={`text-lg sm:text-xl font-bold mb-2 ${
														isSpecialArtist ? 'text-yellow-100' : 'text-white'
													}`}>
														{event.event}
													</h3>

													{/* Time */}
													<div className="flex items-center space-x-2 mb-2">
														<Clock className={`w-4 h-4 ${isSpecialArtist ? 'text-yellow-400' : 'text-purple-400'}`} />
														<span className={`font-medium ${isSpecialArtist ? 'text-yellow-300' : 'text-purple-300'}`}>
															{event.time}
														</span>
													</div>

													{/* Description */}
													<p className={`text-sm sm:text-base mb-3 leading-relaxed ${
														isSpecialArtist ? 'text-yellow-100' : 'text-gray-200'
													}`}>
														{event.description}
													</p>

													{/* Location */}
													<div className="flex items-center space-x-2">
														<MapPin className={`w-4 h-4 ${isSpecialArtist ? 'text-orange-400' : 'text-pink-400'}`} />
														<span className={`text-sm ${isSpecialArtist ? 'text-orange-300' : 'text-pink-300'}`}>
															{event.location}
														</span>
													</div>

													{/* Overlay */}
													<div className={`absolute inset-0 rounded-2xl pointer-events-none ${
														isSpecialArtist 
															? 'bg-gradient-to-r from-yellow-500/5 to-orange-500/5' 
															: 'bg-gradient-to-r from-purple-500/5 to-pink-500/5'
													}`} />
												</div>
											</motion.div>
										);
									})}
								</motion.div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}