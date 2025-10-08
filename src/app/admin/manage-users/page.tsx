'use client';

import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  contactNo: string;
  gender: string;
  age: number;
  universityName: string;
  address: string;
  events: string[];
  userType: string;
  isvalidated: boolean;
  hasEntered: boolean;
  entryTime?: string;
  emailSent: boolean;
  emailSentAt?: string;
  createdAt: string;
  teamParticipations: any[];
  purchaseHistory: any[];
  totalAmountPaid: number;
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
  const [stats, setStats] = useState({
    totalUsers: 0,
    validatedUsers: 0,
    enteredUsers: 0,
    emailSentUsers: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, [currentPage, eventFilter, statusFilter, userTypeFilter, sortBy, sortOrder]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
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

      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
        setStats(data.stats);
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

  const exportUsers = async () => {
    try {
      const params = new URLSearchParams({
        eventFilter,
        format: 'csv'
      });

      const response = await fetch(`/api/admin/export/users?${params}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Error exporting users');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
              <p className="text-gray-600">View, search, edit, and manage user accounts</p>
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
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Validated</p>
                <p className="text-xl font-bold text-gray-900">{stats.validatedUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Entered</p>
                <p className="text-xl font-bold text-gray-900">{stats.enteredUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Email Sent</p>
                <p className="text-xl font-bold text-gray-900">{stats.emailSentUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Name, email, contact..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Filter</label>
              <select
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
              <select
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div className="flex space-x-2">
                <select
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="createdAt">Created Date</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="universityName">University</option>
                </select>
                <select
                  className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Search className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Users</h2>
                <p className="text-sm text-gray-600">
                  Showing {users.length} of {totalCount} users
                </p>
              </div>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.contactNo}</div>
                          {user.universityName && (
                            <div className="text-xs text-gray-400">{user.universityName}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.events.map((event, index) => (
                            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{formatDateTime(user.createdAt)}</div>
                          {user.totalAmountPaid > 0 && (
                            <div className="text-xs text-green-600">
                              Paid: ₹{user.totalAmountPaid}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link href={`/admin/manage-users/edit/${user._id}`}>
                            <button className="text-green-600 hover:text-green-900" title="Edit User">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => setShowDeleteConfirm(user._id)}
                            className="text-red-600 hover:text-red-900"
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
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
                      <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                      <p><span className="font-medium">Contact:</span> {selectedUser.contactNo}</p>
                      <p><span className="font-medium">Gender:</span> {selectedUser.gender}</p>
                      <p><span className="font-medium">Age:</span> {selectedUser.age}</p>
                      <p><span className="font-medium">University:</span> {selectedUser.universityName}</p>
                      <p><span className="font-medium">Address:</span> {selectedUser.address}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Account Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">User Type:</span> {selectedUser.userType}</p>
                      <p><span className="font-medium">Created:</span> {formatDateTime(selectedUser.createdAt)}</p>
                      <p><span className="font-medium">Validated:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedUser.isvalidated)}`}>
                          {selectedUser.isvalidated ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p><span className="font-medium">Entered:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedUser.hasEntered)}`}>
                          {selectedUser.hasEntered ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p><span className="font-medium">Email Sent:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedUser.emailSent)}`}>
                          {selectedUser.emailSent ? 'Yes' : 'No'}
                        </span>
                      </p>
                      <p><span className="font-medium">Total Paid:</span> ₹{selectedUser.totalAmountPaid}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Registered Events</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.events.map((event, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedUser.teamParticipations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Team Participations</h4>
                    <div className="space-y-2">
                      {selectedUser.teamParticipations.map((team, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p><span className="font-medium">Team:</span> {team.teamName}</p>
                          <p><span className="font-medium">Event:</span> {team.eventName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUser.purchaseHistory.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Purchase History</h4>
                    <div className="space-y-2">
                      {selectedUser.purchaseHistory.map((purchase, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p><span className="font-medium">Order ID:</span> {purchase.orderId}</p>
                          <p><span className="font-medium">Amount:</span> ₹{purchase.totalAmount}</p>
                          <p><span className="font-medium">Status:</span> 
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              purchase.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {purchase.paymentStatus}
                            </span>
                          </p>
                          <p><span className="font-medium">Date:</span> {formatDateTime(purchase.purchaseDate)}</p>
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this user? This action cannot be undone and will remove all user data.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for deletion (required)
                  </label>
                  <textarea
                    id="deleteReason"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter reason for deleting this user..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
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
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
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