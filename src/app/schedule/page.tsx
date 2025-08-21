'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../../../components/Footer';

interface TimelineEvent {
	time: string;
	event: string;
	description: string;
	location: string;
}

interface TimelineData {
	[key: number]: TimelineEvent[];
}

export default function SchedulePage() {
	const [activeDay, setActiveDay] = useState<number>(1);

	const timelineData: TimelineData = {
		1: [
			{ time: "9:00 AM", event: "Opening Ceremony", description: "Welcome to Sabrang 2025", location: "Main Auditorium" },
			{ time: "10:30 AM", event: "Tech Workshop", description: "AI & Machine Learning", location: "Lab 101" },
			{ time: "12:00 PM", event: "Lunch Break", description: "Networking & Refreshments", location: "Food Court" },
			{ time: "2:00 PM", event: "Cultural Performance", description: "Traditional Dance Show", location: "Open Air Theater" },
			{ time: "4:00 PM", event: "Sports Event", description: "Inter-College Cricket", location: "Sports Ground" },
			{ time: "6:00 PM", event: "Evening Concert", description: "Live Music & DJ", location: "Amphitheater" },
		],
		2: [
			{ time: "9:00 AM", event: "Academic Seminar", description: "Future of Technology", location: "Conference Hall" },
			{ time: "11:00 AM", event: "Art Exhibition", description: "Student Artwork Display", location: "Art Gallery" },
			{ time: "1:00 PM", event: "Lunch Break", description: "Cultural Food Festival", location: "Food Court" },
			{ time: "3:00 PM", event: "Drama Competition", description: "One Act Plays", location: "Auditorium" },
			{ time: "5:00 PM", event: "Science Fair", description: "Innovation Projects", location: "Science Block" },
			{ time: "7:00 PM", event: "Night Carnival", description: "Games & Entertainment", location: "Campus Ground" },
		],
		3: [
			{ time: "9:00 AM", event: "Final Competitions", description: "Championship Rounds", location: "Various Venues" },
			{ time: "11:00 AM", event: "Award Ceremony", description: "Recognition & Prizes", location: "Main Auditorium" },
			{ time: "1:00 PM", event: "Farewell Lunch", description: "Closing Celebration", location: "Food Court" },
			{ time: "3:00 PM", event: "Cultural Parade", description: "Grand Finale March", location: "Campus Route" },
			{ time: "5:00 PM", event: "Closing Ceremony", description: "Vote of Thanks", location: "Open Air Theater" },
			{ time: "6:00 PM", event: "Fireworks", description: "Spectacular Display", location: "Sports Ground" },
		]
	};

	return (
		<div className="min-h-screen relative overflow-hidden" style={{
			backgroundImage: 'url(/images/Schedule.jpg)',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat'
		}}>
			{/* Dark overlay for better text readability */}
			<div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

			{/* Background Pattern - keeping subtle overlay */}
			<div className="absolute inset-0 opacity-20 pointer-events-none">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),\n                           radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)",
						backgroundSize: '200px 200px, 300px 300px',
						backgroundPosition: '0 0, 100px 100px',
					}}
				/>
			</div>

			{/* Header */}
			<div className="relative z-20 pt-8 pb-6">
				<div className="container mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center"
					>
						<h1
							className="text-6xl md:text-8xl font-black text-white mb-3"
							style={{ fontFamily: "'Orbitron', sans-serif" }}
						>
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600">
								SCHEDULE
							</span>
						</h1>
						<p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
							Experience the magic of Sabrang 2025
						</p>
					</motion.div>
				</div>
			</div>

			{/* Day Tabs */}
			<div className="relative z-20 container mx-auto px-6 mb-8">
				<div className="flex justify-center space-x-4">
					{[1, 2, 3].map((day) => (
						<motion.button
							key={day}
							onClick={() => setActiveDay(day)}
							className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
								activeDay === day
									? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
									: 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 hover:text-white'
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Day {day}
						</motion.button>
					))}
				</div>
			</div>

			{/* Full Page Timeline */}
			<div className="relative z-20 container mx-auto px-6 pb-20">
				<div className="w-full overflow-x-auto">
					<motion.svg
						viewBox="0 0 2400 800"
						className="w-[2400px] h-[600px] md:h-[700px] min-w-full"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8 }}
					>
						<defs>
							<linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="#8b5cf6" />
								<stop offset="25%" stopColor="#ec4899" />
								<stop offset="50%" stopColor="#6366f1" />
								<stop offset="75%" stopColor="#ec4899" />
								<stop offset="100%" stopColor="#8b5cf6" />
							</linearGradient>
							<filter id="timelineGlow" filterUnits="userSpaceOnUse">
								<feGaussianBlur stdDeviation="8" result="coloredBlur" />
								<feMerge>
									<feMergeNode in="coloredBlur" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>
						</defs>

						{/* Main Timeline Path - Horizontal zig-zag like the image */}
						<motion.path
							d="M 100,400 Q 300,300 500,400 T 900,300 T 1300,400 T 1700,300 T 2100,400 T 2300,300"
							fill="none"
							stroke="url(#timelineGradient)"
							strokeWidth="15"
							strokeLinecap="round"
							style={{ filter: 'url(#timelineGlow)' }}
							initial={{ strokeDasharray: 3000, strokeDashoffset: 3000 }}
							animate={{ strokeDashoffset: 0 }}
							transition={{ duration: 5, ease: 'easeInOut' }}
						/>

						{/* Timeline Events - Horizontal layout with proper zig-zag positioning */}
						{timelineData[activeDay].map((event, index) => {
							const x = 200 + (index * 400); // Horizontal spacing
							const y = 400 + (index % 2 === 0 ? 0 : -100); // Zig-zag pattern matching the path
							
							return (
								<g key={index} className="cursor-pointer group">
									{/* Event Circle */}
									<motion.circle
										cx={x}
										cy={y}
										r="25"
										fill="#ffffff"
										className="drop-shadow-[0_0_25px_rgba(139,92,246,0.9)] group-hover:r-30 transition-all duration-300"
										initial={{ scale: 0, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{ delay: 0.5 + index * 0.2, type: 'spring', stiffness: 200 }}
									/>
									
									{/* Event Details Box - Positioned above or below based on zig-zag */}
									<motion.rect
										x={x - 180}
										y={y + (index % 2 === 0 ? 50 : -210)}
										width="360"
										height="160"
										rx="20"
										fill="rgba(0,0,0,0.85)"
										stroke="url(#timelineGradient)"
										strokeWidth="3"
										className="group-hover:stroke-2 group-hover:stroke-pink-400 transition-all duration-300"
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1 + index * 0.2 }}
									/>
									
									{/* Event Text - Positioned in the event box */}
									<motion.text
										x={x}
										y={y + (index % 2 === 0 ? 85 : -175)}
										textAnchor="middle"
										className="text-base font-bold fill-white"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 1.2 + index * 0.2 }}
									>
										{event.time}
									</motion.text>
									
									<motion.text
										x={x}
										y={y + (index % 2 === 0 ? 115 : -145)}
										textAnchor="middle"
										className="text-base font-semibold fill-purple-300"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 1.3 + index * 0.2 }}
									>
										{event.event}
									</motion.text>
									
									<motion.text
										x={x}
										y={y + (index % 2 === 0 ? 140 : -120)}
										textAnchor="middle"
										className="text-sm fill-gray-300"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 1.4 + index * 0.2 }}
									>
										{event.description}
									</motion.text>
									
									<motion.text
										x={x}
										y={y + (index % 2 === 0 ? 165 : -95)}
										textAnchor="middle"
										className="text-sm fill-pink-300"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 1.5 + index * 0.2 }}
									>
										📍 {event.location}
									</motion.text>

									{/* Transparent Blurred Hover Container - Positioned at hover point */}
									<motion.rect
										x={x - 200}
										y={y - 200}
										width="400"
										height="350"
										rx="20"
										fill="rgba(0,0,0,0.85)"
										stroke="rgba(139,92,246,0.6)"
										strokeWidth="2"
										className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
										style={{
											filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))'
										}}
									/>

									{/* Hover Photo Placeholder - Left side with better styling */}
									<motion.rect
										x={x - 180}
										y={y - 180}
										width="140"
										height="140"
										rx="15"
										fill="rgba(139,92,246,0.3)"
										stroke="rgba(255,255,255,0.5)"
										strokeWidth="2"
										className="opacity-0 group-hover:opacity-100 transition-all duration-400 delay-100"
									>
										<title>Event Photo</title>
									</motion.rect>

									{/* Photo Icon - Centered in photo area */}
									<motion.text
										x={x - 110}
										y={y - 110}
										textAnchor="middle"
										className="text-4xl fill-white opacity-0 group-hover:opacity-100 transition-all duration-400 delay-200"
									>
										📸
									</motion.text>

									{/* Photo Label */}
									<motion.text
										x={x - 110}
										y={y - 70}
										textAnchor="middle"
										className="text-xs fill-white opacity-0 group-hover:opacity-100 transition-all duration-400 delay-250"
									>
										Event Photo
									</motion.text>

									{/* Event Details - Right side with better background */}
									<motion.rect
										x={x - 30}
										y={y - 180}
										width="170"
										height="140"
										rx="15"
										fill="rgba(255,255,255,0.1)"
										stroke="rgba(255,255,255,0.2)"
										strokeWidth="1"
										className="opacity-0 group-hover:opacity-100 transition-all duration-400 delay-150"
									/>

									{/* Event Title - Right side */}
									<motion.text
										x={x - 20}
										y={y - 160}
										textAnchor="start"
										className="text-base font-bold fill-white opacity-0 group-hover:opacity-100 transition-all duration-400 delay-200"
									>
										{event.event}
									</motion.text>

									{/* Time - Right side */}
									<motion.text
										x={x - 20}
										y={y - 135}
										textAnchor="start"
										className="text-sm fill-purple-300 opacity-0 group-hover:opacity-100 transition-all duration-400 delay-250"
									>
										⏰ {event.time}
									</motion.text>

									{/* Location - Right side */}
									<motion.text
										x={x - 20}
										y={y - 110}
										textAnchor="start"
										className="text-sm fill-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-400 delay-300"
									>
										📍 {event.location}
									</motion.text>

									{/* Description - Right side */}
									<motion.text
										x={x - 20}
										y={y - 85}
										textAnchor="start"
										className="text-xs fill-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-400 delay-350"
									>
										{event.description}
									</motion.text>

									{/* Bottom Info Section */}
									<motion.rect
										x={x - 180}
										y={y - 30}
										width="360"
										height="60"
										rx="15"
										fill="rgba(139,92,246,0.2)"
										stroke="rgba(139,92,246,0.4)"
										strokeWidth="1"
										className="opacity-0 group-hover:opacity-100 transition-all duration-400 delay-400"
									/>

									{/* Additional Details - Bottom section */}
									<motion.text
										x={x - 170}
										y={y - 10}
										textAnchor="start"
										className="text-xs fill-white opacity-0 group-hover:opacity-100 transition-all duration-400 delay-450"
									>
										🎯 Hover for more details
									</motion.text>

									<motion.text
										x={x + 150}
										y={y - 10}
										textAnchor="end"
										className="text-xs fill-purple-200 opacity-0 group-hover:opacity-100 transition-all duration-400 delay-500"
									>
										✨ Sabrang 2025
									</motion.text>

									{/* Hover Glow Effect - Enhanced */}
									<motion.circle
										cx={x}
										cy={y}
										r="35"
										fill="none"
										stroke="rgba(255,255,255,0.4)"
										strokeWidth="2"
										className="opacity-0 group-hover:opacity-100 transition-all duration-300"
									/>
									
									<motion.circle
										cx={x}
										cy={y}
										r="45"
										fill="none"
										stroke="rgba(236, 72, 153, 0.3)"
										strokeWidth="1"
										className="opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"
									/>
								</g>
							);
						})}
					</motion.svg>
				</div>
			</div>
		</div>
	);
}
