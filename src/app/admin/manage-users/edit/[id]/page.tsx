'use client';

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Event {
  _id: string;
  name: string;
  category: string;
}

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
  isvalidated: boolean;
  newPassword: string;
}

const EditUserPage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
    isvalidated: false,
    newPassword: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchUser();
  }, [userId]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/manage-users?search=${userId}&limit=1`);
      const data = await response.json();

      if (data.success && data.users.length > 0) {
        const userData = data.users[0];
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          contactNo: userData.contactNo || '',
          gender: userData.gender || '',
          age: userData.age ? userData.age.toString() : '',
          universityName: userData.universityName || '',
          address: userData.address || '',
          events: userData.events || [],
          userType: userData.userType || 'participant',
          isvalidated: userData.isvalidated || false,
          newPassword: ''
        });
      } else {
        alert('User not found');
        router.push('/admin/manage-users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Error fetching user details');
    } finally {
      setInitialLoading(false);
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
      const response = await fetch(`/api/admin/manage-users/${userId}`, {
        method: 'PUT',
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
        alert(`User ${data.user.name} updated successfully!`);
        router.push('/admin/manage-users');
      } else {
        alert(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
          <Link href="/admin/manage-users">
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Users
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
              <p className="text-gray-600">Modify user account details</p>
            </div>
          </div>
        </div>

        {/* User Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-blue-900">Current User Information</h3>
              <p className="text-blue-700">
                <span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleString()}
              </p>
              <div className="flex space-x-4 mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.isvalidated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isvalidated ? 'Validated' : 'Not Validated'}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.hasEntered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.hasEntered ? 'Entered' : 'Not Entered'}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.emailSent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.emailSent ? 'Email Sent' : 'Email Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
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
                  New Password (optional)
                </label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Leave empty to keep current password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Registered Events
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
                name="isvalidated"
                id="isvalidated"
                className="mr-2"
                checked={formData.isvalidated}
                onChange={handleInputChange}
              />
              <label htmlFor="isvalidated" className="text-sm text-gray-700">
                Mark as validated user
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;