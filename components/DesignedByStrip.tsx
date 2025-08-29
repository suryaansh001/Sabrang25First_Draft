import Link from 'next/link';

export default function DesignedByStrip() {
	return (
		<div className="fixed inset-x-0 bottom-0 z-50">
			<div className="relative mx-auto max-w-7xl px-3 sm:px-4 pb-3">
				<div className="pointer-events-auto group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
					{/* Glow */}
					<div className="absolute inset-0 -z-10 opacity-60 group-hover:opacity-80 transition" style={{
						background: 'radial-gradient(120% 60% at 50% 120%, rgba(99,102,241,0.25) 0%, rgba(236,72,153,0.18) 35%, transparent 70%)'
					}} />
					{/* Accent edge */}
					<div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-fuchsia-400 via-purple-400 to-blue-400" />
					<Link href="/designed-by" className="flex w-full items-center justify-between gap-3 px-4 py-2.5">
						<div className="flex items-center gap-3">
							<div className="h-6 w-6 rounded-md border border-white/15 bg-white/5 grid place-items-center">
								<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
									<path d="M3 3h18v18H3z" fill="none" stroke="url(#g)" strokeWidth="1.5" />
									<defs>
										<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
											<stop stopColor="#a78bfa" />
											<stop stopColor="#60a5fa" offset="1" />
										</linearGradient>
									</defs>
								</svg>
							</div>
							<p className="text-xs sm:text-sm text-gray-200">
								Designed by <span className="font-semibold text-white">Sabrang Techinal Team</span>
							</p>
						</div>
						<div className="text-[10px] sm:text-xs text-purple-200/90 group-hover:text-white transition flex items-center gap-2">
							<span className="hidden sm:inline">See how we built it</span>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
