import { events as EVENTS_DATA } from '../app/Events/[id]/rules/events.data';

// --- Shared Event Catalog Logic ---
export interface EventCatalogItem {
  id: number;
  title: string;
  price: string;
  category: string;
  date: string;
  time: string;
  endTime: string;
  time12hr: string;
  endTime12hr: string;
  teamSize?: string;
}

const formatTime12hr = (time24: string) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${suffix}`;
};

const rawEventCatalog: Omit<EventCatalogItem, 'time12hr' | 'endTime12hr' | 'teamSize'>[] = [
  { id: 1, title: 'RAMPWALK - PANACHE', price: '₹85-120', category: 'Flagship', date: '25.12.2024', time: '19:00', endTime: '22:00' },
  { id: 2, title: 'BANDJAM', price: '₹60', category: 'Flagship', date: '27.12.2024', time: '19:30', endTime: '23:00' },
  { id: 3, title: 'DANCE BATTLE', price: '₹45', category: 'Flagship', date: '28.12.2024', time: '18:00', endTime: '21:00' },
  { id: 4, title: 'STEP UP', price: '₹40', category: 'Flagship', date: '01.01.2025', time: '18:00', endTime: '21:30' },
  { id: 5, title: 'ECHOES OF NOOR', price: 'Free', category: 'Flagship', date: '02.01.2025', time: '16:00', endTime: '18:00' },
  { id: 7, title: 'BIDDING BEFORE WICKET', price: '₹25', category: 'Fun & Games', date: '25.12.2024', time: '14:00', endTime: '16:00' },
  { id: 8, title: 'SEAL THE DEAL', price: '₹15', category: 'Fun & Games', date: '26.12.2024', time: '15:00', endTime: '17:00' },
  { id: 9, title: 'VERSEVAAD', price: 'Free', category: 'Flagship', date: '29.12.2024', time: '17:00', endTime: '19:00' },
  { id: 10, title: 'IN CONVERSATION WITH', price: 'Free', category: 'Workshops & Talks', date: '30.12.2024', time: '16:00', endTime: '18:00' },
  { id: 11, title: 'CLAY MODELLING', price: '₹40', category: 'Creative Arts', date: '26.12.2024', time: '10:00', endTime: '12:00' },
  { id: 12, title: 'FOCUS', price: '₹50', category: 'Creative Arts', date: '27.12.2024', time: '14:00', endTime: '16:00' },
  { id: 13, title: 'BGMI TOURNAMENT', price: '₹50/squad', category: 'Fun & Games', date: '28.12.2024', time: '10:00', endTime: '18:00' },
  { id: 14, title: 'VALORANT TOURNAMENT', price: '₹100/team', category: 'Fun & Games', date: '29.12.2024', time: '10:00', endTime: '18:00' },
  { id: 15, title: 'FREE FIRE TOURNAMENT', price: '₹40/squad', category: 'Fun & Games', date: '30.12.2024', time: '10:00', endTime: '18:00' },
  { id: 17, title: 'DUMB SHOW', price: 'Free', category: 'Fun & Games', date: '31.12.2024', time: '19:00', endTime: '21:00' },
  { id: 18, title: 'COURTROOM', price: '₹30', category: 'Special Events', date: '01.01.2025', time: '14:00', endTime: '16:00' },
  { id: 19, title: 'ART RELAY', price: '₹20', category: 'Creative Arts', date: '02.01.2025', time: '10:00', endTime: '12:00' }
];

const findTeamSizeRule = (rules: string[] | undefined): string | undefined => {
  if (!rules) return undefined;
  return rules.find(rule => rule.toLowerCase().startsWith('team size:'));
};

export const EVENT_CATALOG: EventCatalogItem[] = rawEventCatalog.map(event => {
  const eventData = EVENTS_DATA.find(e => e.id === event.id);
  const teamSizeRule = findTeamSizeRule(eventData?.rules);
  return {
    ...event,
    time12hr: formatTime12hr(event.time),
    endTime12hr: formatTime12hr(event.endTime),
    teamSize: teamSizeRule ? teamSizeRule.replace('Team Size: ', '') : undefined,
  };
});
