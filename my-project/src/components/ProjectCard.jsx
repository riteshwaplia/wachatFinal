// src/components/ProjectCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2, ArrowRight, CheckCircle, Tag, TrendingUp, CalendarDays } from 'lucide-react'; // Icons
import Button from './Button'; // Our custom Button
import Badge from './Badge';   // Our custom Badge
import Card from './Card';     // Our custom Card (ProjectCard is essentially a Card)

const ProjectCard = ({ project, onEdit, onDelete, onClick }) => {
  return (
    <Card
      className="p-5 flex flex-col justify-between h-full group" // Added group for hover effects
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
          <div className="space-y-1 text-gray-700">
            <p className="flex items-center text-sm">
              <span className="font-semibold text-gray-600 w-24 flex-shrink-0">Assistant:</span> {project.assistantName || 'N/A'}
            </p>
            <p className="flex items-center text-sm">
              <span className="font-semibold text-gray-600 w-24 flex-shrink-0">WhatsApp:</span> {project.whatsappNumber || 'N/A'}
              {project.isWhatsappVerified && (
                <Badge type="success" size="sm" className="ml-2">
                  <CheckCircle size={14} className="inline-block mr-1" /> Verified
                </Badge>
              )}
            </p>
            <p className="flex items-center text-sm">
              <span className="font-semibold text-gray-600 w-24 flex-shrink-0">Plan:</span>
              <Badge type="primary" size="sm" className="ml-1">
                <Tag size={14} className="inline-block mr-1" /> {project.activePlan || 'N/A'}
              </Badge>
              <span className="ml-2 text-gray-500">({project.planDuration} days)</span>
            </p>
            {/* Displaying businessProfileId for debugging/info, can be removed in production */}
            {project.businessProfileId && (
                <p className="text-xs text-gray-500 truncate mt-1">
                    <span className="font-medium">Business ID:</span> {project.businessProfileId}
                </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="text"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onEdit(project); }}
            aria-label="Edit project"
            className="text-primary-500 hover:text-primary-700"
          >
            <Edit size={18} />
          </Button>
          <Button
            variant="text"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
            aria-label="Delete project"
            className="text-error hover:text-error-700"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500 flex items-center space-x-1">
          <CalendarDays size={14} /> Created: {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <Button
          variant="text" // Use text variant for the "View Dashboard" action
          size="sm"
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="flex items-center text-primary-600 hover:text-primary-800"
        >
          View Dashboard <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>
    </Card>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProjectCard;
