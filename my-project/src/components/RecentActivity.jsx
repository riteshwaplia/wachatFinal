import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  User,
  Mail,
  MessageSquare
} from 'lucide-react';

const iconMap = {
  broadcast: <Mail size={16} className="text-purple-500" />,
  template: <MessageSquare size={16} className="text-blue-500" />,
  group: <User size={16} className="text-green-500" />,
  contact: <User size={16} className="text-orange-500" />,
};

const statusMap = {
  success: <CheckCircle size={16} className="text-green-500" />,
  failed: <XCircle size={16} className="text-red-500" />,
  pending: <Clock size={16} className="text-yellow-500" />,
  updated: <AlertCircle size={16} className="text-blue-500" />,
  approved: <CheckCircle size={16} className="text-green-500" />,
};

const RecentActivity = ({ activities }) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
          <div className="mr-3 mt-0.5">
            {iconMap[activity.type] || <MessageSquare size={16} className="text-gray-400" />}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h4 className="font-medium text-gray-800">{activity.title}</h4>
              <div className="ml-2">
                {statusMap[activity.status] || <Clock size={16} className="text-gray-400" />}
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">{activity.user}</span>
              <span className="text-sm text-gray-400">
                {new Date(activity.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;