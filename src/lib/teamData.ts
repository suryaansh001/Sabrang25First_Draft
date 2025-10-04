// Team data parsing utility

export interface TeamMember {
  name: string;
  batch: string;
  contact: string;
  role: string;
  committee: string;
}

export interface CommitteeData {
  committeeName: string;
  members: TeamMember[];
}

// Embedded fallback CSV (will be used if runtime fetch fails)
const fallbackCsvData = `S.No.,Roll No.,Name,Email,Contact No.,Role,Day Scholar/Hosteler`;

// Normalize committee header to display name used in UI
function normalizeCommitteeHeader(rawHeader: string): string {
  const header = rawHeader.replace(/"/g, '').trim();
  if (header === 'ORGANIZING HEAD') return 'Organizing Head';
  if (header.includes('ORGANIZING COMMITTEE')) return 'Organizing Committee';
  if (header.includes('DISCIPLINE TEAM')) return 'Discipline';
  if (header.includes('TECH & SUPPORT TEAM')) return 'Technical';
  if (header.includes('TRANSPORTATION TEAM')) return 'Transport';
  if (header.includes('PRIZE & CERTIFICATES TEAM')) return 'Prize & Certificates';
  if (header.includes('PHOTOGRAPHY TEAM')) return 'Photography';
  if (header.includes('STAGE & VENUE TEAM')) return 'Stage & Venue';
  if (header.includes('REGISTRATIONS TEAM')) return 'Registrations';
  if (header.includes('SOCIAL MEDIA TEAM')) return 'Social Media';
  if (header.includes('HOSPITALITY TEAM')) return 'Hospitality';
  if (header.includes('INTERNAL ARRANGEMENTS TEAM')) return 'Internal Arrangements';
  if (header.includes('CULTURAL EVENTS TEAM')) return 'Cultural';
  if (header.includes('DECOR TEAM')) return 'Decor';
  if (header.includes('SPONSORSHIP & PROMOTIONS TEAM')) return 'Sponsorship & Promotion';
  if (header.includes('MEDIA & REPORT TEAM')) return 'Media & Report';
  if (header.includes('ANCHORS TEAM')) return 'anchors';
  if (header.includes('DESIGN TEAM')) return 'Design';
  return header;
}

// Generic CSV parser supporting both old and new formats
export function parseCSVData(csvText: string): CommitteeData[] {
  const lines = csvText.split('\n');
  const committees: CommitteeData[] = [];
  let currentCommittee: CommitteeData | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r/g, '');
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Header row for new format starts with S.No.
    if (trimmed.startsWith('S.No.')) {
      continue;
    }

    // Committee header rows contain TEAM or known section names
    if (
      trimmed.includes('TEAM') ||
      trimmed.includes('ORGANIZING HEAD') ||
      trimmed.includes('ORGANIZING COMMITTEE')
    ) {
      if (currentCommittee) committees.push(currentCommittee);
      currentCommittee = { committeeName: normalizeCommitteeHeader(trimmed.replace(/^,+/, '')), members: [] };
      continue;
    }

    // Skip delimiter-only rows (commas with nothing meaningful)
    const parts = line.split(',');
    const nonEmpty = parts.some(p => p.trim().length > 0);
    if (!nonEmpty) continue;

    if (!currentCommittee) continue;

    // Determine format by inspecting where the name likely is
    // New format example with leading ",,": ['', '', '1', '2024BBA068', 'Rahul Verma', 'email', 'contact', 'role', '...']
    // Old fallback example: ['','', 'Rahul Verma', '', 'CORE', ...]
    let name = '';
    let batch = '';
    let contact = '';
    let role = '';

    // Prefer new-format indices when available
    if (parts.length >= 8 && parts[4] && parts[4].trim()) {
      name = parts[4].trim();
      batch = (parts[3] || '').trim();
      contact = (parts[6] || '').trim();
      role = (parts[7] || '').trim().toUpperCase();
    } else if (parts.length >= 5 && parts[2] && parts[2].trim()) {
      // Fallback to old embedded format
      name = parts[2].trim();
      batch = (parts[1] || '').trim();
      contact = (parts[3] || '').trim();
      role = (parts[4] || '').trim().toUpperCase();
    }

    // Skip header labels and invalid rows
    if (!name || name === 'Name' || name === 'S.No.') continue;

    currentCommittee.members.push({
      name,
      batch,
      contact,
      role,
      committee: currentCommittee.committeeName
    });
  }

  if (currentCommittee) committees.push(currentCommittee);
  return committees;
}

// Runtime loader that fetches the CSV from public folder (client-side)
export async function loadCommitteesFromCSV(): Promise<CommitteeData[]> {
  try {
    const res = await fetch('/team-list.csv', { cache: 'no-store' });
    const text = await res.text();
    return parseCSVData(text);
  } catch (err) {
    // Fallback to embedded minimal header if fetch fails
    return parseCSVData(fallbackCsvData);
  }
}

// Function to parse CSV data and organize by committee
export function parseTeamData(): CommitteeData[] {
  // Backward-compatible parse using fallback embedded data
  return parseCSVData(fallbackCsvData);
}

// Function to get committee data by name
export function getCommitteeByName(committeeName: string): CommitteeData | null {
  const allCommittees = parseTeamData();
  return allCommittees.find(committee => 
    committee.committeeName.toLowerCase() === committeeName.toLowerCase()
  ) || null;
}

// Async version that loads from CSV at runtime
export async function getCommitteeByNameAsync(committeeName: string): Promise<CommitteeData | null> {
  const allCommittees = await loadCommitteesFromCSV();
  return allCommittees.find(committee => 
    committee.committeeName.toLowerCase() === committeeName.toLowerCase()
  ) || null;
}

// Function to get all committee names
export function getAllCommitteeNames(): string[] {
  const allCommittees = parseTeamData();
  return allCommittees.map(committee => committee.committeeName);
}
