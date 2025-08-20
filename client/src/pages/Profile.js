import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserIcon, 
  MapPinIcon, 
  PhoneIcon, 
  CalendarIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    city: '',
    phone: '',
    age: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  const isOwnProfile = !id || (currentUser && id === currentUser.id);

  useEffect(() => {
    if (isOwnProfile && currentUser) {
      fetchCurrentUserProfile();
    } else if (id) {
      fetchUserProfile(id);
    }
  }, [id, currentUser, isOwnProfile]);

  const fetchCurrentUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setProfile(response.data);
      setEditForm({
        name: response.data.name || '',
        bio: response.data.bio || '',
        city: response.data.city || '',
        phone: response.data.phone || '',
        age: response.data.age || ''
      });
    } catch (error) {
      console.error('Error fetching current user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/users/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    const result = await updateProfile(editForm);
    if (result.success) {
      setProfile(prev => ({ ...prev, ...editForm }));
      setEditing(false);
    }
    
    setUpdateLoading(false);
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mt-1">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{profile.city}</span>
                </div>
                {profile.age && (
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span>{profile.age} years old</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            {isOwnProfile ? (
              <button
                onClick={() => setEditing(!editing)}
                className="btn-secondary flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            ) : currentUser ? (
              <Link
                to={`/chat/${profile._id}`}
                className="btn-primary flex items-center"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                Send Message
              </Link>
            ) : null}
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <form onSubmit={handleEditSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={editForm.city}
                  onChange={handleEditChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={handleEditChange}
                  className="input-field"
                  min="18"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="input-field"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
                className="input-field"
                rows="3"
                maxLength="500"
                placeholder="Tell others about yourself and your travel interests..."
              />
              <p className="text-sm text-gray-500 mt-1">{editForm.bio.length}/500 characters</p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">About</h3>
            {profile.bio ? (
              <p className="text-gray-600">{profile.bio}</p>
            ) : (
              <p className="text-gray-400 italic">No bio available</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Contact Info</h3>
            <div className="space-y-2">
              {profile.phone && (
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Trips Created</h3>
          {profile.tripsCreated && profile.tripsCreated.length > 0 ? (
            <div className="space-y-3">
              {profile.tripsCreated.slice(0, 5).map((trip) => (
                <Link
                  key={trip._id}
                  to={`/posts/${trip._id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 line-clamp-1">{trip.title}</h4>
                      <p className="text-sm text-gray-600">{trip.fromCity} → {trip.toCity}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(trip.travelDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className={`badge ${
                      trip.status === 'active' ? 'badge-green' : 
                      trip.status === 'full' ? 'badge-yellow' : 'badge-red'
                    } text-xs`}>
                      {trip.status}
                    </span>
                  </div>
                </Link>
              ))}
              {profile.tripsCreated.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  And {profile.tripsCreated.length - 5} more trips...
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No trips created yet</p>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Trips Joined</h3>
          {profile.tripsJoined && profile.tripsJoined.length > 0 ? (
            <div className="space-y-3">
              {profile.tripsJoined.slice(0, 5).map((trip) => (
                <Link
                  key={trip._id}
                  to={`/posts/${trip._id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 line-clamp-1">{trip.title}</h4>
                      <p className="text-sm text-gray-600">{trip.fromCity} → {trip.toCity}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(trip.travelDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className={`badge ${
                      trip.status === 'active' ? 'badge-green' : 
                      trip.status === 'full' ? 'badge-yellow' : 'badge-red'
                    } text-xs`}>
                      {trip.status}
                    </span>
                  </div>
                </Link>
              ))}
              {profile.tripsJoined.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  And {profile.tripsJoined.length - 5} more trips...
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No trips joined yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;