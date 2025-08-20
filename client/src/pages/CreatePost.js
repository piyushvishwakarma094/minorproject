import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fromCity: '',
    toCity: '',
    travelDate: '',
    travelTime: '',
    maxParticipants: 2,
    transportMode: 'car',
    estimatedCost: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const transportModes = [
    { value: 'car', label: 'Car' },
    { value: 'bus', label: 'Bus' },
    { value: 'train', label: 'Train' },
    { value: 'flight', label: 'Flight' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.fromCity.trim()) {
      newErrors.fromCity = 'Departure city is required';
    }

    if (!formData.toCity.trim()) {
      newErrors.toCity = 'Destination city is required';
    }

    if (!formData.travelDate) {
      newErrors.travelDate = 'Travel date is required';
    } else if (new Date(formData.travelDate) <= new Date()) {
      newErrors.travelDate = 'Travel date must be in the future';
    }

    if (!formData.travelTime) {
      newErrors.travelTime = 'Travel time is required';
    }

    if (formData.maxParticipants < 2 || formData.maxParticipants > 10) {
      newErrors.maxParticipants = 'Max participants must be between 2 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/posts', formData);
      toast.success('Trip created successfully!');
      navigate(`/posts/${response.data.post._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create trip';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Trip</h1>
        <p className="text-gray-600 mt-2">Share your travel plans and find companions</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Trip Details
            </h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Trip Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="e.g., Weekend trip to Goa"
                value={formData.title}
                onChange={handleChange}
                maxLength="100"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              <p className="mt-1 text-sm text-gray-500">{formData.title.length}/100 characters</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your trip plans, what you want to do, and what kind of travel partner you're looking for..."
                value={formData.description}
                onChange={handleChange}
                maxLength="1000"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              <p className="mt-1 text-sm text-gray-500">{formData.description.length}/1000 characters</p>
            </div>
          </div>

          {/* Location and Time */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Location & Schedule
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromCity" className="block text-sm font-medium text-gray-700 mb-2">
                  From City *
                </label>
                <input
                  id="fromCity"
                  name="fromCity"
                  type="text"
                  required
                  className={`input-field ${errors.fromCity ? 'border-red-500' : ''}`}
                  placeholder="Departure city"
                  value={formData.fromCity}
                  onChange={handleChange}
                />
                {errors.fromCity && <p className="mt-1 text-sm text-red-600">{errors.fromCity}</p>}
              </div>

              <div>
                <label htmlFor="toCity" className="block text-sm font-medium text-gray-700 mb-2">
                  To City *
                </label>
                <input
                  id="toCity"
                  name="toCity"
                  type="text"
                  required
                  className={`input-field ${errors.toCity ? 'border-red-500' : ''}`}
                  placeholder="Destination city"
                  value={formData.toCity}
                  onChange={handleChange}
                />
                {errors.toCity && <p className="mt-1 text-sm text-red-600">{errors.toCity}</p>}
              </div>

              <div>
                <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date *
                </label>
                <input
                  id="travelDate"
                  name="travelDate"
                  type="date"
                  required
                  className={`input-field ${errors.travelDate ? 'border-red-500' : ''}`}
                  value={formData.travelDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.travelDate && <p className="mt-1 text-sm text-red-600">{errors.travelDate}</p>}
              </div>

              <div>
                <label htmlFor="travelTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Time *
                </label>
                <input
                  id="travelTime"
                  name="travelTime"
                  type="time"
                  required
                  className={`input-field ${errors.travelTime ? 'border-red-500' : ''}`}
                  value={formData.travelTime}
                  onChange={handleChange}
                />
                {errors.travelTime && <p className="mt-1 text-sm text-red-600">{errors.travelTime}</p>}
              </div>
            </div>
          </div>

          {/* Trip Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Trip Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants *
                </label>
                <select
                  id="maxParticipants"
                  name="maxParticipants"
                  required
                  className={`input-field ${errors.maxParticipants ? 'border-red-500' : ''}`}
                  value={formData.maxParticipants}
                  onChange={handleChange}
                >
                  {[...Array(9)].map((_, i) => (
                    <option key={i + 2} value={i + 2}>
                      {i + 2} people
                    </option>
                  ))}
                </select>
                {errors.maxParticipants && <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>}
              </div>

              <div>
                <label htmlFor="transportMode" className="block text-sm font-medium text-gray-700 mb-2">
                  Transport Mode
                </label>
                <select
                  id="transportMode"
                  name="transportMode"
                  className="input-field"
                  value={formData.transportMode}
                  onChange={handleChange}
                >
                  {transportModes.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="estimatedCost" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost (₹)
                </label>
                <input
                  id="estimatedCost"
                  name="estimatedCost"
                  type="number"
                  min="0"
                  className="input-field"
                  placeholder="Per person cost"
                  value={formData.estimatedCost}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              className="input-field"
              placeholder="Any additional information about the trip, requirements, or preferences..."
              value={formData.notes}
              onChange={handleChange}
              maxLength="500"
            />
            <p className="mt-1 text-sm text-gray-500">{formData.notes.length}/500 characters</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="btn-secondary px-6 py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner h-4 w-4 mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Trip'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;