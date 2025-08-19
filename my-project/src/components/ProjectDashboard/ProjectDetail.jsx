// client/src/components/ProjectDetail/ProjectDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { FiArrowLeft, FiEdit, FiTrash2, FiUsers, FiMessageSquare, FiMail, FiPhone } from 'react-icons/fi';
import LoadingSpinner from '../Loader'; // Assuming correct path
import ErrorMessage from '../ErrorMessage'; // Assuming correct path
import { useProject } from '../../context/ProjectProvider'; // If you still use this context
import Card from '../Card'; // Assuming correct path
import WhatsAppBusinessProfileCard from './WhatsAppBusinessProfileCard'; // NEW: Import the new component
import { useTranslation } from 'react-i18next';

import { ErrorToast, SuccessToast } from '../../utils/Toast';

const ProjectDetail = () => {
  const { id } = useParams(); // This is projectId
  const navigate = useNavigate();
  const { token } = useAuth();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { project: currentProjectFromContext } = useProject(); // If you need context project

  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);
  const [errorUpdateProfile, setErrorUpdateProfile] = useState(null);
  const [successUpdateProfile, setSuccessUpdateProfile] = useState(null);
  
  const { t } = useTranslation();

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      // Correct API endpoint for fetching a single project
      const response = await api.get(`/project/${id}/dashboard`, { // Changed from /project/${id}/dashboard
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setProjectData(response.data.data);
      } else {
        setError(response.data.message || t('Failed to fetch project details.'));
      }
    } catch (err) {
      console.error('Failed to fetch project:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle updating WhatsApp Business Profile
  const handleUpdateWhatsappProfile = async (profileData) => {
    setLoadingUpdateProfile(true);

    try {
      const response = await api.put(
        `/project/${id}/whatsapp-business-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const { success, message } = response.data;

      if (success) {
        SuccessToast(message || 'WhatsApp Business Profile updated successfully!', { autoClose: 3000 });

        // ✅ Re-fetch project details to get the latest data
        await fetchProjectDetails();
      } else {
        // ✅ Show proper error toast
        ErrorToast(
          message?.includes('Session has expired')
            ? 'Your session has expired. Please reconnect your WhatsApp account.'
            : message || 'Failed to update WhatsApp Business Profile.',
          { autoClose: 3000 }
        );
      }

    } catch (err) {
      console.error('Error updating WhatsApp Business Profile:', err.response?.data || err.message);

      const errMsg = err.response?.data?.message || 'Failed to update WhatsApp Business Profile.';
      ErrorToast(
        errMsg.includes('Session has expired')
          ? 'Your session has expired. Please reconnect your WhatsApp account.'
          : errMsg,
        { autoClose: 3000 }
      );
    } finally {
      setLoadingUpdateProfile(false);
    }
  };


  useEffect(() => {
    fetchProjectDetails();
  }, [id, token]); // Add token to dependency array if it can change

  if (loading) return <LoadingSpinner fullPage message="Loading project details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProjectDetails} />;
  if (!projectData) return <ErrorMessage message="Project not found" />;

  return (
    <div className="space-y-6 p-6"> {/* Added padding for better layout */}
      {/* Header with back button */}
      <div className="flex items-center space-x-4 mb-6">
        {/* <Link to="/projects" className="text-gray-600 hover:text-gray-800">
          <FiArrowLeft size={24} />
        </Link> */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-dark-text-primary">{t("Project Details")}</h1>
      </div>


      {/* Project Header */}
      <div className="bg-indigo-600 dark:bg-dark-surface px-6 py-4 text-white rounded-t-lg shadow-md"> {/* Changed color to indigo for consistency */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-heading">{projectData.name}</h1>
          <div className="flex space-x-2">
            {/* <button
                onClick={() => navigate(`/projects/${id}/edit`)} 
                className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
                aria-label="Edit project"
              >
                <FiEdit size={18} />
              </button> */}
            {/* Add delete button if desired */}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {projectData.isWhatsappVerified && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"> {/* Changed colors */}
              WhatsApp Verified
            </span>
          )}
          <span className="bg-gray-100 text-gray-800 dark:text-dark-text-primary text-xs px-2 py-1 rounded-full">
            {projectData.businessProfileId?.name || 'No Business Profile'} {/* Display Business Profile Name */}
          </span>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"> {/* Changed colors */}
            {projectData.activePlan || 'No plan'}
          </span>
        </div>
      </div>

      {/* WhatsApp Business Profile Card */}
      {projectData && (
        <WhatsAppBusinessProfileCard
          project={projectData}
          onUpdateProfile={handleUpdateWhatsappProfile}
          loadingUpdate={loadingUpdateProfile}
          errorUpdate={errorUpdateProfile}
        />
      )}
      {successUpdateProfile && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {successUpdateProfile}</span>
        </div>
      )}
      {errorUpdateProfile && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {errorUpdateProfile}</span>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card title={t("Project Information")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('Assistant Name')}</p>
                  <p className="text-gray-800 dark:text-dark-text-secondary">{projectData.assistantName || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('WhatsApp Number')}</p>
                  <p className="text-gray-800 dark:text-dark-text-secondary">{projectData.whatsappNumber || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('Meta Phone Number ID')}</p>
                  <p className="text-gray-800 dark:text-dark-text-secondary">{projectData.metaPhoneNumberID || 'Not specified'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('Created At')}</p>
                  <p className="text-gray-800 dark:text-dark-text-secondary">
                    {new Date(projectData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('Last Updated')}</p>
                  <p className="text-gray-800 dark:text-dark-text-secondary">
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
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card title={t("Subscription Details")}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('Active Plan')}</p>
                  <p className="text-gray-800 dark:text-dark-text-secondary">{projectData.activePlan || 'No active plan'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('Plan Duration')}</p>
                  <p className="text-gray-800 dark:text-dark-text-secondary">{projectData.planDuration || 0} days</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{t('Business Profile Name')}</p>
                  <p className="text-gray-800 dark:text-dark-text-secondary">{projectData.businessProfileId?.name || 'Not linked'}</p>
                </div>
            </div>
          </Card>

          {/* <Card title="Project Status">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">WhatsApp Status</p>
                <p className="flex items-center">
                  {projectData.isWhatsappVerified ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
