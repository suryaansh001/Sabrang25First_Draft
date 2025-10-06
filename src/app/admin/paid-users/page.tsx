"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import createApiUrl from "../../../lib/api";

interface PaidUser {
  _id: string;
  name: string;
  email: string;
  contactNo: string;
  universityName: string;
  events: string[];
  paymentCompletedAt: string;
  totalPurchaseAmount: number;
  registeredEvents: string[];
  teamCount: number;
  hasEntered: boolean;
  entryTime?: string;
  idCardImagePath?: string;
  idCardVerified?: boolean;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNext: boolean;
  hasPrev: boolean;
}

function PaidUsersPage() {
  const [users, setUsers] = useState<PaidUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [summary, setSummary] = useState({ totalPaidUsers: 0, totalRevenue: 0 });

  useEffect(() => {
    fetchPaidUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fetchPaidUsers = async (page: number, search: string = '') => {
    try {
      setLoading(true);
      const response = await fetch(
        createApiUrl(`/admin/paid-users?page=${page}&limit=10&search=${encodeURIComponent(search)}`),
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
        setPagination(data.data.pagination);
        setSummary(data.data.summary);
      } else {
        console.error('Failed to fetch paid users');
      }
    } catch (error) {
      console.error('Error fetching paid users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPaidUsers(1, searchTerm);
  };

  const exportToCsv = async () => {
    try {
      const response = await fetch(
        createApiUrl('/admin/export/paid-users'),
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paid-users-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16 pl-6 pr-6 md:pl-8 md:pr-8 lg:pl-12 lg:pr-12 text-white font-sans bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">
              Paid Users Management
            </h1>
            <p className="text-gray-300">View and manage users with confirmed payments</p>
          </div>
          <button
            onClick={exportToCsv}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-green-400" />
              <span className="text-lg font-semibold">Total Paid Users</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{summary.totalPaidUsers}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-8 h-8 text-blue-400" />
              <span className="text-lg font-semibold">Total Revenue</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">₹{summary.totalRevenue}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-purple-400" />
              <span className="text-lg font-semibold">Conversion Rate</span>
            </div>
            <p className="text-3xl font-bold text-purple-400">
              {summary.totalPaidUsers > 0 ? ((summary.totalPaidUsers / (summary.totalPaidUsers + 100)) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="mt-2 text-gray-300">Loading paid users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User Details</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">University</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Events</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Payment</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <p className="text-sm text-gray-400">{user.contactNo}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm">{user.universityName || 'Not specified'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.registeredEvents.length > 0 ? (
                              user.registeredEvents.slice(0, 2).map((event, idx) => (
                                <span key={idx} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                  {event}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">No events</span>
                            )}
                            {user.registeredEvents.length > 2 && (
                              <span className="text-xs text-gray-400">+{user.registeredEvents.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-green-400">₹{user.totalPurchaseAmount}</p>
                            <p className="text-xs text-gray-400">{formatDate(user.paymentCompletedAt)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {user.hasEntered ? (
                              <span className="flex items-center gap-1 text-green-400 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Entered
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-yellow-400 text-sm">
                                <Clock className="w-4 h-4" />
                                Pending
                              </span>
                            )}
                            {user.idCardImagePath && (
                              <span className={`flex items-center gap-1 text-sm ${
                                user.idCardVerified ? 'text-green-400' : 'text-orange-400'
                              }`}>
                                <FileText className="w-4 h-4" />
                                {user.idCardVerified ? 'ID Verified' : 'ID Pending'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => window.open(`/admin/paid-user/${user._id}`, '_blank')}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPrev}
                      className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="flex items-center px-3 py-2 bg-blue-600 rounded-lg">
                      {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={!pagination.hasNext}
                      className="flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProtectedPaidUsersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <PaidUsersPage />
    </ProtectedRoute>
  );
}
