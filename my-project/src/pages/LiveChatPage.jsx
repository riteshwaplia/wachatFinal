// client/src/pages/LiveChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api'; // Using api directly for clarity, assuming api utility is an api instance
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust the import path for useAuth if it's in a different context file
import io from 'socket.io-client';
const VITE_SOCKET_IO_URL = import.meta.env.VITE_SOCKET_IO_URL || 'http://localhost:5000';
// IMPORTANT: Ensure this matches your backend Socket.IO port
const socket = io(VITE_SOCKET_IO_URL, { transports: ['websocket', 'polling'] });

const LiveChatPage = () => {
    const { user, token } = useAuth();
    const { id:projectId } = useParams(); // FIX: Changed from 'id' to 'projectId'
    const navigate = useNavigate();

    const [projectDetails, setProjectDetails] = useState(null); // Re-added state for project details
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessageText, setNewMessageText] = useState('');
    const [message, setMessage] = useState(''); // General message for alerts/errors
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef(null); // For auto-scrolling chat

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // --- Fetch Project Details ---

    // --- Fetch Conversations ---
    const fetchConversations = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/projects/${projectId}/conversations`, config);
            setConversations(res.data.data || []);
            setMessage('');
        } catch (error) {
            console.error('Error fetching conversations:', error.response?.data?.message || error.message);
            setMessage(`Error loading conversations: ${error.response?.data?.message || 'Failed to fetch conversations.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Fetch Messages for Selected Conversation ---
    const fetchMessages = async (conversationId) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/projects/${projectId}/conversations/${conversationId}/messages`, config);
            setMessages(res.data.data || []);
            setMessage('');
            // Mark conversation as read on the backend
            await api.put(`/projects/${projectId}/conversations/${conversationId}/read`, {}, config);
            // Optimistically update unread count in frontend
            setConversations(prev => prev.map(conv =>
                conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
            ));
        } catch (error) {
            console.error('Error fetching messages:', error.response?.data?.message || error.message);
            setMessage(`Error loading messages: ${error.response?.data?.message || 'Failed to fetch messages.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Component Mount Effects ---
    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true });
            return;
        }

        // Fetch initial data
        fetchConversations();

        // Join specific Socket.IO rooms
        socket.emit('joinRoom', user._id); // For general user updates (e.g., new conversation)
        socket.emit('joinRoom', `project-${projectId}`); // For project-wide updates

        // Socket.IO Listener for NEW INBOUND messages (updates conversation list)
        socket.on('newInboundMessage', (data) => {
            console.log("Socket: newInboundMessage received (for Conversation List update):", data);
            // This is for new messages that might create a new conversation or update an existing one not currently selected
            setConversations(prevConversations => {
                const existingConvIndex = prevConversations.findIndex(conv => conv._id === data.conversation._id);
                let updatedConversationsList;

                if (existingConvIndex > -1) {
                    // Update existing conversation details
                    updatedConversationsList = [...prevConversations];
                    updatedConversationsList[existingConvIndex] = {
                        ...updatedConversationsList[existingConvIndex],
                        latestMessage: data.message.type === 'text' ? data.message.message.body : `[${data.message.type}]`,
                        latestMessageType: data.message.type,
                        lastActivityAt: data.message.sentAt,
                        // Increment unread count only if NOT the currently selected conversation
                        unreadCount: (selectedConversation && selectedConversation._id === data.conversation._id)
                            ? 0 // If selected, it's immediately read
                            : (updatedConversationsList[existingConvIndex].unreadCount || 0) + 1
                    };
                } else {
                    // Add new conversation if it doesn't exist
                    updatedConversationsList = [{
                        ...data.conversation,
                        contactId: data.contact, // Ensure populated contact details are used
                        unreadCount: 1 // New conversation starts with 1 unread message
                    }, ...prevConversations];
                }
                // Sort by latest activity for display
                return updatedConversationsList.sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt));
            });

            // If the message is for the currently selected conversation, also add it to chat history
            if (selectedConversation && data.conversation._id === selectedConversation._id) {
                setMessages(prevMessages => [...prevMessages, data.message]);
            }
        });

        // Socket.IO Listener for NEW CHAT MESSAGES (updates selected conversation's messages)
        // This is typically for messages within the *currently open* chat window
        socket.on('newChatMessage', (data) => {
            console.log("Socket: newChatMessage received (for Chat Window update):", data);
            if (selectedConversation && data.conversationId === selectedConversation._id) {
                setMessages(prevMessages => [...prevMessages, data.message]);
                // If this is an inbound message for the currently selected conversation, mark as read
                if (data.message.direction === 'inbound') {
                     api.put(`/projects/${projectId}/conversations/${selectedConversation._id}/read`, {}, config)
                        .then(() => {
                            setConversations(prev => prev.map(conv =>
                                conv._id === selectedConversation._id ? { ...conv, unreadCount: 0 } : conv
                            ));
                        })
                        .catch(err => console.error("Error marking as read via socket:", err));
                }
            }
        });


        // Socket.IO Listener for message status updates (for messages *we* sent)
        socket.on('messageStatusUpdate', (data) => {
            console.log("Socket: messageStatusUpdate received:", data);
            setMessages(prevMessages => prevMessages.map(msg =>
                msg.metaMessageId === data.metaMessageId ? { ...msg, status: data.newStatus, sentAt: data.sentAt } : msg
            ));
        });

        // Cleanup on unmount
        return () => {
            socket.off('newInboundMessage');
            socket.off('newChatMessage');
            socket.off('messageStatusUpdate');
            socket.emit('leaveRoom', user._id);
            socket.emit('leaveRoom', `project-${projectId}`);
        };
    }, [user, token, projectId, navigate, selectedConversation]); // Re-run effect if selectedConversation changes

    // Auto-scroll messages to bottom when messages array changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- Event Handlers ---
    const handleConversationSelect = (conv) => {
        if (selectedConversation?._id !== conv._id) { // Only re-fetch if a different conversation is selected
            setSelectedConversation(conv);
            setNewMessageText(''); // Clear message input
            fetchMessages(conv._id); // Fetch messages for the newly selected conversation
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!selectedConversation || !newMessageText.trim()) {
            setMessage('Please select a conversation and type a message.');
            return;
        }

        setIsSending(true);
        setMessage('');

        const messagePayload = {
            messageType: 'text',
            messageContent: newMessageText.trim(),
        };

        try {
            // Using api directly, adjust if `api` utility has specific interceptors
            const res = await api.post(
                `/projects/${projectId}/conversations/${selectedConversation._id}/messages`,
                messagePayload,
                config
            );
            console.log("Message sent response:", res.data);

            // Optimistically add message to UI (status 'pending')
            setMessages(prevMessages => [...prevMessages, {
                _id: res.data.data._id, // Backend returns the DB _id
                conversationId: selectedConversation._id,
                direction: 'outbound',
                type: 'text',
                message: { body: newMessageText.trim() },
                status: 'pending', // Initial status, will be updated by webhook
                sentAt: new Date(), // Local timestamp, will be updated by webhook status
                metaMessageId: res.data.data.metaMessageId // Meta ID for status tracking
            }]);

            // Also update the conversation list's latest message and time
            setConversations(prevConversations => {
                const updatedList = prevConversations.map(conv => {
                    if (conv._id === selectedConversation._id) {
                        return {
                            ...conv,
                            latestMessage: newMessageText.trim(),
                            latestMessageType: 'text',
                            lastActivityAt: new Date(),
                            unreadCount: 0 // Assume sender reads their own message
                        };
                    }
                    return conv;
                }).sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt)); // Re-sort
                return updatedList;
            });

            setNewMessageText('');
        } catch (error) {
            console.error('Error sending message:', error.response?.data?.message || error.message);
            setMessage(`Error sending message: ${error.response?.data?.message || 'Failed to send message.'}`);
        } finally {
            setIsSending(false);
        }
    };

    if (!user || isLoading) {
        return <p className="text-center py-10">Loading live chat...</p>;
    }

    // This button was for local testing the webhook and should be removed in production UI
    // const handletestlive = async () => {
    //     try {
    //         // This is a simulated GET request, not a real Meta webhook POST
    //         const res = await api.get(`http://localhost:5001/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=${process.env.REACT_APP_WHATSAPP_VERIFY_TOKEN || 'your_default_token'}&hub.challenge=123456`);
    //         console.log("Webhook test response:", res.data);
    //         setMessage('Webhook test initiated. Check server console for logs.');
    //     } catch (error) {
    //         console.error('Error testing webhook:', error.response?.data?.message || error.message);
    //         setMessage(`Error testing webhook: ${error.response?.data?.message || 'Failed to test.'}`);
    //     }
    // };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-lg shadow-md mt-8 overflow-hidden">
            {/* <button onClick={handletestlive}>Test Webhook (Dev Only)</button> */}
            {/* Left Panel: Conversation List */}
            <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
               
                <div className="flex-grow overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="p-4 text-gray-500 text-sm">No conversations yet. Messages from WhatsApp users will appear here.</p>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv._id}
                                className={`flex items-center p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition duration-150 ${
                                    selectedConversation?._id === conv._id ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                                }`}
                                onClick={() => handleConversationSelect(conv)}
                            >
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-gray-800">
                                            {conv.contactId?.profileName || conv.contactId?.name || conv.contactId?.mobileNumber || 'Unknown Contact'}
                                        </h4>
                                        {conv.unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {conv.latestMessageType === 'text' ? conv.latestMessage : `[${conv.latestMessageType} message]`}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(conv.lastActivityAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel: Chat Window */}
            <div className="w-2/3 flex flex-col bg-white">
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Chat with {selectedConversation.contactId?.profileName || selectedConversation.contactId?.name || selectedConversation.contactId?.mobileNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Mobile: {selectedConversation.contactId?.countryCode}{selectedConversation.contactId?.mobileNumber}
                            </p>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-100">
                            {messages.length === 0 ? (
                                <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
                            ) : (
                                messages.map(msg => (
                                    <div
                                        key={msg._id}
                                        className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs p-3 rounded-lg shadow-sm ${
                                                msg.direction === 'outbound'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-300 text-gray-800'
                                            }`}
                                        >
                                            {msg.type === 'text' && <p>{msg.message.body}</p>}
                                            {/* Render other message types if needed */}
                                            {msg.type === 'template' && (
                                                <p className="font-semibold">Template: {msg.message.name}</p>
                                            )}
                                            {(msg.type === 'image' || msg.type === 'document') && (
                                                <div>
                                                    <p className="font-semibold">{msg.type.toUpperCase()}</p>
                                                    {msg.message.link && <a href={msg.message.link} target="_blank" rel="noopener noreferrer" className="text-blue-200 underline break-all">{msg.message.link.substring(0, 30)}...</a>}
                                                    {msg.message.id && <p className="text-xs">Meta ID: {msg.message.id}</p>}
                                                    {msg.message.caption && <p className="text-sm italic">{msg.message.caption}</p>}
                                                </div>
                                            )}
                                            {/* Fallback for unhandled message types */}
                                            {![ 'text', 'template', 'image', 'document' ].includes(msg.type) && (
                                                <p className="italic text-sm">[Unsupported Message Type: {msg.type}]</p>
                                            )}
                                            <p className={`text-xs mt-1 ${msg.direction === 'outbound' ? 'text-blue-100' : 'text-gray-600'}`}>
                                                {new Date(msg.sentAt).toLocaleTimeString()}
                                                {msg.direction === 'outbound' && (
                                                    <span className="ml-2">
                                                        {msg.status === 'sent' && '✓'}
                                                        {msg.status === 'delivered' && '✓✓'}
                                                        {msg.status === 'read' && '✓✓ (Read)'}
                                                        {msg.status === 'failed' && '✗ (Failed)'}
                                                        {msg.status === 'pending' && '...'}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50 flex items-center space-x-3">
                            <input
                                type="text"
                                className="flex-grow border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Type a message..."
                                value={newMessageText}
                                onChange={(e) => setNewMessageText(e.target.value)}
                                disabled={isSending}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-500">
                        Select a conversation to start chatting.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveChatPage;
