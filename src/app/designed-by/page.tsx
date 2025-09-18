"use client";

import MobileNavbar from '../../../components/MobileNavbar';
import FaultyTerminal from '../../../components/Faulty Terminal bg';
import { useState, useEffect } from 'react';

type Member = { name: string; initials: string; image?: string; role?: string };

const coreMember = [
	{ name: 'Suryansh Sharma', initials: 'SS' , image: '/images/tech_team/Suryansh_Sharma-Photoroom.png', role: 'Core Developer' },
];

const codeTeam = [
	{ name: 'Devam Gupta', initials: 'DG', image: '/images/tech_team/Devam_Gupta-Photoroom.png', role: 'Frontend Developer & UI/UX Designer' },
	{ name: 'Aman Pratap Singh', initials: 'APS', image: '/images/tech_team/Aman_Pratap_Singh-Photoroom.png', role: 'Frontend Developer & UI/UX Designer' },
	{ name: 'Yash Mishra', initials: 'YM' , image: '/images/tech_team/yash-mishra-Photoroom.png', role: 'Frontend Developer & UI/UX Designer' },
	{ name: 'Atharv Mehrotra', initials: 'AM' , image: '/images/tech_team/Atharv_Mehrotra-Photoroom.png', role: 'Backend Developer' },
	{ name: 'Ayush Sharma', initials: 'AS', image: '/images/tech_team/Ayush_Shrama-Photoroom.png', role: 'Backend Developer' },
	{ name: 'Somaya Agarwal', initials: 'SA' , image: '/images/tech_team/Somaya_Agr-Photoroom.png', role: 'Frontend Developer' },
];

function FallbackAvatar({ initials }: { initials: string }) {
	return (
		<div className="relative overflow-hidden rounded-3xl aspect-square bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 group-hover:scale-105 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-purple-500/25">
			{/* Animated gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-transparent to-indigo-400/30 group-hover:from-purple-300/40 group-hover:to-indigo-300/40 transition-all duration-500" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.1),transparent_70%)]" />
			<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
			
			{/* Glowing border effect */}
			<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
			
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,.8)] group-hover:scale-110 group-hover:drop-shadow-[0_8px_32px_rgba(139,92,246,0.6)] transition-all duration-500">{initials}</span>
			</div>
			
			{/* Enhanced animated particles */}
			<div className="absolute inset-0 opacity-30">
				<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse group-hover:animate-bounce"></div>
				<div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300 group-hover:animate-ping"></div>
				<div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700 group-hover:animate-pulse"></div>
				<div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-500 group-hover:animate-bounce"></div>
			</div>
			
			{/* Shimmer effect */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
		</div>
	);
}

function TeamSection({ title, members, isMainHeading = false, isCoreSection = false }: { title: string; members: Member[]; isMainHeading?: boolean; isCoreSection?: boolean }) {
	const [hoveredCard, setHoveredCard] = useState<string | null>(null);

	return (
		<div className="mb-20 flex flex-col items-center">
			{title && (
				<div className="text-center mb-16 relative">
					{/* Enhanced title with glassmorphism */}
					<div className="relative inline-block">
						<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 rounded-2xl blur-xl scale-110"></div>
						<h2 className={`relative font-black tracking-tight bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(139,92,246,0.6)] ${
							isMainHeading ? 'text-6xl sm:text-7xl md:text-8xl' : 'text-4xl sm:text-5xl md:text-6xl'
						}`}>
							{title}
						</h2>
					</div>
					
					{/* Enhanced decorative line with glow */}
					<div className="mt-6 mx-auto relative">
						<div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)]"></div>
						<div className="absolute inset-0 w-32 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-sm opacity-60"></div>
					</div>
					
					{/* Enhanced floating particles */}
					<div className="absolute -top-6 -left-6 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
					<div className="absolute -top-3 -right-8 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-300 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></div>
					<div className="absolute -bottom-3 -left-3 w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse delay-700 shadow-[0_0_12px_rgba(99,102,241,0.6)]"></div>
					<div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-500"></div>
				</div>
			)}
			
			<div className={`grid gap-8 sm:gap-10 ${
				isCoreSection ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
			}`}>
				{members.map((m, index) => (
					<figure 
						key={m.name} 
						className="group flex justify-center"
						style={{ animationDelay: `${index * 150}ms` }}
					>
						<div 
							className="relative rounded-3xl overflow-hidden border border-purple-400/30 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-blue-900/40 backdrop-blur-xl shadow-[0_25px_80px_rgba(139,92,246,0.2)] w-full max-w-md sm:max-w-lg lg:max-w-xl hover:shadow-[0_40px_100px_rgba(139,92,246,0.4)] transition-all duration-700 hover:scale-105 hover:border-purple-300/50 hover:-translate-y-2"
							onMouseEnter={() => setHoveredCard(m.name)}
							onMouseLeave={() => setHoveredCard(null)}
						>
							{/* Enhanced glassmorphism border */}
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
							
							{/* Animated border glow */}
							<div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-indigo-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm scale-105"></div>
							
                            <div className={`relative w-full ${
                                isMainHeading && m.name === 'Suryansh Sharma' ? 'aspect-[3/4] min-h-[500px]' : 'aspect-[3/4] min-h-[450px]'
                            }`}>
                                {m.image ? (
                                    <>
                                        {/* Backdrop for transparent PNGs */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,92,246,0.25),transparent_55%)]" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(34,211,238,0.18),transparent_50%)]" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.18),transparent_45%)]" />

                                        <img 
                                            src={m.image} 
                                            alt={m.name} 
                                            className={`absolute inset-0 w-full h-full object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] transition-transform duration-700 will-change-transform ${
                                                 ['Aman Pratap Singh','Ayush Sharma','Devam Gupta'].includes(m.name)
                                                   ? 'p-0 sm:p-0.5 scale-[1.28] group-hover:scale-[1.34]'
                                                   : m.name === 'Yash Mishra'
                                                     ? 'p-0 sm:p-0.5 scale-[1.38] group-hover:scale-[1.46]'
                                                     : 'p-2 sm:p-3 group-hover:scale-105'
                                             } ${m.name === 'Yash Mishra' ? '-translate-y-[20px]' : (m.name !== 'Atharv Mehrotra' && m.name !== 'Devam Gupta' ? '-translate-y-[50px]' : '')}`}
                                            onError={(e) => {
                                                console.log('Image failed to load:', m.image);
                                                e.currentTarget.style.display = 'none';
                                                // Show fallback avatar when image fails
                                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                if (fallback) fallback.style.display = 'block';
                                            }}
                                        />
                                        <div className="absolute inset-0 hidden">
                                            <FallbackAvatar initials={m.initials} />
                                        </div>
                                    </>
                                ) : (
                                    <FallbackAvatar initials={m.initials} />
                                )}
								
                                {/* Overlays tuned for face-only images */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10" />
                                <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-transparent" />
								
								{/* Enhanced shimmer effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200"></div>
								
								{/* Enhanced text overlay with stronger black backdrop */}
								<div className="absolute inset-x-0 bottom-0 p-4">
									<div className="relative">
										{/* Stronger black backdrop for better text visibility */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 rounded-t-2xl backdrop-blur-sm"></div>
										<div className="relative text-center space-y-2">
											<p className="text-white font-bold text-base sm:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,1)] group-hover:scale-105 group-hover:drop-shadow-[0_4px_12px_rgba(139,92,246,0.8)] transition-all duration-500">
												{m.name}
											</p>
											{(m.role || 'Tech Team') && (
												<p className="text-white/90 text-xs sm:text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,1)] group-hover:text-white group-hover:drop-shadow-[0_3px_8px_rgba(139,92,246,0.6)] transition-all duration-500">
													{m.role || 'Tech Team'}
												</p>
											)}
										</div>
									</div>
								</div>
								
								{/* Enhanced hover effect overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-purple-500/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
								
								{/* Corner accent lights */}
								<div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div>
								<div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200 shadow-[0_0_6px_rgba(236,72,153,0.8)]"></div>
							</div>
						</div>
					</figure>
				))}
			</div>
		</div>
	);
}

export default function DesignedByPage() {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	// Debug: Log image paths
	console.log('Core member images:', coreMember.map(m => m.image));
	console.log('Code team images:', codeTeam.map(m => m.image));

	return (
		<div className="min-h-screen text-white overflow-hidden relative">
			{/* Faulty Terminal Background */}
			<div className="fixed inset-0 -z-10">
				<FaultyTerminal 
					scale={1.2}
					gridMul={[2, 1]}
					digitSize={1.5}
					timeScale={0.3}
					scanlineIntensity={0.4}
					glitchAmount={1.2}
					flickerAmount={0.8}
					noiseAmp={1.1}
					chromaticAberration={0.1}
					dither={0.3}
					curvature={0.15}
					tint="#8b5cf6"
					mouseReact={true}
					mouseStrength={0.3}
					pageLoadAnimation={true}
					brightness={0.8}
					className="faulty-terminal-container"
				/>
			</div>

			{/* Mobile navbar */}
			<MobileNavbar />

			{/* Main content with enhanced styling */}
			<section className="px-4 py-24 relative">
				{/* Enhanced page header with glassmorphism */}
				<div className="text-center mb-20 relative">
					<div className={`transition-all duration-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
						{/* Main title with enhanced effects */}
						<div className="relative inline-block mb-8">
							{/* Glowing background */}
							<div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-indigo-500/30 rounded-3xl blur-2xl scale-110"></div>
							{/* Glassmorphism container */}
							<div className="relative bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-blue-900/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/20">
								<h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-[0_6px_32px_rgba(139,92,246,0.6)]">
									Made by
								</h1>
							</div>
						</div>
						
						{/* Enhanced decorative elements */}
						<div className="flex justify-center space-x-6">
							<div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.8)]"></div>
							<div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-300 shadow-[0_0_12px_rgba(236,72,153,0.8)]"></div>
							<div className="w-4 h-4 bg-indigo-400 rounded-full animate-pulse delay-700 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
							<div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-500"></div>
						</div>
						
						{/* Floating accent elements */}
						<div className="absolute -top-8 -left-8 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse opacity-60"></div>
						<div className="absolute -top-4 -right-12 w-4 h-4 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full animate-pulse delay-500 opacity-60"></div>
						<div className="absolute -bottom-6 -left-6 w-5 h-5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse delay-1000 opacity-60"></div>
					</div>
				</div>

			
					{/* Core team section */}
					<TeamSection title="Core Developer" members={coreMember} isMainHeading={true} isCoreSection={true} />
					
					{/* Enhanced divider with glassmorphism */}
					<div className="flex items-center justify-center my-20">
						<div className="h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent w-full max-w-lg shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
						<div className="mx-6 relative">
							<div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.8)]"></div>
							<div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-sm opacity-60"></div>
						</div>
						<div className="h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent w-full max-w-lg shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
					</div>
					
					{/* Development team section */}
					<TeamSection title="Development Team" members={codeTeam} isMainHeading={false} isCoreSection={false} />
				
			</section>
		</div>
	);
}
