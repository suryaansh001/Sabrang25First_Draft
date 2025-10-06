"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Mail,
  Eye,
  Download,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  Building,
  Phone,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import createApiUrl from '../../../lib/api';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { events as localEvents } from '../../../lib/events.data';

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
  teamInfo: {
    teamId: string;
    eventName: string;
    teamName: string;
    isLeader: boolean;
    totalMembers: number;
    registrationComplete: boolean;
  }[];
}

interface RegistrationResponse {
  success: boolean;
  data: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: {
    totalRegistrations: number;
    enteredCount: number;
    validatedCount: number;
    emailSentCount: number;
    teamLeaderCount: number;
    supportStaffCount: number;
  };
  filters: any;
}

interface UserDetailsModal {
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

function RecentRegistrations() {
  const [data, setData] = useState<RegistrationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserDetailsModal | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [processingEntry, setProcessingEntry] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    fromDate: '2025-09-22',
    toDate: '',
    userType: 'all',
    hasEntered: 'all',
    isValidated: 'all',
    emailSent: 'all',
    eventFilter: 'all',
    search: '',
    page: 1,
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [events, setEvents] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Simple static events list for better performance
  const staticEvents = [
    'RAMPWALK - PANACHE',
    'BANDJAM', 
    'DANCE BATTLE',
    'STEP UP',
    'ECHOES OF NOOR',
    'VERSEVAAD',
    'BIDDING BEFORE WICKET',
    'SEAL THE DEAL',
    'BGMI TOURNAMENT',
    'VALORANT TOURNAMENT',
    'FREE FIRE TOURNAMENT',
    'DUMB SHOW',
    'COURTROOM',
    'CLAY MODELLING',
    'FOCUS',
    'ART RELAY',
    'IN CONVERSATION WITH'
  ];

  useEffect(() => {
    fetchEvents();
    fetchRecentRegistrations();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(createApiUrl('/admin/events'), {
        credentials: 'include'
      });
      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchRecentRegistrations = async (isFilterChange = false) => {
    if (isFilterChange) {
      setFilterLoading(true);
    } else {
      setLoading(true);
    }
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== 'all') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(createApiUrl(`/admin/recent-registrations?${queryParams}`), {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent registrations');
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load registrations');
    } finally {
      if (isFilterChange) {
        setFilterLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(createApiUrl(`/admin/registration-details/${userId}`), {
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setSelectedUser(result.data);
        setShowUserModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      alert('Failed to load user details');
    }
  };

  const allowEntry = async (userId: string) => {
    setProcessingEntry(userId);
    try {
      const response = await fetch(createApiUrl(`/admin/allow-entry/${userId}`), {
        method: 'POST',
        credentials: 'include'
      });

      const result = await response.json();
      
      if (result.success) {
        // Update the user in the local state
        if (data) {
          const updatedData = {
            ...data,
            data: data.data.map(user => 
              user._id === userId 
                ? { ...user, hasEntered: true, entryTime: result.entryTime || new Date().toISOString() }
                : user
            )
          };
          setData(updatedData);
        }
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to allow entry:', error);
      alert('Failed to process entry request');
    } finally {
      setProcessingEntry(null);
    }
  };

  const exportToCSV = async () => {
    try {
      // Fetch all registrations for export (without pagination limit)
      const exportFilters = {
        ...filters,
        limit: 9999, // Set a very high limit to get all records
        page: 1
      };

      const queryParams = new URLSearchParams();
      Object.entries(exportFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(
        createApiUrl(`/admin/recent-registrations?${queryParams.toString()}`),
        { credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data for export');
      }

      const exportData = await response.json();
      const allUsers = exportData.data || [];

      const headers = [
        'Name', 'Email', 'Contact', 'University', 'Registration Date', 'User Type', 
        'Events', 'Has Entered', 'Entry Time', 'Email Sent', 'Validated', 'Team Info'
      ];

      const csvData = allUsers.map((user: User) => [
        user.name,
        user.email,
        user.contactNo || '',
        user.universityName || '',
        new Date(user.createdAt).toLocaleDateString(),
        user.userType,
        user.events.join('; '),
        user.hasEntered ? 'Yes' : 'No',
        user.entryTime ? new Date(user.entryTime).toLocaleString() : '',
        user.emailSent ? 'Yes' : 'No',
        user.isvalidated ? 'Yes' : 'No',
        user.teamInfo.map(t => `${t.eventName}: ${t.teamName} (${t.isLeader ? 'Leader' : 'Member'})`).join('; ')
      ]);

      const csvContent = [headers, ...csvData]
        .map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recent-registrations-all-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
    // Trigger data fetch with filter loading state
    setTimeout(() => {
      fetchRecentRegistrations(true);
    }, 100); // Small delay to ensure state is updated
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading recent registrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center p-4 bg-red-500/20 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-8 px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32 scroll-smooth">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Recent Registrations</h1>
                <p className="text-gray-300">Manage registrations from September 22, 2025 onwards</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => fetchRecentRegistrations(false)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          {/* Stats */}
          {data?.stats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-xl font-bold">{data.stats.totalRegistrations}</p>
                <p className="text-xs text-gray-300">Total</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p className="text-xl font-bold">{data.stats.enteredCount}</p>
                <p className="text-xs text-gray-300">Entered</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <UserCheck className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p className="text-xl font-bold">{data.stats.validatedCount}</p>
                <p className="text-xs text-gray-300">Validated</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <Mail className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <p className="text-xl font-bold">{data.stats.emailSentCount}</p>
                <p className="text-xs text-gray-300">Email Sent</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-pink-400" />
                <p className="text-xl font-bold">{data.stats.teamLeaderCount}</p>
                <p className="text-xs text-gray-300">Team Leaders</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <Building className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                <p className="text-xl font-bold">{data.stats.supportStaffCount}</p>
                <p className="text-xs text-gray-300">Support Staff</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </h3>
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-gray-300 hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium">Filters</span>
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>
            </div>

            {/* Always visible search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, contact, or university..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <motion.div
              initial={false}
              animate={{
                height: showFilters ? 'auto' : 0,
                opacity: showFilters ? 1 : 0
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut'
              }}
              className="overflow-hidden"
            >
              {showFilters && (
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
                >
                <div>
                  <label className="block text-sm font-medium mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">User Type</label>
                  <div className="relative">
                    <select
                      value={filters.userType}
                      onChange={(e) => handleFilterChange('userType', e.target.value)}
                      disabled={filterLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-white/15 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="all" className="bg-gray-800">All Types</option>
                      <option value="participant" className="bg-gray-800">Participant</option>
                      <option value="support_staff" className="bg-gray-800">Support Staff</option>
                      <option value="flagship_visitor" className="bg-gray-800">Flagship Visitor</option>
                      <option value="flagship_solo_visitor" className="bg-gray-800">Flagship Solo Visitor</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Entry Status</label>
                  <div className="relative">
                    <select
                      value={filters.hasEntered}
                      onChange={(e) => handleFilterChange('hasEntered', e.target.value)}
                      disabled={filterLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-white/15 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="all" className="bg-gray-800">All</option>
                      <option value="true" className="bg-gray-800">Entered</option>
                      <option value="false" className="bg-gray-800">Not Entered</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Event Filter</label>
                  <div className="relative">
                    <select
                      value={filters.eventFilter}
                      onChange={(e) => handleFilterChange('eventFilter', e.target.value)}
                      disabled={filterLoading}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-white/15 transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="all">All Events</option>
                      {staticEvents.map((eventName) => (
                        <option key={eventName} value={eventName} className="bg-gray-800">
                          {eventName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Registrations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden relative"
        >
          <div className="overflow-x-auto scroll-smooth scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Registration Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Team Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data?.data.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                          {user.contactNo && (
                            <div className="text-xs text-gray-500 flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{user.contactNo}</span>
                            </div>
                          )}
                          {user.universityName && (
                            <div className="text-xs text-gray-500 flex items-center space-x-1">
                              <Building className="w-3 h-3" />
                              <span>{user.universityName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.userType === 'participant' ? 'bg-blue-600' :
                            user.userType === 'support_staff' ? 'bg-purple-600' :
                            'bg-green-600'
                          } text-white`}>
                            {user.userType.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {user.hasEntered ? (
                            <CheckCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-green-400" />
                          )}
                          <span className={`text-xs ${user.hasEntered ? 'text-red-400' : 'text-green-400'}`}>
                            {user.hasEntered ? 'Entered' : 'Can Enter'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.isvalidated ? (
                            <UserCheck className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className={`text-xs ${user.isvalidated ? 'text-green-400' : 'text-yellow-400'}`}>
                            {user.isvalidated ? 'Validated' : 'Unvalidated'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.emailSent ? (
                            <Mail className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Mail className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`text-xs ${user.emailSent ? 'text-blue-400' : 'text-gray-400'}`}>
                            {user.emailSent ? 'Email Sent' : 'No Email'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-300">
                          Events: {user.events.length}
                        </div>
                        {user.teamInfo.length > 0 && (
                          <div className="space-y-1">
                            {user.teamInfo.slice(0, 2).map((team, idx) => (
                              <div key={idx} className="text-xs">
                                <span className={`px-1 py-0.5 rounded text-white ${
                                  team.isLeader ? 'bg-purple-600' : 'bg-blue-600'
                                }`}>
                                  {team.isLeader ? 'Leader' : 'Member'}
                                </span>
                                <span className="ml-1 text-gray-300">{team.teamName}</span>
                              </div>
                            ))}
                            {user.teamInfo.length > 2 && (
                              <div className="text-xs text-gray-400">
                                +{user.teamInfo.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => fetchUserDetails(user._id)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!user.hasEntered && (
                          <button
                            onClick={() => allowEntry(user._id)}
                            disabled={processingEntry === user._id}
                            className="p-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors"
                            title="Allow Entry"
                          >
                            {processingEntry === user._id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  Showing {((data.pagination.currentPage - 1) * data.pagination.limit) + 1} to{' '}
                  {Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.totalCount)} of{' '}
                  {data.pagination.totalCount} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                    disabled={!data.pagination.hasPrev}
                    className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">
                    {data.pagination.currentPage} / {data.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                    disabled={!data.pagination.hasNext}
                    className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {data?.data.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Registrations Found</h3>
              <p className="text-gray-400">
                No users match your current filter criteria.
              </p>
            </div>
          )}
        </motion.div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">
                      User Registration Details
                    </h3>
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 px-6 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                        Basic Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-400">Name:</span> <span className="text-white">{selectedUser.name}</span></div>
                        <div><span className="text-gray-400">Email:</span> <span className="text-white">{selectedUser.email}</span></div>
                        <div><span className="text-gray-400">Contact:</span> <span className="text-white">{selectedUser.contactNo || 'N/A'}</span></div>
                        <div><span className="text-gray-400">Gender:</span> <span className="text-white">{selectedUser.gender || 'N/A'}</span></div>
                        <div><span className="text-gray-400">Age:</span> <span className="text-white">{selectedUser.age || 'N/A'}</span></div>
                        <div><span className="text-gray-400">University:</span> <span className="text-white">{selectedUser.universityName || 'N/A'}</span></div>
                        <div><span className="text-gray-400">User Type:</span> <span className="text-white">{selectedUser.userType}</span></div>
                        <div><span className="text-gray-400">Registered:</span> <span className="text-white">{new Date(selectedUser.createdAt).toLocaleString()}</span></div>
                      </div>
                    </div>

                    {/* Status Info */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                        Status Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Entry Status:</span>
                          {selectedUser.hasEntered ? (
                            <span className="text-red-400 flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Entered at {selectedUser.entryTime ? new Date(selectedUser.entryTime).toLocaleString() : 'Unknown'}</span>
                            </span>
                          ) : (
                            <span className="text-green-400 flex items-center space-x-1">
                              <XCircle className="w-4 h-4" />
                              <span>Not entered</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Validation:</span>
                          {selectedUser.isvalidated ? (
                            <span className="text-green-400">Validated</span>
                          ) : (
                            <span className="text-yellow-400">Unvalidated</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Email Status:</span>
                          {selectedUser.emailSent ? (
                            <span className="text-blue-400">Sent at {selectedUser.emailSentAt ? new Date(selectedUser.emailSentAt).toLocaleString() : 'Unknown'}</span>
                          ) : (
                            <span className="text-gray-400">Not sent</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Events */}
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-4">
                      Registered Events ({selectedUser.events.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.events.map((event, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Team Participations */}
                  {selectedUser.teamParticipations && selectedUser.teamParticipations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-4">
                        Team Participations
                      </h4>
                      <div className="space-y-3">
                        {selectedUser.teamParticipations.map((team, idx) => (
                          <div key={idx} className="bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-white">{team.teamName}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                team.role === 'Team Leader' ? 'bg-purple-600' : 'bg-blue-600'
                              } text-white`}>
                                {team.role}
                              </span>
                            </div>
                            <div className="text-sm text-gray-300">
                              <div>Event: {team.eventName}</div>
                              <div>Team Size: {team.totalMembers}</div>
                              <div>Created: {new Date(team.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registration Timeline */}
                  {selectedUser.registrationTimeline && selectedUser.registrationTimeline.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-4">
                        Registration Timeline
                      </h4>
                      <div className="space-y-3">
                        {selectedUser.registrationTimeline.map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                              <div className="text-white font-medium">{item.type}</div>
                              <div className="text-gray-300 text-sm">{item.description}</div>
                              <div className="text-gray-400 text-xs">{new Date(item.date).toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-700 px-6 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Loading Popup */}
        {filterLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 flex flex-col items-center space-y-4 max-w-sm mx-4"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Fetching Data</h3>
                <p className="text-gray-300 text-sm">Applying filters and loading updated results...</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap with admin protection
export default function ProtectedRecentRegistrations() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <RecentRegistrations />
    </ProtectedRoute>
  );
}
