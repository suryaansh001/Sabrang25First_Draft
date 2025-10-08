'use client';

import React, { useState, useEffect } from 'react';
import { Users, Save, ArrowLeft, Plus, Trash2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Event {
  _id: string;
  name: string;
  category: string;
}

interface TeamMember {
  name: string;
  email: string;
  contactNo: string;
  universityName: string;
  role: string;
}

interface TeamFormData {
  teamName: string;
  eventName: string;
  teamLeaderName: string;
  teamLeaderEmail: string;
  teamLeaderContactNo: string;
  teamLeaderUniversity: string;
  teamMembers: TeamMember[];
  sendEmail: boolean;
}

const AddTeamPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeamFormData>({
    teamName: '',
    eventName: '',
    teamLeaderName: '',
    teamLeaderEmail: '',
    teamLeaderContactNo: '',
    teamLeaderUniversity: '',
    teamMembers: [],
    sendEmail: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events-public');
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error('Events data is not an array:', data);
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          name: '',
          email: '',
          contactNo: '',
          universityName: '',
          role: 'member'
        }
      ]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teamName || !formData.eventName || !formData.teamLeaderName || !formData.teamLeaderEmail) {
      alert('Team name, event, team leader name and email are required');
      return;
    }

    // Validate team members
    for (let i = 0; i < formData.teamMembers.length; i++) {
      const member = formData.teamMembers[i];
      if (!member.name || !member.email) {
        alert(`Team member ${i + 1} must have name and email`);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/manage-users/add-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`Team "${data.team.teamName}" created successfully with ${data.team.totalMembers} members!`);
        router.push('/admin/manage-users');
      } else {
        alert(data.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-16 sm:px-20 lg:px-32 xl:px-40 2xl:px-48">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <Link href="/admin/manage-users">
              <button className="mr-4 p-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Team</h1>
              <p className="text-gray-600">Create a new team with team leader and members</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  name="teamName"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event *
                </label>
                <select
                  name="eventName"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.eventName}
                  onChange={handleInputChange}
                >
                  <option value="">Select Event</option>
                  {events.map((event) => (
                    <option key={event._id} value={event.name}>
                      {event.name} ({event.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Team Leader Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Leader Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Leader Name *
                </label>
                <input
                  type="text"
                  name="teamLeaderName"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.teamLeaderName}
                  onChange={handleInputChange}
                  placeholder="Enter team leader name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Leader Email *
                </label>
                <input
                  type="email"
                  name="teamLeaderEmail"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.teamLeaderEmail}
                  onChange={handleInputChange}
                  placeholder="Enter team leader email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="teamLeaderContactNo"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.teamLeaderContactNo}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University
                </label>
                <input
                  type="text"
                  name="teamLeaderUniversity"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.teamLeaderUniversity}
                  onChange={handleInputChange}
                  placeholder="Enter university name"
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              <button
                type="button"
                onClick={addTeamMember}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </button>
            </div>

            {formData.teamMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No team members added yet.</p>
                <p className="text-sm">Click "Add Member" to add team members.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.teamMembers.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Member {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          placeholder="Member name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={member.email}
                          onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                          placeholder="Member email"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={member.contactNo}
                          onChange={(e) => handleMemberChange(index, 'contactNo', e.target.value)}
                          placeholder="Contact number"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          University
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={member.universityName}
                          onChange={(e) => handleMemberChange(index, 'universityName', e.target.value)}
                          placeholder="University name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Role
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={member.role}
                          onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                        >
                          <option value="member">Member</option>
                          <option value="co-leader">Co-Leader</option>
                          <option value="participant">Participant</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Options</h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="sendEmail"
                id="sendEmail"
                className="mr-3"
                checked={formData.sendEmail}
                onChange={handleInputChange}
              />
              <label htmlFor="sendEmail" className="text-sm text-gray-700">
                Send registration emails to team leader and all members with QR codes
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end space-x-4">
              <Link href="/admin/manage-users">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Team...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Create Team
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamPage;