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
} from "react-icons/fi";
import Modal from "../components/Modal";

const ProjectCard = ({ project, onEdit, onDelete, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-custom-card border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors font-heading">
            {project.name}
          </h3>
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Assistant:</span>{" "}
              {project.assistantName || "N/A"}
            </p>
            <div className="flex items-center">
              <span className="font-medium text-sm text-gray-600">
                WhatsApp:
              </span>
              <span className="ml-1 text-sm text-gray-600">
                {project.whatsappNumber || "N/A"}
              </span>
              {project.isWhatsappVerified && (
                <span className="ml-2 bg-secondary-100 text-secondary-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Plan:</span>{" "}
              {project.activePlan || "N/A"} ({project.planDuration} days)
            </p>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="text-primary-500 hover:text-primary-700 p-1.5 rounded-full hover:bg-primary-50 transition-colors"
            aria-label="Edit project"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project._id);
            }}
            className="text-error hover:text-error-dark p-1.5 rounded-full hover:bg-red-50 transition-colors"
            aria-label="Delete project"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex items-center text-sm text-primary-600 hover:text-primary-800 group-hover:underline transition-all"
        >
          View Dashboard <FiArrowRight className="ml-1" />
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
          text: res.data.message || "You haven't created any projects yet.",
          type: "info",
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setMessage({
        text: `Error fetching projects: ${
          error.response?.data?.message || "Failed to fetch projects."
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
          error.response?.data?.message || "Failed to fetch business profiles."
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
            ? "Project updated successfully!"
            : "Project created successfully!"),
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
            ? "Failed to update project."
            : "Failed to create project.")
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
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await api.delete(`/project/${projectId}`, config);
        setMessage({
          text: res.data.message || "Project deleted successfully!",
          type: "success",
        });
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        setMessage({
          text: `Error deleting project: ${
            error.response?.data?.message || "Unknown error."
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
        Please log in to manage your projects.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Filter Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:hidden`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-primary-500 text-white">
          <h3 className="font-medium">Filter Projects</h3>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white hover:text-primary-100"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Profile
          </label>
          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Businesses</option>
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
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-600 hover:text-primary-600"
              >
                <FiFilter size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 font-heading">
                My Projects
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
                  <option value="all">All Businesses</option>
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
                <FiPlus /> New Project
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
              {message.text}
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
                  ? "No projects found"
                  : "No projects found for selected business"}
              </p>
              <button
                onClick={() => navigate("/add-whatsapp-number")}
                className="flex items-center justify-center gap-2 mx-auto bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <FiPlus /> Create New Project
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
          {editingProject ? "Edit Project" : "Create New Project"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
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
              Assistant Name
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
              Business Profile
            </label>
            <select
              name="businessProfileId"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.businessProfileId}
              onChange={handleInputChange}
            >
              <option value="">Select Business Profile</option>
              {businessProfiles.map((business) => (
                <option key={business._id} value={business._id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number
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
              WhatsApp Verified
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Active Plan
            </label>
            <select
              name="activePlan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.activePlan}
              onChange={handleInputChange}
            >
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Duration (days)
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
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              {editingProject ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectManagementPage;