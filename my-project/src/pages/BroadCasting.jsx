// import React, { useState, useEffect } from 'react';
// import api from '../utils/api';
// import { useNavigate, useParams } from 'react-router-dom';
// import { FiChevronRight, FiExternalLink, FiDownload } from 'react-icons/fi';
// import Button from '../components/Button';
// import { useTranslation } from 'react-i18next';

// const BulkMessagingDashboard = () => {
//   const router = useNavigate();
//   const [broadcasts, setBroadcasts] = useState([]);
//   const [selectedBroadcast, setSelectedBroadcast] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     total: 0,
//     delivered: 0,
//     read: 0,
//     failed: 0
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const params = useParams();
//   const projectId = params.id;
//   const { t } = useTranslation();

//   // Fetch broadcast jobs on component mount
//   useEffect(() => {
//     const fetchBroadcasts = async () => {
//       try {
//         const response = await api.get(`/projects/${projectId}/messages/bulk-send-jobs`);
//         setBroadcasts(response.data.data);

//         // Calculate stats
//         const stats = response.data.data.reduce((acc, job) => {
//           acc.total += job.totalContacts || 0;
//           acc.delivered += job.totalSent || 0;
//           acc.read += job.readCount || 0;
//           acc.failed += job.totalFailed || 0;
//           return acc;
//         }, { total: 0, delivered: 0, read: 0, failed: 0 });

//         setStats(stats);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching broadcasts:', error);
//         setLoading(false);
//       }
//     };

//     fetchBroadcasts();
//   }, [projectId]);

//   // Fetch detailed broadcast data
//   const fetchBroadcastDetails = async (broadcastId) => {
//     try {
//       const response = await api.get(`/projects/${projectId}/messages/bulk-send-jobs/${broadcastId}`);
//       setSelectedBroadcast(response.data.data);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error('Error fetching broadcast details:', error);
//     }
//   };

//   // Create new broadcast
//   const createNewBroadcast = () => {
//     router(`/project/${projectId}/broadcasting/send-bulk`);
//   };
//   const createNewCarosualBroadcast = () => {
//     router(`/project/${projectId}/broadcasting/send-bulk/carosual-template`);
//   };
//   const createNewProdutBroadcast = () => {
//     router(`/project/${projectId}/broadcasting/send-bulk/product-template`);
//   };
//   // /project/:id/broadcasting/send-/send-bulk/carosual-template
//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedBroadcast(null);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div className="space-y-6 p-6"> {/* Added padding for better layout */}
//       {/* Header with stats and new broadcast button */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
//         {/* Left Section */}
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-dark-text-primary">
//             {t('broadcastCenter')}
//           </h1>
//           <p className="mt-1 text-sm text-gray-500">
//             {t('manageBulkMessageCampaigns')}
//           </p>
//         </div>

//         {/* Right Section - Buttons */}
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
//           <Button
//             onClick={createNewBroadcast}
//             className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
//           >
//             + {t('newBroadcast')}
//           </Button>

//           <Button
//             onClick={createNewCarosualBroadcast}
//             className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
//           >
//             + {t('newCarouselBroadcast')}
//           </Button>
//           <Button
//           variant="secondary"
//             onClick={createNewProdutBroadcast}
//             className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
//           >
//             + {t('newProductBroadcast')}
//           </Button>
//         </div>
//       </div>


//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
//         <div className="bg-white p-4 dark:bg-dark-surface dark:border-dark-border rounded-lg border border-gray-200">
//           <div className="flex items-center">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-500">{t('totalMessages')}</p>
//               <p className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">{stats.total}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded-lg dark:bg-dark-surface dark:border-dark-border border border-gray-200">
//           <div className="flex items-center">
//             <div className="bg-green-100 p-3 rounded-full">
//               <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-500">{t('delivered')}</p>
//               <p className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">{stats.delivered}</p>
//             </div>
//           </div>
//         </div>

//         {/* <div className="bg-white p-4 rounded-lg border border-gray-200">
//           <div className="flex items-center">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-500">Read</p>
//               <p className="text-2xl font-semibold text-gray-900">{stats.read}</p>
//             </div>
//           </div>
//         </div> */}

//         <div className="bg-white p-4 rounded-lg dark:bg-dark-surface dark:border-dark-border border border-gray-200">
//           <div className="flex items-center">
//             <div className="bg-red-100 p-3 rounded-full">
//               <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-500">{t('failed')}</p>
//               <p className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">{stats.failed}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Broadcast List */}
//       <div className="bg-white rounded-lg border dark:bg-dark-surface dark:border-dark-surface border-gray-200 overflow-hidden">
//         <div className="px-6 py-4 border-b dark:border-dark-border border-gray-200">
//           <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary
// ">{t('recentBroadcasts')}</h3>
//         </div>
//         <div className="divide-y divide-gray-200">
//           {loading ? (
//             <div className="p-6 text-center">{t('loadingBroadcasts')}</div>
//           ) : broadcasts.length === 0 ? (
//             <div className="p-6 text-center text-gray-500">{t('noBroadcastsFound')}</div>
//           ) : (
//             broadcasts.map((broadcast) => (
//               <div
//                 key={broadcast._id}
//                 className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
//                 onClick={() => fetchBroadcastDetails(broadcast._id)}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">{broadcast.templateName || t('untitledBroadcast')}</h4>
//                     <div className="mt-1 flex items-center text-sm text-gray-500">
//                       <span>{formatDate(broadcast.createdAt)}</span>
//                       <span className="mx-2">•</span>
//                       <span>{broadcast.totalContacts || 0} {t('recipients')}</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="mr-4">
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${broadcast.status === 'completed' ? 'bg-green-100 text-green-800' :
//                         broadcast.status === 'failed' ? 'bg-red-100 text-red-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                         {broadcast.status}
//                       </span>
//                     </div>
//                     <FiChevronRight className="h-5 w-5 text-gray-400" />
//                   </div>
//                 </div>
//                 <div className="mt-3 flex space-x-4 text-sm">
//                   <div className="flex items-center text-green-600">
//                     <span className="font-medium">{broadcast.totalSent || 0}</span>
//                     <span className="ml-1">{t('delivered')}</span>
//                   </div>
//                   {/* <div className="flex items-center text-blue-500">
//                     <span className="font-medium">{broadcast.readCount || 0}</span>
//                     <span className="ml-1">Read</span>
//                   </div> */}
//                   <div className="flex items-center text-red-600">
//                     <span className="font-medium">{broadcast.totalFailed || 0}</span>
//                     <span className="ml-1">{t('failed')}</span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Broadcast Details Modal */}
//       {isModalOpen && selectedBroadcast && (
//         <div className="fixed inset-0 overflow-y-auto z-50">
//           <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
//             </div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg leading-6 font-medium text-gray-900">
//                           {selectedBroadcast.jobDetails.templateName}
//                         </h3>
//                         <p className="mt-1 text-sm text-gray-500">
//                           {t('createdOn')}: {formatDate(selectedBroadcast.jobDetails.createdAt)}
//                         </p>
//                       </div>
//                       <button
//                         onClick={closeModal}
//                         className="text-gray-400 hover:text-gray-500"
//                       >
//                         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </button>
//                     </div>

//                     <div className="mt-6 grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">{t('templateName')}</p>
//                         <p className="mt-1 text-sm text-gray-900">{selectedBroadcast.jobDetails.templateName}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">{t('language')}</p>
//                         <p className="mt-1 text-sm text-gray-900">{selectedBroadcast.jobDetails.language}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">{t('totalRecipients')}</p>
//                         <p className="mt-1 text-sm text-gray-900">{selectedBroadcast.jobDetails.totalContacts}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-500">{t('status')}</p>
//                         <p className="mt-1">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedBroadcast.jobDetails.status === 'completed' ? 'bg-green-100 text-green-800' :
//                             selectedBroadcast.jobDetails.status === 'failed' ? 'bg-red-100 text-red-800' :
//                               'bg-yellow-100 text-yellow-800'
//                             }`}>
//                             {selectedBroadcast.jobDetails.status}
//                           </span>
//                         </p>
//                       </div>
//                     </div>

//                     <div className="mt-6">
//                       <h4 className="text-sm font-medium text-gray-500 mb-2">{t('statusBreakdown')}</h4>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="bg-green-50 p-3 rounded-lg text-center">
//                           <p className="text-2xl font-semibold text-green-600">{selectedBroadcast.jobDetails.totalSent || 0}</p>
//                           <p className="text-xs text-green-800">{t('delivered')}</p>
//                         </div>
//                         {/* <div className="bg-blue-50 p-3 rounded-lg text-center">
//                           <p className="text-2xl font-semibold text-blue-600">{selectedBroadcast.jobDetails.readCount || 0}</p>
//                           <p className="text-xs text-blue-800">Read</p>
//                         </div> */}
//                         <div className="bg-red-50 p-3 rounded-lg text-center">
//                           <p className="text-2xl font-semibold text-red-600">{selectedBroadcast.jobDetails.totalFailed || 0}</p>
//                           <p className="text-xs text-red-800">{t('failed')}</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-6">
//                       <div className="flex justify-between items-center mb-3">
//                         <h4 className="text-sm font-medium text-gray-500">{t('messageDetails')}</h4>
//                         {/* <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                           <FiDownload className="mr-2 h-4 w-4" />
//                           Export CSV
//                         </button> */}
//                       </div>
//                       <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 {t('recipient')}
//                               </th>
//                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 {t('status')}
//                               </th>
//                               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 {t('time')}
//                               </th>
//                               {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                 Actions
//                               </th> */}
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-surface">
//                             {selectedBroadcast.messages.slice(0, 10).map((message) => (
//                               <tr key={message._id}>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                   {message.to}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${message.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                                     message.status === 'read' ? 'bg-blue-100 text-blue-800' :
//                                       'bg-red-100 text-red-800'
//                                     }`}>
//                                     {t(message.status)}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                   {formatDate(message.updatedAt)}
//                                 </td>
//                                 {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                   <button className="text-blue-600 hover:text-blue-900">
//                                     <FiExternalLink className="h-4 w-4" />
//                                   </button>
//                                 </td> */}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={closeModal}
//                 >
//                   {t('close')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BulkMessagingDashboard;


import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiChevronRight, FiCalendar, FiChevronLeft, FiChevronRight as FiRight, FiChevronLeft as FiLeft } from 'react-icons/fi';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';

const BulkMessagingDashboard = () => {
  const router = useNavigate();
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    read: 0,
    failed: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalJobs: 0,
    totalPages: 0
  });
  const [dateFilter, setDateFilter] = useState({
    from: '',
    to: '',
    preset: '7days' // 'today', 'yesterday', '7days', '30days', 'custom'
  });
  const params = useParams();
  const projectId = params.id;
  const { t } = useTranslation();


  // Calculate date ranges
// Helper to get YYYY-MM-DD in local timezone
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateRange = (preset) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case "today":
      return {
        from: formatLocalDate(today),
        to: formatLocalDate(today),
      };

    case "yesterday":
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        from: formatLocalDate(yesterday),
        to: formatLocalDate(yesterday),
      };

    case "7days":
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return {
        from: formatLocalDate(sevenDaysAgo),
        to: formatLocalDate(today),
      };

    case "30days":
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return {
        from: formatLocalDate(thirtyDaysAgo),
        to: formatLocalDate(today),
      };

    default:
      return { from: "", to: "" };
  }
};

  // Fetch broadcast jobs
  const fetchBroadcasts = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit
      };

      if (dateFilter.preset === 'custom' && dateFilter.from && dateFilter.to) {
        params.from = dateFilter.from;
        params.to = dateFilter.to;
      } else if (dateFilter.preset !== 'custom') {
        const range = getDateRange(dateFilter.preset);
        if (range.from && range.to) {
          params.from = range.from;
          params.to = range.to;
        }
      }

      const response = await api.get(`/projects/${projectId}/messages/bulk-send-jobs`, { params });
      setBroadcasts(response.data.data);
      setPagination(response.data.pagination);

      // Calculate stats from current page data
      const currentStats = response.data.data.reduce((acc, job) => {
        acc.total += job.totalContacts || 0;
        acc.delivered += job.totalSent || 0;
        acc.read += job.readCount || 0;
        acc.failed += job.totalFailed || 0;
        return acc;
      }, { total: 0, delivered: 0, read: 0, failed: 0 });

      setStats(currentStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts(1);
  }, [projectId, dateFilter]);

  // Handle date filter change
  const handleDateFilterChange = (preset) => {
    setDateFilter(prev => ({
      ...prev,
      preset,
      from: '',
      to: ''
    }));
  };

  // Handle custom date change
  const handleCustomDateChange = (field, value) => {
    setDateFilter(prev => ({
      ...prev,
      preset: 'custom',
      [field]: value
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBroadcasts(newPage);
    }
  };

  // Create new broadcast functions
  const createNewBroadcast = () => {
    router(`/project/${projectId}/broadcasting/send-bulk`);
  };

  const createNewCarosualBroadcast = () => {
    router(`/project/${projectId}/broadcasting/send-bulk/carosual-template`);
  };

  const createNewProductBroadcast = () => {
    router(`/project/${projectId}/broadcasting/send-bulk/product-template`);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Navigate to details page
  const navigateToDetails = (broadcastId) => {
    router(`/project/${projectId}/broadcasting/bulk-send-jobs/${broadcastId}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with stats and new broadcast button */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-dark-text-primary">
            {t('broadcastCenter')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('manageBulkMessageCampaigns')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
          <Button
            onClick={createNewBroadcast}
            className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
          >
            + {t('newBroadcast')}
          </Button>

          <Button
            onClick={createNewCarosualBroadcast}
            className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
          >
            + {t('newCarouselBroadcast')}
          </Button>
          <Button
            variant="secondary"
            onClick={createNewProductBroadcast}
            className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2"
          >
            + {t('newProductBroadcast')}
          </Button>
        </div>
      </div>

      {/* Date Filter Section */}
      <div className="bg-white rounded-lg border dark:bg-dark-surface dark:border-dark-border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
            {t('filterByDate')}
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {/* Preset date filters */}
            {['today', 'yesterday', '7days', '30days'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleDateFilterChange(preset)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  dateFilter.preset === preset
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t(preset)}
              </button>
            ))}
            
            {/* Custom date filter */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
              <FiCalendar className="text-gray-400" />
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) => handleCustomDateChange('from', e.target.value)}
                className="text-sm border-none focus:ring-0 p-0"
                placeholder="From"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) => handleCustomDateChange('to', e.target.value)}
                className="text-sm border-none focus:ring-0 p-0"
                placeholder="To"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-white p-4 dark:bg-dark-surface dark:border-dark-border rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('totalMessages')}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg dark:bg-dark-surface dark:border-dark-border border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('delivered')}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">{stats.delivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg dark:bg-dark-surface dark:border-dark-border border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('failed')}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-dark-text-primary">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast List */}
      <div className="bg-white rounded-lg border dark:bg-dark-surface dark:border-dark-surface border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b dark:border-dark-border border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
            {t('recentBroadcasts')}
          </h3>
          <span className="text-sm text-gray-500">
            {t('showing')} {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalJobs)} {t('of')} {pagination.totalJobs}
          </span>
        </div>
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center">{t('loadingBroadcasts')}</div>
          ) : broadcasts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">{t('noBroadcastsFound')}</div>
          ) : (
            broadcasts.map((broadcast) => (
              <div
                key={broadcast._id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => navigateToDetails(broadcast._id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{broadcast.templateName || t('untitledBroadcast')}</h4>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{formatDate(broadcast.startTime)}</span>
                      <span className="mx-2">•</span>
                      <span>{broadcast.totalContacts || 0} {t('recipients')}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        broadcast.status === 'completed' ? 'bg-green-100 text-green-800' :
                        broadcast.status === 'failed' ? 'bg-red-100 text-red-800' :
                        broadcast.status === 'completed_with_errors' ? 'bg-orange-100 text-orange-800' :
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
                    <span className="ml-1">{t('delivered')}</span>
                  </div>
                  <div className="flex items-center text-red-600">
                    <span className="font-medium">{broadcast.totalFailed || 0}</span>
                    <span className="ml-1">{t('failed')}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {broadcasts.length > 0 && (
          <div className="px-6 py-4 border-t dark:border-dark-border border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {t('page')} {pagination.page} {t('of')} {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <FiChevronLeft className="h-4 w-4" />
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
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkMessagingDashboard;
