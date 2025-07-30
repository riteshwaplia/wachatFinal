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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/templates", {
        ...config,
        params: {
          businessProfileId,
          page,
          limit: 6, // adjust per row/column size
        },
      });

      setTemplates(res.data.data);
      setTotalPages(res.data.pagination?.totalPages || 1);
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
  }, [user, token, projectId, page]);

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
      // await api.delete(
      //   `/projects/${projectId}/templates/${templateToDelete._id}`,
      //   config
      // );
      await api.delete(`/templates/${templateToDelete._id}`, {
      data: { businessProfileId } 
    });
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
    navigate(`/project/${projectId}/templates/${template._id}`, {
      state: { template },
    });
  };
  const handleDelete = async (template) => {
  const confirmed = window.confirm(`Are you sure you want to delete "${template.name}"?`);
  if (!confirmed) return;

  try {
    const res = await api.delete(`/templates/${template._id}`, {
      data: { businessProfileId } 
    });

    console.log("Template deleted:", res.data);
    onDelete(template._id); // Notify parent to remove it from UI
  } catch (error) {
    console.error('Error deleting template:', error);
    alert("Failed to delete template.");
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
          <h1 className="text-3xl dark:text-dark-text-primary font-bold text-gray-900">
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
          regular Template
          </Button>
          <Button
            variant="primary"
            // onClick={() => setIsModalOpen(true)}
            // icon={<FiPlus className="mr-2" />}
            onClick={() => navigate(`/project/${projectId}/templates/create/carousel-templates`)}
          >
          carousel Template
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
        <div className="text-center dark:bg-dark-surface py-12 bg-gray-50 rounded-lg">
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
  // onEdit={() => handleEditTemplate(template)} // if needed
  // onUpload={() => handleUploadTemplate(template)} // if needed
  onDelete={(t) => setTemplateToDelete(t)} // 👈 fix this
  onViewDetails={() => handleViewDetails(template)}
  handleSyncTemplates={() => handleSyncTemplates()}
/>
          ))}
        
        </div>
      )}
  {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 mt-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          )}
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









// import React, { useState, useEffect } from "react";
// import api from "../utils/api";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// import {
//   FiPlus,
//   FiEdit,
//   FiTrash2,
//   FiUpload,
//   FiRefreshCw,
//   FiChevronDown,
// } from "react-icons/fi";
// import Badge from "../components/Badge";
// import Button from "../components/Button";
// import Alert from "../components/Alert";
// import Card from "../components/Card";
// import Modal from "../components/Modal";
// import InputField from "../components/InputField";
// import SelectField from "../components/SelectField";
// import TextArea from "../components/TextArea";
// import TemplateCard from "../components/template/TemplateCard";

// const TemplatePage = () => {
//   const { user, token } = useAuth();
//   const navigate = useNavigate();
//   const { id: projectId } = useParams();
//   const [templates, setTemplates] = useState([]);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [isLoading, setIsLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [templateToDelete, setTemplateToDelete] = useState(null);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const project = localStorage.getItem("currentProject")
//     ? JSON.parse(localStorage.getItem("currentProject"))
//     : null;
//   const businessProfileId = project?.businessProfileId._id || null;
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Form state

//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   const fetchTemplates = async () => {
//     setIsLoading(true);
//     try {
//       const res = await api.get("/templates", {
//         ...config,
//         params: {
//           businessProfileId,
//           page,
//           limit: 6, // adjust per row/column size
//         },
//       });

//       setTemplates(res.data.data);
//       setTotalPages(res.data.pagination?.totalPages || 1);
//       if (res.data.data.length === 0) {
//         setMessage({
//           text: "No templates found. Create your first template.",
//           type: "info",
//         });
//       } else {
//         setMessage({ text: "", type: "" });
//       }
//     } catch (error) {
//       console.error("Error fetching templates:", error);
//       setMessage({
//         text: error.response?.data?.message || "Failed to load templates",
//         type: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user && token && projectId) {
//       fetchTemplates();
//     } else if (!user) {
//       navigate("/login");
//     }
//   }, [user, token, projectId, page]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleHeaderChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       header: { ...prev.header, [field]: value },
//     }));
//   };

//   const addButton = () => {
//     if (!newButton.text) return;

//     setFormData((prev) => ({
//       ...prev,
//       buttons: [...prev.buttons, newButton],
//     }));

//     setNewButton({ type: "URL", text: "", url: "" });
//   };

//   const removeButton = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       buttons: prev.buttons.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const payload = {
//         name: formData.name,
//         category: formData.category,
//         language: formData.language,
//         components: {
//           header: formData.header.text ? formData.header : null,
//           body: formData.body,
//           footer: formData.footer,
//           buttons: formData.buttons,
//         },
//       };

//       await api.post(`/templates`, payload, config);

//       setMessage({ text: "Template created successfully!", type: "success" });
//       setIsModalOpen(false);
//       resetForm();
//       fetchTemplates();
//     } catch (error) {
//       console.error("Error creating template:", error);
//       setMessage({
//         text: error.response?.data?.message || "Failed to create template",
//         type: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       category: "UTILITY",
//       language: "en_US",
//       header: { type: "TEXT", text: "" },
//       body: "",
//       footer: "",
//       buttons: [],
//     });
//   };

//   const handleSyncTemplates = async () => {
//     setIsSyncing(true);
//     try {
//       await api.post(
//         "/templates/sync-from-meta",
//         {
//           businessProfileId,
//         },
//         config
//       );
//       setMessage({ text: "Templates synced successfully!", type: "success" });
//       fetchTemplates();
//     } catch (error) {
//       console.error("Error syncing templates:", error);
//       setMessage({
//         text: error.response?.data?.message || "Failed to sync templates",
//         type: "error",
//       });
//     } finally {
//       setIsSyncing(false);
//     }
//   };

//   const handleDeleteTemplate = async () => {
//     setIsLoading(true);
//     try {
//       // await api.delete(
//       //   `/projects/${projectId}/templates/${templateToDelete._id}`,
//       //   config
//       // );
//       await api.delete(`/templates/${templateToDelete._id}`, {
//       data: { businessProfileId } 
//     });
//       setMessage({ text: "Template deleted successfully!", type: "success" });
//       setTemplateToDelete(null);
//       fetchTemplates();
//     } catch (error) {
//       console.error("Error deleting template:", error);
//       setMessage({
//         text: error.response?.data?.message || "Failed to delete template",
//         type: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const handleViewDetails = (template) => {
//     navigate(`/project/${projectId}/templates/${template._id}`, {
//       state: { template },
//     });
//   };
//   const handleDelete = async (template) => {
//   const confirmed = window.confirm(`Are you sure you want to delete "${template.name}"?`);
//   if (!confirmed) return;

//   try {
//     const res = await api.delete(`/templates/${template._id}`, {
//       data: { businessProfileId } 
//     });

//     console.log("Template deleted:", res.data);
//     onDelete(template._id); // Notify parent to remove it from UI
//   } catch (error) {
//     console.error('Error deleting template:', error);
//     alert("Failed to delete template.");
//   }
// };
//   if (!user)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Redirecting to login...
//       </div>
//     );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             WhatsApp Templates
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Create and manage message templates for WhatsApp
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Button
//             variant="secondary"
//             onClick={handleSyncTemplates}
//             loading={isSyncing}
//             icon={<FiRefreshCw className="mr-2" />}
//           >
//             Sync Templates
//           </Button>
//           <Button
//             variant="primary"
//             // onClick={() => setIsModalOpen(true)}
//             // icon={<FiPlus className="mr-2" />}
//             onClick={() => navigate(`/project/${projectId}/templates/create`)}
//           >
//             New Template
//           </Button>
//         </div>
//       </div>

//       {/* Message Alert */}
//       {message.text && (
//         <Alert variant={message.type} className="mb-6">
//           {message.text}
//         </Alert>
//       )}

//       {/* Templates Grid */}
//       {isLoading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3].map((i) => (
//             <Card key={i} className="animate-pulse">
//               <div className="h-64"></div>
//             </Card>
//           ))}
//         </div>
//       ) : templates.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <p className="text-gray-500 mb-4">No templates found</p>
//           {/* <Button
//             variant="primary"
//             onClick={() => setIsModalOpen(true)}
//             icon={<FiPlus className="mr-2" />}
//           >
//             Create Your First Template
//           </Button> */}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {templates.map((template) => (
//            <TemplateCard
//   key={template._id}
//   template={template}
//   // onEdit={() => handleEditTemplate(template)} // if needed
//   // onUpload={() => handleUploadTemplate(template)} // if needed
//   onDelete={(t) => setTemplateToDelete(t)} // 👈 fix this
//   onViewDetails={() => handleViewDetails(template)}
//   handleSyncTemplates={() => handleSyncTemplates()}
// />
//           ))}
//           {totalPages > 1 && (
//             <div className="mt-6 flex justify-center space-x-2">
//               <Button
//                 variant="secondary"
//                 disabled={page === 1}
//                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               >
//                 Previous
//               </Button>
//               <span className="text-sm text-gray-600 mt-2">
//                 Page {page} of {totalPages}
//               </span>
//               <Button
//                 variant="secondary"
//                 disabled={page === totalPages}
//                 onClick={() =>
//                   setPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={!!templateToDelete}
//         onClose={() => setTemplateToDelete(null)}
//         title="Delete Template"
//       >
//         <p className="mb-6">
//           Are you sure you want to delete the template "{templateToDelete?.name}
//           "?
//         </p>
//         <div className="flex justify-end space-x-3">
//           <Button variant="secondary" onClick={() => setTemplateToDelete(null)}>
//             Cancel
//           </Button>
//           <Button
//             variant="danger"
//             onClick={handleDeleteTemplate}
//             loading={isLoading}
//           >
//             Delete
//           </Button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default TemplatePage;

// const Tooltip = ({ children, content }) => {
//   return (
//     <div className="relative group">
//       {children}
//       <div className="absolute z-10 invisible group-hover:visible bottom-full mb-2 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
//         {content}
//       </div>
//     </div>
//   );
// };
