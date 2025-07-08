import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiEdit2,
  FiTrash2,
  FiArchive,
  FiRotateCcw,
  FiPlus,
  FiCheck,
  FiX,  
  FiChevronDown,
  FiSearch,
} from "react-icons/fi";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/Loader";

const GroupPage = () => {
     const [showConfirmModal, setShowConfirmModal] = useState(false);
      const [groupId, setGroupId] = useState(null);
  const { user, token } = useAuth();
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [groups, setGroups] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingGroup, setEditingGroup] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/groups`, config);
      setGroups(res.data.data);
      setMessage({ text: "", type: "" });
      setSelectedGroups([]); // Clear selection after any operation
    } catch (error) {
      handleError(error, "fetching groups");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API errors
  const handleError = (error, action) => {
    console.error(`Error ${action}:`, error);
    setMessage({
      text: `Error ${action}: ${
        error.response?.data?.message || "Unknown error"
      }`,
      type: "error",
    });
  };

  // Load data on mount
  useEffect(() => {
    if (user && token && projectId) {
      fetchGroups();
    } else if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, token, projectId, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingGroup
        ? `/projects/${projectId}/groups/${editingGroup._id}`
        : `/projects/${projectId}/groups`;
      const method = editingGroup ? "put" : "post";

      const res = await api[method](endpoint, formData, config);

      setMessage({ text: res.data.message, type: "success" });
      setFormData({ title: "", description: "" });
      setEditingGroup(null);
      fetchGroups();
    } catch (error) {
      handleError(error, editingGroup ? "updating group" : "creating group");
    }
  };

  // Toggle group status (active/archive)
  const toggleGroupStatus = async (groupId, isCurrentlyActive) => {
    try {
      const endpoint = isCurrentlyActive
        ? `/projects/${projectId}/groups/archive/${groupId}`
        : `/projects/${projectId}/groups/removeArchive/${groupId}`;

      const res = await api.put(endpoint, {}, config);
      setMessage({ text: res.data.message, type: "success" });
      fetchGroups();
    } catch (error) {
      handleError(error, "toggling group status");
    }
  };

  // Delete group
  const handleDeleteClick = (groupId) => {
    setGroupId(groupId);
    setShowConfirmModal(true);
};
  const handleDelete = async () => {
    // if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        const res = await api.delete(
          `/projects/${projectId}/groups/${groupId}`,
          config
        );
        setMessage({ text: res.data.message, type: "success" });
        fetchGroups();
      } catch (error) {
        handleError(error, "deleting group");
      }
      finally{
         setShowConfirmModal(false);
        setGroupId  (null);
      }
    // }
  };

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedGroups.length === 0) {
      setMessage({ text: "No groups selected", type: "error" });
      return;
    }

    try {
      let endpoint = "";
      let method = "";

      switch (action) {
        case "archive":
          endpoint = `/projects/${projectId}/groups/archive`;
          method = "patch";
          break;
        case "restore":
          endpoint = `/projects/${projectId}/groups/removeArchive`;
          method = "patch";
          break;
        case "delete":
          endpoint = `/projects/${projectId}/groups`;
          method = "delete";
          break;
        default:
          return;
      }

      const res = await api[method](endpoint, { ids: selectedGroups }, config);
      setMessage({ text: res.data.message, type: "success" });
      fetchGroups();
    } catch (error) {
      handleError(error, "performing bulk action");
    }
  };

  // Toggle group selection
  const toggleGroupSelection = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedGroups.length === filteredGroups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(filteredGroups.map((group) => group._id));
    }
  };

  // Filter groups based on active tab and search term
  const filteredGroups = groups
    .filter((group) =>
      activeTab === "active" ? group.isActive : !group.isActive
    )
    .filter(
      (group) =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.description &&
          group.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert type="error" message="Redirecting to login..." />
      </div>
    );
  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {
      showConfirmModal &&
            <Modal
                              isOpen={showConfirmModal}
                              onClose={() => setShowConfirmModal(false)}
                              title="Delete Contact"
                              size="sm" // Can be 'sm', 'md', 'lg'
                            >
                              <p className='mb-4  text-xl text-red-500 '>Are you sure you want to delete this contact?</p>
                              <div className="flex justify-end space-x-3">
                                <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                                  Cancel
                                </Button>
                                <Button variant="primary" onClick={()=>handleDelete()}>
                                  Confirm
                                </Button> 
                              </div>
                            </Modal>
      }
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Group Management
            </h1>
            <p className="mt-2 text-gray-600">
              Organize your contacts into groups for better communication
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => {
                setEditingGroup(null);
                setFormData({ title: "", description: "" });
                setIsModalOpen(true); // Add this line
              }}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <FiPlus size={18} />
              <span>New Group</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <Alert type={message.type} message={message.text} className="mb-6" />
      )}

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative rounded-md shadow-sm max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {selectedGroups.length > 0 && (
            <div className="relative">
              <Button
                variant="secondary"
                onClick={() => setIsBulkActionsOpen(!isBulkActionsOpen)}
                className="flex items-center space-x-2"
              >
                <span>Bulk Actions</span>
                <FiChevronDown
                  className={`transition-transform ${
                    isBulkActionsOpen ? "transform rotate-180" : ""
                  }`}
                />
              </Button>
              {isBulkActionsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {activeTab === "active" ? (
                    <button
                      onClick={() => {
                        handleBulkAction("archive");
                        setIsBulkActionsOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FiArchive className="mr-2" /> Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleBulkAction("restore");
                        setIsBulkActionsOpen(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FiRotateCcw className="mr-2" /> Restore
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${selectedGroups.length} group(s)?`
                        )
                      ) {
                        handleBulkAction("delete");
                        setIsBulkActionsOpen(false);
                      }
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <FiTrash2 className="mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("active")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === "active"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>Active Groups</span>
              <Badge type="primary" size="sm">
                {groups.filter((g) => g.isActive).length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("archived")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === "archived"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>Archived Groups</span>
              <Badge type="secondary" size="sm">
                {groups.filter((g) => !g.isActive).length}
              </Badge>
            </button>
          </nav>
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredGroups.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              {activeTab === "active" ? (
                <FiPlus className="h-6 w-6 text-gray-400" />
              ) : (
                <FiArchive className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchTerm
                ? "No matching groups found"
                : activeTab === "active"
                ? "No active groups yet"
                : "No archived groups"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try a different search term"
                : activeTab === "active"
                ? "Get started by creating your first group"
                : "Archived groups will appear here"}
            </p>
            {activeTab === "active" && !searchTerm && (
              <Button
                onClick={() => {
                  setEditingGroup(null);
                  setFormData({ title: "", description: "" });
                }}
                variant="primary"
                className="flex items-center space-x-2 mx-auto"
              >
                <FiPlus size={18} />
                <span>Create Group</span>
              </Button>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedGroups.length > 0 &&
                      selectedGroups.length === filteredGroups.length
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Group
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.map((group) => (
                <tr key={group._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group._id)}
                      onChange={() => toggleGroupSelection(group._id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {group.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {group.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {group.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      type={group.isActive ? "success" : "warning"}
                      size="sm"
                    >
                      {group.isActive ? true : false}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        onClick={() => {
                          setEditingGroup(group);
                          setFormData({
                            title: group.title,
                            description: group.description || "",
                          });
                          setIsModalOpen(true); // Add this line
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-primary-600"
                        tooltip="Edit"
                      >
                        <FiEdit2 size={16} />
                      </Button>
                      <Button
                        onClick={() =>
                          toggleGroupStatus(group._id, group.isActive)
                        }
                        variant="ghost"
                        size="sm"
                        className={
                          group.isActive
                            ? "text-gray-600 hover:text-yellow-600"
                            : "text-gray-600 hover:text-green-600"
                        }
                        tooltip={group.isActive ? "Archive" : "Restore"}
                      >
                        {group.isActive ? (
                          <FiArchive size={16} />
                        ) : (
                          <FiRotateCcw size={16} />
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(group._id)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-red-600"
                        tooltip="Delete"
                      >
                        <FiTrash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Group Modal */}
      <Modal
        isOpen={isModalOpen} // Changed from the previous condition
        onClose={() => {
          setEditingGroup(null);
          setFormData({ title: "", description: "" });
          setIsModalOpen(false); // Add this line
        }}
        title={editingGroup ? "Edit Group" : "Create New Group"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Group Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingGroup(null);
                setFormData({ title: "", description: "" });
                setIsModalOpen(false); // Add this line
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingGroup ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GroupPage;
