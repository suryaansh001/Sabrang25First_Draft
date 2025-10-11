"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Award,
  BarChart3,
  RefreshCw,
  Download,
  Search,
  Filter
} from "lucide-react";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import createApiUrl from "../../../lib/api";

interface MemberReferral {
  rollNumber: string;
  referralCount: number;
  referredUsers: Array<{
    name: string;
    email: string;
    events: string[];
    createdAt: string;
  }>;
}

interface CommitteeData {
  committeeName: string;
  totalMembers: number;
  totalReferrals: number;
  memberReferrals: MemberReferral[];
}

interface SummaryData {
  totalCommittees: number;
  totalMembers: number;
  totalReferrals: number;
  topPerformingCommittee: CommitteeData | null;
  averageReferralsPerCommittee: string;
}

function CommitteeReferralsPage() {
  const [data, setData] = useState<CommitteeData[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'referrals' | 'members'>('referrals');
  const [expandedCommittee, setExpandedCommittee] = useState<string | null>(null);

  useEffect(() => {
    fetchCommitteeReferrals();
  }, []);

  const fetchCommitteeReferrals = async () => {
    try {
      setLoading(true);
      const response = await fetch(createApiUrl('/admin/committee-referrals'), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
        setSummary(result.summary);
      } else {
        console.error('Failed to fetch committee referrals');
      }
    } catch (error) {
      console.error('Error fetching committee referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data
    .filter(committee => 
      committee.committeeName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.committeeName.localeCompare(b.committeeName);
        case 'referrals':
          return b.totalReferrals - a.totalReferrals;
        case 'members':
          return b.totalMembers - a.totalMembers;
        default:
          return 0;
      }
    });

  const exportData = () => {
    const csvContent = [
      ['Committee Name', 'Total Members', 'Total Referrals', 'Top Referrer', 'Top Referrer Count'].join(','),
      ...filteredData.map(committee => [
        committee.committeeName,
        committee.totalMembers,
        committee.totalReferrals,
        committee.memberReferrals[0]?.rollNumber || 'N/A',
        committee.memberReferrals[0]?.referralCount || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'committee-referrals.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCommitteeColor = (index: number) => {
    const colors = [
      'from-emerald-500 to-teal-600',
      'from-blue-500 to-cyan-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-indigo-500 to-purple-600',
      'from-green-500 to-emerald-600',
      'from-yellow-500 to-orange-600',
      'from-pink-500 to-rose-600'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading committee referral data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full text-white font-sans bg-black">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-cyan-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[40rem] bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 pt-20 pb-16 px-4">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin" 
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Committee Referrals
                  </span>
                </h1>
                <p className="mt-2 text-sm text-gray-300">
                  Track referral performance across all committees
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchCommitteeReferrals}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 transition hover:from-emerald-600 hover:to-teal-700"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          {summary && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4 backdrop-blur-md">
                <Users className="w-8 h-8 mb-2 text-blue-400" />
                <p className="text-2xl font-bold tracking-tight">{summary.totalCommittees}</p>
                <p className="text-xs text-gray-300">Total Committees</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4 backdrop-blur-md">
                <Users className="w-8 h-8 mb-2 text-green-400" />
                <p className="text-2xl font-bold tracking-tight">{summary.totalMembers}</p>
                <p className="text-xs text-gray-300">Total Members</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4 backdrop-blur-md">
                <TrendingUp className="w-8 h-8 mb-2 text-purple-400" />
                <p className="text-2xl font-bold tracking-tight">{summary.totalReferrals}</p>
                <p className="text-xs text-gray-300">Total Referrals</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-4 backdrop-blur-md">
                <Award className="w-8 h-8 mb-2 text-yellow-400" />
                <p className="text-2xl font-bold tracking-tight">{summary.averageReferralsPerCommittee}</p>
                <p className="text-xs text-gray-300">Avg per Committee</p>
              </div>
            </div>
          )}

          {/* Top Performing Committee */}
          {summary?.topPerformingCommittee && (
            <div className="mb-8 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-3">
                <Award className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-bold">Top Performing Committee</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-400">
                    {summary.topPerformingCommittee.committeeName}
                  </h3>
                  <p className="text-gray-300">
                    {summary.topPerformingCommittee.totalReferrals} referrals from {summary.topPerformingCommittee.totalMembers} members
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-400">
                    {summary.topPerformingCommittee.totalReferrals}
                  </div>
                  <div className="text-sm text-gray-300">referrals</div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search committees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:border-white/20"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'referrals' | 'members')}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white focus:outline-none focus:border-white/20"
            >
              <option value="referrals">Sort by Referrals</option>
              <option value="name">Sort by Name</option>
              <option value="members">Sort by Members</option>
            </select>
          </div>

          {/* Committee Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredData.map((committee, index) => (
              <div
                key={committee.committeeName}
                className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCommitteeColor(index)}`} />
                      <h3 className="text-lg font-semibold">{committee.committeeName}</h3>
                    </div>
                    <button
                      onClick={() => setExpandedCommittee(
                        expandedCommittee === committee.committeeName ? null : committee.committeeName
                      )}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      {expandedCommittee === committee.committeeName ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{committee.totalMembers}</div>
                      <div className="text-xs text-gray-400">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{committee.totalReferrals}</div>
                      <div className="text-xs text-gray-400">Referrals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {committee.totalMembers > 0 ? (committee.totalReferrals / committee.totalMembers).toFixed(1) : '0'}
                      </div>
                      <div className="text-xs text-gray-400">Avg/Member</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Referral Performance</span>
                      <span>{committee.totalReferrals} referrals</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getCommitteeColor(index)} transition-all duration-500`}
                        style={{
                          width: `${Math.min((committee.totalReferrals / (summary?.totalReferrals || 1)) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Top Performers */}
                  {committee.memberReferrals.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Top Performers</h4>
                      <div className="space-y-2">
                        {committee.memberReferrals.slice(0, 3).map((member, idx) => (
                          member.referralCount > 0 && (
                            <div key={member.rollNumber} className="flex items-center justify-between text-sm">
                              <span className="text-gray-300">{member.rollNumber}</span>
                              <span className="text-emerald-400 font-medium">{member.referralCount} referrals</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedCommittee === committee.committeeName && (
                  <div className="border-t border-white/10 p-6 bg-white/5">
                    <h4 className="text-lg font-semibold mb-4">All Members</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {committee.memberReferrals.map((member) => (
                        <div
                          key={member.rollNumber}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div>
                            <div className="font-medium">{member.rollNumber}</div>
                            {member.referralCount > 0 && (
                              <div className="text-xs text-gray-400">
                                {member.referredUsers.length} users referred
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-400">
                              {member.referralCount}
                            </div>
                            <div className="text-xs text-gray-400">referrals</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No committees found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProtectedCommitteeReferralsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <CommitteeReferralsPage />
    </ProtectedRoute>
  );
}
