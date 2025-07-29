import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiArrowRight,
  FiFilter,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import Modal from "../components/Modal";

import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const ProjectCard = ({ project, onEdit, onDelete, onClick }) => {
  const { t } = useTranslation();
  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors font-heading">
            {project.name}
          </h3>

          {/* About + Website */}
          <div className="mt-2 space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium">{t('about')}:</span>{' '}
              {project.about || t('helpingCustomersFaster')}
            </p>
            <p className="text-sm text-gray-700 flex items-center">
              <span className="font-medium">{t('website')}:</span>{' '}
              <a
                href={project.website || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-primary-600 hover:underline flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {project.website || t('exampleWebsite')} <FiExternalLink className="ml-1" />
              </a>
            </p>
          </div>

          {/* WhatsApp Details */}
          <div className="mt-3 flex items-center text-sm text-gray-800">
            <FaWhatsapp className="text-green-500 mr-2" />
            <span className="font-medium">{t('whatsapp')}:</span>{' '}
            <span className="ml-1">
              {project.whatsappNumber || t('defaultWhatsappNumber')}
            </span>
            {project.isWhatsappVerified && (
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                {t('verified')}
              </span>
            )}
          </div>

          {/* Plan */}
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">{t('plan')}:</span>{' '}
            {project.activePlan || t('standard')} (
            {project.planDuration || 30} {t('days')})
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
            aria-label={t('editProject')}
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project._id);
            }}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
            aria-label={t('deleteProject')}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
        <span className="text-gray-500">
          {t('created')}: {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex items-center text-green-600 hover:text-green-800 group-hover:underline transition-all"
        >
          {t('viewDashboard')} <FiArrowRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};


const ProjectManagementPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    isWhatsappVerified: false,
    assistantName: "",
    whatsappNumber: "",
    businessProfileId: "",
    activePlan: "Standard",
    planDuration: 365,
  });
  const [editingProject, setEditingProject] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await api.get("/project", config);
      setProjects(res.data.data);
      if (res.data.data.length === 0) {
        setMessage({
          text: res.data.message || t('noProjectsYet'),
          type: "info",
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setMessage({
        text: `Error fetching projects: ${
          error.response?.data?.message || t('failedToFetchProjects')
        }`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBusinessProfiles = async () => {
    try {
      const res = await api.get("/users/business-profiles", config);
      setBusinessProfiles(res.data.data || []);
    } catch (error) {
      console.error("Error fetching business profiles:", error);
      setMessage({
        text: `Error fetching business profiles: ${
          error.response?.data?.message || t('failedToFetchBusinessProfiles')
        }`,
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchProjects();
      fetchBusinessProfiles();
    }
  }, [user, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const endpoint = editingProject
        ? `/api/project/${editingProject._id}`
        : "/api/project";

      const method = editingProject ? "put" : "post";

      const res = await api[method](endpoint, formData, config);

      setMessage({
        text:
          res.data.message ||
          (editingProject
            ? t('projectUpdatedSuccessfully')
            : t('projectCreatedSuccessfully')),
        type: "success",
      });

      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({
        name: "",
        isWhatsappVerified: false,
        assistantName: "",
        whatsappNumber: "",
        businessProfileId: "",
        activePlan: "Standard",
        planDuration: 365,
      });

      fetchProjects();
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: `Error: ${
          error.response?.data?.message ||
          (editingProject
            ? t('failedToUpdateProject')
            : t('failedToCreateProject'))
        }`,
        type: "error",
      });
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      isWhatsappVerified: project.isWhatsappVerified,
      assistantName: project.assistantName,
      whatsappNumber: project.whatsappNumber,
      businessProfileId: project.businessProfileId?._id || "",
      activePlan: project.activePlan,
      planDuration: project.planDuration,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm(t('confirmDeleteProject'))) {
      try {
        const res = await api.delete(`/project/${projectId}`, config);
        setMessage({
          text: res.data.message || t('projectDeletedSuccessfully'),
          type: "success",
        });
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        setMessage({
          text: `Error deleting project: ${
            error.response?.data?.message || t('unknownError')
          }`,
          type: "error",
        });
      }
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}/dashboard`);
  };

  const filteredProjects =
    selectedBusiness === "all"
      ? projects
      : projects.filter(
          (project) => project.businessProfileId?._id === selectedBusiness
        );

  if (!user) {
    return (
      <div className="text-center py-10 text-error">
        {t('pleaseLogInToManageProjects')}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Filter Sidebar */}
<div
        className={`fixed inset-y-0 left-0 z-50 w-64  bg-white shadow-xl transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:hidden`}
      >
 
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-primary-500 text-white">
          <h3 className="font-medium">{t('filterProjects')}</h3>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white hover:text-primary-100"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('businessProfile')}
          </label>
          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">{t('allBusinesses')}</option>
            {businessProfiles.map((business) => (
              <option key={business._id} value={business._id}>
                {business.name}
              </option>
            ))}
          </select>
        </div>
      </div> 

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto md:px-4 md:py-8 px-2 py-2">          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-600 hover:text-primary-600"
              >
                <FiFilter size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 font-heading">
                {t('myProjects')}
              </h1>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="w-full sm:w-48">
                <select
                  value={selectedBusiness}
                  onChange={(e) => setSelectedBusiness(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="all">{t('allBusinesses')}</option>
                  {businessProfiles.map((business) => (
                    <option key={business._id} value={business._id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => navigate("/add-whatsapp-number")}
                className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors whitespace-nowrap"
              >
                <FiPlus /> {t('newProject')}
              </button>
            </div>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`mb-6 p-3 rounded-md ${
                message.type === "error"
                  ? "bg-red-100 text-error"
                  : message.type === "success"
                  ? "bg-secondary-100 text-secondary-700"
                  : "bg-primary-100 text-primary-700"
              }`}
            >
              {t(message.text)}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                {selectedBusiness === "all"
                  ? t('noProjectsFound')
                  : t('noProjectsFoundForSelectedBusiness')}
              </p>
              <button
                onClick={() => navigate("/add-whatsapp-number")}
                className="flex items-center justify-center gap-2 mx-auto bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <FiPlus /> {t('createNewProject')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteProject}
                  onClick={() => handleProjectClick(project._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 font-heading">
          {editingProject ? t('editProject') : t('createNewProject')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('projectName')} *
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('assistantName')}
            </label>
            <input
              type="text"
              name="assistantName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.assistantName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('businessProfile')}
            </label>
            <select
              name="businessProfileId"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.businessProfileId}
              onChange={handleInputChange}
            >
              <option value="">{t('selectBusinessProfile')}</option>
              {businessProfiles.map((business) => (
                <option key={business._id} value={business._id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('whatsappNumber')}
            </label>
            <input
              type="text"
              name="whatsappNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isWhatsappVerified"
              name="isWhatsappVerified"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.isWhatsappVerified}
              onChange={handleInputChange}
            />
            <label
              htmlFor="isWhatsappVerified"
              className="ml-2 block text-sm text-gray-700"
            >
              {t('whatsappVerified')}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('activePlan')}
            </label>
            <select
              name="activePlan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.activePlan}
              onChange={handleInputChange}
            >
              <option value="Standard">{t('standard')}</option>
              <option value="Premium">{t('premium')}</option>
              <option value="Enterprise">{t('enterprise')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('planDuration')} ({t('days')})
            </label>
            <input
              type="number"
              name="planDuration"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.planDuration}
              onChange={handleInputChange}
              min="1"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              {editingProject ? t('updateProject') : t('createProject')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectManagementPage;