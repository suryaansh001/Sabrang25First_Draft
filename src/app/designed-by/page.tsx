"use client";

import MobileNavbar from '../../../components/MobileNavbar';

type Member = { name: string; initials: string; image?: string; role?: string };

const coreMember = [
	{ name: 'Suryansh Sharma', initials: 'SS' , image: '/images/tech_team/Suryansh_Sharma.webp', role: 'Core' },
];

const codeTeam = [
	{ name: 'Devam Gupta', initials: 'DG', image: '/images/tech_team/Devam_Gupta.webp', role: 'Frontend Developer &  UI/UX Designer' },
	{ name: 'Aman Pratap Singh', initials: 'APS', image: '/images/tech_team/Aman_Pratap_Singh.webp', role: 'Frontend Developer &  UI/UX Designer' },
	{ name: 'Yash Mishra', initials: 'YM' , image: '/images/tech_team/yash-mishra.webp', role: 'Frontend Developer &  UI/UX Designer' },
	{ name: 'Atharv Mehrotra', initials: 'AM' , image: '/images/tech_team/Atharv_Mehrotra.webp', role: 'Backend Developer' },
	{ name: 'Ayush Sharma', initials: 'AS', image: '/images/tech_team/Ayush_Shrama.webp', role: 'Backend Developer' },
	{ name: 'Somaya Agr', initials: 'SA' , image: '/images/tech_team/Somaya_Agr.webp', role: 'Frontend Developer' },
];

function FallbackAvatar({ initials }: { initials: string }) {
	return (
		<div className="relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.3),transparent_60%)]" />
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,.6)]">{initials}</span>
			</div>
		</div>
	);
}

function TeamSection({ title, members, isMainHeading = false, isCoreSection = false }: { title: string; members: Member[]; isMainHeading?: boolean; isCoreSection?: boolean }) {
	return (
		<div className="mb-12 flex flex-col items-center">
			<h2 className={`text-center mb-8 font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(139,92,246,0.4)] ${
				isMainHeading ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-2xl sm:text-3xl md:text-4xl'
			}`}>
				{title}
			</h2>
			<div className={`grid gap-4 sm:gap-6 ${
				isCoreSection ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
			}`}>
				{members.map((m) => (
					<figure key={m.name} className="group flex justify-center">
						<div className="relative rounded-[28px] overflow-hidden border border-purple-400/30 bg-gradient-to-br from-purple-600/40 via-indigo-600/30 to-blue-600/40 shadow-[0_15px_50px_rgba(139,92,246,0.3)] w-full max-w-sm sm:max-w-md hover:shadow-[0_20px_60px_rgba(139,92,246,0.4)] transition-all duration-300">
							<div className={`relative w-full ${
								isMainHeading && m.name === 'Suryansh Sharma' ? 'aspect-[3/4] min-h-[350px]' : 'aspect-[3/4] min-h-[350px]'
							}`}>
								{m.image ? (
									<>
										<img 
											src={m.image} 
											alt={m.name} 
											className="absolute inset-0 w-full h-full object-cover"
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
								{/* bottom gradient overlay */}
								<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
								{/* text overlay */}
								<div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
									<p className="text-white font-extrabold text-base sm:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,.6)] text-center">{m.name}</p>
									{(m.role || 'Tech Team') && (
										<p className="text-white/85 text-sm sm:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,.6)] text-center">{m.role || 'Tech Team'}</p>
									)}
								</div>
							</div>
						</div>
					</figure>
				))}
			</div>
		</div>
	);
}

export default function DesignedByPage() {
	// Debug: Log image paths
	console.log('Core member images:', coreMember.map(m => m.image));
	console.log('Code team images:', codeTeam.map(m => m.image));

	return (
		<div className="relative min-h-screen overflow-hidden text-white">
			<div className="fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-purple-900/80 to-indigo-900/90" />
				<div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[140vw] h-[140vw] rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(closest-side, rgba(139,92,246,0.4), rgba(236,72,153,0.2), rgba(59,130,246,0.15), transparent)' }} />
			</div>

			{/* Tech team themed background */}
			<div 
				className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-70"
				style={{ backgroundImage: 'url(/images/tech_team/tech_team_bg.webp)' }}
			/>

			{/* Mobile navbar */}
			<MobileNavbar />

			<section className="px-4 py-16">
				<div className="max-w-6xl mx-auto rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-slate-800/40 backdrop-blur-lg p-6 sm:p-8 shadow-2xl">
					<TeamSection title="Tech Geeks" members={coreMember} isMainHeading={true} isCoreSection={true} />
					<TeamSection title="" members={codeTeam} isMainHeading={false} isCoreSection={false} />
				</div>
			</section>
		</div>
	);
}
