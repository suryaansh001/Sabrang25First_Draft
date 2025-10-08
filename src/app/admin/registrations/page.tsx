"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Users,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import createApiUrl from '../../../lib/api';
import { EVENT_CATALOG } from '../../../lib/eventCatalog';

interface TeamInfo {
  teamId: string;
  eventName: string;
  teamName: string;
  isLeader: boolean;
  totalMembers: number;
  registrationComplete: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  contactNo?: string;
  gender?: string;
  age?: number;
  universityName?: string;
  address?: string;
  hasEntered: boolean;
  entryTime?: string;
  isvalidated: boolean;
  emailSent: boolean;
  emailSentAt?: string;
  userType: 'participant' | 'support_staff' | 'flagship_visitor' | 'flagship_solo_visitor';
  events: string[];
  createdAt: string;
  teamInfo: TeamInfo[];
}

interface RegistrationResponse {
  success: boolean;
  data: User[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  }
}

interface UserDetailsModalData {
  _id: string;
  name: string;
  email: string;
  contactNo?: string;
  gender?: string;
  age?: number;
  universityName?: string;
  address?: string;
  hasEntered: boolean;
  entryTime?: string;
  isvalidated: boolean;
  emailSent: boolean;
  emailSentAt?: string;
  userType: string;
  events: string[];
  createdAt: string;
  teamParticipations: any[];
  purchases: any[];
  eventsRegistered: any[];
  registrationTimeline: any[];
}

type Filters = {
  search: string;
  eventFilter: string; // event name or id depending on backend; we reuse same key as recent-registrations
  registrationComplete: 'all' | 'yes' | 'no';
  hasEntered: 'all' | 'yes' | 'no';
  isValidated: 'all' | 'yes' | 'no';
  fromDate: string;
  toDate: string;
  limit: number;
};

function RegistrationsTeamsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    eventFilter: 'all',
    registrationComplete: 'all',
    hasEntered: 'all',
    isValidated: 'all',
    fromDate: '',
    toDate: '',
    limit: 5000
  });

  const [events, setEvents] = useState<{ id?: string | number; title: string }[]>([]);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserDetailsModalData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'team' | 'solo'>('team');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, [filters]);

  // Canonical event titles that must always appear in the filter
  const CANONICAL_EVENTS = [
    'ART RELAY',
    'BAND JAM',
    'BGMI TOURNAMENT',
    'BIDDING BEFORE WICKET',
    'CLAY MODELLING',
    'COURTROOM',
    'DANCE BATTLE',
    'DUMB SHOW',
    'ECHOES OF NOOR',
    'FOCUS',
    'FREE FIRE TOURNAMENT',
    'IN CONVERSATION WITH',
    'RAMPWALK - PANACHE',
    'SEAL THE DEAL',
    'STEP UP',
    'VALORANT TOURNAMENT',
    'VERSEVAAD',
    'VISITOR_PASS'
  ];

  const fetchEvents = async () => {
    const normalize = (t: string) => (t || '')
      .toLowerCase()
      .replace(/[\u2012\u2013\u2014\u2015]/g, '-') // normalize en/em dashes
      .replace(/\s+/g, ' ')
      .trim();
    const toCanonical = (title: string): string => {
      const norm = normalize(title);
      // Aliases
      if (norm === normalize('bgmi')) return 'BGMI TOURNAMENT';
      if (norm === normalize('rampwalk - panache - theme based')) return 'RAMPWALK - PANACHE';
      if (norm === normalize('bandjam')) return 'BAND JAM';
      // Match canonical list case-insensitively
      const match = CANONICAL_EVENTS.find(c => normalize(c) === norm);
      return match || title;
    };
    const EXCLUDED = new Set([
      normalize('RAMPWALK - PANACHE - THEME BASED'),
      normalize('PHOTOGRAPHY CONTEST'),
      normalize('TECH TALK - AI WORKSHOP')
    ]);
    try {
      const response = await fetch(createApiUrl('/admin/events'), { credentials: 'include' });
      if (response.ok) {
        const eventsData = await response.json();
        const list: any[] = Array.isArray(eventsData)
          ? eventsData
          : (Array.isArray(eventsData?.data) ? eventsData.data : []);
        const mapped = list.map((ev: any) => ({
          id: ev._id || ev.id,
          title: toCanonical(ev.title || ev.name || ev.eventName || '')
        })).filter((e: any) => e.title);
        // Merge with local catalog to ensure all events show
        const local = EVENT_CATALOG.map(e => ({ id: e.id, title: toCanonical(e.title) }));
        const required = CANONICAL_EVENTS.map(t => ({ id: t, title: t }));
        const combined = [...mapped, ...local, ...required]
          .filter(m => !EXCLUDED.has(normalize(m.title)));
        const dedup = Array.from(new Map(combined.map(m => [m.title, m])).values())
          .sort((a, b) => a.title.localeCompare(b.title));
        setEvents(dedup);
        return;
      }
    } catch (e) {
      // ignore and fallback
    }
    // Backend failed; show local catalog
    const fallback = [
      ...EVENT_CATALOG.map(e => ({ id: e.id, title: toCanonical(e.title) })),
      ...CANONICAL_EVENTS.map(t => ({ id: t, title: t }))
    ]
      .filter(m => !EXCLUDED.has(normalize(m.title)))
      .sort((a, b) => a.title.localeCompare(b.title));
    setEvents(fallback);
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.eventFilter !== 'all' && filters.eventFilter !== 'none') {
        queryParams.append('eventFilter', filters.eventFilter);
      }
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);
      if (filters.hasEntered !== 'all') queryParams.append('hasEntered', filters.hasEntered);
      if (filters.isValidated !== 'all') queryParams.append('isValidated', filters.isValidated);
      queryParams.append('limit', String(filters.limit));
      queryParams.append('sortBy', 'createdAt');
      queryParams.append('sortOrder', 'desc');

      // Reuse the existing endpoint powering recent registrations
      const response = await fetch(createApiUrl(`/admin/recent-registrations?${queryParams}`), {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch registrations');
      const json: RegistrationResponse = await response.json();
      let users = json.data || [];

      // Apply client-side filters
      if (filters.registrationComplete !== 'all') {
        users = users.filter(u => {
          const infos = u.teamInfo || [];
          if (infos.length === 0) return filters.registrationComplete === 'no' ? true : false;
          const anyComplete = infos.some(t => t.registrationComplete);
          return filters.registrationComplete === 'yes' ? anyComplete : !anyComplete;
        });
      }

      if (filters.eventFilter === 'none') {
        users = users.filter(u => (u.events || []).length === 0);
      }

      setData(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const groupedTeams = useMemo(() => {
    // Map key: `${eventName}|${teamId}` → { leader: User | null, members: User[], meta: TeamInfo }
    const map = new Map<string, { leader: User | null; members: User[]; meta: TeamInfo }>();

    for (const user of data) {
      const infos = user.teamInfo || [];
      if (infos.length === 0) continue;
      for (const ti of infos) {
        // Use teamId when reliable; otherwise fall back to teamName to avoid duplicates
        const safeIdPart = ti.teamId && String(ti.teamId).trim().length > 0 ? String(ti.teamId) : (ti as any).teamName || '';
        const key = `${ti.eventName}|${safeIdPart}`;
        if (!map.has(key)) map.set(key, { leader: null, members: [], meta: ti });
        const entry = map.get(key)!;
        if (ti.isLeader) {
          // If multiple users claim leader for the same team, last write wins; backend should ensure consistency
          entry.leader = user;
        } else {
          entry.members.push(user);
        }
      }
    }

    return Array.from(map.entries()).map(([key, value]) => ({ key, ...value }));
  }, [data]);

  const soloParticipants = useMemo(() => data.filter(u => !u.teamInfo || u.teamInfo.length === 0), [data]);

  const toggleTeam = (key: string) => {
    setExpandedTeams(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value as any }));
  };

  const exportAllToCSV = () => {
    const headers = [
      'Name','Email','Contact','Gender','Age','University','Address','User Type','Created At','Events','Has Entered','Entry Time','Validated','Email Sent','Team Id','Team Name','Event','Role','Team Size','Registration Complete'
    ];

    const rows: string[][] = [];

    // Teams
    for (const t of groupedTeams) {
      const meta = t.meta;
      const members = [t.leader, ...t.members].filter(Boolean) as User[];
      for (const u of members) {
        const role = u._id === t.leader?._id ? 'Leader' : 'Member';
        rows.push([
          u.name,
          u.email,
          u.contactNo || '',
          u.gender || '',
          u.age != null ? String(u.age) : '',
          u.universityName || '',
          u.address || '',
          u.userType,
          new Date(u.createdAt).toISOString(),
          (u.events || []).join('; '),
          u.hasEntered ? 'Yes' : 'No',
          u.entryTime ? new Date(u.entryTime).toISOString() : '',
          u.isvalidated ? 'Yes' : 'No',
          u.emailSent ? 'Yes' : 'No',
          meta.teamId,
          meta.teamName,
          meta.eventName,
          role,
          String(meta.totalMembers ?? ''),
          meta.registrationComplete ? 'Yes' : 'No'
        ]);
      }
    }

    // Solo
    for (const u of soloParticipants) {
      rows.push([
        u.name,
        u.email,
        u.contactNo || '',
        u.gender || '',
        u.age != null ? String(u.age) : '',
        u.universityName || '',
        u.address || '',
        u.userType,
        new Date(u.createdAt).toISOString(),
        (u.events || []).join('; '),
        u.hasEntered ? 'Yes' : 'No',
        u.entryTime ? new Date(u.entryTime).toISOString() : '',
        u.isvalidated ? 'Yes' : 'No',
        u.emailSent ? 'Yes' : 'No',
        '',
        '',
        '',
        'Solo',
        '',
        ''
      ]);
    }

    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${(cell ?? '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations_teams_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchUserDetails = async (userId: string, fallback?: User) => {
    try {
      // Optimistic: prefill with known data while fetching
      if (fallback) {
        setSelectedUser(prev => ({
          _id: fallback._id,
          name: fallback.name,
          email: fallback.email,
          contactNo: fallback.contactNo,
          gender: fallback.gender,
          age: fallback.age,
          universityName: fallback.universityName,
          address: fallback.address,
          hasEntered: fallback.hasEntered,
          entryTime: fallback.entryTime,
          isvalidated: fallback.isvalidated,
          emailSent: fallback.emailSent,
          emailSentAt: fallback.emailSentAt,
          userType: fallback.userType,
          events: fallback.events,
          createdAt: fallback.createdAt,
          teamParticipations: [],
          purchases: [],
          eventsRegistered: [],
          registrationTimeline: []
        }));
        setShowUserModal(true);
      }
      const response = await fetch(createApiUrl(`/admin/registration-details/${userId}`), {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        const payload = result?.data || result?.user || result;
        // Only update if payload has valid user data (check for essential fields)
        if (payload && payload._id && payload.name) {
          setSelectedUser(payload);
          setShowUserModal(true);
        }
        // If payload is invalid, keep the fallback data that was already set
      }
    } catch (e) {
      console.error('Failed to load user details', e);
      alert('Failed to load user details');
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-6 px-16 sm:px-20 lg:px-32 xl:px-40 2xl:px-48">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 rounded-xl border border-white/10 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/10 ring-1 ring-white/10">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Admin • Registrations & Teams</h1>
                  <p className="text-sm text-gray-300">Overpowered control center for participants and team management</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => fetchRegistrations()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 ring-1 ring-white/10">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
                <button onClick={exportAllToCSV} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-600 text-white">
                  <Download className="w-4 h-4" /> Download Excel
                </button>
                <Link href="/admin" className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 ring-1 ring-white/10">Back to Admin</Link>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-black/30 ring-1 ring-white/10 p-3">
                <div className="text-gray-400">Total Participants</div>
                <div className="text-xl font-semibold">{data.length}</div>
              </div>
              <div className="rounded-lg bg-black/30 ring-1 ring-white/10 p-3">
                <div className="text-gray-400">Teams</div>
                <div className="text-xl font-semibold">{groupedTeams.length}</div>
              </div>
              <div className="rounded-lg bg-black/30 ring-1 ring-white/10 p-3">
                <div className="text-gray-400">Solo Participants</div>
                <div className="text-xl font-semibold">{soloParticipants.length}</div>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="mb-4 sticky top-0 z-30">
            <div className="flex items-center justify-center">
              <div className="inline-flex bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg">
                <button
                  className={`px-5 py-2 text-sm transition ${activeTab === 'team' ? 'bg-white/20 font-semibold ring-1 ring-white/20' : 'hover:bg-white/10'}`}
                  onClick={() => setActiveTab('team')}
                >
                  Teams
                </button>
                <button
                  className={`px-5 py-2 text-sm transition ${activeTab === 'solo' ? 'bg-white/20 font-semibold ring-1 ring-white/20' : 'hover:bg-white/10'}`}
                  onClick={() => setActiveTab('solo')}
                >
                  Solo
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 p-4 rounded-lg bg-black/30 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-semibold"><Filter className="w-4 h-4" /> Filters</div>
              <button className="text-sm underline" onClick={() => setShowFilters(s => !s)}>{showFilters ? 'Hide' : 'Show'} advanced</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded px-3 py-2">
                <Search className="w-4 h-4 text-gray-300" />
                <input
                  className="bg-transparent outline-none w-full placeholder-gray-400"
                  placeholder="Search name/email/phone"
                  value={filters.search}
                  onChange={e => handleFilterChange('search', e.target.value)}
                />
              </div>
              <select className="bg-white text-black rounded px-3 py-2" value={filters.eventFilter} onChange={e => handleFilterChange('eventFilter', e.target.value)}>
                <option value="all">All Events</option>
                <option value="none">No Events</option>
                {events.map((ev: any) => (
                  <option key={ev.id || ev.title} value={ev.title}>{ev.title}</option>
                ))}
              </select>
              {/* Role filter removed per request */}
              {showFilters && (
                <>
                  <select className="bg-white/10 rounded px-3 py-2" value={filters.registrationComplete} onChange={e => handleFilterChange('registrationComplete', e.target.value)}>
                    <option value="all">Registration Complete?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <select className="bg-white/10 rounded px-3 py-2" value={filters.hasEntered} onChange={e => handleFilterChange('hasEntered', e.target.value)}>
                    <option value="all">Has Entered?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <select className="bg-white/10 rounded px-3 py-2" value={filters.isValidated} onChange={e => handleFilterChange('isValidated', e.target.value)}>
                    <option value="all">Validated?</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <input type="date" className="bg-white/10 rounded px-3 py-2" value={filters.fromDate} onChange={e => handleFilterChange('fromDate', e.target.value)} />
                  <input type="date" className="bg-white/10 rounded px-3 py-2" value={filters.toDate} onChange={e => handleFilterChange('toDate', e.target.value)} />
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-200">Loading registrations...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-400">{error}</div>
          ) : (
            activeTab === 'team' ? (
              <div className="grid grid-cols-1 gap-6">
                {/* Teams list */}
                <div className="space-y-4">
                  <div className="text-sm text-gray-300">Teams: {groupedTeams.length}</div>
                  <div className="space-y-3">
                    {groupedTeams.map(team => (
                      <div key={team.key} className="rounded border border-white/10 bg-black/30">
                        <button onClick={() => toggleTeam(team.key)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5">
                          <div className="flex items-center gap-3">
                            {expandedTeams[team.key] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            <div>
                              <div className="font-semibold">{team.meta.teamName}</div>
                              <div className="text-xs text-gray-300">{team.meta.eventName} • Members: {team.meta.totalMembers ?? team.members.length + (team.leader ? 1 : 0)}</div>
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className={`px-2 py-1 rounded ${team.meta.registrationComplete ? 'bg-emerald-600' : 'bg-yellow-600'}`}>{team.meta.registrationComplete ? 'Complete' : 'Incomplete'}</span>
                          </div>
                        </button>

                        {expandedTeams[team.key] && (
                          <div className="px-4 pb-3">
                            {/* Leader row */}
                            {team.leader && (
                              <div className="flex items-center justify-between py-2 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-purple-600 text-xs">Leader</span>
                                  <span className="font-medium">{team.leader.name}</span>
                                  <span className="text-xs text-gray-300">{team.leader.email}</span>
                                </div>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); fetchUserDetails(team.leader!._id, team.leader!); }} className="inline-flex items-center gap-1 text-sm underline">
                                  <Eye className="w-4 h-4" /> View
                                </button>
                              </div>
                            )}

                            {/* Members */}
                            <div className="divide-y divide-white/10">
                              {team.members.map(m => (
                                <div key={m._id} className="flex items-center justify-between py-2">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-blue-600 text-xs">Member</span>
                                    <span className="font-medium">{m.name}</span>
                                    <span className="text-xs text-gray-300">{m.email}</span>
                                  </div>
                                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); fetchUserDetails(m._id, m); }} className="inline-flex items-center gap-1 text-sm underline">
                                    <Eye className="w-4 h-4" /> View
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">
                <div className="text-sm text-gray-300 mb-4 text-center">Solo Participants: {soloParticipants.length}</div>
                {soloParticipants.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 text-sm">No solo participants found</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {soloParticipants.map(u => (
                      <div key={u._id} className="rounded border border-white/10 bg-black/30 p-4 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-base leading-tight">{u.name}</div>
                            <div className="text-xs text-gray-300 break-all">{u.email}</div>
                          </div>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); fetchUserDetails(u._id, u); }} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20">
                            <Eye className="w-4 h-4" /> View
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {(u.events || []).length > 0 ? (
                            (u.events || []).map((e, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded bg-white/10">{e}</span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No events</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {/* User details modal */}
          {showUserModal && isClient && createPortal(
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
              <div className="bg-gray-900 border border-white/10 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <div>
                    <div className="font-semibold">{selectedUser?.name || 'Participant'}</div>
                    <div className="text-xs text-gray-300">{selectedUser?.email || ''}</div>
                  </div>
                  <button onClick={() => setShowUserModal(false)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">Close</button>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div><span className="text-gray-400">Contact:</span> {selectedUser?.contactNo || '-'}</div>
                    <div><span className="text-gray-400">Gender:</span> {selectedUser?.gender || '-'}</div>
                    <div><span className="text-gray-400">Age:</span> {selectedUser?.age ?? '-'}</div>
                    <div><span className="text-gray-400">University:</span> {selectedUser?.universityName || '-'}</div>
                    <div className="col-span-2"><span className="text-gray-400">Address:</span> {selectedUser?.address || '-'}</div>
                    <div><span className="text-gray-400">Validated:</span> {selectedUser?.isvalidated ? 'Yes' : 'No'}</div>
                    <div><span className="text-gray-400">Has Entered:</span> {selectedUser?.hasEntered ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Events</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser?.events?.map((e, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded bg-white/10">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>, document.body)
          }

        </div>
      </div>
    </ProtectedRoute>
  );
}

export default RegistrationsTeamsPage;


