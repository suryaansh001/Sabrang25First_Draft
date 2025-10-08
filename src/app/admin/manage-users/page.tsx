"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Filter,
  Download,
  RefreshCw,
  UserPlus,
  Mail,
  XCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

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
  userType: string;
  events: string[];
  isvalidated: boolean;
  hasEntered: boolean;
  emailSent: boolean;
  createdAt: string;
  teamInfo?: TeamInfo[];
  teamParticipations?: any[];
  purchaseHistory?: any[];
  totalAmountPaid?: number;
}

interface Event {
  _id: string;
  name: string;
  category: string;
}

const ManageUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'teams'>('users');
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [teams, setTeams] = useState<any[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    validatedUsers: 0,
    enteredUsers: 0,
    emailSentUsers: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchEvents();
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchTeams();
    }
  }, [currentPage, eventFilter, statusFilter, userTypeFilter, sortBy, sortOrder, activeTab]);

  const fetchEvents = async () => {
    // Use exact event titles from events.data.ts
    const predefinedEvents = [
      { _id: '1', name: 'RAMPWALK - PANACHE', category: 'Fashion Show' },
      { _id: '2', name: 'BANDJAM', category: 'Music Festival' },
      { _id: '3', name: 'DANCE BATTLE', category: 'Dance Competition' },
      { _id: '4', name: 'STEP UP', category: 'Solo Dance' },
      { _id: '5', name: 'ECHOES OF NOOR', category: 'Spoken Word' },
      { _id: '7', name: 'BIDDING BEFORE WICKET', category: 'Cricket Auction' },
      { _id: '8', name: 'SEAL THE DEAL', category: 'Simulated Trading' },
      { _id: '9', name: 'VERSEVAAD', category: 'Poetic Debate' },
      { _id: '10', name: 'IN CONVERSATION WITH', category: 'Talk Series' },
      { _id: '11', name: 'CLAY MODELLING', category: 'Sculpture' },
      { _id: '12', name: 'FOCUS', category: 'Photography' },
      { _id: '13', name: 'BGMI TOURNAMENT', category: 'E-Sports' },
      { _id: '14', name: 'VALORANT TOURNAMENT', category: 'E-Sports' },
      { _id: '15', name: 'FREE FIRE TOURNAMENT', category: 'E-Sports' },
      { _id: '17', name: 'DUMB SHOW', category: 'Mime Acting' },
      { _id: '18', name: 'COURTROOM', category: 'Mock Trial' },
      { _id: '19', name: 'ART RELAY', category: 'Solo Art' }
    ];
    
    setEvents(predefinedEvents);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        eventFilter,
        statusFilter,
        userTypeFilter,
        sortBy,
        sortOrder,
        page: currentPage.toString(),
        limit: '20'
      });

      const response = await fetch(`/api/admin/manage-users?${params}`);
      const data = await response.json();

      console.log('API Response:', data);
      console.log('Response structure:', {
        success: data.success,
        users: data.users ? 'exists' : 'missing',
        pagination: data.pagination ? 'exists' : 'missing',
        stats: data.stats ? 'exists' : 'missing'
      });

      if (data.success) {
        console.log('Users data received:', data.users);
        console.log('Sample user with team data:', data.users?.[0]);
        setUsers(data.users || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCount(data.pagination.totalCount || 0);
        } else {
          console.error('Missing pagination in response');
          setTotalPages(1);
          setTotalCount(0);
        }
        setStats(data.stats || {
          totalUsers: 0,
          validatedUsers: 0,
          enteredUsers: 0,
          emailSentUsers: 0,
          activeUsers: 0
        });
      } else {
        alert(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    setTeamsLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        eventFilter,
        sortBy,
        sortOrder,
        limit: '100'
      });

      console.log('Fetching teams with params:', params.toString());
      const response = await fetch(`/api/admin/teams?${params}`);
      const data = await response.json();

      console.log('Teams API Response:', data);

      if (data.success) {
        setTeams(data.teams || []);
        console.log('Teams loaded:', data.teams?.length || 0);
      } else {
        console.error('Failed to fetch teams:', data.message);
        setTeams([]);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  };

  const deleteUser = async (userId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/manage-users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          confirmDelete: true,
          reason
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`User ${data.deletedUser.name} deleted successfully`);
        fetchUsers(); // Refresh the list
        setShowDeleteConfirm(null);
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Group users by teams (using teamParticipations from backend)
  const groupedTeams = useMemo(() => {
    console.log('Grouping teams from users:', users.length);
    const map = new Map<string, { leader: User | null; members: User[]; meta: any }>();

    for (const user of users) {
      const teamParticipations = user.teamParticipations || [];
      console.log(`User ${user.name} has ${teamParticipations.length} team participations:`, teamParticipations);
      
      if (teamParticipations.length === 0) continue;
      
      for (const team of teamParticipations) {
        // Handle missing or undefined team data
        if (!team || !team.teamName || !team.eventName) {
          console.log('Skipping invalid team data:', team);
          continue;
        }
        
        const key = `${team.eventName}|${team.teamName}`;
        console.log(`Processing team: ${key} for user: ${user.name}`);
        
        if (!map.has(key)) {
          map.set(key, { 
            leader: null, 
            members: [], 
            meta: {
              teamName: team.teamName,
              eventName: team.eventName,
              teamId: team.teamId || team.teamName,
              registrationComplete: true, // Assume complete if they're in teamParticipations
              totalMembers: 0 // Will be calculated
            }
          });
          console.log(`Created new team entry: ${key}`);
        }
        const entry = map.get(key)!;
        
        // Check if user is already in this team (avoid duplicates)
        const isAlreadyLeader = entry.leader && entry.leader._id === user._id;
        const isAlreadyMember = entry.members.some(m => m._id === user._id);
        
        if (isAlreadyLeader || isAlreadyMember) {
          console.log(`User ${user.name} already in team ${key}, skipping`);
          continue;
        }
        
        // For now, treat first user as leader (we can improve this logic later)
        if (!entry.leader) {
          entry.leader = user;
          console.log(`Set ${user.name} as leader of ${key}`);
        } else {
          entry.members.push(user);
          console.log(`Added ${user.name} as member of ${key}`);
        }
        
        // Update total members count
        entry.meta.totalMembers = (entry.leader ? 1 : 0) + entry.members.length;
      }
    }

    const result = Array.from(map.entries()).map(([key, value]) => ({ key, ...value }));
    console.log('Final grouped teams:', result);
    console.log('Team summary:', result.map(t => ({
      key: t.key,
      teamName: t.meta.teamName,
      eventName: t.meta.eventName,
      leaderName: t.leader?.name,
      memberCount: t.members.length,
      totalMembers: t.meta.totalMembers
    })));
    return result;
  }, [users]);

  const soloUsers = useMemo(() => users.filter(u => !u.teamParticipations || u.teamParticipations.length === 0), [users]);

  const toggleTeam = (key: string) => {
    setExpandedTeams(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const exportUsers = async () => {
    setExporting(true);
    try {
      // Use the same filters as the current view
      const params = new URLSearchParams({
        search: searchQuery,
        eventFilter,
        statusFilter,
        userTypeFilter,
        sortBy,
        sortOrder,
        format: 'excel',
        export: 'true' // Flag to get all matching records, not paginated
      });

      console.log('Exporting with filters:', {
        search: searchQuery,
        eventFilter,
        statusFilter,
        userTypeFilter,
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/admin/manage-users?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date and applied filters
      const filterSuffix = eventFilter !== 'all' ? `_${eventFilter}` : '';
      const statusSuffix = statusFilter !== 'all' ? `_${statusFilter}` : '';
      const filename = `users_export${filterSuffix}${statusSuffix}_${new Date().toISOString().split('T')[0]}.csv`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Export completed:', filename);
    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Error exporting users: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-6 px-16 sm:px-20 lg:px-32 xl:px-40 2xl:px-48">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
              <p className="text-gray-300">View, search, edit, and manage user accounts</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/admin/manage-users/add-user">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add User
                </button>
              </Link>
              <Link href="/admin/manage-users/add-team">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Add Team
                </button>
              </Link>
              <button
                onClick={exportUsers}
                disabled={exporting}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed flex items-center border border-gray-600"
              >
                {exporting ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Download className="w-5 h-5 mr-2" />
                )}
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-xl">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-300">Total Users</p>
                <p className="text-xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-xl">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-gray-300">Validated</p>
                <p className="text-xl font-bold text-white">{stats.validatedUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-xl">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-300">Entered</p>
                <p className="text-xl font-bold text-white">{stats.enteredUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-xl">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-sm text-gray-300">Email Sent</p>
                <p className="text-xl font-bold text-white">{stats.emailSentUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-xl">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-indigo-400 mr-3" />
              <div>
                <p className="text-sm text-gray-300">Active</p>
                <p className="text-xl font-bold text-white">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mb-4 sticky top-0 z-30">
          <div className="flex items-center justify-center">
            <div className="inline-flex bg-gray-800 border border-gray-600 rounded-xl overflow-hidden shadow-lg">
              <button
                className={`px-5 py-2 text-sm transition ${activeTab === 'users' ? 'bg-blue-600 font-semibold text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setActiveTab('users')}
              >
                All Users ({stats.totalUsers})
              </button>
              <button
                className={`px-5 py-2 text-sm transition ${activeTab === 'teams' ? 'bg-blue-600 font-semibold text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setActiveTab('teams')}
              >
                Teams ({teams.length})
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Name, email, contact..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Filter</label>
              <select
                className="w-full py-2 px-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
              >
                <option value="all">All Events</option>
                {events.map((event) => (
                  <option key={event._id} value={event.name}>{event.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status Filter</label>
              <select
                className="w-full py-2 px-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="validated">Validated</option>
                <option value="not-validated">Not Validated</option>
                <option value="entered">Entered</option>
                <option value="not-entered">Not Entered</option>
                <option value="email-sent">Email Sent</option>
                <option value="email-pending">Email Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">User Type</label>
              <select
                className="w-full py-2 px-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="participant">Participant</option>
                <option value="support_staff">Support Staff</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <div className="flex space-x-2">
                <select
                  className="flex-1 py-2 px-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAt">Created Date</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="universityName">University</option>
                </select>
                <select
                  className="py-2 px-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 flex items-center border border-blue-600"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Search className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Content based on active tab */}
        {loading ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading users...</p>
          </div>
        ) : activeTab === 'users' ? (
          /* Users Table */
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">All Users</h2>
                  <p className="text-sm text-gray-300">
                    Showing {users.length} of {totalCount} users
                  </p>
                </div>
                <div className="text-sm text-gray-300">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Registration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-300">{user.email}</div>
                          <div className="text-sm text-gray-300">{user.contactNo}</div>
                          {user.universityName && (
                            <div className="text-xs text-gray-400">{user.universityName}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.events && user.events.map((event, index) => (
                            <span key={index} className="inline-block bg-blue-600 text-blue-100 text-xs px-2 py-1 rounded">
                              {event}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isvalidated)}`}>
                            {user.isvalidated ? 'Validated' : 'Not Validated'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.hasEntered)}`}>
                            {user.hasEntered ? 'Entered' : 'Not Entered'}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.emailSent)}`}>
                            {user.emailSent ? 'Email Sent' : 'Email Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <div>
                          <div>{formatDateTime(user.createdAt)}</div>
                          {(user.totalAmountPaid || 0) > 0 && (
                            <div className="text-xs text-green-400">
                              Paid: ₹{user.totalAmountPaid || 0}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-400 hover:text-blue-300"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link href={`/admin/manage-users/edit/${user._id}`}>
                            <button className="text-green-400 hover:text-green-300" title="Edit User">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => setShowDeleteConfirm(user._id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 bg-gray-700 border-t border-gray-600 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-300 hover:text-white disabled:text-gray-500"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm text-gray-300 hover:text-white disabled:text-gray-500"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : teamsLoading ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-12 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading teams...</p>
          </div>
        ) : (
          /* Teams View */
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white">Teams</h2>
                  <p className="text-sm text-gray-300">
                    {teams.length} teams found
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {teams.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No teams found
                </div>
              ) : (
                <div className="space-y-3">
                  {teams.map(team => (
                    <div key={team._id} className="rounded border border-gray-600 bg-gray-700">
                      <button 
                        onClick={() => toggleTeam(team._id)} 
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {expandedTeams[team._id] ? 
                            <ChevronDown className="w-4 h-4 text-gray-300" /> : 
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          }
                          <div className="text-left">
                            <div className="font-semibold text-white">{team.teamName}</div>
                            <div className="text-xs text-gray-300">
                              {team.eventName} • Members: {team.totalMembers}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className={`px-2 py-1 rounded text-white ${team.registrationComplete ? 'bg-green-600' : 'bg-yellow-600'}`}>
                            {team.registrationComplete ? 'Complete' : 'Incomplete'}
                          </span>
                        </div>
                      </button>

                      {expandedTeams[team._id] && (
                        <div className="px-4 pb-3 border-t border-gray-600">
                          {/* Team Leader */}
                          {team.leader && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-600">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-xs">Leader</span>
                                <span className="font-medium text-white">{team.leader.name}</span>
                                <span className="text-xs text-gray-300">{team.leader.email}</span>
                                {team.leader.hasEntered && (
                                  <span className="px-1 py-0.5 rounded bg-green-600 text-white text-xs">Entered</span>
                                )}
                              </div>
                              <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* TODO: Fetch user details */ }} 
                                className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                              >
                                <Eye className="w-4 h-4" /> View
                              </button>
                            </div>
                          )}

                          {/* Team Members */}
                          <div className="divide-y divide-gray-600">
                            {team.members.map((member: any) => (
                              <div key={member._id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs">Member</span>
                                  <span className="font-medium text-white">{member.name}</span>
                                  <span className="text-xs text-gray-300">{member.email}</span>
                                  {member.hasEntered && (
                                    <span className="px-1 py-0.5 rounded bg-green-600 text-white text-xs">Entered</span>
                                  )}
                                </div>
                                <button 
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* TODO: Fetch user details */ }} 
                                  className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                                >
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
              )}
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">User Details</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Personal Information</h4>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="font-medium text-gray-200">Name:</span> {selectedUser.name}</p>
                      <p><span className="font-medium text-gray-200">Email:</span> {selectedUser.email}</p>
                      <p><span className="font-medium text-gray-200">Contact:</span> {selectedUser.contactNo}</p>
                      <p><span className="font-medium text-gray-200">Gender:</span> {selectedUser.gender}</p>
                      <p><span className="font-medium text-gray-200">Age:</span> {selectedUser.age}</p>
                      <p><span className="font-medium text-gray-200">University:</span> {selectedUser.universityName}</p>
                      <p><span className="font-medium text-gray-200">Address:</span> {selectedUser.address}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-3">Account Information</h4>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="font-medium text-gray-200">User Type:</span> {selectedUser.userType}</p>
                      <p><span className="font-medium text-gray-200">Created:</span> {formatDateTime(selectedUser.createdAt)}</p>
                      <p><span className="font-medium text-gray-200">Validated:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedUser.isvalidated)}`}>
                          {selectedUser.isvalidated ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p><span className="font-medium text-gray-200">Entered:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedUser.hasEntered)}`}>
                          {selectedUser.hasEntered ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p><span className="font-medium text-gray-200">Email Sent:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedUser.emailSent)}`}>
                          {selectedUser.emailSent ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p><span className="font-medium text-gray-200">Total Paid:</span> ₹{selectedUser.totalAmountPaid}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-white mb-3">Registered Events</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.events && selectedUser.events.map((event, index) => (
                      <span key={index} className="bg-blue-600 text-blue-100 text-sm px-3 py-1 rounded-full">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedUser.teamParticipations && selectedUser.teamParticipations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-white mb-3">Team Participations</h4>
                    <div className="space-y-2">
                      {selectedUser.teamParticipations.map((team, index) => (
                        <div key={index} className="bg-gray-700 border border-gray-600 p-3 rounded-lg">
                          <p className="text-gray-300"><span className="font-medium text-gray-200">Team:</span> {team.teamName}</p>
                          <p className="text-gray-300"><span className="font-medium text-gray-200">Event:</span> {team.eventName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUser.purchaseHistory && selectedUser.purchaseHistory.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-white mb-3">Purchase History</h4>
                    <div className="space-y-2">
                      {selectedUser.purchaseHistory.map((purchase, index) => (
                        <div key={index} className="bg-gray-700 border border-gray-600 p-3 rounded-lg">
                          <p className="text-gray-300"><span className="font-medium text-gray-200">Order ID:</span> {purchase.orderId}</p>
                          <p className="text-gray-300"><span className="font-medium text-gray-200">Amount:</span> ₹{purchase.totalAmount}</p>
                          <p className="text-gray-300"><span className="font-medium text-gray-200">Status:</span> 
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              purchase.paymentStatus === 'completed' ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                            }`}>
                              {purchase.paymentStatus}
                            </span>
                          </p>
                          <p className="text-gray-300"><span className="font-medium text-gray-200">Date:</span> {formatDateTime(purchase.purchaseDate)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Delete User</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Are you sure you want to delete this user? This action cannot be undone and will remove all user data.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Reason for deletion (required)
                  </label>
                  <textarea
                    id="deleteReason"
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                    placeholder="Enter reason for deleting this user..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 bg-gray-600 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-500 border border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const reasonInput = document.getElementById('deleteReason') as HTMLTextAreaElement;
                      const reason = reasonInput?.value?.trim();
                      if (!reason) {
                        alert('Please provide a reason for deletion');
                        return;
                      }
                      deleteUser(showDeleteConfirm, reason);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 border border-red-600"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
