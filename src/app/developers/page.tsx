"use client";

import MobileNavbar from '../../../components/MobileNavbar';

type Member = { name: string; initials: string; image?: string; role?: string };

const members: Member[] = [
	{ name: 'Suryansh Sharma', initials: 'SS' , image: '/images/tech_team/Suryansh_Sharma.jpg' },
	{ name: 'Devam Gupta', initials: 'DG', image: '/images/tech_team/Devam_Gupta.webp' },
	{ name: 'Aman Pratap Singh', initials: 'APS', image: '/images/tech_team/Aman_Pratap_Singh.webp' },
	{ name: 'Yash Mishra', initials: 'YM' , image: '/images/tech_team/Yash_Mishra.jpg' },
	{ name: 'Ayush Sharma', initials: 'AS', image: '/images/tech_team/Ayush_Shrama.jpg' },
	{ name: 'Atharv Mehrotra', initials: 'AM' , image: '/images/tech_team/Atharv_Mehrotra.jpg' },
	{ name: 'Somaya Agr', initials: 'AM' , image: '/images/tech_team/Somaya_Agr.jpg' },
	
];

function FallbackAvatar({ initials }: { initials: string }) {
	return (
		<div className="relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.25),transparent_60%)]" />
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,.45)]">{initials}</span>
			</div>
		</div>
	);
}

export default function DesignedByPage() {
	return (
		<div className="relative min-h-screen overflow-hidden text-white">
			<div className="fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-[#0b0b1a]/80 to-black/80" />
				<div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[140vw] h-[140vw] rounded-full blur-3xl opacity-25" style={{ background: 'radial-gradient(closest-side, rgba(99,102,241,0.28), rgba(236,72,153,0.14), transparent)' }} />
			</div>

			{/* Tech team themed background */}
			<div 
				className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-70"
				style={{ backgroundImage: 'url(/images/tech_team/tech_team_bg.png)' }}
			/>

			{/* Mobile navbar */}
			<MobileNavbar />

			<section className="px-4 py-16">
				<div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 sm:p-8">
					<div className="grid grid-cols-2 gap-6 sm:gap-8">
					{members.map((m, idx) => (
						<figure key={m.name} className="group">
							<div className="relative rounded-[28px] overflow-hidden border border-white/10 bg-[#8b0d3a]/60 shadow-[0_10px_40px_rgba(0,0,0,.35)]">
								<div className="relative w-full aspect-[3/4]">
									{m.image ? (
										<img src={m.image} alt={m.name} className="absolute inset-0 w-full h-full object-cover" />
									) : (
										<FallbackAvatar initials={m.initials} />
									)}
									{/* bottom gradient overlay */}
									<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
									{/* text overlay */}
									<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
										<p className="text-white font-extrabold text-lg sm:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,.6)]">{m.name}</p>
										{(m.role || 'Tech Team') && (
											<p className="text-white/85 text-sm sm:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,.6)]">{m.role || 'Tech Team'}</p>
										)}
									</div>
								</div>
							</div>
						</figure>
					))}
					</div>
				</div>
			</section>
		</div>
	);
}