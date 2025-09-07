"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AlertCircle, ArrowLeft, Gavel, ListChecks, Shield, Star } from 'lucide-react';
import { events, Event, Criterion } from './events.data';
import EventCard from '../../EventCard';

const defaultRules: string[] = [
	'Carry a valid college ID and entry pass.',
	'Report at least 30 minutes before the event start time.',
	'Decisions of judges are final and binding.',
	'Any form of abuse, vandalism or misconduct leads to disqualification.',
	'Organizers reserve the right to modify rules at any time.'
];

const defaultCriteria: string[] = [
	'Creativity and originality of concept',
	'Execution and technical skill',
	'Stage presence and audience engagement',
	'Adherence to theme and guidelines',
	'Overall impact'
];

export default function EventRulesPage() {
	const router = useRouter();
	const routeParams = useParams() as { id?: string };
	const eventId = Number(routeParams?.id ?? '0');
	const [activeTab, setActiveTab] = useState<'rules' | 'criteria'>('rules');

	const event = useMemo<Event | undefined>(() => events.find(e => e.id === eventId), [eventId]);

	const { scrollY } = useScroll();
	const heroBgY = useTransform(scrollY, [0, 500], ["0%", "30%"]);
	const heroBgScale = useTransform(scrollY, [0, 500], [1, 1.2]);

	const rules = useMemo<string[]>(() => {
		return event?.rules && event.rules.length > 0 ? event.rules : defaultRules;
	}, [event]);

	const criteria = useMemo<Criterion[]>(() => {
		return event?.criteria && event.criteria.length > 0 ? event.criteria : defaultCriteria;
	}, [event]);

	const accents = (() => {
		switch (event?.category) {
			case 'Flagship':
				return {
					pill: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
					headingGradient: 'from-amber-200 to-orange-400',
					iconGradient: 'from-amber-400 to-orange-500',
					tabActive: 'bg-amber-400/10 text-amber-200 border-amber-300',
					tabInactive: 'text-neutral-400 border-transparent',
					alertBorder: 'border-amber-400/30',
					alertBg: 'bg-amber-400/5',
					glowGradient: 'bg-gradient-to-tr from-orange-500 to-amber-500',
				};
			case 'Creative Arts':
				return {
					pill: 'text-rose-300 bg-rose-400/10 border-rose-400/20',
					headingGradient: 'from-rose-200 to-fuchsia-400',
					iconGradient: 'from-rose-400 to-fuchsia-500',
					tabActive: 'bg-rose-400/10 text-rose-200 border-rose-300',
					tabInactive: 'text-neutral-400 border-transparent',
					alertBorder: 'border-rose-400/30',
					alertBg: 'bg-rose-400/5',
					glowGradient: 'bg-gradient-to-tr from-fuchsia-500 to-rose-500',
				};
			case 'Fun & Games':
				return {
					pill: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20',
					headingGradient: 'from-cyan-200 to-sky-400',
					iconGradient: 'from-cyan-400 to-sky-500',
					tabActive: 'bg-cyan-400/10 text-cyan-200 border-cyan-300',
					tabInactive: 'text-neutral-400 border-transparent',
					alertBorder: 'border-cyan-400/30',
					alertBg: 'bg-cyan-400/5',
					glowGradient: 'bg-gradient-to-tr from-sky-500 to-cyan-500',
				};
			case 'Workshops & Talks':
				return {
					pill: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
					headingGradient: 'from-emerald-200 to-teal-400',
					iconGradient: 'from-emerald-400 to-teal-500',
					tabActive: 'bg-emerald-400/10 text-emerald-200 border-emerald-300',
					tabInactive: 'text-neutral-400 border-transparent',
					alertBorder: 'border-emerald-400/30',
					alertBg: 'bg-emerald-400/5',
					glowGradient: 'bg-gradient-to-tr from-teal-500 to-emerald-500',
				};
			default: // Special Events & fallback
				return {
					pill: 'text-indigo-300 bg-indigo-400/10 border-indigo-400/20',
					headingGradient: 'from-indigo-200 to-violet-400',
					iconGradient: 'from-indigo-400 to-violet-500',
					tabActive: 'bg-indigo-400/10 text-indigo-200 border-indigo-300',
					tabInactive: 'text-neutral-400 border-transparent',
					alertBorder: 'border-indigo-400/30',
					alertBg: 'bg-indigo-400/5',
					glowGradient: 'bg-gradient-to-tr from-violet-500 to-indigo-500',
				};
		}
	})();

	if (!event) {
		return (
			<div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Event not found</h1>
					<button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-white/10 rounded-lg">Go Back</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-neutral-900 text-white relative isolate">
			{/* Aurora Glow Background */}
			<div className="absolute inset-x-0 top-1/2 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
				<div 
					className={`relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] ${accents.glowGradient} opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]`}
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
				/>
			</div>

			{/* Sticky Header */}
			<header className="sticky top-0 z-20  backdrop-blur-xl border-b border-white/5">
				<div className="max-w-6xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<button 
							onClick={() => router.back()} 
							className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
						>
							<ArrowLeft className="w-4 h-4 " />
							<span>Back</span>
						</button>
						<div className="text-right">
							<div className="text-sm text-neutral-500">Event Rules</div>
							<div className="text-lg font-semibold truncate max-w-md">
								{event?.title || 'Guidelines'}
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* New Hero Section */}
			<div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
				<motion.div
					className="absolute inset-0 bg-cover bg-center opacity-50 blur-sm"
					style={{ 
						backgroundImage: `url(${event.image})`,
						y: heroBgY,
						scale: heroBgScale
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-neutral-900" />

				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
						{/* Left: Event Card */}
						<motion.div
							className="flex justify-center md:justify-end"
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.7, ease: 'easeOut' }}
						>
							<EventCard event={event} />
						</motion.div>

						{/* Right: Event Details */}
						<motion.div
							className="text-center md:text-left"
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
						>
							<div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm mb-4 ${accents.pill}`}>
								<Shield className="w-4 h-4" />
								<span>Official Guidelines</span>
							</div>
							<h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
								<span className={`bg-gradient-to-r ${accents.headingGradient} bg-clip-text text-transparent`}>{event.title}</span>
							</h1>
							<p className="mt-4 text-lg text-neutral-300 max-w-lg mx-auto md:mx-0">
								{event.description || 'Everything you need to know to participate successfully. Read carefully and compete with confidence.'}
							</p>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Main Content with Tabs */}
			<main className="relative z-10">
				<div className="max-w-5xl mx-auto px-6 pb-20">
					{/* Tab Navigation */}
					<div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex items-center gap-2 mb-8">
						<button
							onClick={() => setActiveTab('rules')}
							className={`w-1/2 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 border-b-2 ${activeTab === 'rules' ? accents.tabActive : accents.tabInactive}`}
						>
							<Gavel className="w-4 h-4" />
							Competition Rules
						</button>
						<button
							onClick={() => setActiveTab('criteria')}
							className={`w-1/2 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 border-b-2 ${activeTab === 'criteria' ? accents.tabActive : accents.tabInactive}`}
						>
							<Star className="w-4 h-4" />
							Judging Criteria
						</button>
					</div>

					{/* Tab Content */}
					{activeTab === 'rules' && (
						<motion.div
							key="rules"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="space-y-4"
						>
							{rules.map((rule, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className="bg-white/5 border border-white/10 rounded-lg p-5 flex items-start gap-4"
								>
									<div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-neutral-300">{index + 1}</div>
									<p className="text-neutral-200 leading-relaxed pt-1">{rule}</p>
								</motion.div>
							))}
						</motion.div>
					)}

					{activeTab === 'criteria' && (
						<motion.div
							key="criteria"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="space-y-4"
						>
							{criteria.map((criterion, index) => {
								if (typeof criterion === 'string') {
									// Render simple criterion card
									return (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.5, delay: index * 0.1 }}
											className="bg-white/5 border border-white/10 rounded-lg p-5 flex items-start gap-4 hover:bg-white/10 transition-colors"
										>
											<div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${accents.iconGradient}`}>
												<ListChecks className="w-5 h-5 text-white" />
											</div>
											<p className="text-neutral-200 leading-relaxed pt-2">{criterion}</p>
										</motion.div>
									);
								} else {
									// Render heading with items
									return (
										<motion.div
											key={index}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.5, delay: index * 0.1 }}
											className="bg-black/20 border border-white/10 rounded-xl p-6"
										>
											<h3 className={`text-xl font-bold mb-4 flex items-center gap-3`}>
												<span className={`p-2 rounded-md flex-shrink-0 bg-gradient-to-br ${accents.iconGradient}`}>
													<Star className="w-5 h-5 text-white" />
												</span>
												<span className={`bg-gradient-to-r ${accents.headingGradient} bg-clip-text text-transparent`}>
													{criterion.heading}
												</span>
											</h3>
											<div className="space-y-3 pl-4 border-l-2 border-white/10 ml-5">
												{criterion.items.map((item, itemIndex) => (
													<div key={itemIndex} className="flex items-start gap-3">
														<div className="mt-1.5 w-2 h-2 rounded-full bg-white/50 flex-shrink-0" />
														<p className="text-neutral-300">{item}</p>
													</div>
												))}
											</div>
										</motion.div>
									);
								}
							})}
						</motion.div>
					)}

					{/* Important Note Callout */}
					<div className={`mt-12 border rounded-xl p-6 backdrop-blur-md ${accents.alertBorder} ${accents.alertBg}`}>
						<div className="flex items-start gap-4">
							<div className={`p-2 rounded-lg flex-shrink-0 bg-gradient-to-br ${accents.iconGradient}`}>
								<AlertCircle className="w-5 h-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-white">Important Note</h3>
								<p className="text-neutral-300 leading-relaxed mt-1">
									All judging criteria may carry equal weight. Performances are evaluated holistically across all dimensions for the fairest assessment. The organizers' decisions are final.
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}