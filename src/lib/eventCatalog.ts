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
  // 10 Oct 2025
  { id: 1, title: 'RAMPWALK - PANACHE', price: 'Team ₹2,999', category: 'Flagship', date: '10.10.2025', time: '18:00', endTime: '20:30' },
  { id: 14, title: 'VALORANT TOURNAMENT', price: '₹750', category: 'Fun & Games', date: '10.10.2025', time: '11:00', endTime: '15:00' },
  { id: 12, title: 'FOCUS', price: '₹199', category: 'Creative Arts', date: '10.10.2025', time: '10:00', endTime: '11:00' },
  { id: 8, title: 'SEAL THE DEAL', price: '₹199', category: 'Fun & Games', date: '10.10.2025', time: '11:00', endTime: '13:00' },
  { id: 5, title: 'ECHOES OF NOOR', price: 'Solo/Duo ₹499', category: 'Flagship', date: '10.10.2025', time: '11:30', endTime: '13:30' },
  { id: 10, title: 'IN CONVERSATION WITH', price: '₹99', category: 'Workshops & Talks', date: '10.10.2025', time: '14:00', endTime: '15:30' },
  { id: 9, title: 'VERSEVAAD', price: 'Solo/Duo ₹499', category: 'Flagship', date: '10.10.2025', time: '16:00', endTime: '18:00' },
  
  // 11 Oct 2025
  { id: 7, title: 'BIDDING BEFORE WICKET', price: '₹199', category: 'Fun & Games', date: '11.10.2025', time: '09:00', endTime: '14:00' },
  { id: 15, title: 'FREE FIRE TOURNAMENT', price: '₹600', category: 'Fun & Games', date: '11.10.2025', time: '11:00', endTime: '14:00' },
  // Removed duplicate "IN CONVERSATION WITH" entry for 11.10.2025 to avoid showing twice
  { id: 18, title: 'COURTROOM', price: '₹199', category: 'Special Events', date: '11.10.2025', time: '13:00', endTime: '16:00' },
  { id: 2, title: 'BANDJAM', price: 'Team ₹1,499', category: 'Flagship', date: '11.10.2025', time: '17:00', endTime: '19:30' },
  { id: 3, title: 'DANCE BATTLE', price: 'Team ₹2,499', category: 'Flagship', date: '11.10.2025', time: '19:30', endTime: '21:30' },

  // 12 Oct 2025
  { id: 11, title: 'CLAY MODELLING', price: '₹199', category: 'Creative Arts', date: '12.10.2025', time: '10:00', endTime: '11:00' },
  { id: 13, title: 'BGMI TOURNAMENT', price: '₹750', category: 'Fun & Games', date: '12.10.2025', time: '11:00', endTime: '15:00' },
  { id: 17, title: 'DUMB SHOW', price: '₹199', category: 'Fun & Games', date: '12.10.2025', time: '11:00', endTime: '13:00' },
  { id: 4, title: 'STEP UP', price: 'Solo ₹499', category: 'Flagship', date: '12.10.2025', time: '11:30', endTime: '13:30' },
  { id: 19, title: 'ART RELAY', price: '₹199', category: 'Creative Arts', date: '12.10.2025', time: '14:00', endTime: '16:00' }
];

const findTeamSizeRule = (rules: string[] | undefined): string | undefined => {
  if (!rules) return undefined;
  return rules.find(rule => rule.toLowerCase().startsWith('team size:'));
};

export const EVENT_CATALOG: EventCatalogItem[] = rawEventCatalog.map(event => {
  const eventData = EVENTS_DATA.find(e => e.id === event.id);
  const teamSizeRule = findTeamSizeRule(eventData?.rules);

  // Extract the part after "Team size:" case-insensitively and trim punctuation
  let extractedTeamSize: string | undefined;
  if (teamSizeRule) {
    const match = teamSizeRule.match(/team\s*size:\s*(.*)/i);
    if (match && match[1]) {
      // Take only the first sentence/segment to avoid extra instructions after team size
      const firstSentence = match[1].split(/[.;]/)[0].trim();
      extractedTeamSize = firstSentence.replace(/[.]+$/,'');
    }
  }

  // Explicit overrides for events lacking a rule-based team size
  if (!extractedTeamSize) {
    if (event.title === 'ECHOES OF NOOR') extractedTeamSize = 'Solo/Duo';
    if (event.title === 'VERSEVAAD') extractedTeamSize = 'Solo/Duo';
    if (event.title === 'SEAL THE DEAL') extractedTeamSize = 'Solo';
    if (event.title === 'CLAY MODELLING') extractedTeamSize = 'Solo';
    if (event.title === 'FOCUS') extractedTeamSize = 'Solo';
    if (event.title === 'ART RELAY') extractedTeamSize = 'Solo';
    if (event.title === 'BIDDING BEFORE WICKET') extractedTeamSize = 'On-spot team';
    if (event.title === 'IN CONVERSATION WITH') extractedTeamSize = 'Solo';
  }

  // Normalize common phrasings into concise badges
  if (extractedTeamSize) {
    // Normalize ranges like "6 to 12 members" → "6 - 12 members"
    const rangeMatch = extractedTeamSize.match(/(\d+)\s*(?:to|–|—|-)\s*(\d+)\s*members/i);
    if (rangeMatch) {
      extractedTeamSize = `${rangeMatch[1]} - ${rangeMatch[2]} members`;
    }
    // Normalize Solo statements
    if (/^solo(\b|\s)/i.test(extractedTeamSize) || /\b1\s*member\b/i.test(extractedTeamSize)) {
      extractedTeamSize = 'Solo';
    }
    // Ensure hyphen spacing for formats like 10-20 members
    extractedTeamSize = extractedTeamSize.replace(/(\d+)-(\d+)\s*members/i, '$1 - $2 members');

    // Esports phrasing like "5 members (required) + 1-2 substitutes (optional). Maximum 7 players per team."
    if (/members?\s*\(.*\)\s*\+/.test(extractedTeamSize) || /Maximum\s+\d+\s+(?:players|members)/i.test(extractedTeamSize)) {
      const baseMatch = extractedTeamSize.match(/(\d+)\s*members?/i);
      const maxPlayersMatch = extractedTeamSize.match(/Maximum\s+(\d+)\s+(?:players|members)/i);
      let minVal: number | undefined = baseMatch ? parseInt(baseMatch[1], 10) : undefined;
      let maxVal: number | undefined = maxPlayersMatch ? parseInt(maxPlayersMatch[1], 10) : undefined;

      // If no explicit maximum is provided, infer from substitutes
      if (minVal && !maxVal) {
        const plusOneSub = extractedTeamSize.match(/\+\s*(\d+)\s*substitute/i);
        const plusRangeSubs = extractedTeamSize.match(/\+\s*(\d+)\s*[-–—]\s*(\d+)\s*substitutes/i);
        if (plusRangeSubs) {
          maxVal = minVal + parseInt(plusRangeSubs[2], 10);
        } else if (plusOneSub) {
          maxVal = minVal + parseInt(plusOneSub[1], 10);
        }
      }

      if (minVal && maxVal) {
        extractedTeamSize = `${minVal} - ${maxVal} members`;
      } else if (minVal) {
        extractedTeamSize = `${minVal} members`;
      }
    }
  }

  return {
    ...event,
    time12hr: formatTime12hr(event.time),
    endTime12hr: formatTime12hr(event.endTime),
    teamSize: extractedTeamSize,
  };
});