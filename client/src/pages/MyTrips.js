import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  MapIcon, 
  CalendarIcon, 
  ClockIcon, 
  UsersIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const MyTrips = () => {
  const [trips, setTrips] = useState({
    tripsCreated: [],
    tripsJoined: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created');

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async () => {
    try {
      const response = await axios.get('/api/users/my-trips');
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-green',
      full: 'badge-yellow',
      completed: 'badge-blue',
      cancelled: 'badge-red'
    };
    return badges[status] || 'badge-gray';
  };

  const TripCard = ({ trip, isCreator = false }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
          {trip.title}
        </h3>
        <span className={`badge ${getStatusBadge(trip.status)} ml-2 flex-shrink-0`}>
          {trip.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {trip.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">
            {trip.fromCity} → {trip.toCity}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">
            {format(new Date(trip.travelDate), 'MMM dd, yyyy')}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{trip.travelTime}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">
            {trip.currentParticipants}/{trip.maxParticipants} joined
          </span>
        </div>
      </div>

      {/* Participants Preview */}
      {trip.participants && trip.participants.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Participants:</p>
          <div className="flex flex-wrap gap-2">
            {trip.participants.slice(0, 3).map((participant) => (
              <div key={participant._id} className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {participant.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-gray-700">{participant.name}</span>
              </div>
            ))}
            {trip.participants.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{trip.participants.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
        <span>
          {isCreator ? 'Created by you' : `By ${trip.creator?.name || 'Unknown'}`}
        </span>
        <Link
          to={`/posts/${trip._id}`}
          className="btn-secondary text-xs flex items-center"
        >
          <EyeIcon className="h-3 w-3 mr-1" />
          View Details
        </Link>
      </div>
    </div>
  );

  const EmptyState = ({ type }) => (
    <div className="text-center py-12">
      <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No trips {type} yet
      </h3>
      <p className="text-gray-500 mb-6">
        {type === 'created' 
          ? 'Create your first trip and start finding travel partners!'
          : 'Join some trips to connect with other travelers!'
        }
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/create-post" className="btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create New Trip
        </Link>
        <Link to="/posts" className="btn-secondary">
          Browse Trips
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600 mt-1">
            Manage your created trips and view joined adventures
          </p>
        </div>
        <Link to="/create-post" className="btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create New Trip
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('created')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'created'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Created Trips ({trips.tripsCreated.length})
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'joined'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Joined Trips ({trips.tripsJoined.length})
          </button>
        </nav>
      </div>

      {/* Trip Lists */}
      <div className="min-h-[400px]">
        {activeTab === 'created' ? (
          trips.tripsCreated.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.tripsCreated.map((trip) => (
                <TripCard key={trip._id} trip={trip} isCreator={true} />
              ))}
            </div>
          ) : (
            <EmptyState type="created" />
          )
        ) : (
          trips.tripsJoined.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.tripsJoined.map((trip) => (
                <TripCard key={trip._id} trip={trip} isCreator={false} />
              ))}
            </div>
          ) : (
            <EmptyState type="joined" />
          )
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {trips.tripsCreated.length}
          </div>
          <p className="text-gray-600">Trips Created</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {trips.tripsJoined.length}
          </div>
          <p className="text-gray-600">Trips Joined</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {trips.tripsCreated.length + trips.tripsJoined.length}
          </div>
          <p className="text-gray-600">Total Adventures</p>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;