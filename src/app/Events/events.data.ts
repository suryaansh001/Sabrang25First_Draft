export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  shares: string;
  image: string;
  modalImage?: string;
  description: string;
  venue: string;
  price: string;
  genre: string;
  category: string;
  details: string;
  isFlagship: boolean;
  rules?: string[];
  coordinators?: { name: string; phone?: string }[];
}

export const events: Event[] = [
  {
    id: 1,
    title: "RAMPWALK - PANACHE",
    date: "10.10.2025",
    time: "18:00",
    shares: "567 Shares",
    image: "/posters/PANACHE.webp",
    modalImage: "/images/gallery/image1.webp",
    description: "Panache is the ultimate ramp walk competition! It's not just about your outfit, but the confidence, energy, and attitude you bring. This is your dazzling platform to show off your charisma and unique sense of style. With stunning lights and great music, this event celebrates individuality and glamour. Step onto the runway, own your presence, and let the world see your incredible style shine!",
    venue: "Main Stage",
    price: "₹85-120",
    genre: "Fashion Show",
    category: "Flagship",
    details: "A single-day fashion spectacle focusing on thematic costume interpretation and runway impact. Judging criteria include costume design, thematic relevance, stage presence, and overall narrative.",
    isFlagship: true
  },
  {
    id: 2,
    title: "BANDJAM",
    date: "11.10.2025",
    time: "17:00",
    shares: "189 Shares",
    image: "/posters/BANDJAM.webp",
    modalImage: "/images/gallery/image2.webp",
    description: "This is the ultimate music showdown for all bands! It's not just about playing your instruments, but showing your energy, creativity, and unique vibe. Get on stage, play your powerful music loud and proud, and feel the excitement from the crowd. Band Jam is where passion takes over, and your music gets to do all the talking. Come own the sound!",
    venue: "Main Stage",
    price: "₹60",
    genre: "Music Festival",
    category: "Flagship",
    details: "Bands are judged on creativity, technical prowess, audience engagement, and stage presence. Bandjam is the sonic pulse of Sabrang.",
    isFlagship: true
  },
  {
    id: 3,
    title: "DANCE BATTLE",
    date: "11.10.2025",
    time: "19:30",
    shares: "156 Shares",
    image: "/posters/DANCE_BATTLE.webp",
    modalImage: "/images/gallery/image3.webp",
    description: "Get your crew together for an epic dance showdown! This isn't a solo act; it's a team effort that mixes hip-hop, Bollywood, and freestyle. You'll need perfect teamwork, sharp moves, and tons of energy to impress the crowd. With great music and bright lights, only the best team will take the win. Is your squad ready to battle?",
    venue: "Main Stage",
    price: "₹45",
    genre: "Dance Competition",
    category: "Flagship",
    details: "Each round challenges rhythm, originality, and intensity. It's not just about dancing – it's about commanding the floor.",
    isFlagship: true
  },
  {
    id: 4,
    title: "STEP UP",
    date: "12.10.2025",
    time: "11:30",
    shares: "145 Shares",
    image: "/posters/STEPUP.webp",
    modalImage: "/images/gallery/image4.webp",
    description: "Step Up is the ultimate solo dance competition where your body gets to tell your story! Forget old routines; this is all about your individuality, rhythm, and pure fun. Whether you do lyrical, hip-hop, contemporary, or any other style—every move matters. Bring your fire, your flair, and your authentic self. Own the spotlight, let your soul dance loud, and turn your passion into glory!",
    venue: "Main Stage",
    price: "₹40",
    genre: "Solo Dance",
    category: "Flagship",
    details: "A two-round solo dance elimination where individual performers showcase their skill, creativity, and stage command.",
    isFlagship: true
  },
  {
    id: 5,
    title: "ECHOES OF NOOR",
    date: "10.10.2025",
    time: "11:30",
    shares: "95 Shares",
    image: "/posters/echoesofnoor.webp",
    modalImage: "/images/gallery/image5.webp",
    description: "A spoken word and poetry event celebrating the festival's theme, 'Noorwana'. Artists perform original pieces reflecting on light, cosmos, and inner luminescence.",
    venue: "Main Stage",
    price: "Free",
    genre: "Spoken Word",
    category: "Flagship",
    details: "Performances are judged on lyrical content, emotional delivery, and thematic relevance. A platform for the voices of tomorrow.",
    isFlagship: true
  },
  {
    id: 7,
    title: "BIDDING BEFORE WICKET",
    date: "11.10.2025",
    time: "09:00",
    shares: "234 Shares",
    image: "/posters/wicket.webp",
    description: "Ready for an exciting player auction? It's a game of strategy where every bid is a test of how much you want a player. Think smart, be patient, and make the right choices—one mistake could cost you the game. Who will you bid on? Will you discover a hidden star? Don't miss your shot to be a master bidder!",
    venue: "Business School Auditorium",
    price: "₹25",
    genre: "Cricket Auction",
    category: "Fun & Games",
    details: "Based on IPL stats and records. The goal? Build the most powerful team and outscore opponents in cricket-themed questions.",
    isFlagship: false
  },
  {
    id: 8,
    title: "SEAL THE DEAL",
    date: "10.10.2025",
    time: "11:00",
    shares: "189 Shares",
    image: "/posters/deal.webp",
    description: "Want to try the thrill of stock trading without risking any real money? Here's your chance! Our event lets you experience the fast-paced market. We give you virtual money to buy and sell stocks. Use your smart strategies and quick thinking to make the most profit. Test your instincts and prove you're a great trader!",
    venue: "-",
    price: "₹15",
    genre: "Simulated Trading",
    category: "Fun & Games",
    details: "A solo simulated trading competition. Participants start with a dummy capital of ₹10,00,000 and aim for the highest gains within a 1-hour time limit. Judged on profit, with tie-breakers for trade success.",
    isFlagship: false
  },
  {
    id: 9,
    title: "VERSEVAAD",
    date: "10.10.2025",
    time: "16:00",
    shares: "110 Shares",
    image: "/posters/VERSVAAD.webp",
    description: "If you love rapping and playing with words, this is your stage! Don't hold back—bring the fire in your words and the rhythm in your voice. Whether you're a pro or just love the flow, what matters is your passion. This competition is about the power of words delivered fast, with raw hip-hop energy. Step up, be bold, and let your lyrical skills hit harder than any beat drop. Make the crowd feel your vibe!",
    venue: "Main Stage",
    price: "Free",
    genre: "Poetic Debate",
    category: "Flagship",
    details: "Teams are given topics and must construct their arguments in rhyming couplets or free verse. Judged on content, poetic quality, and delivery.",
    isFlagship: true
  },
  {
    id: 10,
    title: "IN CONVERSATION WITH",
    date: "10.10.2025",
    time: "14:00",
    shares: "234 Shares",
    image: "/posters/convo.webp",
    description: "Join us for 'In Conversation With,' a curated talk series featuring distinguished guests from the worlds of art, activism, and creation. Listen as they share their personal journeys and behind-the-scenes stories in an intimate setting, followed by an interactive live Q&A session designed to spark ideas and inspire the next generation.",
    venue: "Tech Lawn",
    price: "Free",
    genre: "Talk Series",
    category: "Workshops & Talks",
    details: "Live Q&A sessions. This is where ideas spark and inspire the next generation.",
    isFlagship: false
  },
  {
    id: 11,
    title: "CLAY MODELLING",
    date: "12.10.2025",
    time: "10:00",
    shares: "70 Shares",
    image: "/posters/clay.webp",
    description: "It's time to get messy, creative, and competitive! Clay Modelling is where you let your imagination run wild. Squish, mold, and craft your best piece in a fun battle filled with laughter and a bit of craziness. You will get muddy! Sign up now, let out your inner artist, and let the clay battle begin!",
    venue: "Tech Lawn",
    price: "₹40",
    genre: "Sculpture",
    category: "Creative Arts",
    details: "A solo competition where participants are given 2-3 hours to interpret a theme using air-dry clay. Judged on creativity, material handling, and relevance to the theme.",
    isFlagship: false
  },
  {
    id: 12,
    title: "FOCUS",
    date: "10.10.2025",
    time: "10:00",
    shares: "115 Shares",
    image: "/posters/focus.webp",
    description: "In Focus, your pictures tell the story. Go on the hunt for that perfect moment! This contest is all about capturing the spirit of the event in three fun groups: Portraits, Creative Shots, and Candids. We'll judge your photos on how they look and the story they tell. Grab your camera, show your creative side, and become the storyteller people will remember!",
    venue: "Amphitheatre",
    price: "₹50",
    genre: "Photography",
    category: "Creative Arts",
    details: "A two-round photography competition focused on creativity, composition, and minimal editing. Participants will tackle themed challenges within the campus.",
    isFlagship: false
  },
  {
    id: 13,
    title: "BGMI TOURNAMENT",
    date: "12.10.2025",
    time: "11:00",
    shares: "350 Shares",
    image: "/posters/bgmi.webp",
    description: "Get ready for action in the BGMI Tournament! This is more than a game; it's where skill meets strategy. Be brave enough for non-stop action, taking down other squads, and making clutch plays. Team up, show your skills, and aim for the final circle. Play aggressively, survive the chaos, and grab that 'WINNER WINNER CHICKEN DINNER'!",
    venue: "Online / E-Sports Arena",
    price: "₹50/squad",
    genre: "E-Sports",
    category: "Fun & Games",
    details: "A multi-round tournament for squads of four. Points are awarded for placement and kills. The final rounds will be live-streamed.",
    isFlagship: false
  },
  {
    id: 14,
    title: "VALORANT TOURNAMENT",
    date: "10.10.2025",
    time: "11:00",
    shares: "410 Shares",
    image: "/posters/valo.webp",
    description: "Jump into the Valorant tournament everyone wants to join! Expect intense 5v5 matches, amazing headshots, and agent powers flying everywhere. A single great play can make your team legendary on campus. Will you make a heroic move to win the glory, or watch from the side? Get your squad locked in—spots are vanishing fast!",
    venue: "E-Sports Arena",
    price: "₹100/team",
    genre: "E-Sports",
    category: "Fun & Games",
    details: "A 5v5, single-elimination bracket tournament. Matches are played on standard competitive settings. Defy the limits!",
    isFlagship: false
  },
  {
    id: 15,
    title: "FREE FIRE TOURNAMENT",
    date: "11.10.2025",
    time: "11:00",
    shares: "290 Shares",
    image: "/posters/freefire.webp",
    description: "The Free Fire Tournament is a thrilling eSports event that's all about strategy and teamwork. It feels like a life-or-death battle where one smart move can change everything. You'll need sharp aim and fast reflexes to revive your friends, take down enemies, and stay inside the safe zones. Survive the map, fight for your team, and grab the ultimate Booyah!",
    venue: "Online / E-Sports Arena",
    price: "₹40/squad",
    genre: "E-Sports",
    category: "Fun & Games",
    details: "Squad-based battle royale. The tournament will consist of multiple qualifying rounds leading to a grand final.",
    isFlagship: false
  },
  {
    id: 17,
    title: "DUMB SHOW",
    date: "12.10.2025",
    time: "11:00",
    shares: "67 Shares",
    image: "/posters/dumb.webp",
    description: "Prepare for a hilarious game of mismatched movements! Dumb Show is like Charades but with a funny, chaotic twist. Your team will mime movie titles, phrases, or songs for your teammates to guess while the clock is ticking. The time limit makes it wild and fun, testing your acting skills and how well you can read your teammates' minds!",
    venue: "Amphitheatre",
    price: "Free",
    genre: "Mime Acting",
    category: "Fun & Games",
    details: "It's fast, funny, and tests how well you know your teammates – and your acting chops.",
    isFlagship: false
  },
  {
    id: 18,
    title: "COURTROOM",
    date: "11.10.2025",
    time: "13:00",
    shares: "50 Shares",
    image: "/posters/courtroom.webp",
    description: "Step into the shoes of detectives and unravel a thrilling murder mystery! With twists, turns, and surprising revelations, this event promises to test your problem-solving skills, creativity, and intuition.",
    venue: "Amphitheatre",
    price: "₹30",
    genre: "Mock Trial",
    category: "Special Events",
    details: "Teams will be given a case brief and must prepare arguments for prosecution and defense. Judged on legal reasoning, presentation, and courtroom etiquette.",
    isFlagship: false
  },
  {
    id: 19,
    title: "ART RELAY",
    date: "12.10.2025",
    time: "14:00",
    shares: "60 Shares",
    image: "/posters/art.webp",
    description: "The Art Relay is a unique event that tests an artist's flexibility and innovative thinking. Participants are tasked with creating a single artwork that evolves through multiple phases based on a series of revealed prompts.",
    venue: "Tech Lawn",
    price: "₹20",
    genre: "Solo Art",
    category: "Creative Arts",
    details: "A solo art challenge where participants create an evolving artwork on a single canvas based on a series of prompts revealed every 10 minutes. Judged on creativity, cohesiveness, and relevance to prompts.",
    isFlagship: false
  }
];

