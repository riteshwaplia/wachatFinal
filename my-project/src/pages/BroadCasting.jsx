import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import { FiChevronRight, FiExternalLink, FiDownload } from 'react-icons/fi';

const BulkMessagingDashboard = () => {
  const router = useNavigate();
  const [broadcasts, setBroadcasts] = useState([]);
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    read: 0,
    failed: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const projectId = params.id;

  // Fetch broadcast jobs on component mount
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await api.get(`/projects/${projectId}/messages/bulk-send-jobs`);
        setBroadcasts(response.data.data);
        
        // Calculate stats
        const stats = response.data.data.reduce((acc, job) => {
          acc.total += job.totalContacts || 0;
          acc.delivered += job.totalSent || 0;
          acc.read += job.readCount || 0;
          acc.failed += job.totalFailed || 0;
          return acc;
        }, { total: 0, delivered: 0, read: 0, failed: 0 });
        
        setStats(stats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching broadcasts:', error);
        setLoading(false);
      }
    };

    fetchBroadcasts();
  }, [projectId]);

  // Fetch detailed broadcast data
  const fetchBroadcastDetails = async (broadcastId) => {
    try {
      const response = await api.get(`/projects/${projectId}/messages/bulk-send-jobs/${broadcastId}`);
      setSelectedBroadcast(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching broadcast details:', error);
    }
  };

  // Create new broadcast
  const createNewBroadcast = () => {
    router(`/project/${projectId}/broadcasting/send-bulk`);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBroadcast(null);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with stats and new broadcast button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Broadcast Center</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your bulk message campaigns
          </p>
        </div>
        <button
          onClick={createNewBroadcast}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          + New Broadcast
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Messages</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Read</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.read}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Broadcasts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center">Loading broadcasts...</div>
          ) : broadcasts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No broadcasts found</div>
          ) : (
            broadcasts.map((broadcast) => (
              <div 
                key={broadcast._id} 
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => fetchBroadcastDetails(broadcast._id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{broadcast.templateName || 'Untitled Broadcast'}</h4>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{formatDate(broadcast.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{broadcast.totalContacts || 0} recipients</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        broadcast.status === 'completed' ? 'bg-green-100 text-green-800' :
                        broadcast.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {broadcast.status}
                      </span>
                    </div>
                    <FiChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="mt-3 flex space-x-4 text-sm">
                  <div className="flex items-center text-green-600">
                    <span className="font-medium">{broadcast.totalSent || 0}</span>
                    <span className="ml-1">Delivered</span>
                  </div>
                  <div className="flex items-center text-blue-500">
                    <span className="font-medium">{broadcast.readCount || 0}</span>
                    <span className="ml-1">Read</span>
                  </div>
                  <div className="flex items-center text-red-600">
                    <span className="font-medium">{broadcast.totalFailed || 0}</span>
                    <span className="ml-1">Failed</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Broadcast Details Modal */}
      {isModalOpen && selectedBroadcast && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {selectedBroadcast.jobDetails.templateName}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Created on {formatDate(selectedBroadcast.jobDetails.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Template Name</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedBroadcast.jobDetails.templateName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Language</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedBroadcast.jobDetails.language}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Recipients</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedBroadcast.jobDetails.totalContacts}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedBroadcast.jobDetails.status === 'completed' ? 'bg-green-100 text-green-800' :
                            selectedBroadcast.jobDetails.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedBroadcast.jobDetails.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Status Breakdown</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-2xl font-semibold text-green-600">{selectedBroadcast.jobDetails.totalSent || 0}</p>
                          <p className="text-xs text-green-800">Delivered</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-2xl font-semibold text-blue-600">{selectedBroadcast.jobDetails.readCount || 0}</p>
                          <p className="text-xs text-blue-800">Read</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <p className="text-2xl font-semibold text-red-600">{selectedBroadcast.jobDetails.totalFailed || 0}</p>
                          <p className="text-xs text-red-800">Failed</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-500">Message Details</h4>
                        <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <FiDownload className="mr-2 h-4 w-4" />
                          Export CSV
                        </button>
                      </div>
                      <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Recipient
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedBroadcast.messages.slice(0, 10).map((message) => (
                              <tr key={message._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {message.to}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    message.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {message.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(message.updatedAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button className="text-blue-600 hover:text-blue-900">
                                    <FiExternalLink className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkMessagingDashboard;