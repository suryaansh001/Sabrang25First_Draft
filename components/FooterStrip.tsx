import Link from 'next/link';

export default function FooterStrip() {
	return (
		<div className="w-full bg-black/20 backdrop-blur-sm border-t border-white/10 py-3 px-4 relative z-[20]">
			<div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-1 text-center">
				{/* University site link */}
				<img src="/JKLU_logo_white.png" alt="JKLU" className="w-15 h-15 object-contain" />
				{/* Copyright */}
				<a href="https://jklu.edu.in" target="_blank" rel="noopener noreferrer" className="hover:text-white underline-offset-4 hover:underline">
				<div className="text-white/70 text-xs sm:text-sm">
					<span>Sabrang - JK Lakshmipat University © 2025 JKLU. All Right Reserved</span>
				</div>
				</a>

				{/* Credits */}
				<div className="text-white/60 text-xs sm:text-sm">
					<span>Built and designed by </span>
					<Link href="/designed-by" className="underline-offset-4 hover:underline hover:text-white">tech_geek</Link>
				
				</div>
			</div>
		</div>
	);
}
