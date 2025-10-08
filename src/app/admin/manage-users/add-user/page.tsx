'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Save, ArrowLeft, Upload, Download, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Event {
  _id: string;
  name: string;
  category: string;
}

interface UserFormData {
  name: string;
  email: string;
  contactNo: string;
  gender: string;
  age: string;
  universityName: string;
  address: string;
  events: string[];
  userType: string;
  password: string;
  sendEmail: boolean;
}

const AddUserPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkUsers, setBulkUsers] = useState('');
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    contactNo: '',
    gender: '',
    age: '',
    universityName: '',
    address: '',
    events: [],
    userType: 'participant',
    password: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleEventChange = (eventName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      events: checked 
        ? [...prev.events, eventName]
        : prev.events.filter(e => e !== eventName)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/manage-users/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : null
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`User ${data.user.name} created successfully!${data.credentials ? ` Default password: ${data.credentials.defaultPassword}` : ''}`);
        router.push('/admin/manage-users');
      } else {
        alert(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkUsers.trim()) {
      alert('Please enter user data');
      return;
    }

    // Parse CSV data
    const lines = bulkUsers.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    if (!headers.includes('name') || !headers.includes('email')) {
      alert('CSV must include "name" and "email" columns');
      return;
    }

    const users = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const user: any = {};
      
      headers.forEach((header, index) => {
        if (header === 'events' && values[index]) {
          user[header] = values[index].split(';').map(e => e.trim());
        } else if (header === 'age' && values[index]) {
          user[header] = parseInt(values[index]);
        } else {
          user[header] = values[index] || '';
        }
      });
      
      return user;
    });

    setLoading(true);
    try {
      const response = await fetch('/api/admin/manage-users/bulk-add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          users,
          sendEmails: formData.sendEmail
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Bulk creation completed: ${data.results.created} created, ${data.results.failed} failed, ${data.results.skipped} skipped`);
        router.push('/admin/manage-users');
      } else {
        alert(data.message || 'Failed to create users');
      }
    } catch (error) {
      console.error('Error creating users:', error);
      alert('Error creating users');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,contactNo,gender,age,universityName,address,events,userType\nJohn Doe,john@example.com,1234567890,Male,22,University Name,Address,Event1;Event2,participant';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk_users_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-16 sm:px-20 lg:px-32 xl:px-40 2xl:px-48">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin/manage-users">
                <button className="mr-4 p-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Add User</h1>
                <p className="text-gray-600">Create new user account</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setBulkMode(!bulkMode)}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  bulkMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                {bulkMode ? 'Single Mode' : 'Bulk Mode'}
              </button>
              {bulkMode && (
                <button
                  onClick={downloadTemplate}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Template
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {!bulkMode ? (
            /* Single User Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNo"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="1"
                    max="100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University Name
                  </label>
                  <input
                    type="text"
                    name="universityName"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.universityName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <select
                    name="userType"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.userType}
                    onChange={handleInputChange}
                  >
                    <option value="participant">Participant</option>
                    <option value="support_staff">Support Staff</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password (optional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Leave empty for default password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Default password: Sabrang2025!
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Register for Events
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {events.map((event) => (
                    <label key={event._id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={formData.events.includes(event.name)}
                        onChange={(e) => handleEventChange(event.name, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">{event.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="sendEmail"
                  id="sendEmail"
                  className="mr-2"
                  checked={formData.sendEmail}
                  onChange={handleInputChange}
                />
                <label htmlFor="sendEmail" className="text-sm text-gray-700">
                  Send registration email with QR code
                </label>
              </div>

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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Bulk Upload Form */
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Bulk User Data (CSV Format)
                  </label>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Format: name,email,contactNo,gender,age,universityName,address,events,userType
                  </p>
                  <p className="text-xs text-gray-500">
                    • Events should be separated by semicolons (Event1;Event2)
                    • First row should be headers
                  </p>
                </div>
                <textarea
                  value={bulkUsers}
                  onChange={(e) => setBulkUsers(e.target.value)}
                  rows={15}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="name,email,contactNo,gender,age,universityName,address,events,userType
John Doe,john@example.com,1234567890,Male,22,University Name,Address,Event1;Event2,participant
Jane Smith,jane@example.com,0987654321,Female,21,Another University,Address2,Event1,participant"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="sendEmail"
                  id="bulkSendEmail"
                  className="mr-2"
                  checked={formData.sendEmail}
                  onChange={handleInputChange}
                />
                <label htmlFor="bulkSendEmail" className="text-sm text-gray-700">
                  Send registration emails to all created users
                </label>
              </div>

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
                      Creating Users...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Create Users
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;