"use client";
import React, { useEffect, useState } from 'react';
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
  ChevronRight,
  FileSpreadsheet,
  BarChart3,
  Settings,
  Globe,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import createApiUrl from '../../../lib/api';
import ProtectedRoute from '../../../../components/ProtectedRoute';

interface Registration {
  id: string;
  name: string;
  email: string;
  contactNo?: string;
  gender?: string;
  age?: number;
  universityName?: string;
  address?: string;
  events: string[];
  userType: string;
  supportRole?: string;
  visitorPassDays?: number;
  isvalidated: boolean;
  hasEntered: boolean;
  entryTime?: string;
  emailSent: boolean;
  emailSentAt?: string;
  qrPath?: string;
  qrCodeBase64?: string;
  createdAt: string;
  updatedAt: string;
  registrationType: 'individual' | 'team-leader' | 'team-member';
  teamInfo: {
    teamId: string;
    teamName: string;
    eventName: string;
    teamLeaderName?: string;
    teamLeaderEmail?: string;
    totalMembers: number;
    registrationComplete: boolean;
    paymentStatus: string;
    role?: string;
  }[];
  purchases: {
    orderId: string;
    totalAmount: number;
    paymentStatus: string;
    purchaseDate: string;
    items: any[];
    promoCode?: string;
  }[];
  totalAmountPaid: number;
  referralCode?: string;
}

interface Stats {
  totalRegistrations: number;
  individualRegistrations: number;
  teamLeaders: number;
  teamMembers: number;
  validatedUsers: number;
  enteredUsers: number;
  emailsSent: number;
  qrCodesGenerated: number;
  totalRevenue: number;
  eventBreakdown: Record<string, number>;
  universityBreakdown: Record<string, number>;
  userTypeBreakdown: Record<string, number>;
}

function AllRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter states - all filtering done on frontend
  const [filters, setFilters] = useState({
    search: '',
    userType: 'all',
    hasEntered: 'all',
    isValidated: 'all',
    emailSent: 'all',
    eventFilter: 'all',
    university: 'all',
    gender: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Get unique values for filter dropdowns
  const getUniqueValues = (key: keyof Registration): string[] => {
    const values = registrations
      .map(reg => reg[key])
      .filter((value, index, self) => value && self.indexOf(value) === index)
      .map(value => String(value))
      .sort();
    return values;
  };

  useEffect(() => {
    fetchAllRegistrations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [registrations, filters]);

  const fetchAllRegistrations = async () => {
    setLoading(true);
    try {
      // Fetch all registrations in one API call
      const response = await fetch(createApiUrl('/admin/all-registrations'), {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }

      const data = await response.json();
      if (data.success) {
        setRegistrations(data.data);
        setStats(data.stats);
      } else {
        throw new Error(data.message || 'Failed to fetch registrations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...registrations];

    // Apply search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm) ||
        reg.email.toLowerCase().includes(searchTerm) ||
        reg.contactNo?.toLowerCase().includes(searchTerm) ||
        reg.universityName?.toLowerCase().includes(searchTerm) ||
        reg.events.some(event => event.toLowerCase().includes(searchTerm))
      );
    }

    // Apply other filters
    if (filters.userType !== 'all') {
      filtered = filtered.filter(reg => reg.userType === filters.userType);
    }

    if (filters.hasEntered !== 'all') {
      filtered = filtered.filter(reg => reg.hasEntered === (filters.hasEntered === 'true'));
    }

    if (filters.isValidated !== 'all') {
      filtered = filtered.filter(reg => reg.isvalidated === (filters.isValidated === 'true'));
    }

    if (filters.emailSent !== 'all') {
      filtered = filtered.filter(reg => reg.emailSent === (filters.emailSent === 'true'));
    }

    if (filters.eventFilter !== 'all') {
      filtered = filtered.filter(reg => reg.events.includes(filters.eventFilter));
    }

    if (filters.university !== 'all') {
      filtered = filtered.filter(reg => reg.universityName === filters.university);
    }

    if (filters.gender !== 'all') {
      filtered = filtered.filter(reg => reg.gender === filters.gender);
    }

    // Apply date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(reg => new Date(reg.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(reg => new Date(reg.createdAt) <= toDate);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'universityName':
          aValue = a.universityName || '';
          bValue = b.universityName || '';
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRegistrations(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = [
      'Name',
      'Email', 
      'Contact',
      'Gender',
      'Age',
      'University',
      'Address',
      'User Type',
      'Registration Date',
      'Events',
      'Team Info',
      'Has Entered',
      'Entry Time',
      'Is Validated',
      'Email Sent',
      'Email Sent At',
      'Total Purchases',
      'Total Amount'
    ];

    const csvData = filteredRegistrations.map(reg => [
      reg.name,
      reg.email,
      reg.contactNo || '',
      reg.gender || '',
      reg.age || '',
      reg.universityName || '',
      reg.address || '',
      reg.userType,
      new Date(reg.createdAt).toLocaleString(),
      reg.events.join('; '),
      reg.teamInfo.map(t => `${t.eventName}: ${t.teamName} (${t.role === 'Team Leader' ? 'Leader' : 'Member'})`).join('; '),
      reg.hasEntered ? 'Yes' : 'No',
      reg.entryTime ? new Date(reg.entryTime).toLocaleString() : '',
      reg.isvalidated ? 'Yes' : 'No',
      reg.emailSent ? 'Yes' : 'No',
      reg.emailSentAt ? new Date(reg.emailSentAt).toLocaleString() : '',
      reg.purchases?.length || 0,
      reg.totalAmountPaid || 0
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredRegistrations.slice(startIndex, endIndex);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading all registrations...</p>
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
          <button 
            onClick={fetchAllRegistrations}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-8 px-4">
      <div className="container mx-auto max-w-7xl">
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
                <h1 className="text-3xl font-bold">All Event Registrations</h1>
                <p className="text-gray-300">Complete registration management with client-side filtering</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export CSV ({filteredRegistrations.length} records)</span>
              </button>
              <button
                onClick={fetchAllRegistrations}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          {/* Stats Dashboard */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-xl font-bold">{stats.totalRegistrations}</p>
                <p className="text-xs text-gray-300">Total Registrations</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <p className="text-xl font-bold">{stats.enteredUsers}</p>
                <p className="text-xs text-gray-300">Entered</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <UserCheck className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p className="text-xl font-bold">{stats.validatedUsers}</p>
                <p className="text-xs text-gray-300">Validated</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <Mail className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <p className="text-xl font-bold">{stats.emailsSent}</p>
                <p className="text-xs text-gray-300">Email Sent</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-pink-400" />
                <p className="text-xl font-bold">₹{stats.totalRevenue}</p>
                <p className="text-xs text-gray-300">Revenue</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                <Globe className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                <p className="text-xl font-bold">{filteredRegistrations.length}</p>
                <p className="text-xs text-gray-300">Filtered Results</p>
              </div>
            </div>
          )}

          {/* Filters Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filters & Search</span>
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Search - Always visible */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, contact, university, or events..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">User Type</label>
                  <select
                    value={filters.userType}
                    onChange={(e) => handleFilterChange('userType', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="participant">Participant</option>
                    <option value="support_staff">Support Staff</option>
                    <option value="flagship_visitor">Flagship Visitor</option>
                    <option value="flagship_solo_visitor">Flagship Solo Visitor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Entry Status</label>
                  <select
                    value={filters.hasEntered}
                    onChange={(e) => handleFilterChange('hasEntered', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="true">Entered</option>
                    <option value="false">Not Entered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Validation Status</label>
                  <select
                    value={filters.isValidated}
                    onChange={(e) => handleFilterChange('isValidated', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="true">Validated</option>
                    <option value="false">Not Validated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Status</label>
                  <select
                    value={filters.emailSent}
                    onChange={(e) => handleFilterChange('emailSent', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="true">Email Sent</option>
                    <option value="false">Email Not Sent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">University</label>
                  <select
                    value={filters.university}
                    onChange={(e) => handleFilterChange('university', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Universities</option>
                    {getUniqueValues('universityName').map(uni => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Genders</option>
                    {getUniqueValues('gender').map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">Registration Date</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="universityName">University</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Order:</span>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Registrations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
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
                    Events & Teams
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {currentPageData.map((registration) => (
                  <tr key={registration.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {registration.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{registration.name}</div>
                          <div className="text-sm text-gray-400">{registration.email}</div>
                          {registration.contactNo && (
                            <div className="text-xs text-gray-500 flex items-center space-x-1">
                              <Phone className="w-3 h-3" />
                              <span>{registration.contactNo}</span>
                            </div>
                          )}
                          {registration.universityName && (
                            <div className="text-xs text-gray-500 flex items-center space-x-1">
                              <Building className="w-3 h-3" />
                              <span className="truncate max-w-32">{registration.universityName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{new Date(registration.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(registration.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            registration.userType === 'participant' ? 'bg-blue-600' :
                            registration.userType === 'support_staff' ? 'bg-purple-600' :
                            'bg-green-600'
                          } text-white`}>
                            {registration.userType.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        {registration.gender && (
                          <div className="text-xs text-gray-400 mt-1">
                            {registration.gender}{registration.age && `, ${registration.age}y`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {registration.hasEntered ? (
                            <CheckCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-green-400" />
                          )}
                          <span className={`text-xs ${registration.hasEntered ? 'text-red-400' : 'text-green-400'}`}>
                            {registration.hasEntered ? 'Entered' : 'Can Enter'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {registration.isvalidated ? (
                            <UserCheck className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className={`text-xs ${registration.isvalidated ? 'text-green-400' : 'text-yellow-400'}`}>
                            {registration.isvalidated ? 'Validated' : 'Unvalidated'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {registration.emailSent ? (
                            <Mail className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Mail className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={`text-xs ${registration.emailSent ? 'text-blue-400' : 'text-gray-400'}`}>
                            {registration.emailSent ? 'Email Sent' : 'No Email'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-xs text-gray-300">
                          Events: {registration.events.length}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {registration.events.slice(0, 2).map((event, idx) => (
                            <span key={idx} className="px-1 py-0.5 bg-indigo-600 text-white text-xs rounded">
                              {event.length > 12 ? event.substring(0, 12) + '...' : event}
                            </span>
                          ))}
                          {registration.events.length > 2 && (
                            <span className="text-xs text-gray-400">+{registration.events.length - 2}</span>
                          )}
                        </div>
                        {registration.teamInfo.length > 0 && (
                          <div className="space-y-1">
                            {registration.teamInfo.slice(0, 2).map((team, idx) => (
                              <div key={idx} className="text-xs">
                                <span className={`px-1 py-0.5 rounded text-white ${
                                  registration.registrationType === 'team-leader' ? 'bg-purple-600' : 'bg-blue-600'
                                }`}>
                                  {registration.registrationType === 'team-leader' ? 'L' : 'M'}
                                </span>
                                <span className="ml-1 text-gray-300">
                                  {team.teamName.length > 10 ? team.teamName.substring(0, 10) + '...' : team.teamName}
                                </span>
                              </div>
                            ))}
                            {registration.teamInfo.length > 2 && (
                              <div className="text-xs text-gray-400">
                                +{registration.teamInfo.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
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
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredRegistrations.length)} of {filteredRegistrations.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Registrations Found</h3>
              <p className="text-gray-400">
                {filters.search || Object.values(filters).some(v => v !== 'all' && v !== '') 
                  ? 'No registrations match your current filter criteria.'
                  : 'No registrations available.'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Registration Details Modal */}
        {showDetailsModal && selectedRegistration && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">
                      Registration Details - {selectedRegistration.name}
                    </h3>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 px-6 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                        Basic Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-400">Name:</span> <span className="text-white">{selectedRegistration.name}</span></div>
                        <div><span className="text-gray-400">Email:</span> <span className="text-white">{selectedRegistration.email}</span></div>
                        <div><span className="text-gray-400">Contact:</span> <span className="text-white">{selectedRegistration.contactNo || 'N/A'}</span></div>
                        <div><span className="text-gray-400">Gender:</span> <span className="text-white">{selectedRegistration.gender || 'N/A'}</span></div>
                        <div><span className="text-gray-400">Age:</span> <span className="text-white">{selectedRegistration.age || 'N/A'}</span></div>
                        <div><span className="text-gray-400">University:</span> <span className="text-white">{selectedRegistration.universityName || 'N/A'}</span></div>
                        <div><span className="text-gray-400">Address:</span> <span className="text-white">{selectedRegistration.address || 'N/A'}</span></div>
                        <div><span className="text-gray-400">User Type:</span> <span className="text-white">{selectedRegistration.userType}</span></div>
                        <div><span className="text-gray-400">Registration Type:</span> <span className="text-white">{selectedRegistration.registrationType}</span></div>
                        <div><span className="text-gray-400">Registered:</span> <span className="text-white">{new Date(selectedRegistration.createdAt).toLocaleString()}</span></div>
                        <div><span className="text-gray-400">Total Paid:</span> <span className="text-white">₹{selectedRegistration.totalAmountPaid}</span></div>
                      </div>
                    </div>

                    {/* Status Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                        Status Information
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Entry Status:</span>
                          {selectedRegistration.hasEntered ? (
                            <span className="text-red-400 flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Entered at {selectedRegistration.entryTime ? new Date(selectedRegistration.entryTime).toLocaleString() : 'Unknown'}</span>
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
                          {selectedRegistration.isvalidated ? (
                            <span className="text-green-400">Validated</span>
                          ) : (
                            <span className="text-yellow-400">Unvalidated</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">Email Status:</span>
                          {selectedRegistration.emailSent ? (
                            <span className="text-blue-400">Sent at {selectedRegistration.emailSentAt ? new Date(selectedRegistration.emailSentAt).toLocaleString() : 'Unknown'}</span>
                          ) : (
                            <span className="text-gray-400">Not sent</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">QR Code:</span>
                          <span className="text-white">{selectedRegistration.qrCodeBase64 === 'Available' ? 'Generated' : 'Not Generated'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Events */}
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-4">
                      Registered Events ({selectedRegistration.events.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedRegistration.events.map((event, idx) => (
                        <span key={idx} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Team Information */}
                  {selectedRegistration.teamInfo.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-4">
                        Team Participations ({selectedRegistration.teamInfo.length})
                      </h4>
                      <div className="space-y-3">
                        {selectedRegistration.teamInfo.map((team, idx) => (
                          <div key={idx} className="bg-gray-700 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-white">{team.teamName}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  selectedRegistration.registrationType === 'team-leader' ? 'bg-purple-600' : 'bg-blue-600'
                                } text-white`}>
                                  {selectedRegistration.registrationType === 'team-leader' ? 'Team Leader' : 'Team Member'}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  team.registrationComplete ? 'bg-green-600' : 'bg-yellow-600'
                                } text-white`}>
                                  {team.registrationComplete ? 'Complete' : 'Incomplete'}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-300">
                              <div>Event: {team.eventName}</div>
                              <div>Team Size: {team.totalMembers}</div>
                              <div>Team ID: {team.teamId}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Purchase Information */}
                  {selectedRegistration.purchases && selectedRegistration.purchases.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2 mb-4">
                        Purchase History ({selectedRegistration.purchases.length})
                      </h4>
                      <div className="space-y-3">
                        {selectedRegistration.purchases.map((purchase, idx) => (
                          <div key={idx} className="bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">{purchase.orderId}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-green-400 font-bold">₹{purchase.totalAmount}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  purchase.paymentStatus === 'completed' ? 'bg-green-600' : 
                                  purchase.paymentStatus === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                                } text-white`}>
                                  {purchase.paymentStatus.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(purchase.purchaseDate).toLocaleString()}
                              {purchase.promoCode && <span className="ml-2 text-yellow-400">Promo: {purchase.promoCode}</span>}
                            </div>
                          </div>
                        ))}
                        <div className="bg-gray-600 p-3 rounded-lg">
                          <div className="text-white font-semibold">
                            Total Spent: ₹{selectedRegistration.totalAmountPaid}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-700 px-6 py-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowDetailsModal(false)}
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
      </div>
    </div>
  );
}

// Wrap with admin protection
export default function ProtectedAllRegistrations() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AllRegistrations />
    </ProtectedRoute>
  );
}