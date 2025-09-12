"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Mail, 
  MailCheck, 
  Clock, 
  Send, 
  Users, 
  UserCheck,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import createApiUrl from '../../../lib/api';
import ProtectedRoute from '../../../../components/ProtectedRoute';

interface User {
  _id: string;
  name: string;
  email: string;
  contactNo: string;
  universityName: string;
  events: string[];
  teamId?: string;
  isMainPerson: boolean;
  teamSize: number;
  emailSent: boolean;
  emailSentAt: string | null;
  emailSentBy: {
    _id: string;
    name: string;
    email: string;
  } | null;
  hasEntered: boolean;
  entryTime: string | null;
  isvalidated: boolean;
  qrPath: string;
  createdAt: string;
}

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  contactNo: string;
  universityName: string;
  events: string[];
  mainPersonId: {
    _id: string;
    name: string;
    email: string;
    teamId: string;
  };
  emailSent: boolean;
  emailSentAt: string | null;
  emailSentBy: {
    _id: string;
    name: string;
    email: string;
  } | null;
  hasEntered: boolean;
  entryTime: string | null;
  isvalidated: boolean;
  qrPath: string;
  createdAt: string;
}

interface EmailStats {
  totalUsers: number;
  emailsSent: number;
  emailsPending: number;
  totalTeamMembers: number;
}

interface BulkEmailResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: string[];
}

function EmailManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'team-members'>('users');
  const [processingEmails, setProcessingEmails] = useState<Set<string>>(new Set());
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkEmailResult | null>(null);
  const [showBulkResults, setShowBulkResults] = useState(false);

  useEffect(() => {
    fetchEmailData();
  }, []);

  const fetchEmailData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersResponse, teamMembersResponse] = await Promise.all([
        fetch(createApiUrl('/admin/users-email-status'), {
          credentials: 'include'
        }),
        fetch(createApiUrl('/admin/team-members-email-status'), {
          credentials: 'include'
        })
      ]);

      if (!usersResponse.ok || !teamMembersResponse.ok) {
        throw new Error('Failed to fetch email data');
      }

      const usersData = await usersResponse.json();
      const teamMembersData = await teamMembersResponse.json();

      if (usersData.success) {
        setUsers(usersData.users);
      }
      if (teamMembersData.success) {
        setTeamMembers(teamMembersData.teamMembers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load email data');
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (userId: string, userType: 'user' | 'team-member') => {
    setProcessingEmails(prev => new Set(prev).add(userId));
    
    try {
      const response = await fetch(createApiUrl(`/admin/send-email/${userId}`), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        if (userType === 'user') {
          setUsers(users.map(user => 
            user._id === userId 
              ? { ...user, emailSent: true, emailSentAt: result.emailSentAt }
              : user
          ));
        } else {
          setTeamMembers(teamMembers.map(member => 
            member._id === userId 
              ? { ...member, emailSent: true, emailSentAt: result.emailSentAt }
              : member
          ));
        }
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email');
    } finally {
      setProcessingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const sendBulkEmails = async (targetType: 'users' | 'team-members' | 'both') => {
    setBulkSending(true);
    setBulkResults(null);
    setShowBulkResults(false);
    
    try {
      const response = await fetch(createApiUrl('/admin/send-bulk-emails'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetType })
      });

      const result = await response.json();
      
      if (result.success) {
        setBulkResults(result.results);
        setShowBulkResults(true);
        // Refresh data to show updated email statuses
        await fetchEmailData();
        alert(`✅ Bulk email sending completed! ${result.results.successful} sent, ${result.results.failed} failed.`);
      } else {
        alert(`❌ Bulk email sending failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to send bulk emails:', error);
      alert('Failed to send bulk emails');
    } finally {
      setBulkSending(false);
    }
  };

  const resetEmailStatus = async (userId: string, userType: 'user' | 'team-member') => {
    if (!confirm('Are you sure you want to reset the email status? This will allow sending the email again.')) {
      return;
    }

    try {
      const response = await fetch(createApiUrl(`/admin/reset-email-status/${userId}`), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        if (userType === 'user') {
          setUsers(users.map(user => 
            user._id === userId 
              ? { ...user, emailSent: false, emailSentAt: null, emailSentBy: null }
              : user
          ));
        } else {
          setTeamMembers(teamMembers.map(member => 
            member._id === userId 
              ? { ...member, emailSent: false, emailSentAt: null, emailSentBy: null }
              : member
          ));
        }
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to reset email status:', error);
      alert('Failed to reset email status');
    }
  };

  const getEmailStats = (): EmailStats => {
    return {
      totalUsers: users.length,
      emailsSent: users.filter(u => u.emailSent).length + teamMembers.filter(m => m.emailSent).length,
      emailsPending: users.filter(u => !u.emailSent).length + teamMembers.filter(m => !m.emailSent).length,
      totalTeamMembers: teamMembers.length
    };
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = getEmailStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading email data...</p>
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
            onClick={fetchEmailData}
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
                <h1 className="text-3xl font-bold">Email Management</h1>
                <p className="text-gray-300">Send registration emails to users and team members</p>
              </div>
            </div>
            <button
              onClick={fetchEmailData}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers + stats.totalTeamMembers}</p>
                  <p className="text-sm text-gray-300">Total Recipients</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <MailCheck className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.emailsSent}</p>
                  <p className="text-sm text-gray-300">Emails Sent</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.emailsPending}</p>
                  <p className="text-sm text-gray-300">Pending Emails</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <UserCheck className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalTeamMembers}</p>
                  <p className="text-sm text-gray-300">Team Members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="mb-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Bulk Email Actions</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => sendBulkEmails('users')}
                disabled={bulkSending}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                {bulkSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send to All Users</span>
              </button>
              <button
                onClick={() => sendBulkEmails('team-members')}
                disabled={bulkSending}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                {bulkSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send to Team Members</span>
              </button>
              <button
                onClick={() => sendBulkEmails('both')}
                disabled={bulkSending}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                {bulkSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send to Everyone</span>
              </button>
            </div>
            {bulkSending && (
              <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  <span className="text-blue-400">Sending bulk emails... This may take a few minutes.</span>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Results */}
          {showBulkResults && bulkResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Bulk Email Results</span>
                </h3>
                <button
                  onClick={() => setShowBulkResults(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{bulkResults.successful}</div>
                  <div className="text-sm text-green-300">Successful</div>
                </div>
                <div className="text-center p-3 bg-red-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">{bulkResults.failed}</div>
                  <div className="text-sm text-red-300">Failed</div>
                </div>
                <div className="text-center p-3 bg-blue-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{bulkResults.totalProcessed}</div>
                  <div className="text-sm text-blue-300">Total Processed</div>
                </div>
              </div>
              {bulkResults.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-red-400 mb-2">Errors:</h4>
                  <div className="max-h-32 overflow-y-auto bg-red-500/10 rounded-lg p-3">
                    {bulkResults.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-300 mb-1">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Main Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('team-members')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'team-members'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Team Members ({teamMembers.length})
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'users' ? 'users' : 'team members'} by name, email, or university...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Users/Team Members Table */}
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
                    {activeTab === 'users' ? 'User' : 'Team Member'} Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Registration Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {(activeTab === 'users' ? filteredUsers : filteredTeamMembers).map((person) => (
                  <tr key={person._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {person.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">{person.name}</span>
                            {activeTab === 'users' && (person as User).isMainPerson && (person as User).teamId && (
                              <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                                Team Leader
                              </span>
                            )}
                            {activeTab === 'team-members' && (
                              <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full">
                                Team Member
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{person.email}</div>
                          <div className="text-xs text-gray-500">{person.universityName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {person.emailSent ? (
                          <>
                            <MailCheck className="w-5 h-5 text-green-400" />
                            <div>
                              <span className="text-green-400 font-semibold">Sent</span>
                              <div className="text-xs text-gray-400">
                                {person.emailSentAt 
                                  ? new Date(person.emailSentAt).toLocaleString()
                                  : 'Time unknown'
                                }
                              </div>
                              {person.emailSentBy && (
                                <div className="text-xs text-gray-500">
                                  by {person.emailSentBy.name}
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 font-semibold">Pending</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            {person.events.length}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">Events</div>
                        </div>
                        {activeTab === 'users' && (person as User).teamSize > 1 && (
                          <div className="text-center">
                            <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              {(person as User).teamSize}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Team Size</div>
                          </div>
                        )}
                        <div className="text-center">
                          <div className={`px-2 py-1 rounded text-xs font-semibold ${
                            person.hasEntered ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                          }`}>
                            {person.hasEntered ? 'Entered' : 'Not Entered'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">Entry Status</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {!person.emailSent ? (
                          <button
                            onClick={() => sendEmail(person._id, activeTab === 'users' ? 'user' : 'team-member')}
                            disabled={processingEmails.has(person._id)}
                            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
                          >
                            {processingEmails.has(person._id) ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>Send Email</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => resetEmailStatus(person._id, activeTab === 'users' ? 'user' : 'team-member')}
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Reset Status</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {(activeTab === 'users' ? filteredUsers : filteredTeamMembers).length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No {activeTab === 'users' ? 'Users' : 'Team Members'} Found</h3>
              <p className="text-gray-400">
                {searchTerm 
                  ? `No ${activeTab === 'users' ? 'users' : 'team members'} match your search criteria.` 
                  : `No ${activeTab === 'users' ? 'users' : 'team members'} have registered yet.`
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Wrap with admin protection
export default function ProtectedEmailManagement() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <EmailManagement />
    </ProtectedRoute>
  );
}
