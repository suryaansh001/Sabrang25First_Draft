"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaQrcode, FaUser, FaEnvelope, FaUsers, FaSearch } from 'react-icons/fa';
import createApiUrl from '../../lib/api';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  contactNo: string;
  gender: string;
  age: number;
  universityName: string;
  address: string;
  profileImage: string;
  qrPath: string;
  qrCodeBase64: string;
  hasEntered: boolean;
  entryTime: string | null;
  events: string[];
}

interface TeamData {
  teamId: string;
  mainPerson: {
    id: string;
    name: string;
    email: string;
    contactNo: string;
    gender: string;
    age: number;
    universityName: string;
    address: string;
    profileImage: string;
    qrPath: string;
    qrCodeBase64: string;
    hasEntered: boolean;
    entryTime: string | null;
    events: string[];
  };
  teamMembers: TeamMember[];
  teamSize: number;
  registeredEvents: any[];
}

function TicketPage() {
  const [email, setEmail] = useState('');
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError('');
    setTeamData(null);

    try {
      const response = await fetch(createApiUrl('/api/team-by-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch team data');
      }

      const data = await response.json();
      setTeamData(data.team);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team data');
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async (memberId: string, memberName: string) => {
    // Add to downloading set
    setDownloadingIds(prev => new Set(prev).add(memberId));
    
    try {
      const response = await fetch(createApiUrl(`/api/qrcode/${memberId}`), {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${memberName.replace(/[^a-zA-Z0-9]/g, '_')}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    } finally {
      // Remove from downloading set
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Team Tickets
          </h1>
          <p className="text-gray-400 text-lg">
            Enter team leader email to view and download QR codes for all team members
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Team Leader Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter team leader email address"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <FaSearch />
                )}
                <span>{loading ? 'Searching...' : 'Search Team'}</span>
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
            >
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Team Data Display */}
        {teamData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Team Overview */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Team Overview</h2>
                <p className="text-gray-400">
                  Team Size: {teamData.teamSize} members
                </p>
              </div>

              {/* Registered Events */}
              {teamData.registeredEvents.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Registered Events:</h3>
                  <div className="flex flex-wrap gap-2">
                    {teamData.registeredEvents.map((event, index) => (
                      <span
                        key={index}
                        className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                      >
                        {event.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Team Leader */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <FaUser className="text-yellow-400" />
                <span>Team Leader</span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p><span className="font-semibold">Name:</span> {teamData.mainPerson.name}</p>
                  <p><span className="font-semibold">Email:</span> {teamData.mainPerson.email}</p>
                  <p><span className="font-semibold">Contact:</span> {teamData.mainPerson.contactNo || 'N/A'}</p>
                  <p><span className="font-semibold">University:</span> {teamData.mainPerson.universityName || 'N/A'}</p>
                  <p><span className="font-semibold">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      teamData.mainPerson.hasEntered 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {teamData.mainPerson.hasEntered ? 'Entered' : 'Not Entered'}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-white rounded-lg p-2 mb-4">
                    <img
                      src={createApiUrl(`/api/qrcode/${teamData.mainPerson.id}`)}
                      alt="Team Leader QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => downloadQRCode(teamData.mainPerson.id, teamData.mainPerson.name)}
                    disabled={downloadingIds.has(teamData.mainPerson.id)}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    {downloadingIds.has(teamData.mainPerson.id) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaDownload />
                    )}
                    <span>{downloadingIds.has(teamData.mainPerson.id) ? 'Downloading...' : 'Download QR'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Team Members */}
            {teamData.teamMembers.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <FaUsers className="text-green-400" />
                  <span>Team Members ({teamData.teamMembers.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamData.teamMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="space-y-2 mb-4">
                        <p className="font-semibold text-lg">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                        <p className="text-sm">
                          <span className="font-medium">Contact:</span> {member.contactNo || 'N/A'}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">University:</span> {member.universityName || 'N/A'}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            member.hasEntered 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {member.hasEntered ? 'Entered' : 'Not Entered'}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-white rounded p-1 mb-3">
                          <img
                            src={createApiUrl(`/api/qrcode/${member.id}`)}
                            alt={`${member.name} QR Code`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          onClick={() => downloadQRCode(member.id, member.name)}
                          disabled={downloadingIds.has(member.id)}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
                        >
                          {downloadingIds.has(member.id) ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : (
                            <FaDownload />
                          )}
                          <span>{downloadingIds.has(member.id) ? 'Downloading...' : 'Download'}</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Export the component directly without ProtectedRoute
export default TicketPage;
