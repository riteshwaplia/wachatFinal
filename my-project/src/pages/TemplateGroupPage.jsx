import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import LoadingSpinner from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { BackButton } from "../components/BackButton";
import Modal from "../components/Modal";
import whatsapp from "../assets/whatsap.jpg";
const TemplateGroupPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState({
    categories: false,
    templates: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    template: null
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const projectId = id;

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const res = await api.get("/templatecategory");
      const cats = res.data.data || [];
      setCategories(cats);

      if (!selectedCategory && cats.length > 0) {
        setSelectedCategory(cats[0]);
      }
    } catch (err) {
      console.error("Error fetching categories", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  }, []);

  // Fetch templates
  const fetchTemplates = useCallback(async (categoryId) => {
    if (!categoryId) return;
    setLoading((prev) => ({ ...prev, templates: true }));
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

  // Filter templates
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(
        (tpl) =>
          tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tpl.desc &&
            tpl.desc.toLowerCase().includes(searchQuery.toLowerCase()))
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
      setSearchQuery("");
    }
  }, [selectedCategory, fetchTemplates]);

  const handleSubmittometa = (projectId, templateId) => {
    navigate(`/project/${projectId}/templates/create/${templateId}`);
  };

  const handlePreviewTemplate = (template) => {
    setPreviewModal({
      isOpen: true,
      template: template
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      template: null
    });
  };

  return (
    <>
      <BackButton text="back" />
      <div className="template-user flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <div className="template-sidebar w-64 bg-gray-100 dark:bg-gray-900 p-4 border-r dark:border-gray-700 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Categories</h2>

          {loading.categories ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            <ul className="space-y-2 flex-1 overflow-y-auto">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <div
                    className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer ${
                      selectedCategory?._id === cat._id
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="truncate">{cat?.icons}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {categories.length === 0 && !loading.categories && (
            <EmptyState
              title="No categories found"
              subtitle="Please contact admin to add categories"
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {selectedCategory?.name || "Select Category"} Templates
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="primary"
                onClick={() => navigate(`/project/${projectId}/templates/create`)}
                className="w-full sm:w-auto"
              >
                + Template manually
              </Button>

              <Button
                variant="primary"
                onClick={() => navigate(`/project/${projectId}/templates/create/carousel-templates`)}
                className="w-full sm:w-auto"
              >
                + Carousel Template manually
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              {error}
              <button
                className="float-right font-bold text-red-800"
                onClick={() => setError("")}
              >
                ×
              </button>
            </div>
          )}

          {!selectedCategory ? (
            <EmptyState
              icon="📁"
              title="No category selected"
              description="Select a category to view templates"
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
      className="template-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 bg-white dark:bg-gray-800 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-xl transition-shadow relative overflow-hidden group"
    >
      {/* Tag with improved styling */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 transform group-hover:scale-105 ${
            tpl.tag === "hot"
              ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-200"
              : tpl.tag === "trending"
              ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-200"
              : tpl.tag === "new"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200"
              : tpl.tag === "popular"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200"
              : tpl.tag === "seasonal"
              ? "bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-200"
              : "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-200"
          }`}
        >
          {/* Icons for each tag type */}
          {tpl.tag === "hot" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          )}
          {tpl.tag === "trending" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          )}
          {tpl.tag === "new" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
          {tpl.tag === "popular" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 13.713 2 10.016 2 5a1 1 0 011-1c2 0 4.5 1.5 5.5 3.5C9.5 5.5 12 4 14 4a1 1 0 011 1c0 5.016-2.045 8.713-5.285 11.32a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
            </svg>
          )}
          {tpl.tag === "seasonal" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          )}
          {!["hot", "trending", "new", "popular", "seasonal"].includes(tpl.tag) && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          )}
          {tpl.tag.toUpperCase()}
        </span>
      </div>

      {/* WhatsApp-style Preview */}
      <div className="bg-[#e5ddd5] dark:bg-gray-700 rounded-lg p-3 mt-6">
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
                    className="rounded-lg max-h-40 object-cover w-full"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
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
                className="text-gray-900 dark:text-gray-100 text-sm mb-2 whitespace-pre-line"
              >
                {c.text}
              </p>
            );
          }

          if (c.type === "FOOTER") {
            return (
              <p key={idx} className="text-gray-500 dark:text-gray-300 text-xs mt-2">
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
                    className="px-3 py-1.5 border border-green-600 text-green-600 rounded-md text-sm hover:bg-green-50 transition-colors duration-200"
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

      <div className="flex justify-between items-center mt-4">
        <button
          className="flex items-center px-2 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:from-blue-700 hover:to-blue-900 text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          onClick={() => handleSubmittometa(projectId, tpl._id)}
        >
          Use this Template
        </button>
        <button
          className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors duration-200"
          onClick={() => handlePreviewTemplate(tpl)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          Preview
        </button>
      </div>
    </div>
  ))}
</div>

              {filteredTemplates.length === 0 && (
                <EmptyState
                  title="No templates in this category"
                  subtitle="Please contact admin to add templates"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        title="Template Preview"
        size="lg"
      >
        {previewModal.template && (
          <div className="p-4 bg-white dark:bg-gray-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{previewModal.template.name}</h3>
            
            {/* WhatsApp-style Preview */}
            <div className="bg-[#e5ddd5] dark:bg-gray-700 rounded-lg p-4 mb-4">
              {previewModal.template.components.map((c, idx) => {
                if (c.type === "HEADER") {
                  return (
                    <div key={idx} className="mb-3">
                      {c.format === "IMAGE" ? (
                        <img
                          src={
                            c.example?.header_handle ||
                            "https://via.placeholder.com/200"
                          }
                          alt="header"
                          className="rounded-lg max-h-60 object-cover w-full"
                        />
                      ) : (
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
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
                      className="text-gray-900 dark:text-gray-100 text-base mb-3 whitespace-pre-line"
                    >
                      {c.text}
                    </p>
                  );
                }

                if (c.type === "FOOTER") {
                  return (
                    <p key={idx} className="text-gray-500 dark:text-gray-300 text-sm mt-3">
                      {c.text}
                    </p>
                  );
                }

                if (c.type === "BUTTONS") {
                  return (
                    <div
                      key={idx}
                      className="flex flex-col space-y-2 mt-3"
                    >
                      {c.buttons.map((btn, bIdx) => (
                        <button
                          key={bIdx}
                          className="px-4 py-2 border border-green-600 text-green-600 rounded-md text-base hover:bg-green-50"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Template Details</h4>
                <p><strong>Name:</strong> {previewModal.template.name}</p>
                <p><strong>Language:</strong> {previewModal.template.language}</p>
                <p><strong>Category:</strong> {previewModal.template.category}</p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Components</h4>
                <ul className="text-sm text-gray-800 dark:text-gray-200">
                  {previewModal.template.components.map((comp, idx) => (
                    <li key={idx} className="mb-1">
                      {comp.type}: {comp.format || comp.text?.substring(0, 30) + '...'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="primary"
                onClick={() => {
                  closePreviewModal();
                  handleSubmittometa(projectId, previewModal.template._id);
                }}
              >
                Use This Template
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TemplateGroupPage;