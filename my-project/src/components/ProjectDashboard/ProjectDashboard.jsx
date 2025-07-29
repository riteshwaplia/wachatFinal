import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle,
  BarChart2,
  Clock,
  Calendar,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import RecentActivity from '../RecentActivity';
import Card from '../Card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../utils/api'
import CreateFlowButton from '../../apis/CreateFlowButton';
import { sendgroupbroadcast } from '../../apis/ApiForTest';

const ProjectDashboard = () => {
  const { id: projectId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  const fetchDashboardData = async () => {
    if (!projectId) {
      setError("Project ID is missing in the URL. Please select a project.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/projects/${projectId}/dashboard/stats`);
      if (response.data.success) {
        setStats(response.data.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setError(response.data.message || 'Failed to fetch dashboard data.');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error fetching dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [projectId]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* <CreateFlowButton/> */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Project Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Last updated: {lastUpdated}</span>
          <button 
            className="p-1 rounded hover:bg-gray-100"
            onClick={sendgroupbroadcast}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Contacts" 
          value={stats.contacts.total} 
          change={stats.contacts.changeVsLastWeek} 
          icon={<Phone size={20} className="text-primary-500" />}
          link={`/project/${projectId}/contacts`}
        >
          <div className="text-sm text-gray-500 mt-1">
            <span className="text-green-500">+{stats.contacts.newThisWeek}</span> this week
          </div>
        </StatCard>

        <StatCard 
          title="Groups" 
          value={stats.groups.total} 
          icon={<Users size={20} className="text-secondary-500" />}
          link={`/project/${projectId}/group`}
        >
          <div className="flex space-x-4 text-sm mt-1">
            <span className="text-gray-500">
              <span className="text-green-500">{stats.groups.active}</span> active
            </span>
            <span className="text-gray-500">
              <span className="text-gray-400">{stats.groups.inactive}</span> inactive
            </span>
          </div>
        </StatCard>

        {/* <StatCard 
          title="Templates" 
          value={stats.templates.total} 
          icon={<MessageSquare size={20} className="text-accent-500" />}
          link={`/project/${projectId}/templates`}
        >
          <div className="flex space-x-4 text-sm mt-1">
            <span className="text-gray-500">
              <span className="text-green-500">{stats.templates.approved}</span> approved
            </span>
            <span className="text-gray-500">
              <span className="text-yellow-500">{stats.templates.pending}</span> pending
            </span>
          </div>
        </StatCard> */}

        <StatCard 
          title="Broadcasting" 
          value={`${stats.broadcasting.success}/${stats.broadcasting.totalJobs}`} 
          icon={<Mail size={20} className="text-purple-500" />}
          link={`/project/${projectId}/broadcasting`}
        >
          <div className="flex space-x-4 text-sm mt-1">
            <span className="text-gray-500">
              <span className="text-green-500">{stats.broadcasting.success}</span> success
            </span>
            <span className="text-gray-500">
              <span className="text-red-500">{stats.broadcasting.failed}</span> failed
            </span>
            {/* <span className="text-gray-500">
              <span className="text-blue-500">{stats.broadcasting.scheduled}</span> scheduled
            </span> */}
          </div>
        </StatCard>

        {/* <StatCard 
          title="Team Members" 
          value={stats.teamMembers.total} 
          icon={<Users size={20} className="text-indigo-500" />}
          link={`/project/${projectId}/team-members`}
        >
          <div className="flex space-x-4 text-sm mt-1">
            <span className="text-gray-500">
              <span className="text-primary-500">{stats.teamMembers.admins}</span> admins
            </span>
            <span className="text-gray-500">
              <span className="text-gray-600">{stats.teamMembers.members}</span> members
            </span>
          </div>
        </StatCard> */}

        <StatCard 
          title="Live Chat" 
          value={stats.liveChat.activeUserCount} 
          change={stats.liveChat.responseRate}
          icon={<MessageSquare size={20} className="text-teal-500" />}
          link={`/project/${projectId}/chat`}
        >
          <div className="flex space-x-4 text-sm mt-1">
            <span className="text-gray-500">
              <span className="text-blue-500">{stats.liveChat.unread}</span> messages
            </span>
            <span className="text-gray-500">
              <span className="text-green-500">{stats.liveChat.responseRate}%</span> response rate
            </span>
          </div>
        </StatCard>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionCard
          title="Create Broadcast"
          description="Send a message to your contacts"
          icon={<Mail size={20} />}
          link={`/project/${projectId}/broadcasting/send-bulk`}
          color="bg-purple-50 text-purple-600"
        />
        <QuickActionCard
          title="Add Contacts"
          description="Import or add new contacts"
          icon={<Phone size={20} />}
          link={`/project/${projectId}/contacts`}
          color="bg-blue-50 text-blue-600"
        />
        <QuickActionCard
          title="Create Template"
          description="Design a new message template"
          icon={<MessageSquare size={20} />}
          link={`/project/${projectId}/templates/create`}
          color="bg-green-50 text-green-600"
        />
      </div>

      {/* Recent Activity - You might want to fetch this separately */}
      <Card title="Recent Activity" icon={<BarChart2 size={20} />}>
        <div className="text-center py-8 text-gray-500">
          Recent activity would be displayed here
        </div>
        <div className="mt-4 text-right">
          <Link 
            to={`/project/${projectId}/activity`} 
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
          >
            View all activity <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

// Stat Card Component (unchanged)
export const StatCard = ({ title, value, change, icon, link, children }) => {
  return (
    <Card>
      <Link to={link} className="block hover:bg-gray-50 rounded-lg -m-4 p-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-opacity-20 flex items-center justify-center">
            {icon}
          </div>
        </div>
        {children}
        {change && (
          <div className="mt-2 flex items-center text-sm">
            {change > 0 ? (
              <span className="text-green-500 flex items-center">
                <ArrowUp size={14} className="mr-1" /> {change}%
              </span>
            ) : (
              <span className="text-red-500 flex items-center">
                <ArrowDown size={14} className="mr-1" /> {Math.abs(change)}%
              </span>
            )}
            <span className="text-gray-500 ml-1">vs last week</span>
          </div>
        )}
      </Link>
    </Card>
  );
};

// Quick Action Card Component (unchanged)
const QuickActionCard = ({ title, description, icon, link, color }) => {
  return (
    <Link to={link} className={`group block rounded-lg p-4 border hover:shadow-md transition-all ${color.split(' ')[0]} ${color.split(' ')[1]}`}>
      <div className="flex items-start">
        <div className={`p-2 rounded-lg ${color.split(' ')[0]} bg-opacity-30 mr-3`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium group-hover:underline">{title}</h3>
          <p className="text-sm opacity-80 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectDashboard;



// client/src/components/Dashboard/Dashboard.js
// import React, { useEffect, useState } from 'react';
// import api from '../../utils/api'; // Assuming your configured axios instance
// import {
//   Users,
//   LayoutGrid,
//   FileText,
//   Send,
//   UserCheck,
//   MessageSquare,
//   ArrowUp,
//   ArrowDown,
//   CircleDotDashed // For pending templates
// } from 'lucide-react'; // Make sure you have lucide-react installed: npm install lucide-react

// // Reusable StatCard component
// const StatCard = ({ title, value, icon: Icon, subStats, className = '' }) => (
//   <div className={`bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between ${className}`}>
//     <div className="flex items-center justify-between mb-4">
//       <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
//       {Icon && <Icon className="w-8 h-8 text-indigo-600" />}
//     </div>
//     <div className="text-4xl font-extrabold text-indigo-600 mb-2">
//       {value}
//     </div>
//     <div className="space-y-1 text-sm text-gray-500">
//       {subStats.map((stat, index) => (
//         <div key={index} className="flex items-center">
//           {stat.icon && <span className="mr-1">{stat.icon}</span>}
//           <span>{stat.label}</span>
//           {stat.percentageChange !== undefined && (
//             <span
//               className={`ml-2 flex items-center ${
//                 stat.percentageChange > 0 ? 'text-green-500' : stat.percentageChange < 0 ? 'text-red-500' : 'text-gray-500'
//               }`}
//             >
//               {stat.percentageChange !== 0 && (
//                 stat.percentageChange > 0 ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />
//               )}
//               {stat.percentageChange !== 0 && `${Math.abs(stat.percentageChange).toFixed(1)}%`}
//             </span>
//           )}
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get('/dashboard/stats'); // Your new API endpoint
//         if (response.data.success) {
//           setDashboardData(response.data.data);
//         } else {
//           setError(response.data.message || 'Failed to fetch dashboard data.');
//         }
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err.response?.data || err.message);
//         setError(err.response?.data?.message || 'Error fetching dashboard data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6 font-inter">
//         <div className="text-indigo-600 text-xl">Loading dashboard data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6 font-inter">
//         <div className="text-red-600 text-xl">Error: {error}</div>
//       </div>
//     );
//   }

//   // Destructure data for easier access
//   const {
//     contacts,
//     groups,
//     templates,
//     broadcasting,
//     teamMembers,
//     liveChat,
//   } = dashboardData;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 font-inter">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Contacts Card */}
//         <StatCard
//           title="Contacts"
//           value={contacts.total.toLocaleString()}
//           icon={Users}
//           subStats={[
//             { label: `${contacts.newThisWeek} this week`, percentageChange: contacts.changeVsLastWeek },
//           ]}
//         />

//         {/* Groups Card */}
//         <StatCard
//           title="Groups"
//           value={groups.total.toLocaleString()}
//           icon={LayoutGrid}
//           subStats={[
//             { label: `${groups.active} active` },
//             { label: `${groups.inactive} inactive` },
//           ]}
//         />

//         {/* Templates Card */}
//         <StatCard
//           title="Templates"
//           value={templates.total.toLocaleString()}
//           icon={FileText}
//           subStats={[
//             { label: `${templates.approved} approved` },
//             { label: `${templates.pending} pending`, icon: <CircleDotDashed className="w-3 h-3 text-yellow-500" /> },
//           ]}
//         />

//         {/* Broadcasting Card */}
//         <StatCard
//           title="Broadcasting"
//           value={`${broadcasting.success}/${broadcasting.totalJobs}`}
//           icon={Send}
//           subStats={[
//             { label: `${broadcasting.success} success` },
//             { label: `${broadcasting.failed} failed` },
//             { label: `${broadcasting.scheduled} scheduled` },
//           ]}
//         />

//         {/* Team Members Card */}
//         <StatCard
//           title="Team Members"
//           value={teamMembers.total.toLocaleString()}
//           icon={UserCheck}
//           subStats={[
//             { label: `${teamMembers.admins} admins` },
//             { label: `${teamMembers.members} members` },
//           ]}
//         />

//         {/* Live Chat Card */}
//         <StatCard
//           title="Live Chat"
//           value={liveChat.unread.toLocaleString()}
//           icon={MessageSquare}
//           subStats={[
//             { label: `${liveChat.unread} unread` },
//             { label: `${liveChat.responseRate}% response rate`, percentageChange: liveChat.responseRateChangeVsLastWeek },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// client/src/components/Dashboard/Dashboard.js
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom'; // Import useParams
// import api from '../../utils/api';
// import {
//   Users,
//   LayoutGrid,
//   FileText,
//   Send,
//   UserCheck,
//   MessageSquare,
//   ArrowUp,
//   ArrowDown,
//   CircleDotDashed
// } from 'lucide-react';

// // Reusable StatCard component (no changes needed here)
// const StatCard = ({ title, value, icon: Icon, subStats, className = '' }) => (
//   <div className={`bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between ${className}`}>
//     <div className="flex items-center justify-between mb-4">
//       <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
//       {Icon && <Icon className="w-8 h-8 text-indigo-600" />}
//     </div>
//     <div className="text-4xl font-extrabold text-indigo-600 mb-2">
//       {value}
//     </div>
//     <div className="space-y-1 text-sm text-gray-500">
//       {subStats.map((stat, index) => (
//         <div key={index} className="flex items-center">
//           {stat.icon && <span className="mr-1">{stat.icon}</span>}
//           <span>{stat.label}</span>
//           {stat.percentageChange !== undefined && (
//             <span
//               className={`ml-2 flex items-center ${
//                 stat.percentageChange > 0 ? 'text-green-500' : stat.percentageChange < 0 ? 'text-red-500' : 'text-gray-500'
//               }`}
//             >
//               {stat.percentageChange !== 0 && (
//                 stat.percentageChange > 0 ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />
//               )}
//               {stat.percentageChange !== 0 && `${Math.abs(stat.percentageChange).toFixed(1)}%`}
//             </span>
//           )}
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   const { id } = useParams(); // Get projectId from URL parameters
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
// const projectId = id; // Use the projectId from URL parameters
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (!projectId) {
//         setError("Project ID is missing in the URL. Please select a project.");
//         setLoading(false);
//         return;
//       }
// // /:projectId/stats
//       try {
//         setLoading(true);
//         // Updated API endpoint to include projectId
//         const response = await api.get(`/projects/${projectId}/stats`);
//         if (response.data.success) {
//           setDashboardData(response.data.data);
//         } else {
//           setError(response.data.message || 'Failed to fetch dashboard data.');
//         }
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err.response?.data || err.message);
//         setError(err.response?.data?.message || 'Error fetching dashboard data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [projectId]); // Re-fetch data when projectId changes
// console.log("project dashboard data", dashboardData);
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6 font-inter">
//         <div className="text-indigo-600 text-xl">Loading dashboard data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6 font-inter">
//         <div className="text-red-600 text-xl">Error: {error}</div>
//       </div>
//     );
//   }

//   const {
//     contacts,
//     groups,
//     templates,
//     broadcasting,
//     teamMembers,
//     liveChat,
//   } = dashboardData;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 font-inter">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview (Project: {projectId})</h1> {/* Added project ID for clarity */}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Contacts Card */}
//         <StatCard
//           title="Contacts"
//           value={contacts.total.toLocaleString()}
//           icon={Users}
//           subStats={[
//             { label: `${contacts.newThisWeek} this week`, percentageChange: contacts.changeVsLastWeek },
//           ]}
//         />

//         {/* Groups Card */}
//         <StatCard
//           title="Groups"
//           value={groups.total.toLocaleString()}
//           icon={LayoutGrid}
//           subStats={[
//             { label: `${groups.active} active` },
//             { label: `${groups.inactive} inactive` },
//           ]}
//         />

//         {/* Templates Card */}
//         <StatCard
//           title="Templates"
//           value={templates.total.toLocaleString()}
//           icon={FileText}
//           subStats={[
//             { label: `${templates.approved} approved` },
//             { label: `${templates.pending} pending`, icon: <CircleDotDashed className="w-3 h-3 text-yellow-500" /> },
//           ]}
//         />

//         {/* Broadcasting Card */}
//         <StatCard
//           title="Broadcasting"
//           value={`${broadcasting.success}/${broadcasting.totalJobs}`}
//           icon={Send}
//           subStats={[
//             { label: `${broadcasting.success} success` },
//             { label: `${broadcasting.failed} failed` },
//             { label: `${broadcasting.scheduled} scheduled` },
//           ]}
//         />

//         {/* Team Members Card (Tenant-wide) */}
    

//         {/* Live Chat Card */}
//         <StatCard
//           title="Live Chat"
//           value={liveChat.unread.toLocaleString()}
//           icon={MessageSquare}
//           subStats={[
//             { label: `${liveChat.unread} unread` },
//             { label: `${liveChat.responseRate}% response rate`, percentageChange: liveChat.responseRateChangeVsLastWeek },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
