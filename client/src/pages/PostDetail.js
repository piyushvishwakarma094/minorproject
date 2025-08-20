import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapIcon, 
  CalendarIcon, 
  ClockIcon, 
  UsersIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load trip details');
      navigate('/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTrip = async () => {
    if (!user) {
      toast.error('Please login to join trips');
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      const response = await axios.post(`/api/posts/${id}/join`);
      setPost(response.data.post);
      toast.success('Successfully joined the trip!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to join trip';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveTrip = async () => {
    setActionLoading(true);
    try {
      await axios.post(`/api/posts/${id}/leave`);
      fetchPost(); // Refresh post data
      toast.success('Successfully left the trip');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to leave trip';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setCommentLoading(true);
    try {
      const response = await axios.post(`/api/posts/${id}/comments`, {
        text: comment.trim()
      });
      setPost({
        ...post,
        comments: response.data.comments
      });
      setComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add comment';
      toast.error(message);
    } finally {
      setCommentLoading(false);
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

  const isParticipant = user && post?.participants.some(p => p._id === user.id);
  const isCreator = user && post?.creator._id === user.id;
  const canJoin = user && post?.status === 'active' && !isParticipant && !isCreator;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600">Trip not found</h2>
        <Link to="/posts" className="btn-primary mt-4">
          Back to Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 flex-1">{post.title}</h1>
              <span className={`badge ${getStatusBadge(post.status)} text-sm`}>
                {post.status}
              </span>
            </div>
            <p className="text-gray-600 text-lg">{post.description}</p>
          </div>
        </div>

        {/* Trip Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="flex items-center space-x-3">
            <MapIcon className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Route</p>
              <p className="font-semibold">{post.fromCity} → {post.toCity}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{format(new Date(post.travelDate), 'MMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ClockIcon className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-semibold">{post.travelTime}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <UsersIcon className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              <p className="font-semibold">{post.currentParticipants}/{post.maxParticipants}</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <TruckIcon className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Transport</p>
              <p className="font-medium capitalize">{post.transportMode}</p>
            </div>
          </div>

          {post.estimatedCost > 0 && (
            <div className="flex items-center space-x-3">
              <CurrencyRupeeIcon className="h-6 w-6 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Estimated Cost</p>
                <p className="font-medium">₹{post.estimatedCost} per person</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <UserIcon className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Created by</p>
              <Link 
                to={`/profile/${post.creator._id}`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {post.creator.name}
              </Link>
            </div>
          </div>
        </div>

        {/* Notes */}
        {post.notes && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Additional Notes</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{post.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {canJoin && (
            <button
              onClick={handleJoinTrip}
              disabled={actionLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Joining...' : 'Join Trip'}
            </button>
          )}

          {isParticipant && !isCreator && (
            <button
              onClick={handleLeaveTrip}
              disabled={actionLoading}
              className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Leaving...' : 'Leave Trip'}
            </button>
          )}

          {user && !isCreator && (
            <Link
              to={`/chat/${post.creator._id}?postId=${post._id}`}
              className="btn-secondary flex items-center"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Message Creator
            </Link>
          )}

          <Link
            to={`/profile/${post.creator._id}`}
            className="btn-secondary flex items-center"
          >
            <UserIcon className="h-4 w-4 mr-2" />
            View Profile
          </Link>
        </div>
      </div>

      {/* Participants */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Participants ({post.currentParticipants})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {post.participants.map((participant) => (
            <div key={participant._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <Link
                  to={`/profile/${participant._id}`}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  {participant.name}
                </Link>
                <p className="text-sm text-gray-500">{participant.city}</p>
                {participant._id === post.creator._id && (
                  <span className="badge badge-blue text-xs">Creator</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Comments ({post.comments.length})</h2>
        
        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="input-field resize-none"
                  rows="3"
                  maxLength="500"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{comment.length}/500</span>
                  <button
                    type="submit"
                    disabled={commentLoading || !comment.trim()}
                    className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-2">Please login to add comments</p>
            <Link to="/login" className="btn-primary text-sm">
              Login
            </Link>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Link
                        to={`/profile/${comment.user._id}`}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        {comment.user.name}
                      </Link>
                      <span className="text-sm text-gray-500">{comment.user.city}</span>
                      <span className="text-sm text-gray-400">
                        {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;