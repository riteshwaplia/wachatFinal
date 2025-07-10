import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Card from "../components/Card";
import Modal from "../components/Modal";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import TextArea from "../components/TextArea";
import TemplateCard from "../components/template/TemplateCard";

const TemplatePage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [templates, setTemplates] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const project = localStorage.getItem("currentProject")
    ? JSON.parse(localStorage.getItem("currentProject"))
    : null;
  const businessProfileId = project?.businessProfileId._id || null;
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "UTILITY",
    language: "en_US",
    header: { type: "TEXT", text: "" },
    body: "",
    footer: "",
    buttons: [],
  });
  const [newButton, setNewButton] = useState({
    type: "URL",
    text: "",
    url: "",
  });

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const categoryOptions = [
    { value: "UTILITY", label: "Utility" },
    { value: "MARKETING", label: "Marketing" },
    { value: "AUTHENTICATION", label: "Authentication" },
  ];

  const languageOptions = [
    { value: "en_US", label: "English (US)" },
    { value: "es_ES", label: "Spanish (Spain)" },
    { value: "fr_FR", label: "French (France)" },
  ];

  const headerTypeOptions = [
    { value: "TEXT", label: "Text" },
    { value: "IMAGE", label: "Image" },
    { value: "VIDEO", label: "Video" },
    { value: "DOCUMENT", label: "Document" },
  ];

  const buttonTypeOptions = [
    { value: "URL", label: "Website URL" },
    { value: "PHONE_NUMBER", label: "Phone Number" },
    { value: "QUICK_REPLY", label: "Quick Reply" },
  ];

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/templates", {
        ...config,
        params: {
          businessProfileId: businessProfileId,
        },
      });
      setTemplates(res.data.data);
      if (res.data.data.length === 0) {
        setMessage({
          text: "No templates found. Create your first template.",
          type: "info",
        });
      } else {
        setMessage({ text: "", type: "" });
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to load templates",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && token && projectId) {
      fetchTemplates();
    } else if (!user) {
      navigate("/login");
    }
  }, [user, token, projectId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeaderChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
  };

  const addButton = () => {
    if (!newButton.text) return;

    setFormData((prev) => ({
      ...prev,
      buttons: [...prev.buttons, newButton],
    }));

    setNewButton({ type: "URL", text: "", url: "" });
  };

  const removeButton = (index) => {
    setFormData((prev) => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        language: formData.language,
        components: {
          header: formData.header.text ? formData.header : null,
          body: formData.body,
          footer: formData.footer,
          buttons: formData.buttons,
        },
      };

      await api.post(`/templates`, payload, config);

      setMessage({ text: "Template created successfully!", type: "success" });
      setIsModalOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error("Error creating template:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to create template",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "UTILITY",
      language: "en_US",
      header: { type: "TEXT", text: "" },
      body: "",
      footer: "",
      buttons: [],
    });
  };

  const handleSyncTemplates = async () => {
    setIsSyncing(true);
    try {
      await api.post(
        "/templates/sync-from-meta",
        {
          businessProfileId,
        },
        config
      );
      setMessage({ text: "Templates synced successfully!", type: "success" });
      fetchTemplates();
    } catch (error) {
      console.error("Error syncing templates:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to sync templates",
        type: "error",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteTemplate = async () => {
    setIsLoading(true);
    try {
      await api.delete(
        `/projects/${projectId}/templates/${templateToDelete._id}`,
        config
      );
      setMessage({ text: "Template deleted successfully!", type: "success" });
      setTemplateToDelete(null);
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to delete template",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleViewDetails = (template) => {
    setSelectedTemplate(template);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">Approved</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        Redirecting to login...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            WhatsApp Templates
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage message templates for WhatsApp
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={handleSyncTemplates}
            loading={isSyncing}
            icon={<FiRefreshCw className="mr-2" />}
          >
            Sync Templates
          </Button>
          <Button
            variant="primary"
            // onClick={() => setIsModalOpen(true)}
            // icon={<FiPlus className="mr-2" />}
            onClick={() => navigate(`/project/${projectId}/templates/create`)}
          >
            New Template
          </Button>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <Alert variant={message.type} className="mb-6">
          {message.text}
        </Alert>
      )}

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-64"></div>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No templates found</p>
          {/* <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<FiPlus className="mr-2" />}
          >
            Create Your First Template
          </Button> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
            //   onEdit={() => handleEditTemplate(template)}
            //   onUpload={() => handleUploadTemplate(template._id)}
              onDelete={() => confirmDeleteTemplate(template)}
              onViewDetails={() => handleViewDetails(template)} // 👈 this triggers modal
              
            />
          ))}
        </div>
      )}

      {/* Create Template Modal */}
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Create New Template"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Template Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <SelectField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={categoryOptions}
              required
            />

            <SelectField
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              options={languageOptions}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Type
              </label>
              <SelectField
                value={formData.header.type}
                onChange={(e) => handleHeaderChange("type", e.target.value)}
                options={headerTypeOptions}
              />
            </div>
          </div>

          {formData.header.type === "TEXT" && (
            <InputField
              label="Header Text"
              value={formData.header.text}
              onChange={(e) => handleHeaderChange("text", e.target.value)}
            />
          )}

          {formData.header.type !== "TEXT" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.header.type === "IMAGE"
                  ? "Image"
                  : formData.header.type === "VIDEO"
                  ? "Video"
                  : "Document"}
              </label>
              <input
                type="file"
                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary-50 file:text-primary-700
                                    hover:file:bg-primary-100"
                accept={
                  formData.header.type === "IMAGE"
                    ? "image/*"
                    : formData.header.type === "VIDEO"
                    ? "video/*"
                    : ".pdf,.doc,.docx"
                }
              />
            </div>
          )}

          <TextArea
            label="Body Text (use {{1}} for variables)"
            value={formData.body}
            onChange={(e) =>
              handleInputChange({
                target: { name: "body", value: e.target.value },
              })
            }
            rows={4}
            required
          />

          <InputField
            label="Footer Text"
            name="footer"
            value={formData.footer}
            onChange={handleInputChange}
          />

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Buttons</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <SelectField
                label="Button Type"
                value={newButton.type}
                onChange={(e) =>
                  setNewButton({ ...newButton, type: e.target.value })
                }
                options={buttonTypeOptions}
              />
              <InputField
                label="Button Text"
                value={newButton.text}
                onChange={(e) =>
                  setNewButton({ ...newButton, text: e.target.value })
                }
              />
              <InputField
                label={newButton.type === "URL" ? "URL" : "Phone Number"}
                value={newButton.url}
                onChange={(e) =>
                  setNewButton({ ...newButton, url: e.target.value })
                }
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={addButton}
              disabled={!newButton.text}
            >
              Add Button
            </Button>

            {formData.buttons.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.buttons.map((btn, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">
                      {btn.text} ({btn.type})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeButton(i)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isLoading}>
              Create Template
            </Button>
          </div>
        </form>
      </Modal> */}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!templateToDelete}
        onClose={() => setTemplateToDelete(null)}
        title="Delete Template"
      >
        <p className="mb-6">
          Are you sure you want to delete the template "{templateToDelete?.name}
          "?
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setTemplateToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteTemplate}
            loading={isLoading}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TemplatePage;

const Tooltip = ({ children, content }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute z-10 invisible group-hover:visible bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {content}
      </div>
    </div>
  );
};
