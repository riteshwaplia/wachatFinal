import React, { useEffect, useState, useCallback } from "react";
import api from "../../utils/api";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingSpinner from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import "./TemplateManage.css";
import { Eye, Pencil, Trash2 } from "lucide-react";
import whatsapp from "../../assets/whatsap.jpg";
import EmojiPicker from "emoji-picker-react";

const TemplateManage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState({
    categories: false,
    templates: false,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: "", desc: "" });

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icons: "" });
  const [editCategory, setEditCategory] = useState({ id: null, name: "", icons: "" });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'category' or 'template'
    id: null,
    name: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Fetch categories with error handling
  const fetchCategories = useCallback(async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    setError("");
    try {
      const res = await api.get("/templatecategory");
      const cats = res.data.data || [];
      setCategories(cats);

      if (!selectedCategory && cats.length > 0) {
        setSelectedCategory(cats[0]);
      } else if (selectedCategory) {
        const stillExists = cats.find((c) => c._id === selectedCategory._id);
        if (stillExists) {
          setSelectedCategory(stillExists);
        } else {
          setSelectedCategory(cats[0] || null);
        }
      }
    } catch (err) {
      console.error("Error fetching categories", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  }, []);

  // Fetch templates for selected category
  const fetchTemplates = useCallback(async (categoryId) => {
    if (!categoryId) return;
    setLoading((prev) => ({ ...prev, templates: true }));
    setError("");
    try {
      const res = await api.get(`/templatecategory/${categoryId}/templates`);
      const templatesData = res.data.data || [];
      setTemplates(templatesData);
      setFilteredTemplates(templatesData);
    } catch (err) {
      console.error("Error fetching templates", err);
      setError("Failed to load templates. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, templates: false }));
    }
  }, []);

  // Filter templates based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(
        (tpl) =>
          tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tpl.desc &&
            tpl.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
          tpl.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tpl.components.some(
            (c) =>
              c.text && c.text.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredTemplates(filtered);
    }
  }, [searchQuery, templates]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategory?._id) {
      fetchTemplates(selectedCategory._id);
      setSearchQuery(""); // Reset search when category changes
    }
  }, [selectedCategory, fetchTemplates]);

  const handleCreateTemplate = async () => {
    if (!newTemplate.title.trim()) {
      setError("Template title is required");
      return;
    }

    try {
      const res = await api.post(`/templates`, {
        categoryId: selectedCategory._id,
        ...newTemplate,
      });
      setTemplates([...templates, res.data.data]);
      setOpenTemplateModal(false);
      setNewTemplate({ title: "", desc: "" });
      setSuccess("Template created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error creating template", err);
      setError("Failed to create template. Please try again.");
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const res = await api.post(`/templatecategory`, newCategory);
      const newCat = res.data.data;
      setCategories([...categories, newCat]);
      setSelectedCategory(newCat);
      setOpenCategoryModal(false);
      setNewCategory({ name: "", icons: "" });
      setSuccess("Category created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error creating category", err);
      setError("Failed to create category. Please try again.");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategory.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const res = await api.put(`/templatecategory/${editCategory.id}`, {
        name: editCategory.name,
        icons: editCategory.icons
      });
      
      const updatedCategories = categories.map((cat) =>
        cat._id === editCategory.id ? { ...cat, name: editCategory.name, icons: editCategory.icons } : cat
      );
      
      setCategories(updatedCategories);
      
      // Update selected category if it's the one being edited
      if (selectedCategory?._id === editCategory.id) {
        setSelectedCategory({ ...selectedCategory, name: editCategory.name, icons: editCategory.icons });
      }
      
      setEditCategory({ id: null, name: "", icons: "" });
      setSuccess("Category updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating category", err);
      setError("Failed to update category. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteModal.type === "category") {
        await api.delete(`/templatecategory/${deleteModal.id}`);
        const updatedCategories = categories.filter(
          (cat) => cat._id !== deleteModal.id
        );
        setCategories(updatedCategories);

        if (selectedCategory?._id === deleteModal.id) {
          setSelectedCategory(updatedCategories[0] || null);
        }

        setSuccess("Category deleted successfully!");
      } else if (deleteModal.type === "template") {
        await api.delete(`/templates/${deleteModal.id}`);
        const updatedTemplates = templates.filter(
          (tpl) => tpl._id !== deleteModal.id
        );
        setTemplates(updatedTemplates);
        setSuccess("Template deleted successfully!");
      }

      setDeleteModal({ isOpen: false, type: null, id: null, name: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting", err);
      setError(`Failed to delete ${deleteModal.type}. Please try again.`);
      setDeleteModal({ isOpen: false, type: null, id: null, name: "" });
    }
  };

  const handleEditTemplate = (templateId) => {
    navigate(`/admin/manage-templates/edit/${templateId}`);
  };

  const handlePreviewTemplate = (templateId) => {
    navigate(`/admin/manage-templates/preview/${templateId}`);
  };

  const handleEditCategory = (category) => {
    setEditCategory({ id: category._id, name: category.name, icons: category.icons || "" });
  };

  return (
    <div className="template-manage flex h-screen">
      {/* Sidebar */}
      <div className="template-sidebar w-64 bg-gray-100 p-4 border-r flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>

        <Button
          onClick={() => setOpenCategoryModal(true)}
          className="mb-4"
          variant="primary"
        >
          + Add Category
        </Button>

        {loading.categories ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="small" />
          </div>
        ) : (
          <ul className="space-y-2 flex-1 overflow-y-auto">
            {categories.map((cat) => (
              <li key={cat._id} className="category-item">
                <div
                  className={`category-main flex justify-between items-center px-3 py-2 rounded-md ${
                    selectedCategory?._id === cat._id
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{cat.icons || "📁"}</span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <div className="category-actions flex space-x-1">
                    <button
                      className="p-1 hover:bg-gray-300 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(cat);
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-300 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModal({
                          isOpen: true,
                          type: "category",
                          id: cat._id,
                          name: cat.name,
                        });
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {categories.length === 0 && !loading.categories && (
          <EmptyState
            message="No categories found"
            subtitle="Create your first category to get started"
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory?.name || "Select Category"} Templates
          </h2>

          {selectedCategory && (
            <div className="flex space-x-3">
              <SearchBar 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-32"
              />
              <Button
                onClick={() => navigate("/admin/manage-templates/create")}
                variant="primary"
              >
                + Add Template
              </Button>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              className="float-right font-bold text-red-800"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
            <button
              className="float-right font-bold text-green-800"
              onClick={() => setSuccess("")}
            >
              ×
            </button>
          </div>
        )}

        {!selectedCategory ? (
          <EmptyState
            icon="📁"
            message="No category selected"
            subtitle="Select or create a category to view templates"
          />
        ) : loading.templates ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="Loading templates..." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl._id}
                  className="template-card border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  {/* WhatsApp-style Preview */}
                  <div className="bg-[#e5ddd5] rounded-lg p-3">
                    {tpl.components.map((c, idx) => {
                      if (c.type === "HEADER") {
                        return (
                          <div key={idx} className="mb-2">
                            {c.format === "IMAGE" ? (
                              <img
                                src={
                                 whatsapp
                                }
                                alt="header"
                                className="rounded-lg max-h-40 object-cover"
                              />
                            ) : (
                              <p className="font-semibold text-gray-800">
                                {c.text}
                              </p>
                            )}
                          </div>
                        );
                      }

                      if (c.type === "BODY") {
                        return (
                          <p
                            key={idx}
                            className="text-gray-900 text-sm mb-2 whitespace-pre-line"
                          >
                            {c.text}
                          </p>
                        );
                      }

                      if (c.type === "FOOTER") {
                        return (
                          <p key={idx} className="text-gray-500 text-xs mt-2">
                            {c.text}
                          </p>
                        );
                      }

                      if (c.type === "BUTTONS") {
                        return (
                          <div
                            key={idx}
                            className="flex flex-col space-y-2 mt-2"
                          >
                            {c.buttons.map((btn, bIdx) => (
                              <button
                                key={bIdx}
                                className="px-3 py-1 border border-green-600 text-green-600 rounded-md text-sm hover:bg-green-50"
                              >
                                {btn.text}
                              </button>
                            ))}
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>

                  {/* Template Info */}
                  <div className="mt-3">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Category: {tpl.TemplateCategory?.name || "Uncategorized"}
                    </p>
                    <p className="text-xs text-gray-400">Lang: {tpl.language}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleEditTemplate(tpl._id)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            type: "template",
                            id: tpl._id,
                            name: tpl.name,
                          })
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && searchQuery && (
              <EmptyState
                description="No templates found"
                subtitle={`No templates match your search for "${searchQuery}"`}
              />
            )}

            {filteredTemplates.length === 0 && !searchQuery && (
              <EmptyState
                title="No templates in this category yet"
                description="Create your first template to get started"
              />
            )}
          </>
        )}
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={openCategoryModal}
        onClose={() => {
          setOpenCategoryModal(false);
          setNewCategory({ name: "", icons: "" });
          setError("");
        }}
        title="Create Category"
        size="md"
      >
        <InputField
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          autoFocus
        />

        {/* Icon Picker */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Category Icon</label>
          <div className="flex items-center space-x-2">
            <InputField
              placeholder="Select Icon..."
              value={newCategory.icons}
              onChange={(e) =>
                setNewCategory({ ...newCategory, icons: e.target.value })
              }
            />
            <span className="text-2xl">
              {newCategory.icons || "❔"}
            </span>
          </div>
          <div className="mt-2">
            <EmojiPicker
              onEmojiClick={(emojiData) =>
                setNewCategory({ ...newCategory, icons: emojiData.emoji })
              }
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            onClick={() => setOpenCategoryModal(false)}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleCreateCategory} variant="primary">
            Create
          </Button>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={!!editCategory.id}
        onClose={() => setEditCategory({ id: null, name: "", icons: "" })}
        title="Edit Category"
        size="md"
      >
        <InputField
          placeholder="Category Name"
          value={editCategory.name}
          onChange={(e) =>
            setEditCategory({ ...editCategory, name: e.target.value })
          }
          autoFocus
        />

        {/* Icon Picker */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Category Icon</label>
          <div className="flex items-center space-x-2">
            <InputField
              placeholder="Select Icon..."
              value={editCategory.icons}
              onChange={(e) =>
                setEditCategory({ ...editCategory, icons: e.target.value })
              }
            />
            <span className="text-2xl">
              {editCategory.icons || "❔"}
            </span>
          </div>
          <div className="mt-2">
            <EmojiPicker
              onEmojiClick={(emojiData) =>
                setEditCategory({ ...editCategory, icons: emojiData.emoji })
              }
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button
            onClick={() => setEditCategory({ id: null, name: "", icons: "" })}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateCategory} variant="primary">
            Update
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null, id: null, name: "" })}
        onConfirm={handleDelete}
        title={`Delete ${deleteModal.type} `}
        message={`Are you sure you want to delete "${deleteModal.name}"? This action will also delete the template related to this category , and cannot be undone. `}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default TemplateManage;