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
const ProjectDashboard = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Generate dummy data
  useEffect(() => {
    const dummyData = {
      contacts: {
        total: 1245,
        newThisWeek: 42,
        growth: 3.2,
      },
      groups: {
        total: 28,
        active: 22,
        inactive: 6,
      },
      templates: {
        total: 15,
        approved: 12,
        pending: 3,
      },
      broadcasting: {
        success: 18,
        failed: 2,
        scheduled: 3,
      },
      teamMembers: {
        total: 5,
        admins: 2,
        regular: 3,
      },
      chat: {
        activeConversations: 8,
        unreadMessages: 14,
        responseRate: 92,
      },
      recentActivities: [
        {
          id: 1,
          type: 'broadcast',
          title: 'New promotion broadcast',
          status: 'success',
          date: '2023-06-15T10:30:00Z',
          user: 'John Doe'
        },
        {
          id: 2,
          type: 'template',
          title: 'Order confirmation template approved',
          status: 'approved',
          date: '2023-06-14T14:15:00Z',
          user: 'System'
        },
        {
          id: 3,
          type: 'group',
          title: 'VIP Customers group updated',
          status: 'updated',
          date: '2023-06-13T09:45:00Z',
          user: 'Jane Smith'
        },
        {
          id: 4,
          type: 'contact',
          title: '42 new contacts imported',
          status: 'success',
          date: '2023-06-12T16:20:00Z',
          user: 'System'
        },
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setStats(dummyData);
      setIsLoading(false);
    }, 800);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Project Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Last updated: Just now</span>
          <button className="p-1 rounded hover:bg-gray-100">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Contacts" 
          value={stats.contacts.total} 
          change={stats.contacts.growth} 
          icon={<Phone size={20} className="text-primary-500" />}
          link={`/project/${id}/contacts`}
        >
          <div className="text-sm text-gray-500 mt-1">
            <span className="text-green-500">+{stats.contacts.newThisWeek}</span> this week
          </div>
        </StatCard>

        <StatCard 
          title="Groups" 
          value={stats.groups.total} 
          icon={<Users size={20} className="text-secondary-500" />}
          link={`/project/${id}/group`}
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

        <StatCard 
          title="Templates" 
          value={stats.templates.total} 
          icon={<MessageSquare size={20} className="text-accent-500" />}
          link={`/project/${id}/templates`}
        >
          <div className="flex space-x-4 text-sm mt-1">
            <span className="text-gray-500">
              <span className="text-green-500">{stats.templates.approved}</span> approved
            </span>
            <span className="text-gray-500">
              <span className="text-yellow-500">{stats.templates.pending}</span> pending
            </span>
          </div>
        </StatCard>

        <StatCard 
          title="Broadcasting" 
          value={`${stats.broadcasting.success}/${stats.broadcasting.success + stats.broadcasting.failed}`} 
          icon={<Mail size={20} className="text-purple-500" />}
          link={`/project/${id}/broadcasting`}
        >
          <div className="flex space-x-4 text-sm mt-1">
            <span className="text-gray-500">
              <span className="text-green-500">{stats.broadcasting.success}</span> success
            </span>
            <span className="text-gray-500">
              <span className="text-red-500">{stats.broadcasting.failed}</span> failed
            </span>
            <span className="text-gray-500">
              <span className="text-blue-500">{stats.broadcasting.scheduled}</span> scheduled
            </span>
          </div>
        </StatCard>

        <StatCard 
          title="Team Members" 
          value={stats.teamMembers.total} 
          icon={<Users size={20} className="text-indigo-500" />}
          link={`/project/${id}/team-members`}
        >
          <div className="flex space-x-4 text-sm mt-1">
            <span className="text-gray-500">
              <span className="text-primary-500">{stats.teamMembers.admins}</span> admins
            </span>
            <span className="text-gray-500">
              <span className="text-gray-600">{stats.teamMembers.regular}</span> members
            </span>
          </div>
        </StatCard>

        <StatCard 
          title="Live Chat" 
          value={stats.chat.activeConversations} 
          change={stats.chat.responseRate}
          icon={<MessageSquare size={20} className="text-teal-500" />}
          link={`/project/${id}/chat`}
        >
          <div className="flex space-x-4 text-sm mt-1">
            <span className="text-gray-500">
              <span className="text-blue-500">{stats.chat.unreadMessages}</span> unread
            </span>
            <span className="text-gray-500">
              <span className="text-green-500">{stats.chat.responseRate}%</span> response rate
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
          link={`/project/${id}/broadcasting/new`}
          color="bg-purple-50 text-purple-600"
        />
        <QuickActionCard
          title="Add Contacts"
          description="Import or add new contacts"
          icon={<Phone size={20} />}
          link={`/project/${id}/contacts/new`}
          color="bg-blue-50 text-blue-600"
        />
        <QuickActionCard
          title="Create Template"
          description="Design a new message template"
          icon={<MessageSquare size={20} />}
          link={`/project/${id}/templates/new`}
          color="bg-green-50 text-green-600"
        />
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity" icon={<BarChart2 size={20} />}>
        <RecentActivity activities={stats.recentActivities} />
        <div className="mt-4 text-right">
          <Link 
            to={`/project/${id}/activity`} 
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
          >
            View all activity <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

// Stat Card Component
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

// Quick Action Card Component
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