export type Criterion = string | { heading: string; items: string[] };

export interface Event {
	id: number;
	title: string;
	image?: string;
	category?: string;
	description?: string;
	rules?: string[];
	criteria?: Criterion[];
}

export const events: Event[] = [
	{
		id: 1,
		title: 'RAMPWALK - PANACHE',
		image: '/images/about-section/Panache.png',
		category: 'Flagship',
		description: 'The grandest runway event of Sabrang, Panache is where elegance, charisma, and confidence collide. Teams will display original collections or concepts with full choreography, soundtrack, and fashion narratives. Expectations - Glamour, high-stakes competition, and crowd pulling visuals.',
		rules: [
			'Team size: 10-20 members.',
			'Participants must arrive at the venue 2 hours before the event commences.',
			'Registration is compulsory for all participants.',
			'Each team must choose a clear theme for their rampwalk.',
			'The participants are allowed to use props as per their wish to enhance their performance.',
			'A brief description of the theme has to be submitted in document form along with required media files 2 days before the event in a drive link which will be circulated by event coordinators.',
			'Violation of rules and indecent behaviour will lead to immediate disqualification.',
			'The candidates are responsible for their personal belongings.'
		],
		criteria: [
			'Theme interpretation',
			'Body Language',
			'Stage presence & confidence',
			'Innovation & visual impact',
			'Choreography & walk',
			'Costume/styling & props',
			'Coordination & flow'
		]
	},
	{
		id: 2,
		title: 'BANDJAM',
		image: '/images/about-section/Bandjam.png',
		category: 'Flagship',
		description: "Get ready to experience the electrifying talent of the Band Jam Competition, where instruments roar to life with powerful melodies. This musical face-off will fill the air with rhythm and energy, leaving the audience moved by the magic of sound.",
		rules: [
			'Participants must arrive 1 hour before the competition begins.',
			'Team Size: 4 - 8 members.',
			'Use of pre-recorded tracks is strictly prohibited, and doing so will lead to immediate disqualification.',
			'Participants must bring their own instruments. A basic drum kit will be provided, but teams should bring their own cymbals if needed.',
			'Any rule violations or inappropriate behaviour may result in disqualification.'
		],
		criteria: [
			'Judges’ decisions will be final and binding. Bands will be judged on:',
			'Vocals',
			'Rhythm',
			'Tone Quality',
			'Creativity',
			{
				heading: 'Round 1',
				items: [
					'Stage Presence',
					'Coordination',
					'Each team will have a total time limit of 20 minutes (10 minutes for performance + 10 minutes for mic check).',
					'Penalties will be applied if the time limit is exceeded.'
				]
			}
		]
	},
	{
		id: 3,
		title: 'DANCE BATTLE',
		image: '/images/about-section/Dance.png',
		category: 'Flagship',
		description: "Get ready for an electrifying crew vs. crew dance showdown! In this high-stakes elimination battle, teams of 6-12 members will face off, showcasing their best choreography and freestyle moves. With strict rules on music, props, and conduct, only the most disciplined and creative crew will be crowned champions. It's a test of skill, synchronization, and raw energy.",
		rules: [
			'Team Size: Each team must consist of 6 to 12 members (including performers and backstage help).',
			'Reporting Time: All teams must report at the venue 2 hours before the event for briefing and sound check.',
			'Multiple Entries: Participants are allowed to be a part of only one team.',
			'Music Submission: Teams must submit their audio file in MP3 format, at least 2 days prior to the event.',
			'Submission Process: Music must be uploaded via the official Google Drive link shared by the coordinators.',
			'Tracks must be edited and final—no live mixing or last-minute changes will be entertained.',
			'Props usage: Props involving fire, water, glass, or hazardous materials are strictly prohibited.',
			'Costume: Outfits must be appropriate, respectful, and culturally sensitive.',
			'Violation of the rules or any indecent behaviour may result in immediate disqualification.',
			'The candidates are responsible for their personal belongings.'
		],
		criteria: [
			'Choreography & Creativity',
			'Synchronization',
			'Energy, Stage Presence & Facial Expressions',
			'Technical Skill, Musicality & Rhythm Sync',
			'Costume & Visual Appeal',
			'Use of Stage & Formations',
			{
				heading: 'Round 1',
				items: [
					'Each team will have a total time limit of 5 -15 minutes for performance.',
					'Exceeding the time limit will result in negative marking.'
				]
			}
		]
	},
	{
		id: 4,
		title: 'STEP UP',
		image: '/images/home2.png',
		category: 'Flagship',
		description: "Step Up is the ultimate solo dance challenge where individual performers take center stage. This is a test of pure skill, creativity, and stage command. With strict rules and a two-round elimination format, only the most versatile and captivating dancer will rise to the top. Are you ready to own the spotlight?",
		rules: [
			'Team Size: Solo (only 1 participant per entry).',
			'Eligibility: Open to all students with a valid ID card.',
			'Reporting Time: All participants must report 2 hours before the event for check-in, briefing, and stage inspection.',
			'Multiple Entries: A participant may not register in more than one solo dance category.',
			'Music Submission: Teams must submit their audio file in MP3 format, at least 2 days prior to the event.',
			'Submission Process: Music must be uploaded via the official Google Drive link shared by the coordinators.',
			'Tracks must be edited and final—no live mixing or last-minute changes will be entertained.',
			'Props usage: Props involving fire, water, glass, or hazardous materials are strictly prohibited.',
			'Costume: Outfits must be appropriate, respectful, and culturally sensitive.',
			'Violation of the rules or any indecent behaviour may result in immediate disqualification.',
			'The candidates are responsible for their personal belongings.'
		],
		criteria: [
			'Stage Presence & Facial Expressions',
			'Creativity',
			'Technical Skill, Musicality & Rhythm Sync',
			'Choreography',
			'Costume & visual appeal',
			'Energy',
			'Stage Utilization',
			'Space Adaptation',
			{
				heading: 'Round 1 (no props allowed)',
				items: [
					'Each participant will have a total time of 2 minutes for performance.',
					'Exceeding the time limit will result in negative marking.',
					'No use of any karaoke and instruments allowed in this round.',
					'A certain number of participants will be allowed to proceed to the final round based on the judges’ evaluation.'
				]
			},
			{
				heading: 'Round 2',
				items: [
					'Each participant will have a total time limit of 4 minutes for performance.',
					'Exceeding the time limit will result in negative marking.',
					'Use of pre-approved, safe props allowed. (no harmful or hazardous materials are allowed.)'
				]
			}
		]
	},
	{ id: 5, title: 'ECHOES OF NOOR', image: '/images/Logo@2x.png', category: 'Flagship' },
	{
		id: 7,
		title: 'BIDDING BEFORE WICKET',
		image: '/images/Logo@2x.png',
		category: 'Fun & Games',
		description: "Welcome to Bidding Before Wicket, the ultimate cricket strategy showdown! This isn't just an auction; it's a high-stakes battle of wits where you build your dream team with a 100 Cr budget. Navigate the auction with special powers like 'Jump Bidding' and the risky 'Budget Boost'. Qualify through a quiz round, then dominate the auction table to assemble a squad with the highest rating. Do you have what it takes to be a champion owner?",
		rules: [
			'SOME POWERS TO MAKE GAME MORE INTRESTING:',
			'1) JUMP BIDDING RULE: Each team will be allowed to use the Jump Bidding feature once during the entire auction. This allows a team to skip the regular bidding increments and directly bid any higher amount from the base price. However, if no other team places a bid after the jump, the initiating team will be compulsorily required to buy the player at their quoted jump price.',
			'2) BUDGET BOOST POWER: To introduce a thrilling strategic element, each team will be allowed to use the Budget Boost Power only once during the entire auction. After every round, there will be a 5-minute break, during which teams may choose to activate this power. When used, the team will be asked a bonus question related to cricket or general knowledge. If they answer correctly, they will receive a massive 2 crores boost to their remaining budget. However, if they answer incorrectly, ₹3 crores will be deducted from their budget. This power comes with high risk and high reward, so teams are advised to use it strategically and only when confident. Once a team uses the Budget Boost Power, they cannot use it again under any circumstances',
			'Team Composition Minimum criteria: Batsmen - 4, Bowler – 4, Wicketkeeper - 1, All-rounder – 3',
			'Ratings: The team with the highest ratings. If the first two criteria of the two teams are the same, then the budget left with the team will be taken into consideration.'
		],
		criteria: [
			{
				heading: 'ROUND 1:',
				items: [
					'Each team shall designate one individual to represent them in the quiz',
					'The top 10 teams would qualify for the Final Round.'
				]
			},
			{
				heading: 'ROUND 2:',
				items: [
					'Each team will be allotted a budget of 100 Cr.',
					'Each team must pick a total of 12 players only.',
					'Each team can pick a max of 4 overseas players.',
					'Each team must pick one Uncapped Indian player.',
					"The players' base prices are allocated according to their present form and statistics, with values set at 20 Crores, 10 Crores, 1 Crore , 50 Lakhs and 20 Lakhs.",
					"When calling your bid, say the franchise name. For example, a Team representing Rajasthan Royals will bid '50 Lakhs– RR’.",
					'The increment bidding for players will be in the following manner:* 20 Lakhs – 1 crore: 10 Lakhs 1 crore – 10 Crore: 50 Lakhs 10 crores to 20 Crore – 1 Crore Above 20 Crore – 2 Crore',
					'After one round of auction, unsold players will be repeated only once.'
				]
			}
		]
	},
	{
		id: 8,
		title: 'SEAL THE DEAL',
		image: '/images/Logo@2x.png',
		category: 'Fun & Games',
		description: "Welcome to Seal the Deal, a premier trading event designed to challenge and sharpen your financial acumen. This competition offers a unique opportunity to experience the intensity and decision-making rigour of trading in a simulated environment. With a substantial dummy capital and a range of trading strategies, participants will need skill, precision, and strategy to emerge victorious.",
		rules: [
			'Team Size: 1 member.',
			'Trading Capital: Each participant will be allotted ₹10,00,000 (INR) in dummy cash to begin their trading activities.',
			'All subsequent trades must be funded from the available balance, including both initial capital and any profits.',
			'Exceeding the available balance will result in immediate disqualification from the event.',
			'All trades must follow fair trading practices. Any violation of ethical trading will result in disqualification.'
		],
		criteria: [
			'The participant who achieves the highest gains by the end of the competition will be declared the winner.',
			{
				heading: 'Tie-Breaker Rules',
				items: [
					'1. The participant with the most successful trades will be declared the winner.',
					'2. If a tie persists, the participant with the highest profit from a single trade will be declared the winner.'
				]
			},
			{
				heading: 'Event Format',
				items: [
					'Participants will engage in simulated trading for a fixed time period of 1 hour.',
					'Strict adherence to the time limit is required; exceeding the time limit will result in disqualification.'
				]
			},
			{
				heading: 'Permitted Trading Strategies',
				items: [
					'Buy and Hold: Participants may purchase assets and retain them for any duration within the allotted event time.',
					'Day Trading: Participants may engage in intraday trading, buying and selling assets within the same day.',
					'Short Selling: Participants may sell assets they do not own with the intention to repurchase them at a lower price later.'
				]
			}
		]
	},
	{
		id: 9,
		title: 'VERSEVAAD',
		image: '/images/Logo@2x.png',
		category: 'Flagship',
		description: '"Versevaad" is a two-round rap battle event designed to showcase originality, creativity, and improvisational skills. The competition emphasizes clean content, prohibiting any form of vulgarity.',
		rules: [
			'Eligibility: Open to all individuals; no age restrictions. Participants must register prior to the event.',
			'Conduct: Respect towards fellow participants, judges, and the audience is mandatory. Any form of hate speech, discrimination, or personal attacks will result in disqualification.',
			'Performance: Use of props or background music is not permitted unless specified. Participants must adhere to the time limits; exceeding the limit may affect scoring.',
			"Judging Panel: A panel of 3 judges will evaluate performances based on the specified criteria. Judges' decisions are final and binding.",
			'Tiebreakers: In the event of a tie, a sudden-death round will be conducted with a new set of words and a 3-minute preparation time.'
		],
		criteria: [
			{
				heading: 'Round 1: Prewritten Original Rap',
				items: [
					'Performance: Each participant will perform their own original, prewritten rap piece.',
					'Time Limit: Maximum of 2 minutes per performance.',
					'Content Guidelines: Lyrics must be 100% original; plagiarism is strictly prohibited. No vulgar, offensive, or inappropriate language or themes.',
					'Judging Criteria: Lyricism and originality, Flow and rhythm, Stage presence and delivery, Audience engagement.',
					'Advancement: Top performers, as determined by the judges, will advance to Round 2.'
				]
			},
			{
				heading: 'Round 2: Freestyle with Given Words (FACE OFF)',
				items: [
					'Preparation: Participants will be provided with a set of specific words. A 5-minute preparation period will be allotted to compose a rap incorporating these words.',
					'Performance: Raps must be performed live immediately after the preparation time. All provided words must be used meaningfully within the rap.',
					'Prohibited Aids: No mobile phones, notebooks, paper, or any external writing tools allowed during this round. You can’t read off of your phone/Canibus’ notebook if you forget your bars.',
					'Time Limit: Maximum of 2 minutes per performance.',
					'Content Guidelines: Maintain clean content; avoid vulgarity and offensive language.',
					'Judging Criteria: Effective incorporation of given words, Creativity and improvisation, Flow and coherence, Audience response.'
				]
			}
		]
	},
	{
		id: 10,
		title: 'IN CONVERSATION WITH',
		image: '/images/Logo@2x.png',
		category: 'Workshops & Talks',
		description: "Join us for 'In Conversation With,' a curated talk series featuring distinguished guests from the worlds of art, activism, and creation. Listen as they share their personal journeys and behind-the-scenes stories in an intimate setting, followed by an interactive live Q&A session designed to spark ideas and inspire the next generation.",
		rules: [
			'Entry is on a first-come, first-served basis due to limited seating.',
			'Please arrive at least 15 minutes before the session begins to ensure you are seated.',
			'Mobile phones must be switched to silent mode to avoid disturbing the session.',
			'Please be respectful during the Q&A session and allow others the opportunity to ask questions.',
			'Recording of the session (audio or video) is strictly prohibited without prior written permission from the organizers.'
		],
		criteria: [
			{
				heading: 'What to Expect',
				items: [
					'A curated talk series featuring distinguished guests including artists, activists, and creators.',
					'Guests will share their personal journeys and behind-the-scenes stories.',
					'Interactive live Q&A sessions with the audience.',
					'A platform where ideas spark and inspire the next generation.'
				]
			}
		]
	},
	{
		id: 11,
		title: 'CLAY MODELLING',
		image: '/images/Logo@2x.png',
		category: 'Creative Arts',
		description: "Unleash your creativity and bring your imagination to life in our hands-on clay modelling event! This is a solo artist's playground, where you'll have the time, space, and materials to translate a concept from your mind into a tangible piece of art.",
		rules: [
			'Team size: 1 member',
			'Open to all students with a valid ID card',
			'Participants will be provided with air dry clay and basic sculpting tools.',
			'Participants will be given 2-3hours to interpret a given theme into their clay model.'
		],
		criteria: [
			'Creativity and originality',
			'Material handling',
			'Skill & detailing',
			'Relevance to theme'
		]
	},
	{
		id: 12,
		title: 'FOCUS',
		image: '/images/Logo@2x.png',
		category: 'Creative Arts',
		description: "Bring your vision to life through the lens! FOCUS is a creative photography challenge that pushes you to capture stories, colours, and reflections in their purest form — without heavy edits or digital tricks.",
		rules: [
			'Team Size: Solo participation only (1 member per team).',
			'Rounds: The competition will have 2 rounds.',
			'Editing: Only light edits allowed – cropping, brightness, contrast, sharpness, and minor colour correction. No filters, presets, or advanced manipulation.',
			'Originality: Every photo must be your own work. Plagiarised or AI-generated entries will be disqualified.',
			'Deadline: Submissions must be made within the given time limit. Late entries will not be accepted.',
			'File Format: Only JPEG or PNG formats are accepted.',
			'Device Neutrality: Photos taken on any device (camera or mobile) will be judged equally.',
			'Ethics: No harm to people, animals, or the environment while taking photographs.',
			'Disqualification: Any rule violation will result in immediate disqualification.',
			'Open to all students with a valid ID card.'
		],
		criteria: [
			"Judges’ decisions will be final and binding. Entries will be evaluated on: Aesthetics & visual balance (as per theme), Creativity & composition, Interpretation of caption (Round 2), Use of light & color, and Subtlety & clarity (over-edited photos may be penalized).",
			{
				heading: 'Event Format - Round 1 (Dual Challenge)',
				items: [
					'Dual Challenge: Participants must complete both sub-themes:',
					'1. Complementary Colour Challenge: Capture a photo using complementary colors (e.g., blue & orange, red & green, purple & yellow). Objective: Explore colour theory and create strong visual contrast.',
					'1. Reflection Hunt: Capture a photo that prominently features reflections. Objective: Use angles, symmetry, and reflections to create depth and balance.',
					'Location Restriction: All photographs must be clicked within the university campus during Sabrang.',
					'Editing Note: Only basic corrections (crop, brightness, contrast, sharpness, natural colour correction) are allowed. Any filters, presets, or AI edits will lead to penalties or disqualification.'
				]
			},
			{
				heading: 'Event Format - Round 1 (B)',
				items: [
					'Dual Challenge: Participants must complete both sub-themes in Round 1.',
					'1. Complementary Colour Challenge: Participants must capture photographs that use complementary colours from the colour wheel (e.g., blue & orange, red & green, purple & yellow). Objective: To explore colour theory and create visual contrast that enhances compositional strength.',
					'2. Reflection Hunt: Participants must also click a photo that prominently features reflections. Objective: To explore angles, symmetry, and visual depth using reflected imagery.',
					'Location Restriction: All photographs must be clicked within the university campus during Sabrang.',
					'Editing: Only basic edits such as cropping, brightness, contrast, sharpness, and color correction are allowed. Use of filters, presets, or AI tools is strictly prohibited. Edits should enhance the natural quality of the photo without altering its authenticity or colour integrity.'
				]
			},
			
		]
	},
	{
		id: 13,
		title: 'BGMI TOURNAMENT',
		image: '/images/Logo@2x.png',
		category: 'Fun & Games',
		description: "Drop into Sabrang's official BGMI tournament, where strategy and skill collide. Squads of four will battle it out in a multi-day event with a unique scoring system that rewards both aggressive play and survival. With bonus points for kill streaks and chicken dinners, only the most versatile team will claim victory. Register your squad, gear up, and get ready for the ultimate battle royale showdown.",
		rules: [
			'Team Size: 4 members + 1 support (optional). If all 4 main players are not available and there is no support player, the team will be disqualified.',
			'Tournament will be played over two days during scheduled slots.',
			'Emulators and triggers are restricted.',
			'Participants are responsible for their own devices (phone/tablet), headphones, and registration of IDs.',
			'Upon registration, Google forms will be circulated where every player has to register their IDs. All details should be filled carefully and once submitted no changes will be allowed.',
			'ID & Password will be provided via an official group formed upon registration.',
			'The room will be held for 10 minutes prior to start for team screening and only registered IDs will be permitted.',
			'If any player or team is suspected of using third-party tools (APKs, GFX, altered game files) or exploiting bugs, they will be banned from the tournament.'
		],
		criteria: [
			{
				heading: 'Tournament Format & Participation',
				items: [
					'On-Campus: All teams must report to the venue 25 minutes prior to scheduled matches.',
					'Online: Teams participating online must provide their information to the coordinator 48 hours before the scheduled match. Online participation is only permitted with prior approval.',
					'The Placement Table will be revealed, and only top teams will play the Finals, whose format will be announced on the spot.'
				]
			},
			{
				heading: 'Scoring System',
				items: [
					'Per Kill: 2 points.',
					'Bonus: An additional 5 points bonus will be granted if a team\'s kills exceed 8 in a match.',
					'Bonus: If a team secures 2 Winner Winner Chicken Dinners (WWCD) out of 4 matches, a 15-point bonus will be granted.',
					'Powerplay Match: One match (except M1 Erangle) will be a powerplay round where only kill points (5 per kill) will be considered, and placement points will be void.'
				]
			}
		]
	},
	{
		id: 14,
		title: 'VALORANT TOURNAMENT',
		image: '/images/Logo@2x.png',
		category: 'Fun & Games',
		description: "Gear up for Sabrang's official 5v5 Valorant tournament! This high-stakes competition tests your team's strategy, aim, and coordination across a multi-stage format, from group stages to a best-of-five grand final. With strict fair play rules and a professional map veto process, only the most skilled team will emerge as champions.",
		rules: [
			'Eligibility: Open to all current students of [College Name]. Participants must have a valid college ID. Teams must register before the deadline (no on-spot entries).',
			'Team Composition: 5v5 (Main players) + 1-2 substitutes (optional). Team names must be appropriate (offensive names will be rejected).',
			'Game Settings: Mode: Tournament Mode (Standard Plant/Defuse). Maps: Pre-decided by organizers or picked via veto system. Server: Mumbai (or closest available server).',
			'Cheating & Fair Play: Any form of hacking, scripting, or exploiting bugs will lead to immediate disqualification. Smurfing is not allowed (players must use their main accounts). Teams may be asked to share screens via Discord/Zoom for monitoring.'
		],
		criteria: [
			{
				heading: 'Tournament Format',
				items: [
					'Group Stage: Round-robin or Swiss format (depending on the number of teams). Best of 1 (BO1) matches.',
					'Knockouts: Quarterfinals/Semifinals: Best of 3 (BO3). Finals: Best of 5 (BO5).',
					'Map Veto Process: Higher seed (or coin toss) decides veto order. Teams alternate banning maps until one remains (or pick for BO3/BO5).'
				]
			},
			{
				heading: 'Match Rules',
				items: [
					'Punctuality: Teams must join the lobby 10 mins before scheduled time. 5-minute grace period; late teams forfeit the match.',
					'Disconnections: If a player disconnects before first blood, the round is restarted. After first blood, play continues (substitute can join if available).',
					'Pauses: Each team gets 1 tactical pause (2 mins max) per match.',
					'Score Submission: Winning team must submit a screenshot of match results to admins.'
				]
			},
			{
				heading: 'Allowed & Restricted Agents/Weapons',
				items: [
					'Agents: All agents allowed (including the latest released agent).',
					'Weapons/Skins: No restrictions (purely cosmetic).',
					'Glitches: Exploiting map bugs (e.g., Cypher cam spots) is banned.'
				]
			}
		]
	},
	{
		id: 15,
		title: 'FREE FIRE TOURNAMENT',
		image: '/images/Logo@2x.png',
		category: 'Fun & Games',
		description: "Dive into the ultimate mobile battle royale with Sabrang's official Free Fire Tournament. This is a high-stakes competition where only the sharpest squads will survive. With strict rules against teaming and hacking, and a point system that rewards both placement and kills, your path to victory depends on pure skill and strategy. Join the lobby, prove your worth, and fight for the Booyah!",
		rules: [
			'Lobby Joining: Room ID & Password will be shared 10 minutes before the match. Late entry beyond 5 minutes = disqualified for that match. Participants are responsible for their own devices, headphones, and IDs.',
			'Teaming with opponents is strictly prohibited.',
			'Hacking/Modding: Any use of third-party tools (APKs, GFX, altered files) or exploitation of bugs will result in an immediate team ban. Suspicious activity can be reported to moderators.',
			'Character Skills / Pets: All are allowed unless otherwise specified by organizers for balanced play (e.g., Chrono, Alok, K may be restricted).',
			'Weapons & Loadouts: All weapons are allowed. Custom rooms will use default settings.',
			'Zone Camping / Glitches: Zone camping with medkits to win is not allowed. Using map bugs or glitches will lead to instant disqualification.',
			'Disconnection: No rematch for individual disconnections. Server-side issues affecting all players will be reviewed for a potential rematch.',
			'Proof Submission: A screenshot of your kill count and rank must be submitted within 10 minutes of match completion in the designated group.',
			'Disqualification Grounds: Abusive language, not joining on time, use of hacks/emulators, or account sharing.'
		],
		criteria: [
			{
				heading: 'Scoring System (Example)',
				items: [
					'1st Place: 15 Points',
					'2nd Place: 12 Points',
					'3rd Place: 10 Points',
					'4th–10th Place: 5 Points',
					'Per Kill: 1 Point'
				]
			},
			{
				heading: 'Round 1 Participation',
				items: [
					'On-Campus: All teams must report to the venue 25 minutes prior to scheduled matches.',
					'Online: Teams participating online must provide their information to the coordinator 48 hours before the scheduled match. Online participation is only permitted with prior approval.'
				]
			}
		]
	},
	{
		id: 17,
		title: 'DUMB SHOW',
		image: '/images/Schedule.jpg',
		category: 'Fun & Games',
		description: "Get ready for a fun and challenging game of silent acting! Dumb Show brings teams together to act out movie names, phrases, or themes without speaking, relying on gestures and body language to communicate. Test your creativity and teamwork as participants race against the clock to guess the correct answer, making for an exciting and laughter-filled experience for everyone involved.",
		rules: [
			'Team Size: 3 members. Before starting, each team must introduce themselves with a funny name.',
			'This event comprises 2 rounds.',
			'Decision of the judges will be final and binding.',
			'Bonus Points for Creativity: Award extra points for funny, creative, or dramatic performances — not just correct guesses.',
			'Penalty for Clues/Whispers: Mouth movements, lip-syncing, or any form of hinting will lead to point deduction or disqualification.',
			'Tie-Breaker Round: In case of a tie, teams will face a rapid-fire round (30 seconds per act, sudden death style).',
			'Offensive gestures or content that promotes discrimination is strictly prohibited.',
			'Any rule violations or inappropriate behaviour may result in disqualification.',
			'Exciting prizes await the winners – stay tuned!'
		],
		criteria: [
			{
				heading: 'Round 1: Classic Dumb Show',
				items: [
					'Acting: One team member draws a slip with a movie or song and acts it out for their teammates.',
					'Guessing: The other two members of the team must guess the answer.',
					'Time Limit: 2 minutes per performance.',
					'Restrictions: No words, sounds, or props are allowed. Only gestures, facial expressions, and body language.',
					'Evaluation: Teams with the highest scores from correct guesses will advance to the final round.'
				]
			},
			{
				heading: 'Round 2: Acting Telephone',
				items: [
					'The Chain: One member acts out a phrase to the second member, who then acts out their interpretation to the third member.',
					'The Reveal: The final member of the chain reveals what they believe the phrase is.',
					'Time Limit: The team gets a total of 3 minutes for the entire chain.',
					'Evaluation: Points will be awarded based on how close the final guess is to the original phrase.'
				]
			}
		]
	},
	{
		id: 18,
		title: 'COURTROOM',
		image: '/images/Logo@2x.png',
		category: 'Special Events',
		description: "Step into the shoes of detectives and unravel a thrilling murder mystery! With twists, turns, and surprising revelations, this event promises to test your problem-solving skills, creativity, and intuition.",
		rules: [
			'Team Size: 2 – 4 members',
			'Open to all students with a valid ID card',
			'Rounds: 2',
			'All members must report 10 minutes before the event.',
			'Case study details are strictly confidential – sharing outside the event leads to disqualification.',
			'Unethical behaviour (plagiarism, dishonesty) will not be tolerated.',
			'Written submissions must meet deadlines; late entries won’t be accepted.',
			'Maintain decorum and ethics at all times.',
			'Final prize pool depends on registrations'
		],
		criteria: [
			'Quality and creativity of write-up/story.',
			'Cohesion and clarity of case presentation.',
			'Attention to detail.',
			'Teamwork and engagement with the judge.',
			{
				heading: 'Round 1 – Preliminary Hearing',
				items: [
					'Teams receive a mysterious case study with limited clues.',
					'Analyse clues, connect dots, and submit a 200-word write-up presenting findings.',
					'Judges shortlist teams for the final round.'
				]
			},
			{
				heading: 'Round 2 – Final Hearing',
				items: [
					'Teams get extra clues to refine their case.',
					'20 minutes total (10 mins presentation + 10 mins mic check).',
					'Present your case verbally, argue convincingly, and identify the culprit.',
					'Penalties apply for exceeding time'
				]
			}
		]
	},
	{
		id: 19,
		title: 'ART RELAY',
		image: '/images/Logo@2x.png',
		category: 'Creative Arts',
		description: "The Art Relay is a unique event that tests an artist's flexibility and innovative thinking. Participants are tasked with creating a single artwork that evolves through multiple phases based on a series of revealed prompts.",
		rules: [
			'Open to all students with a valid ID card',
			'A canvas of 4*4 will be provided. The first prompt will also be immediately provided as soon as participants are settled.',
			'The participants must depict the prompt in any way they want. They get 10 minutes for the same.',
			'After this, the second prompt will be given, and the participants must switch their drawing accordingly on the same canvas.',
			'Similarly, five prompts will be given every ten minutes.'
		],
		criteria: [
			'Color and composition',
			'Time management',
			'Relevance to prompts',
			'Cohesiveness',
			'Creativity'
		]
	},
];
