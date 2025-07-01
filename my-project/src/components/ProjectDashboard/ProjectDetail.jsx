import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { FiArrowLeft, FiEdit, FiTrash2, FiUsers, FiMessageSquare, FiMail, FiPhone } from 'react-icons/fi';
import LoadingSpinner from '../Loader';
import ErrorMessage from '../ErrorMessage';
import { useProject } from '../../context/ProjectProvider';
import StatCard from './ProjectDashboard';
import Card from '../Card';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { project } = useProject();

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/project/${id}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjectData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError(err.response?.data?.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  if (loading) return <LoadingSpinner fullPage message="Loading project details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProjectDetails} />;
  if (!projectData) return <ErrorMessage message="Project not found" />;

  // Dummy stats data - replace with actual API data
  const stats = {
    contacts: 1245,
    groups: 28,
    templates: 15,
    broadcasts: {
      success: 18,
      failed: 2,
      scheduled: 3
    },
    teamMembers: 5,
    activeChats: 8
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}


      {/* Project Header */}
        <div className="bg-primary-500 px-6 py-4 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold font-heading">{projectData.name}</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/project/${id}/edit`)}
                className="p-2 rounded-full hover:bg-primary-600 transition-colors"
                aria-label="Edit project"
              >
                <FiEdit size={18} />
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {projectData.isWhatsappVerified && (
              <span className="bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded-full">
                WhatsApp Verified
              </span>
            )}
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {projectData.type || 'No type specified'}
            </span>
            <span className="bg-accent-100 text-accent-800 text-xs px-2 py-1 rounded-full">
              {projectData.activePlan || 'No plan'}
            </span>
          </div>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Project Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Assistant Name</p>
                  <p className="text-gray-800">{projectData.assistantName || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">WhatsApp Number</p>
                  <p className="text-gray-800">{projectData.whatsappNumber || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Meta Phone Number ID</p>
                  <p className="text-gray-800">{projectData.metaPhoneNumberID || 'Not specified'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="text-gray-800">
                    {new Date(projectData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-gray-800">
                    {new Date(projectData.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Subscription Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Plan</p>
                  <p className="text-gray-800">{projectData.activePlan || 'No active plan'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Plan Duration</p>
                  <p className="text-gray-800">{projectData.planDuration || 0} days</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Provider Type</p>
                  <p className="text-gray-800">{projectData.providerType || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-800">{projectData.description || 'No description provided'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Link
                to={`/project/${id}/contacts/new`}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiPhone className="text-primary-500 mr-3" />
                <span>Add New Contacts</span>
              </Link>
              <Link
                to={`/project/${id}/broadcasting/new`}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiMail className="text-secondary-500 mr-3" />
                <span>Create Broadcast</span>
              </Link>
              <Link
                to={`/project/${id}/templates/new`}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiMessageSquare className="text-accent-500 mr-3" />
                <span>Create Template</span>
              </Link>
              {/* <Link
                to={`/project/${id}/team-members/invite`}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiUsers className="text-indigo-500 mr-3" />
                <span>Invite Team Member</span>
              </Link> */}
            </div>
          </Card>

          <Card title="Project Status">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">WhatsApp Status</p>
                <p className="flex items-center">
                  {projectData.isWhatsappVerified ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Not Verified
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Project Health</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">85% - Good</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
       


    </div>
  );
};

export default ProjectDetail;