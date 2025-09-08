import Link from 'next/link';

export default function FooterStrip() {
	return (
		<div className="w-full bg-black/20 backdrop-blur-sm border-t border-white/10 py-3 px-4">
			<div className="max-w-7xl mx-auto flex items-center justify-center">
				<Link 
					href="/designed-by" 
					className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group text-sm"
				>
					{/* Simple animated dot */}
					<div className="relative w-2 h-2">
						<div className="absolute w-2 h-2 bg-blue-500/60 rounded-full animate-pulse"></div>
						<div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
					</div>
					
					<span className="font-medium">DESIGNED AND DEVELOPED BY TECH TEAM</span>
				</Link>
			</div>
		</div>
	);
}
