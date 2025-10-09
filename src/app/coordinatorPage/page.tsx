'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, UserCheck, UserX, RefreshCw, Eye, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import createApiUrl from "../../lib/api";

interface Participant {
  _id: string;
  name: string;
  email: string;
  contactNo: string;
  universityName: string;
  events: string[];
  hasEntered: boolean;
  entryTime?: string;
  isvalidated: boolean;
  participantType: 'individual' | 'team-leader' | 'team-member';
  teamInfo?: {
    teamId: string;
    teamName: string;
    eventName: string;
    teamLeaderName?: string;
    totalMembers: number;
  };
}

interface Event {
  _id: string;
  name: string;
  category: string;
  coordinator: string;
  mobile: string;
}

const CoordinatorPage = () => {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [entryFilter, setEntryFilter] = useState('all'); // 'all', 'entered', 'not-entered'
  const [loading, setLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [resetConfirm, setResetConfirm] = useState<string | null>(null);
  const [allowingEntry, setAllowingEntry] = useState<string | null>(null);
  const [entryResult, setEntryResult] = useState<{[key: string]: any}>({});
  const [stats, setStats] = useState({
    total: 0,
    entered: 0,
    notEntered: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 100
  });

  // Fetch events and initial participants on component mount
  useEffect(() => {
    fetchEvents();
    loadAllParticipants();
  }, []);

  // Reload participants when event filter changes (not entry filter since it's client-side)
  useEffect(() => {
    if (events.length > 0) { // Only reload if events are loaded
      if (searchQuery.trim()) {
        searchParticipants();
      } else {
        loadAllParticipants();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events-public');
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Events data is not an array:', data);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const loadAllParticipants = async (page: number = 1) => {
    setLoading(true);
    try {
      // Use the admin/users endpoint to get all users
      const params = new URLSearchParams({
        eventFilter: selectedEvent,
        limit: pagination.usersPerPage.toString(),
        page: page.toString(),
        sortBy: 'hasEntered',
        sortOrder: 'desc'
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      

      if (data.success && Array.isArray(data.users)) {
        // Transform the users data to match our Participant interface
        const transformedParticipants = data.users.map((user: any) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          contactNo: user.contactNo || '',
          universityName: user.universityName || '',
          events: user.events || [],
          hasEntered: Boolean(user.hasEntered),
          entryTime: user.entryTime,
          isvalidated: user.isvalidated || false,
          participantType: user.participantType || 'individual',
          teamInfo: user.teamInfo
        }));

        setParticipants(transformedParticipants);
        
        
        // Update pagination info using correct API response structure
        const totalUsers = data.pagination?.totalCount || data.stats?.totalUsers || 0;
        const totalPages = data.pagination?.totalPages || Math.ceil(totalUsers / pagination.usersPerPage);
        const currentPage = data.pagination?.currentPage || page;
        
        
        setPagination(prev => ({
          ...prev,
          currentPage: currentPage,
          totalPages: totalPages,
          totalUsers: totalUsers
        }));
        
        // Calculate stats using backend data for totals
        const backendStats = data.stats || {};
        const enteredUsersTotal = backendStats.enteredUsers || 0;
        
        const stats = {
          total: totalUsers, // Show total users across all pages
          entered: enteredUsersTotal, // Use backend total count
          notEntered: totalUsers - enteredUsersTotal // Calculate from totals
        };
        setStats(stats);
      } else {
        console.log('No participants found');
        setParticipants([]);
        setStats({ total: 0, entered: 0, notEntered: 0 });
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalUsers: 0
        }));
      }
    } catch (error) {
      console.error('Error loading participants:', error);
      setParticipants([]);
      setStats({ total: 0, entered: 0, notEntered: 0 });
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  const searchParticipants = async (page: number = 1) => {
    // If no search query, just load all participants
    if (!searchQuery.trim()) {
      loadAllParticipants(page);
      return;
    }

    // Validate search query length
    if (searchQuery.trim().length < 2) {
      alert('Please enter at least 2 characters to search or leave empty to show all');
      return;
    }

    setLoading(true);
    try {
      // Use the admin/users endpoint with search parameter
      const params = new URLSearchParams({
        search: searchQuery.trim(),
        eventFilter: selectedEvent,
        limit: pagination.usersPerPage.toString(),
        page: page.toString()
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.users)) {
        // Transform the users data to match our Participant interface
        const transformedParticipants = data.users.map((user: any) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          contactNo: user.contactNo || '',
          universityName: user.universityName || '',
          events: user.events || [],
          hasEntered: Boolean(user.hasEntered),
          entryTime: user.entryTime,
          isvalidated: user.isvalidated || false,
          participantType: user.participantType || 'individual',
          teamInfo: user.teamInfo
        }));

        setParticipants(transformedParticipants);
        
        // Update pagination info for search results using correct API response structure
        const totalUsers = data.pagination?.totalCount || data.stats?.totalUsers || 0;
        const totalPages = data.pagination?.totalPages || Math.ceil(totalUsers / pagination.usersPerPage);
        const currentPage = data.pagination?.currentPage || page;
        
        setPagination(prev => ({
          ...prev,
          currentPage: currentPage,
          totalPages: totalPages,
          totalUsers: totalUsers
        }));
        
        // Calculate stats using backend data for totals
        const backendStats = data.stats || {};
        const enteredUsersTotal = backendStats.enteredUsers || 0;
        
        const stats = {
          total: totalUsers, // Show total search results across all pages
          entered: enteredUsersTotal, // Use backend total count
          notEntered: totalUsers - enteredUsersTotal // Calculate from totals
        };
        setStats(stats);
      } else {
        console.log('No participants found');
        setParticipants([]);
        setStats({ total: 0, entered: 0, notEntered: 0 });
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalUsers: 0
        }));
      }
    } catch (error) {
      console.error('Error searching participants:', error);
      alert('Error searching participants');
    } finally {
      setLoading(false);
    }
  };

  const viewParticipantDetails = async (participant: Participant) => {
    try {
      const response = await fetch(`/api/admin/coordinator/participant/${participant._id}`);
      const data = await response.json();

      if (data.success) {
        setSelectedParticipant(data.participant);
        setShowDetails(true);
      } else {
        alert(data.message || 'Failed to fetch participant details');
      }
    } catch (error) {
      console.error('Error fetching participant details:', error);
      alert('Error fetching participant details');
    }
  };

  const resetEntryStatus = async (participantId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/coordinator/reset-entry/${participantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Entry status reset successfully for ${data.participant.name}`);
        
        // Update the participant in the list
        setParticipants(prevParticipants =>
          prevParticipants.map(p =>
            p._id === participantId
              ? { ...p, hasEntered: false, entryTime: undefined }
              : p
          )
        );

        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          entered: prevStats.entered - 1,
          notEntered: prevStats.notEntered + 1
        }));

        // Clear entry result for this participant
        setEntryResult(prev => {
          const updated = { ...prev };
          delete updated[participantId];
          return updated;
        });

        setResetConfirm(null);
      } else {
        alert(data.message || 'Failed to reset entry status');
      }
    } catch (error) {
      console.error('Error resetting entry status:', error);
      alert('Error resetting entry status');
    }
  };

  const handleAllowEntry = async (participantId: string) => {
    // Unlock audio on user gesture (similar to scan-qr page)
    try {
      const audio = new Audio('/audio/buzzer.mp3');
      audio.volume = 0;
      audio.play()
        .then(() => {
          try { audio.pause(); audio.currentTime = 0; } catch {}
          (window as any).__audioUnlocked = true;
        })
        .catch(() => { (window as any).__audioUnlocked = false; });
    } catch { (window as any).__audioUnlocked = false; }

    setAllowingEntry(participantId);
    try {
      const response = await fetch(createApiUrl(`/admin/allow-entry/${participantId}`), {
        method: 'POST',
        credentials: 'include'
      });
      
      const result = await response.json();
      
      // Store the result for this participant
      setEntryResult(prev => ({
        ...prev,
        [participantId]: result
      }));
      
      // Update participant data if successful
      if (result.success) {
        setParticipants(prevParticipants =>
          prevParticipants.map(p =>
            p._id === participantId
              ? { ...p, hasEntered: true, entryTime: result.entryTime }
              : p
          )
        );

        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          entered: prevStats.entered + 1,
          notEntered: prevStats.notEntered - 1
        }));

        // Success feedback - you could add a success sound here if desired
        console.log(`✅ Entry allowed for participant ${participantId}`);
      } else {
        // Play buzzer sound for failure (similar to scan-qr page)
        try {
          if ((window as any).__audioUnlocked) {
            const audio = new Audio('/audio/buzzer.mp3');
            audio.play().catch(() => {});
          }
        } catch {}
        console.log(`🚫 Entry denied for participant ${participantId}: ${result.message}`);
      }
      
    } catch (err) {
      console.error('Failed to process entry:', err);
      setEntryResult(prev => ({
        ...prev,
        [participantId]: { success: false, message: 'Failed to process entry' }
      }));
      
      // Play buzzer for network/system errors too
      try {
        if ((window as any).__audioUnlocked) {
          const audio = new Audio('/audio/buzzer.mp3');
          audio.play().catch(() => {});
        }
      } catch {}
    } finally {
      setAllowingEntry(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchParticipants(1); // Reset to page 1 on new search
    }
  };

  const handlePageChange = (newPage: number) => {
    if (searchQuery.trim()) {
      searchParticipants(newPage);
    } else {
      loadAllParticipants(newPage);
    }
  };

  // Filter participants based on entry status
  const filteredParticipants = participants.filter(participant => {
    if (entryFilter === 'entered') {
      return Boolean(participant.hasEntered);
    } else if (entryFilter === 'not-entered') {
      return !Boolean(participant.hasEntered);
    }
    return true; // 'all' - show all participants
  });

  const handleSearchClick = () => {
    searchParticipants(1); // Reset to page 1 on new search
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getParticipantTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 text-blue-800';
      case 'team-leader': return 'bg-green-100 text-green-800';
      case 'team-member': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getParticipantTypeLabel = (type: string) => {
    switch (type) {
      case 'individual': return 'Individual';
      case 'team-leader': return 'Team Leader';
      case 'team-member': return 'Team Member';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-2">Coordinator Dashboard</h1>
          <p className="text-gray-300 mb-4">Search and manage event participants with entry control</p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center p-3 bg-green-900/30 rounded-lg border border-green-700">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-semibold text-green-300">Allow Entry</p>
                <p className="text-xs text-green-400">Grant access to participants</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-orange-900/30 rounded-lg border border-orange-700">
              <RotateCcw className="w-5 h-5 text-orange-400 mr-3" />
              <div>
                <p className="text-sm font-semibold text-orange-300">Reset Entry</p>
                <p className="text-xs text-orange-400">Reset entry status if needed</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-900/30 rounded-lg border border-blue-700">
              <Eye className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-semibold text-blue-300">View Details</p>
                <p className="text-xs text-blue-400">Check participant information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Participants</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or contact number (leave empty to show all)..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Entry Status</label>
              <select
                className="w-full py-2 px-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={entryFilter}
                onChange={(e) => setEntryFilter(e.target.value)}
              >
                <option value="all">All Participants</option>
                <option value="entered">Entered Only</option>
                <option value="not-entered">Not Entered Only</option>
              </select>
            </div>
            <div className="md:w-32 flex items-end">
              <button
                onClick={handleSearchClick}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    {searchQuery.trim() ? 'Search' : 'Show All'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats */}
          {filteredParticipants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-700">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-blue-300 font-medium">Total Users</p>
                    <p className="text-xl font-bold text-blue-200">{stats.total}</p>
                    <p className="text-xs text-blue-400">Showing {filteredParticipants.length} on this page</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/30 p-3 rounded-lg border border-green-700">
                <div className="flex items-center">
                  <UserCheck className="w-5 h-5 text-green-400 mr-2" />
                  <div>
                    <p className="text-sm text-green-300 font-medium">Entered</p>
                    <p className="text-xl font-bold text-green-200">{stats.entered}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-900/30 p-3 rounded-lg border border-red-700">
                <div className="flex items-center">
                  <UserX className="w-5 h-5 text-red-400 mr-2" />
                  <div>
                    <p className="text-sm text-red-300 font-medium">Not Entered</p>
                    <p className="text-xl font-bold text-red-200">{stats.notEntered}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredParticipants.length > 0 && (
          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {searchQuery.trim() ? 'Search Results' : 'All Participants'}
              </h2>
              <p className="text-sm text-gray-300">
                Showing {filteredParticipants.length} of {pagination.totalUsers} participants 
                (Page {pagination.currentPage} of {pagination.totalPages})
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Entry Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredParticipants.map((participant) => (
                    <tr key={participant._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{participant.name}</div>
                          <div className="text-sm text-gray-300">{participant.email}</div>
                          <div className="text-sm text-gray-300">{participant.contactNo}</div>
                          {participant.universityName && (
                            <div className="text-xs text-gray-400">{participant.universityName}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getParticipantTypeColor(participant.participantType)}`}>
                          {getParticipantTypeLabel(participant.participantType)}
                        </span>
                        {participant.teamInfo && (
                          <div className="text-xs text-gray-400 mt-1">
                            Team: {participant.teamInfo.teamName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">
                          {participant.events.map((event, index) => (
                            <span key={index} className="inline-block bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded mr-1 mb-1">
                              {event}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          {(() => {
                            const result = entryResult[participant._id];
                            const isSuccess = result?.success === true;
                            const isFailure = result?.success === false;
                            const hasEntered = participant.hasEntered || isSuccess;
                            
                            if (hasEntered && !isFailure) {
                              return (
                                <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                                  <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-green-500 text-white">
                                    ✅ ENTRY ALLOWED
                                  </span>
                                  <div className="text-xs text-green-700 mt-1 font-medium">
                                    Entry time: {formatDateTime(participant.entryTime || result?.entryTime)}
                                  </div>
                                  {isSuccess && (
                                    <div className="text-xs text-green-600 mt-1">
                                      Entry processed successfully
                                    </div>
                                  )}
                                </div>
                              );
                            } else if (isFailure) {
                              return (
                                <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                                  <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-red-500 text-white">
                                    🚫 ACCESS DENIED
                                  </span>
                                  <div className="text-xs text-red-700 mt-1 font-medium">
                                    {result.message || 'Entry not allowed'}
                                  </div>
                                  {participant.hasEntered && participant.entryTime && (
                                    <div className="text-xs text-red-600 mt-1">
                                      Already entered: {formatDateTime(participant.entryTime)}
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                  <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-yellow-500 text-white">
                                    ⏳ AWAITING ENTRY
                                  </span>
                                  <div className="text-xs text-yellow-700 mt-1">
                                    Ready for entry validation
                                  </div>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => viewParticipantDetails(participant)}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                          
                          {/* Always show buttons for debugging */}
                          {!participant.hasEntered ? (
                            <button
                              onClick={() => handleAllowEntry(participant._id)}
                              disabled={allowingEntry === participant._id}
                              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed"
                            >
                              {allowingEntry === participant._id ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Allow Entry
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => setResetConfirm(participant._id)}
                              className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg flex items-center justify-center transition-colors duration-200"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reset Entry
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-300">
                  <span>
                    Page {pagination.currentPage} of {pagination.totalPages} 
                    ({pagination.totalUsers} total users)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {(() => {
                    const pages = [];
                    const start = Math.max(1, pagination.currentPage - 2);
                    const end = Math.min(pagination.totalPages, pagination.currentPage + 2);
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-1 text-sm rounded ${
                            i === pagination.currentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Participant Details Modal */}
        {showDetails && selectedParticipant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Participant Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Personal Information</h4>
                    <div className="space-y-2">
                      <p className="text-gray-300"><span className="font-medium text-white">Name:</span> {selectedParticipant.name}</p>
                      <p className="text-gray-300"><span className="font-medium text-white">Email:</span> {selectedParticipant.email}</p>
                      <p className="text-gray-300"><span className="font-medium text-white">Contact:</span> {selectedParticipant.contactNo}</p>
                      <p className="text-gray-300"><span className="font-medium text-white">University:</span> {selectedParticipant.universityName}</p>
                      <p className="text-gray-300"><span className="font-medium text-white">Type:</span> {getParticipantTypeLabel(selectedParticipant.participantType)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Status Information</h4>
                    <div className="space-y-2">
                      <p className="text-gray-300"><span className="font-medium text-white">Validated:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${selectedParticipant.isvalidated ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-red-900/30 text-red-300 border border-red-700'}`}>
                          {selectedParticipant.isvalidated ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p className="text-gray-300"><span className="font-medium text-white">Entry Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${selectedParticipant.hasEntered ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-red-900/30 text-red-300 border border-red-700'}`}>
                          {selectedParticipant.hasEntered ? 'Entered' : 'Not Entered'}
                        </span>
                      </p>
                      {selectedParticipant.entryTime && (
                        <p className="text-gray-300"><span className="font-medium text-white">Entry Time:</span> {formatDateTime(selectedParticipant.entryTime)}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-white mb-3">Registered Events</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedParticipant.events.map((event, index) => (
                      <span key={index} className="bg-blue-900/30 text-blue-300 border border-blue-700 text-sm px-3 py-1 rounded-full">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedParticipant.teamInfo && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-white mb-3">Team Information</h4>
                    <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                      <p className="text-gray-300"><span className="font-medium text-white">Team:</span> {selectedParticipant.teamInfo.teamName}</p>
                      <p className="text-gray-300"><span className="font-medium text-white">Event:</span> {selectedParticipant.teamInfo.eventName}</p>
                      <p className="text-gray-300"><span className="font-medium text-white">Total Members:</span> {selectedParticipant.teamInfo.totalMembers}</p>
                      {selectedParticipant.teamInfo.teamLeaderName && (
                        <p className="text-gray-300"><span className="font-medium text-white">Team Leader:</span> {selectedParticipant.teamInfo.teamLeaderName}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reset Entry Confirmation Modal */}
        {resetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Reset Entry Status</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Are you sure you want to reset the entry status for this participant? This action will mark them as "Not Entered" and remove their entry time.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reason for reset (optional)
                  </label>
                  <textarea
                    id="resetReason"
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter reason for resetting entry status..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setResetConfirm(null)}
                    className="flex-1 bg-gray-600 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const reasonInput = document.getElementById('resetReason') as HTMLTextAreaElement;
                      resetEntryStatus(resetConfirm, reasonInput?.value || '');
                    }}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
                  >
                    Reset Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredParticipants.length === 0 && !loading && (
          <div className="bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-700">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Participants Found</h3>
            <p className="text-gray-300">
              {searchQuery.trim() 
                ? "No participants match your search criteria. Try adjusting your search or event filter."
                : "No participants are registered yet, or there might be a connection issue."
              }
            </p>
            {searchQuery.trim() && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  loadAllParticipants(1);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Show All Participants
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorPage;
