'use client';

import React, { useState, useEffect } from 'react';
import { Search, Users, UserCheck, UserX, RefreshCw, Eye, RotateCcw, AlertTriangle } from 'lucide-react';

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
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [resetConfirm, setResetConfirm] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    entered: 0,
    notEntered: 0,
    validated: 0
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events-public');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const searchParticipants = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      alert('Please enter at least 2 characters to search');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery.trim(),
        eventFilter: selectedEvent,
        limit: '50'
      });

      const response = await fetch(`/api/admin/coordinator/search-participants?${params}`);
      const data = await response.json();

      if (data.success) {
        setParticipants(data.participants);
        
        // Calculate stats
        const stats = {
          total: data.participants.length,
          entered: data.participants.filter((p: Participant) => p.hasEntered).length,
          notEntered: data.participants.filter((p: Participant) => !p.hasEntered).length,
          validated: data.participants.filter((p: Participant) => p.isvalidated).length
        };
        setStats(stats);
      } else {
        alert(data.message || 'Search failed');
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

        setResetConfirm(null);
      } else {
        alert(data.message || 'Failed to reset entry status');
      }
    } catch (error) {
      console.error('Error resetting entry status:', error);
      alert('Error resetting entry status');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchParticipants();
    }
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coordinator Dashboard</h1>
          <p className="text-gray-600">Search and manage event participants</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Participants</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or contact number..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Event</label>
              <select
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="all">All Events</option>
                {events.map((event) => (
                  <option key={event._id} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:w-32 flex items-end">
              <button
                onClick={searchParticipants}
                disabled={loading || !searchQuery.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats */}
          {participants.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Found</p>
                    <p className="text-xl font-bold text-blue-800">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <UserCheck className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Entered</p>
                    <p className="text-xl font-bold text-green-800">{stats.entered}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <UserX className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <p className="text-sm text-red-600 font-medium">Not Entered</p>
                    <p className="text-xl font-bold text-red-800">{stats.notEntered}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Validated</p>
                    <p className="text-xl font-bold text-purple-800">{stats.validated}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {participants.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
              <p className="text-sm text-gray-600">Found {participants.length} participants</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <tr key={participant._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                          <div className="text-sm text-gray-500">{participant.email}</div>
                          <div className="text-sm text-gray-500">{participant.contactNo}</div>
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
                          <div className="text-xs text-gray-500 mt-1">
                            Team: {participant.teamInfo.teamName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {participant.events.map((event, index) => (
                            <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                              {event}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {participant.hasEntered ? (
                            <div>
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Entered
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatDateTime(participant.entryTime)}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Not Entered
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => viewParticipantDetails(participant)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {participant.hasEntered && (
                          <button
                            onClick={() => setResetConfirm(participant._id)}
                            className="text-orange-600 hover:text-orange-900 flex items-center"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset Entry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Participant Details Modal */}
        {showDetails && selectedParticipant && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Participant Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedParticipant.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedParticipant.email}</p>
                      <p><span className="font-medium">Contact:</span> {selectedParticipant.contactNo}</p>
                      <p><span className="font-medium">University:</span> {selectedParticipant.universityName}</p>
                      <p><span className="font-medium">Type:</span> {getParticipantTypeLabel(selectedParticipant.participantType)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Status Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Validated:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${selectedParticipant.isvalidated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {selectedParticipant.isvalidated ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p><span className="font-medium">Entry Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${selectedParticipant.hasEntered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {selectedParticipant.hasEntered ? 'Entered' : 'Not Entered'}
                        </span>
                      </p>
                      {selectedParticipant.entryTime && (
                        <p><span className="font-medium">Entry Time:</span> {formatDateTime(selectedParticipant.entryTime)}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Registered Events</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedParticipant.events.map((event, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedParticipant.teamInfo && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Team Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">Team:</span> {selectedParticipant.teamInfo.teamName}</p>
                      <p><span className="font-medium">Event:</span> {selectedParticipant.teamInfo.eventName}</p>
                      <p><span className="font-medium">Total Members:</span> {selectedParticipant.teamInfo.totalMembers}</p>
                      {selectedParticipant.teamInfo.teamLeaderName && (
                        <p><span className="font-medium">Team Leader:</span> {selectedParticipant.teamInfo.teamLeaderName}</p>
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Reset Entry Status</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to reset the entry status for this participant? This action will mark them as "Not Entered" and remove their entry time.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for reset (optional)
                  </label>
                  <textarea
                    id="resetReason"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter reason for resetting entry status..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setResetConfirm(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
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
        {participants.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Participants</h3>
            <p className="text-gray-600">
              Enter a name, email, or contact number to search for event participants.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoordinatorPage;