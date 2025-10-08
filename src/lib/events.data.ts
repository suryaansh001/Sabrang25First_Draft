// Centralized events data for the app
// This replaces the old `src/app/Events/[id]/rules/events.data.ts`

export interface Event {
  id: number;
  title: string;
  category?: string;
  price?: string;
  rules?: string[];
  description?: string;
  whatsappLink?: string;
  prizePool?: string;
  coordinators?: { name: string; phone?: string }[];
}

// Minimal dataset required by various parts of the app.
// Add/update items as needed; IDs must stay consistent with references elsewhere.
export const events: Event[] = [
  { id: 1, title: 'RAMPWALK - PANACHE', category: 'Flagship', price: 'Team ₹2,999', rules: [
    'Team size: 7 - 18 members'
  ] },
  { id: 2, title: 'BANDJAM', category: 'Flagship', price: 'Team ₹1,499', rules: [
    'Team size: 3 - 8 members'
  ] },
  { id: 3, title: 'DANCE BATTLE', category: 'Flagship', price: 'Team ₹2,499', rules: [
    'Team size: 10 - 25 members'
  ] },
  { id: 4, title: 'STEP UP', category: 'Flagship', price: 'Solo ₹499', rules: [
    'Team size: Solo'
  ] },
  { id: 5, title: 'ECHOES OF NOOR', category: 'Flagship', price: 'Solo/Duo ₹499', rules: [
    'Team size: Solo/Duo'
  ] },
  { id: 7, title: 'BIDDING BEFORE WICKET', category: 'Fun & Games', price: '₹199', rules: [
    'Team size: On-spot team'
  ] },
  { id: 8, title: 'SEAL THE DEAL', category: 'Fun & Games', price: '₹199', rules: [
    'Team size: Solo'
  ] },
  { id: 9, title: 'VERSEVAAD', category: 'Flagship', price: 'Solo/Duo ₹499', rules: [
    'Team size: Solo/Duo'
  ] },
  { id: 10, title: 'IN CONVERSATION WITH', category: 'Workshops & Talks', price: '₹99', rules: [
    'Team size: Solo'
  ] },
  { id: 11, title: 'CLAY MODELLING', category: 'Creative Arts', price: '₹199', rules: [
    'Team size: Solo'
  ] },
  { id: 12, title: 'FOCUS', category: 'Creative Arts', price: '₹199', rules: [
    'Team size: Solo'
  ] },
  { id: 13, title: 'BGMI TOURNAMENT', category: 'Fun & Games', price: '₹750', rules: [
    'Team size: 4 - 5 members'
  ] },
  { id: 14, title: 'VALORANT TOURNAMENT', category: 'Fun & Games', price: '₹750', rules: [
    'Team size: 5 members'
  ] },
  { id: 15, title: 'FREE FIRE TOURNAMENT', category: 'Fun & Games', price: '₹600', rules: [
    'Team size: 4 members'
  ] },
  { id: 17, title: 'DUMB SHOW', category: 'Fun & Games', price: '₹199', rules: [
    'Team size: Solo'
  ] },
  { id: 18, title: 'COURTROOM', category: 'Special Events', price: '₹199' },
  { id: 19, title: 'ART RELAY', category: 'Creative Arts', price: '₹199', rules: [
    'Team size: Solo'
  ] },
];

