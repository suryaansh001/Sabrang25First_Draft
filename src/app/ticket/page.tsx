"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import createApiUrl from '../../lib/api';
import { Ticket, HelpCircle, X, Mail, Phone, Upload, Send, AlertCircle, Loader, CheckCircle, Search, Shield, Clock, Download, QrCode, User, Users } from 'lucide-react';

// Helper function to format price to 2 decimal places
function formatPrice(price: number): string {
  return price.toFixed(2);
}

interface Registration {
  id: string;
  type: 'individual' | 'team-leader' | 'team-member';
  registrationId?: string;
  registrationDate?: string;
  registrationCount?: number;
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
  registeredEvents: any[];
  finalPrice?: number;
  
  // For team leader registrations
  teamMembers?: {
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
  }[];
  teamSize?: number;
  
  // For team member registrations
  teamLeader?: {
    id: string;
    name: string;
    email: string;
    registrationId: string;
  };
}

interface RegistrationsData {
  registrations: Registration[];
  summary: {
    totalRegistrations: number;
    individualRegistrations: number;
    teamLeaderRegistrations: number;
    teamMemberRegistrations: number;
    accessedBy: string;
  };
}

function TicketPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [registrationsData, setRegistrationsData] = useState<RegistrationsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [otpLoading, setOtpLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);


  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      const response = await fetch(createApiUrl('/api/send-ticket-otp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
      console.error('Error sending OTP:', err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(createApiUrl('/api/verify-ticket-otp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }

      setAccessToken(data.accessToken);
      setOtpVerified(true);
      await fetchTeamData(data.accessToken);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
      console.error('Error verifying OTP:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamData = async (token: string) => {
    try {
      const response = await fetch(createApiUrl('/api/team-by-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ accessToken: token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch registration data');
      }

      const data = await response.json();
      setRegistrationsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registration data');
      console.error('Error fetching registration data:', err);
    }
  };

  // Function to categorize registrations by events
  const categorizeByEvents = (data: RegistrationsData) => {
    // This function is not needed anymore since we display registrations directly
    return data;
  };

  const handleResendOTP = async () => {
    setOtp('');
    setOtpSent(false);
    setError('');
    await handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
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

  const resetForm = () => {
    setEmail('');
    setOtp('');
    setOtpSent(false);
    setOtpVerified(false);
    setAccessToken('');
    setRegistrationsData(null);
    setError('');
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
            Secure Ticket Access
          </h1>
          <p className="text-gray-400 text-lg">
            Enter your email to receive an OTP and securely access your Sabrang'25 tickets
          </p>
        </motion.div>

        {/* Search/OTP Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
        >
          {!otpSent ? (
            /* Email Input Form */
            <form onSubmit={handleSendOTP} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email address"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={otpLoading}
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  {otpLoading ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : (
                    <Shield />
                  )}
                  <span>{otpLoading ? 'Sending OTP...' : 'Send OTP'}</span>
                </button>
              </div>
            </form>
          ) : !otpVerified ? (
            /* OTP Verification Form */
            <div>
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="text-green-400" />
                  <p className="text-green-300">
                    OTP sent to {email}. Please check your email and enter the 6-digit code below.
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleVerifyOTP} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="otp" className="block text-sm font-medium mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
                      required
                      maxLength={6}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    {loading ? (
                      <Loader className="animate-spin h-5 w-5" />
                    ) : (
                      <Search />
                    )}
                    <span>{loading ? 'Verifying...' : 'Verify & View'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={otpLoading}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                  >
                    {otpLoading ? (
                      <Loader className="animate-spin h-4 w-4" />
                    ) : (
                      <Clock />
                    )}
                    <span>{otpLoading ? 'Sending...' : 'Resend'}</span>
                  </button>
                </div>
              </form>
              
              <div className="mt-4 text-sm text-gray-400">
                <p>• OTP is valid for 10 minutes</p>
                <p>• Maximum 3 attempts allowed</p>
                <p>• Check your spam folder if you don't see the email</p>
              </div>
            </div>
          ) : (
            /* Verified State */
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-green-400 font-medium">Email Verified</p>
                  <p className="text-sm text-gray-400">{email}</p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Search Different Email
              </button>
            </div>
          )}

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

        {/* Registration Data Display */}
        {otpVerified && registrationsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Summary Overview */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Your Registrations</h2>
                <p className="text-gray-400">
                  Found {registrationsData.summary.totalRegistrations} registration(s) for {registrationsData.summary.accessedBy}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/20 text-blue-300 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{registrationsData.summary.individualRegistrations}</div>
                  <div className="text-sm">Individual</div>
                </div>
                <div className="bg-green-500/20 text-green-300 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{registrationsData.summary.teamLeaderRegistrations}</div>
                  <div className="text-sm">Team Leader</div>
                </div>
                <div className="bg-purple-500/20 text-purple-300 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{registrationsData.summary.teamMemberRegistrations}</div>
                  <div className="text-sm">Team Member</div>
                </div>
              </div>
            </div>

            {/* Individual Registrations */}
            {registrationsData.registrations.filter(reg => reg.type === 'individual').map((registration, index) => (
              <div key={registration.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <User className="text-blue-400" />
                  <span>Individual Registration #{registration.registrationCount}</span>
                  {registration.registrationDate && (
                    <span className="text-sm text-gray-400 ml-2">
                      ({new Date(registration.registrationDate).toLocaleDateString()})
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p><span className="font-semibold">Name:</span> {registration.name}</p>
                    <p><span className="font-semibold">Email:</span> {registration.email}</p>
                    <p><span className="font-semibold">Contact:</span> {registration.contactNo || 'N/A'}</p>
                    <p><span className="font-semibold">University:</span> {registration.universityName || 'N/A'}</p>
                    {registration.finalPrice && (
                      <p><span className="font-semibold">Amount Paid:</span> ₹{formatPrice(registration.finalPrice)}</p>
                    )}
                    <p><span className="font-semibold">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        registration.hasEntered 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {registration.hasEntered ? 'Entered' : 'Not Entered'}
                      </span>
                    </p>
                    {registration.events.length > 0 && (
                      <div>
                        <span className="font-semibold">Events:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {registration.events.map((event, idx) => (
                            <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-white rounded-lg p-2 mb-4">
                      {registration.qrCodeBase64 ? (
                        <img
                          src={`data:image/png;base64,${registration.qrCodeBase64}`}
                          alt="QR Code"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={createApiUrl(`/api/qrcode/${registration.id}`)}
                          alt="QR Code"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            console.log('QR code failed to load for individual:', registration.id);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => downloadQRCode(registration.id, registration.name)}
                      disabled={downloadingIds.has(registration.id)}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      {downloadingIds.has(registration.id) ? (
                        <Loader className="animate-spin h-4 w-4" />
                      ) : (
                        <Download />
                      )}
                      <span>{downloadingIds.has(registration.id) ? 'Downloading...' : 'Download QR'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Team Leader Registrations */}
            {registrationsData.registrations.filter(reg => reg.type === 'team-leader').map((registration, index) => (
              <div key={registration.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Users className="text-green-400" />
                  <span>Team Leader Registration #{registration.registrationCount}</span>
                  {registration.registrationDate && (
                    <span className="text-sm text-gray-400 ml-2">
                      ({new Date(registration.registrationDate).toLocaleDateString()})
                    </span>
                  )}
                </h3>
                
                {/* Team Leader Info */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-yellow-400">Team Leader</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p><span className="font-semibold">Name:</span> {registration.name}</p>
                      <p><span className="font-semibold">Email:</span> {registration.email}</p>
                      <p><span className="font-semibold">Contact:</span> {registration.contactNo || 'N/A'}</p>
                      <p><span className="font-semibold">University:</span> {registration.universityName || 'N/A'}</p>
                      <p><span className="font-semibold">Team Size:</span> {registration.teamSize}</p>
                      {registration.finalPrice && (
                        <p><span className="font-semibold">Amount Paid:</span> ₹{formatPrice(registration.finalPrice)}</p>
                      )}
                      <p><span className="font-semibold">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          registration.hasEntered 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {registration.hasEntered ? 'Entered' : 'Not Entered'}
                        </span>
                      </p>
                      {registration.events.length > 0 && (
                        <div>
                          <span className="font-semibold">Events:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {registration.events.map((event, idx) => (
                              <span key={idx} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 bg-white rounded-lg p-2 mb-4">
                        {registration.qrCodeBase64 ? (
                          <img
                            src={`data:image/png;base64,${registration.qrCodeBase64}`}
                            alt="Team Leader QR Code"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <img
                            src={createApiUrl(`/api/qrcode/${registration.id}`)}
                            alt="Team Leader QR Code"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              console.log('QR code failed to load for team leader:', registration.id);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <button
                        onClick={() => downloadQRCode(registration.id, registration.name)}
                        disabled={downloadingIds.has(registration.id)}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        {downloadingIds.has(registration.id) ? (
                          <Loader className="animate-spin h-4 w-4" />
                        ) : (
                          <Download />
                        )}
                        <span>{downloadingIds.has(registration.id) ? 'Downloading...' : 'Download QR'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                {registration.teamMembers && registration.teamMembers.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-blue-400">Team Members ({registration.teamMembers.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {registration.teamMembers.map((member) => (
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
                              {member.qrCodeBase64 ? (
                                <img
                                  src={`data:image/png;base64,${member.qrCodeBase64}`}
                                  alt={`${member.name} QR Code`}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <img
                                  src={createApiUrl(`/api/qrcode/${member.id}`)}
                                  alt={`${member.name} QR Code`}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    console.log('QR code failed to load for member:', member.id);
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <button
                              onClick={() => downloadQRCode(member.id, member.name)}
                              disabled={downloadingIds.has(member.id)}
                              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
                            >
                              {downloadingIds.has(member.id) ? (
                                <Loader className="animate-spin h-3 w-3" />
                              ) : (
                                <Download />
                              )}
                              <span>{downloadingIds.has(member.id) ? 'Downloading...' : 'Download'}</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Team Member Registrations */}
            {registrationsData.registrations.filter(reg => reg.type === 'team-member').map((registration, index) => (
              <div key={registration.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <User className="text-purple-400" />
                  <span>Team Member Registration</span>
                  {registration.teamLeader && (
                    <span className="text-sm text-gray-400 ml-2">
                      (Team Leader: {registration.teamLeader.name})
                    </span>
                  )}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p><span className="font-semibold">Name:</span> {registration.name}</p>
                    <p><span className="font-semibold">Email:</span> {registration.email}</p>
                    <p><span className="font-semibold">Contact:</span> {registration.contactNo || 'N/A'}</p>
                    <p><span className="font-semibold">University:</span> {registration.universityName || 'N/A'}</p>
                    {registration.teamLeader && (
                      <p><span className="font-semibold">Team Leader:</span> {registration.teamLeader.name} ({registration.teamLeader.email})</p>
                    )}
                    <p><span className="font-semibold">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        registration.hasEntered 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {registration.hasEntered ? 'Entered' : 'Not Entered'}
                      </span>
                    </p>
                    {registration.events.length > 0 && (
                      <div>
                        <span className="font-semibold">Events:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {registration.events.map((event, idx) => (
                            <span key={idx} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-white rounded-lg p-2 mb-4">
                      {registration.qrCodeBase64 ? (
                        <img
                          src={`data:image/png;base64,${registration.qrCodeBase64}`}
                          alt="Team Member QR Code"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={createApiUrl(`/api/qrcode/${registration.id}`)}
                          alt="Team Member QR Code"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            console.log('QR code failed to load for team member:', registration.id);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <button
                      onClick={() => downloadQRCode(registration.id, registration.name)}
                      disabled={downloadingIds.has(registration.id)}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      {downloadingIds.has(registration.id) ? (
                        <Loader className="animate-spin h-4 w-4" />
                      ) : (
                        <Download />
                      )}
                      <span>{downloadingIds.has(registration.id) ? 'Downloading...' : 'Download QR'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Help Form Section */}
        <motion.div className="mt-12">
          <div className="bg-neutral-900/90 text-white rounded-2xl w-full shadow-2xl border border-white/20">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold">Trouble Finding Your Ticket?</h2>
              <p className="text-gray-400">
                If you're having trouble accessing your tickets, please fill out our support form.
              </p>
            </div>
            <div className="p-8">
              <a
                href="https://forms.gle/EF7WS9E4GZPHBNit8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none transition-all duration-300 hover:scale-105"
              >
                <HelpCircle className="w-5 h-5" />
                Go to Support Form
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
              </a>
              <p className="text-gray-400 text-sm mt-4">
                You will be redirected to a Google Form to submit your details.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Export the component directly without ProtectedRoute
export default TicketPage;
