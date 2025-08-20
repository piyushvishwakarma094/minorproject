import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  MapIcon, 
  CalendarIcon, 
  ClockIcon, 
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    fromCity: searchParams.get('fromCity') || '',
    toCity: searchParams.get('toCity') || '',
    date: searchParams.get('date') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.fromCity) queryParams.append('fromCity', filters.fromCity);
      if (filters.toCity) queryParams.append('toCity', filters.toCity);
      if (filters.date) queryParams.append('date', filters.date);
      queryParams.append('page', page);
      queryParams.append('limit', '12');

      const response = await axios.get(`/api/posts?${queryParams.toString()}`);
      setPosts(response.data.posts);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams();
    
    if (filters.fromCity) newSearchParams.append('fromCity', filters.fromCity);
    if (filters.toCity) newSearchParams.append('toCity', filters.toCity);
    if (filters.date) newSearchParams.append('date', filters.date);
    
    setSearchParams(newSearchParams);
    fetchPosts(1);
  };

  const clearFilters = () => {
    setFilters({
      fromCity: '',
      toCity: '',
      date: ''
    });
    setSearchParams(new URLSearchParams());
    fetchPosts(1);
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Travel Partners</h1>
          <p className="text-gray-600 mt-1">
            {pagination.total} trips available
          </p>
        </div>
        <Link to="/create-post" className="btn-primary">
          Create New Trip
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Search Trips</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary sm:hidden"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From City
                </label>
                <input
                  type="text"
                  name="fromCity"
                  placeholder="Departure city"
                  className="input-field"
                  value={filters.fromCity}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To City
                </label>
                <input
                  type="text"
                  name="toCity"
                  placeholder="Destination city"
                  className="input-field"
                  value={filters.toCity}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Date
                </label>
                <input
                  type="date"
                  name="date"
                  className="input-field"
                  value={filters.date}
                  onChange={handleFilterChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="btn-primary flex-1">
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Search
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, index) => (
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
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post._id}`}
                className="card hover:shadow-lg transition-shadow group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <span className={`badge ${getStatusBadge(post.status)} ml-2 flex-shrink-0`}>
                    {post.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">
                      {post.fromCity} → {post.toCity}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      {format(new Date(post.travelDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{post.travelTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      {post.currentParticipants}/{post.maxParticipants} joined
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <span>By {post.creator.name}</span>
                  <span>{post.creator.city}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        page === pagination.currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <MapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or create a new trip
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
            <Link to="/create-post" className="btn-primary">
              Create New Trip
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;