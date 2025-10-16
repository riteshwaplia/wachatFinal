import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';  
const BroadcastDetails = () => {
  const { id, broadcastId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [broadcast, setBroadcast] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch broadcast details
  const fetchBroadcastDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}/messages/bulk-send-jobs/${broadcastId}`);
      setBroadcast(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching broadcast details:', error);
      setLoading(false);
    }
  };

  // Fetch messages with pagination
  const fetchMessages = async (page = 1) => {
    try {
      setMessagesLoading(true);
      const response = await api.get(`/projects/${id}/messages/bulk-send-jobs/${broadcastId}/messages`, {
        params: { page, limit: pagination.limit }
      });
      setMessages(response.data.data);
      setPagination(response.data.pagination);
      setMessagesLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcastDetails();
    fetchMessages(1);
  }, [id, broadcastId]);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchMessages(newPage);
    }
  };

  // Export to CSV
  const exportToCSV = async () => {
    try {
      const response = await api.get(`/projects/${id}/messages/bulk-send-jobs/${broadcastId}/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `broadcast-${broadcastId}-messages.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">{t('loading')}</div>
        </div>
      </div>
    );
  }

  if (!broadcast) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">{t('broadcastNotFound')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-surface"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">
                {broadcast.jobDetails?.templateName || t('untitledBroadcast')}
              </h1>
              <p className="text-gray-500 mt-1">
                {t('broadcastDetails')}
              </p>
            </div>
          </div>
          
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary"
          >
            <FiDownload className="mr-2 h-4 w-4" />
            {t('exportCSV')}
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-dark-border">
            <p className="text-sm font-medium text-gray-500">{t('status')}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                broadcast.jobDetails?.status === 'completed' ? 'bg-green-100 text-green-800' :
                broadcast.jobDetails?.status === 'failed' ? 'bg-red-100 text-red-800' :
                broadcast.jobDetails?.status === 'completed_with_errors' ? 'bg-orange-100 text-orange-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {broadcast.jobDetails?.status}
              </span>
            </p>
          </div>

          <div className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-dark-border">
            <p className="text-sm font-medium text-gray-500">{t('totalRecipients')}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
              {broadcast.jobDetails?.totalContacts || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-dark-border">
            <p className="text-sm font-medium text-gray-500">{t('delivered')}</p>
            <p className="mt-1 text-lg font-semibold text-green-600">
              {broadcast.jobDetails?.totalSent || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-dark-border">
            <p className="text-sm font-medium text-gray-500">{t('failed')}</p>
            <p className="mt-1 text-lg font-semibold text-red-600">
              {broadcast.jobDetails?.totalFailed || 0}
            </p>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border">
          <div className="px-6 py-4 border-b dark:border-dark-border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
              {t('jobDetails')}
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">{t('templateName')}</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-dark-text-primary">
                  {broadcast.jobDetails?.templateName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('language')}</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-dark-text-primary">
                  {broadcast.jobDetails?.language || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('createdAt')}</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-dark-text-primary">
                  {formatDate(broadcast.jobDetails?.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t('startTime')}</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-dark-text-primary">
                  {broadcast.jobDetails?.startTime ? formatDate(broadcast.jobDetails.startTime) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border">
          <div className="px-6 py-4 border-b dark:border-dark-border border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
              {t('messageDetails')}
            </h3>
            <span className="text-sm text-gray-500">
              {t('showing')} {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} {t('of')} {pagination.total}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
              <thead className="bg-gray-50 dark:bg-dark-surface">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('recipient')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('time')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('errorMessage')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-dark-border">
                {messagesLoading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      {t('loading')}
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      {t('noMessagesFound')}
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr key={message._id} className="hover:bg-gray-50 dark:hover:bg-dark-background">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text-primary">
                        {message.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          message.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                          message.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {t(message.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(message.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {message.errorMessage || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {messages.length > 0 && (
            <div className="px-6 py-4 border-t dark:border-dark-border border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {t('page')} {pagination.page} {t('of')} {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-surface"
                >
                  <FiArrowLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        pagination.page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-primary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-surface"
                >
                  <FiArrowLeft className="h-4 w-4 transform rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BroadcastDetails;