import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { 
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Chat = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('postId');
  const { user } = useAuth();
  const { socket, sendMessage } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      openChatWithUser(userId);
    }
  }, [userId, postId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', handleReceiveMessage);
      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [socket, activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/chat/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const openChatWithUser = async (targetUserId) => {
    try {
      const queryParams = postId ? `?postId=${postId}` : '';
      const response = await axios.get(`/api/chat/${targetUserId}${queryParams}`);
      setActiveChat(response.data);
      setMessages(response.data.messages || []);
      
      // Mark messages as read
      await axios.put(`/api/chat/${response.data._id}/read`);
      
      // Update conversations list
      fetchConversations();
    } catch (error) {
      console.error('Error opening chat:', error);
    }
  };

  const handleReceiveMessage = (messageData) => {
    if (activeChat && messageData.senderId !== user.id) {
      setMessages(prev => [...prev, {
        _id: Date.now().toString(),
        sender: { _id: messageData.senderId },
        content: messageData.message,
        timestamp: messageData.timestamp
      }]);
      
      // Mark as read if chat is active
      if (activeChat) {
        axios.put(`/api/chat/${activeChat._id}/read`);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    setSendingMessage(true);
    try {
      const response = await axios.post(`/api/chat/${activeChat._id}/messages`, {
        content: newMessage.trim()
      });

      const sentMessage = response.data.sentMessage;
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');

      // Send via socket for real-time delivery
      const otherParticipant = activeChat.participants.find(p => p._id !== user.id);
      if (otherParticipant) {
        sendMessage(otherParticipant._id, newMessage.trim());
      }

      // Update conversations list
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else if (diffInHours < 24 * 7) {
      return format(date, 'EEE HH:mm');
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto h-[600px] flex">
        <div className="w-1/3 border-r border-gray-200 p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="h-full bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Messages
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {conversations.length > 0 ? (
                <div className="space-y-1 p-2">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation._id}
                      onClick={() => {
                        setActiveChat(null);
                        setMessages([]);
                        openChatWithUser(conversation.participant._id);
                      }}
                      className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                        activeChat?._id === conversation._id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {conversation.participant.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 truncate">
                              {conversation.participant.name}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 ml-2">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{conversation.participant.city}</p>
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                          {conversation.relatedPost && (
                            <p className="text-xs text-blue-600 mt-1">
                              Re: {conversation.relatedPost.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start chatting with other travelers!</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-1 flex-col">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {activeChat.participants.find(p => p._id !== user.id)?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {activeChat.participants.find(p => p._id !== user.id)?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {activeChat.participants.find(p => p._id !== user.id)?.city}
                      </p>
                      {activeChat.relatedPost && (
                        <p className="text-xs text-blue-600">
                          Trip: {activeChat.relatedPost.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`chat-message ${
                            message.sender._id === user.id 
                              ? 'chat-message-sent' 
                              : 'chat-message-received'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender._id === user.id ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 input-field"
                      maxLength="1000"
                      disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sendingMessage}
                      className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <UserIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the sidebar to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;