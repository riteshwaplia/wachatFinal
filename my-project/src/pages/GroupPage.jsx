import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
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
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/Loader";
import InputField from "../components/InputField";
// import { ErrorToast } from "../utils/Toast";

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
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [loading, setLoding] = useState(false);
  const [erorrs, setErrors] = useState({ title: '' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    totalPages: 1,
    limit: 10
  });

  useEffect(() => {
    setLoding(true)
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // setPagination(prev => ({ ...prev, currentPage: 1 }));
      setLoding(false)

    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (user && token && projectId) {
      fetchGroups();
    } else if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, token, projectId, activeTab, pagination.currentPage, pagination.limit, debouncedSearchTerm]);

  // Pagination state based on API response structure

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };


  const validateGroupData = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Group name is required";
    }

    // Show toast for each error
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return false;
    }

    return true;
  };



  // Fetch groups with pagination
  const fetchGroups = async () => {
    try {
      setLoding(true);


      // api/projects/:projectId/groups/bulk-block

      const endpoint = activeTab === "active"
        ? `/projects/${projectId}/groups`
        : `/projects/${projectId}/groups/archiveList`;

      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: debouncedSearchTerm   // <==== this one
      };

      const res = await api.get(endpoint, {
        ...config,
        params
      });

      if (res.data.success) {
        const { data = [], pagination: serverPagination = {} } = res.data;

        setGroups(data);

        setPagination({
          currentPage: serverPagination.currentPage || 1,
          total: serverPagination.total || 0,
          totalPages: serverPagination.totalPages || 0,
          limit: serverPagination.limit || pagination.limit || 10
        });
        setLoding(false)

      } else {
        setGroups([]);
        setPagination({
          currentPage: 1,
          total: 0,
          totalPages: 0,
          limit: pagination.limit || 10
        });
        setLoding(false)

      }

      // if (res.data.success) {
      //   setGroups(res.data.data);
      //   console.log("res.>>>>>>>>>", res.data?.pagination?.total)
      //   setPagination({
      //     currentPage: res.data.pagination.currentPage || 1,
      //     total: res.data.pagination.total || 0,
      //     totalPages: res.data?.pagination.totalPages || 0,
      //     limit: pagination?.limit || 10
      //   });
      //   setLoding(false)
      //   setMessage({ text: res.data.message, type: "success" });
      // } else {
      //   setMessage({ text: res.data.message, type: "error" });
      // }
      setSelectedGroups([]);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to fetch groups",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  console.log("paginatnion", pagination)


  // Handle pagination change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: newPage
      }));
    }
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      currentPage: 1 // Reset to first page when changing limit
    }));
  };


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (erorrs[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }


  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateGroupData();
    if (!isValid) {
      return
    }
    try {
      const endpoint = editingGroup
        ? `/projects/${projectId}/groups/${editingGroup._id}`
        : `/projects/${projectId}/groups`;
      const method = editingGroup ? "put" : "post";



      const res = await api[method](endpoint, formData, config);

      setMessage({ text: res.data.message, type: "success" });
      setFormData({ title: "", description: "" });
      setEditingGroup(null);
      setIsModalOpen(false);
      fetchGroups();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to save group",
        type: "error"
      });
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
      setMessage({
        text: error.response?.data?.message || "Failed to toggle group status",
        type: "error"
      });
    }
  };

  // Delete group
  const handleDeleteClick = (groupId) => {
    setGroupId(groupId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await api.delete(
        `/projects/${projectId}/groups/${groupId}`,
        config
      );
      setMessage({ text: res.data.message, type: "success" });
      fetchGroups();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to delete group",
        type: "error"
      });
    } finally {
      setShowConfirmModal(false);
      setGroupId(null);
    }
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
          endpoint = `/projects/${projectId}/groups/multi/archive`;
          method = "patch";
          break;
        case "restore":
          endpoint = `/projects/${projectId}/groups/unarchive`;
          method = "post";
          break;
        case "delete":
          // /api/projects/:projectId/groups/bulk-block
          endpoint = `/projects/${projectId}/groups/bulk-delete`;
          method = "post";
          break;
        default:
          return;
      }
      const res = await api[method](endpoint, { ids: selectedGroups }, config);
      setMessage({ text: res.data.message, type: "success" });
      fetchGroups();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to perform bulk action",
        type: "error"
      });
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
    if (selectedGroups.length === groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups.map((group) => group._id));
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert type="error" message="Redirecting to login..." />
      </div>
    );
  }

  if (isLoading) return <>
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  </>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {showConfirmModal && (
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Delete Group"
          size="sm"
        >
          <p className='mb-4 text-xl text-red-500'>Are you sure you want to delete this group?</p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              Confirm
            </Button>
          </div>
        </Modal>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-dark-text-primary text-gray-900">
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
                setIsModalOpen(true);
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
      {/* {message.text && (
        <Alert type={message.type} message={message.text} className="mb-6" />
      )} */}

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative rounded-md shadow-sm max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-primary-500 dark:bg-dark-surface dark:text-dark-text-primary focus:border-primary-500 block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => {
              const raw = e.target.value;
              const cleaned = raw.replace(/[^a-zA-Z0-9 ]/g, "");
              setSearchTerm(cleaned);
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}

          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
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
                  className={`transition-transform ${isBulkActionsOpen ? "transform rotate-180" : ""
                    }`}
                />
              </Button>
              {isBulkActionsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-md shadow-lg py-1 z-10">
                  {activeTab === "active" ? (
                    <button
                      onClick={() => {
                        handleBulkAction("archive");
                        setIsBulkActionsOpen(false);
                      }}
                      className="flex items-center px-4 py-2 dark:text-dark-text-primary  dark:hover:bg-dark-surface  text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FiArchive className="mr-2" /> Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleBulkAction("restore");
                        setIsBulkActionsOpen(false);
                      }}
                      className="flex items-center px-4 py-2 dark:text-dark-text-primary dark:hover:bg-dark-surface text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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
                    className="flex items-center px-4 py-2  dark:hover:bg-dark-surface  text-sm text-red-600 hover:bg-red-50 w-full text-left"
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
              onClick={() => {
                setActiveTab("active");
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === "active"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <span>Active Groups</span>
              {activeTab === 'active' && <Badge type="primary" size="sm">
                {pagination.total}
              </Badge>}
            </button>
            <button
              onClick={() => {
                setActiveTab("archived");
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === "archived"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <span>Archived Groups</span>
              {activeTab === 'archived' && <Badge type="primary" size="sm">
                {pagination.total}
              </Badge>}
            </button>
          </nav>
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-white dark:bg-dark-surface overflow-scroll rounded-xl shadow-sm dark:border-dark-border border border-gray-200 overflow-hidden">
        {groups.length === 0 ? (
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
                  setIsModalOpen(true);
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
          loading ? <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div> : (
            <>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-surface">
                <thead className="bg-gray-50 dark:bg-dark-surface">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedGroups.length > 0 &&
                          selectedGroups.length === groups.length
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
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-surface dark:divide-y dark:divide-dark-border dark:bg-dark-surface">
                  {groups.map((group) => (
                    <tr key={group._id} className="hover:bg-gray-50 dark:hover:bg-dark-surface">
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
                            <div className="text-sm font-medium dark:text-dark-text-secondary text-gray-900">
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
                          {group.isActive ? "Active" : "Archived"}
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
                              setIsModalOpen(true);
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


              {/* Pagination */}
              <div className="px-6 py-4 border-t dark:border-dark-border border-gray-200 flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.limit, pagination.total)}
                    </span> of <span className="font-medium">{pagination.total}</span> results
                  </span>
                  <select
                    value={pagination.limit}
                    onChange={handleLimitChange}
                    className="border border-gray-300 rounded-md dark:bg-dark-surface dark:text-dark-text-primary px-2 py-1 text-sm"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="flex items-center"
                  >
                    <FiChevronLeft size={16} className="mr-1" />
                    Previous
                  </Button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.currentPage === pageNum ? "primary" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10 h-10 flex items-center justify-center"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className="flex items-center"
                  >
                    Next
                    <FiChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            </>)
        )}
      </div>

      {/* Create/Edit Group Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setEditingGroup(null);
          setFormData({ title: "", description: "" });
          setIsModalOpen(false);
        }}
        title={editingGroup ? "Edit Group" : "Create New Group"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Group Name *
            </label> */}

            <InputField
              label="Group Name"
              name="title"
              value={(formData.title).replace(/[^a-zA-Z0-9]/g, '')}
              error={erorrs.title}
              helperText={erorrs.title}
              onChange={handleInputChange}
              placeholder="enter  group name"
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
              className="w-full dark:bg-dark-surface dark:text-dark-text-primary px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                setIsModalOpen(false);
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