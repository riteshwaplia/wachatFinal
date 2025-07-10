import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Card from '../../components/Card';

const AdminDashboardPage = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const response = await api.get('/dashboard/stats', config);
        setStats(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchDashboardStats();
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-error-100 border-l-4 border-error-500 text-error-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Contacts" 
          value={stats.contacts.total} 
          change={stats.contacts.changeVsLastWeek} 
          icon="users"
          color="primary"
        />
        <StatCard 
          title="Active Groups" 
          value={stats.groups.active} 
          change={(stats.groups.active / stats.groups.total) * 100} 
          icon="group"
          color="secondary"
        />
        <StatCard 
          title="Approved Templates" 
          value={stats.templates.approved} 
          change={(stats.templates.approved / stats.templates.total) * 100} 
          icon="template"
          color="accent"
        />
        <StatCard 
          title="Team Members" 
          value={stats.teamMembers.total} 
          change={(stats.teamMembers.admins / stats.teamMembers.total) * 100} 
          icon="team"
          color="success"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Message Activity</h3>
            <ActivityChart 
              sent={stats.broadcasting.success}
              received={stats.liveChat.unread}
              failed={stats.broadcasting.failed}
            />
          </div>
        </Card>

        <Card>
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Response Metrics</h3>
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary-500"
                    strokeWidth="10"
                    strokeDasharray={`${stats.liveChat.responseRate}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-2xl font-bold text-gray-800">{stats.liveChat.responseRate}%</span>
                  <div className="text-sm text-gray-500">Response Rate</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {stats.liveChat.responseRateChangeVsLastWeek >= 0 ? (
                  <span className="text-success-600">↑ {Math.abs(stats.liveChat.responseRateChangeVsLastWeek)}%</span>
                ) : (
                  <span className="text-error-600">↓ {Math.abs(stats.liveChat.responseRateChangeVsLastWeek)}%</span>
                )} from last week
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Broadcast Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Successful</span>
                <span className="font-medium text-gray-800">{stats.broadcasting.success}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Failed</span>
                <span className="font-medium text-gray-800">{stats.broadcasting.failed}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Scheduled</span>
                <span className="font-medium text-gray-800">{stats.broadcasting.scheduled}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Template Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Approved</span>
                <span className="font-medium text-gray-800">{stats.templates.approved}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-gray-800">{stats.templates.pending}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total</span>
                <span className="font-medium text-gray-800">{stats.templates.total}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <RecentActivity />
          </div>
        </Card>
      </div>
    </div>
  );
};


const StatCard = ({ title, value, change, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-800 border-l-4 border-primary-500',
    secondary: 'bg-secondary-50 text-secondary-800 border-l-4 border-secondary-500',
    accent: 'bg-accent-50 text-accent-800 border-l-4 border-accent-500',
    success: 'bg-success-50 text-success-800 border-l-4 border-success-500',
    warning: 'bg-warning-50 text-warning-800 border-l-4 border-warning-500',
    error: 'bg-error-50 text-error-800 border-l-4 border-error-500'
  };

  const iconClasses = {
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    group: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    template: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    team: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  };

  return (
    <div className={`${colorClasses[color]} p-5 rounded-lg shadow-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-white bg-opacity-50">
          {iconClasses[icon]}
        </div>
      </div>
      <div className="mt-3">
        <span className={`inline-flex items-center text-sm font-medium ${
          change >= 0 ? 'text-success-600' : 'text-error-600'
        }`}>
          {change >= 0 ? (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {Math.abs(change)}%
          <span className="ml-1 text-gray-500">vs last week</span>
        </span>
      </div>
    </div>
  );
};

const ActivityChart = ({ sent, received, failed }) => {
  const maxValue = Math.max(sent, received, failed) || 1;
  const sentHeight = (sent / maxValue) * 100;
  const receivedHeight = (received / maxValue) * 100;
  const failedHeight = (failed / maxValue) * 100;

  return (
    <div className="h-64">
      <div className="flex items-end h-full space-x-4">
        <div className="flex flex-col items-center flex-1">
          <div 
            className="w-full bg-primary-500 rounded-t hover:bg-primary-600 transition-colors" 
            style={{ height: `${sentHeight}%` }}
            title={`${sent} sent messages`}
          ></div>
          <span className="text-xs mt-2 text-gray-600">Sent ({sent})</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div 
            className="w-full bg-secondary-500 rounded-t hover:bg-secondary-600 transition-colors" 
            style={{ height: `${receivedHeight}%` }}
            title={`${received} received messages`}
          ></div>
          <span className="text-xs mt-2 text-gray-600">Received ({received})</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div 
            className="w-full bg-error-500 rounded-t hover:bg-error-600 transition-colors" 
            style={{ height: `${failedHeight}%` }}
            title={`${failed} failed messages`}
          ></div>
          <span className="text-xs mt-2 text-gray-600">Failed ({failed})</span>
        </div>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const activities = [
    { id: 1, action: 'New broadcast created', time: '2 minutes ago', user: 'You', type: 'broadcast' },
    { id: 2, action: 'Template approved', time: '1 hour ago', user: 'Admin', type: 'template' },
    { id: 3, action: 'New contact imported', time: '3 hours ago', user: 'You', type: 'contact' },
    { id: 4, action: 'Group updated', time: '5 hours ago', user: 'Team Member', type: 'group' },
  ];

  const typeColors = {
    broadcast: 'bg-primary-500',
    template: 'bg-accent-500',
    contact: 'bg-success-500',
    group: 'bg-secondary-500'
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start group">
          <div className={`flex-shrink-0 h-2 w-2 mt-2 rounded-full ${typeColors[activity.type]}`}></div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 group-hover:text-primary-600 transition-colors">
              {activity.action}
            </p>
            <p className="text-xs text-gray-500">
              {activity.time} • {activity.user}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};



export default AdminDashboardPage;
