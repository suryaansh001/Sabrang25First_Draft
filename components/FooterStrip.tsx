import Link from 'next/link';

export default function FooterStrip() {
	return (
		<div className="w-full bg-black/20 backdrop-blur-sm border-t border-white/10 py-3 px-4">
			<div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-1 text-center">
				<div className="flex items-center gap-2 text-white/80 text-sm">
					<a href="https://jklu.edu.in" target="_blank" rel="noopener noreferrer" className="hover:text-white underline-offset-4 hover:underline">jklu.edu.in</a>
				</div>
				<div className="text-white/70 text-xs sm:text-sm">
					<span>Sabrang - JK Lakshmipat University © 2025 JKLU. All Right Reserved</span>
				</div>
			</div>
		</div>
	);
}
