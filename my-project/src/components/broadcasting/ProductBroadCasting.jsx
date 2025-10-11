import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import * as XLSX from "xlsx";

const ProductBroadCasting = () => {
  const { user, token } = useAuth();
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [sendMode, setSendMode] = useState("send-now"); 
  const [scheduledDateTime, setScheduledDateTime] = useState(null);
  const [bulkContactsFile, setBulkContactsFile] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [messageType, setMessageType] = useState(""); // catalog | spm | mpm
  const [metaCatalogId, setMetaCatalogId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(""); // for SPM
  const [thumbnailProductId, setThumbnailProductId] = useState(""); // for MPM
  const [sections, setSections] = useState([
    { title: "Section 1", product_items: [{ product_retailer_id: "" }] },
  ]);

  const [loading, setLoading] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    fetchTemplates();
    fetchCatalogData();
  }, [user]);

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/templates/allapprovedtemplates", config);
      setTemplates(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load templates");
    }
  };

  const fetchCatalogData = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/catalog`, config);
      setMetaCatalogId(res.data.metaCatalogId || "");
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to load catalog data");
    }
  };

  const handleSectionChange = (sectionIndex, field, value) => {
    const updated = [...sections];
    updated[sectionIndex][field] = value;
    setSections(updated);
  };

  const handleAddSection = () => {
    setSections([...sections, { title: "", product_items: [{ product_retailer_id: "" }] }]);
  };

  const handleAddProductToSection = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].product_items.push({ product_retailer_id: "" });
    setSections(updated);
  };

  const handleProductChange = (sectionIndex, productIndex, value) => {
    const updated = [...sections];
    updated[sectionIndex].product_items[productIndex].product_retailer_id = value;
    setSections(updated);
  };

  const handleBulkFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkContactsFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const headers = json[0] || [];
      console.log("Detected Headers:", headers);
    };
    reader.readAsArrayBuffer(file);
  };

  const validateForm = () => {
    if (!bulkContactsFile) {
      toast.error("Please upload a contacts file");
      return false;
    }

    if (!selectedTemplate) {
      toast.error("Please select a template");
      return false;
    }

    if (!messageType) {
      toast.error("Please select message type");
      return false;
    }

    if (!metaCatalogId) {
      toast.error("Catalog ID not found");
      return false;
    }

    // Validate specific message types
    if (messageType === "spm" && !selectedProductId) {
      toast.error("Please select a product for Single Product Message");
      return false;
    }

    if (messageType === "mpm") {
      if (!thumbnailProductId) {
        toast.error("Please select a thumbnail product for Multi Product Message");
        return false;
      }
      
      // Validate sections
      for (const section of sections) {
        if (!section.title.trim()) {
          toast.error("All sections must have a title");
          return false;
        }
        for (const item of section.product_items) {
          if (!item.product_retailer_id) {
            toast.error("All products in sections must be selected");
            return false;
          }
        }
      }
    }

    if (sendMode === "schedule" && !scheduledDateTime) {
      toast.error("Please select schedule date and time");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", bulkContactsFile);
      formData.append("templateName", selectedTemplate);
      formData.append("typeofmessage", messageType);
      formData.append("metaCatalogId", metaCatalogId);

      // Add scheduling if applicable
      if (sendMode === "schedule" && scheduledDateTime) {
        formData.append("scheduledTime", scheduledDateTime.toISOString());
      }

      // Add message type specific data
      if (messageType === "spm") {
        formData.append("productId", selectedProductId);
      }

      if (messageType === "mpm") {
        formData.append("thumbnail_product_retailer_id", thumbnailProductId);
        formData.append("sections", JSON.stringify(sections));
      }

      const res = await api.post(
        `/projects/${projectId}/messages/bulk-catalog-messages`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data", 
            Authorization: `Bearer ${token}` 
          },
        }
      );
      
      toast.success(res.data.message || "Message request sent successfully");
      
      // Reset form after successful submission
      setSelectedTemplate("");
      setMessageType("");
      setSelectedProductId("");
      setThumbnailProductId("");
      setSections([{ title: "Section 1", product_items: [{ product_retailer_id: "" }] }]);
      setScheduledDateTime(null);
      setBulkContactsFile(null);
      
      // Clear file input
      const fileInput = document.getElementById("bulkContactsFile");
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageTypeChange = (e) => {
    const newType = e.target.value;
    setMessageType(newType);
    
    // Reset related states when message type changes
    if (newType !== "spm") setSelectedProductId("");
    if (newType !== "mpm") {
      setThumbnailProductId("");
      setSections([{ title: "Section 1", product_items: [{ product_retailer_id: "" }] }]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Bulk Catalog Messaging</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        
 {/* Message Type */}
        <div>
          <label className="block font-medium mb-2">Message Type</label>
          <select
            className="w-full border rounded-md p-2"
            value={messageType}
            onChange={handleMessageTypeChange}
            required
          >
            <option value="">Select Type</option>
            <option value="catalog">Catalog</option>
            <option value="spm">Single Product (SPM)</option>
            <option value="mpm">Multi Product (MPM)</option>
          </select>
        </div>
        {/* Template Selection */}

         {/* Catalog ID Display */}
        {metaCatalogId && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm">
              <span className="font-medium">Catalog ID:</span> {metaCatalogId}
            </p>
          </div>
        )}

        {/* SPM - Single Product Message */}
        {messageType === "spm" && (
          <div>
            <label className="block font-medium mb-2">Select Product</label>
            <select
              className="w-full border rounded-md p-2"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* MPM - Multi Product Message */}
        {messageType === "mpm" && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Thumbnail Product</label>
              <select
                className="w-full border rounded-md p-2"
                value={thumbnailProductId}
                onChange={(e) => setThumbnailProductId(e.target.value)}
                required
              >
                <option value="">Select Thumbnail Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                This product will be shown as the thumbnail in the message
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Sections</h4>
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                  onClick={handleAddSection}
                >
                  + Add Section
                </button>
              </div>
              
              {sections.map((section, sIndex) => (
                <div key={sIndex} className="border p-3 rounded-md mb-3">
                  <input
                    type="text"
                    placeholder="Section Title"
                    value={section.title}
                    onChange={(e) => handleSectionChange(sIndex, "title", e.target.value)}
                    className="w-full border rounded-md p-2 mb-2"
                    required
                  />
                  {section.product_items.map((item, pIndex) => (
                    <div key={pIndex} className="flex gap-2 mb-2">
                      <select
                        className="flex-1 border rounded-md p-2"
                        value={item.product_retailer_id}
                        onChange={(e) => handleProductChange(sIndex, pIndex, e.target.value)}
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="px-3 py-1 bg-gray-200 rounded-md text-sm"
                    onClick={() => handleAddProductToSection(sIndex)}
                  >
                    + Add Product
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block font-medium mb-2">Template</label>
          <select
            className="w-full border rounded-md p-2"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            required
          >
            <option value="">Select Template</option>
            {templates.map((tpl) => (
              <option key={tpl._id} value={tpl.name}>
                {tpl.name}
              </option>
            ))}
          </select>
        </div>

       

       
<div>
          <label className="block font-medium mb-2">Upload Contacts File</label>
          <input
            type="file"
            id="bulkContactsFile"
            className="w-full border rounded-md p-2"
            onChange={handleBulkFileChange}
            accept=".csv,.xlsx,.xls"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Supported formats: CSV, XLSX, XLS
          </p>
        </div>
        {/* Scheduling */}
        <div>
          <label className="block font-medium mb-2">Send Mode</label>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${sendMode === "send-now" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setSendMode("send-now")}
            >
              Send Now
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${sendMode === "schedule" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setSendMode("schedule")}
            >
              Schedule
            </button>
          </div>
          {sendMode === "schedule" && (
            <div className="mt-3">
              <label className="block font-medium mb-2">Schedule Date & Time</label>
              <DatePicker
                selected={scheduledDateTime}
                onChange={(date) => setScheduledDateTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                className="w-full border rounded-md p-2"
                placeholderText="Select date and time"
                required
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Processing..." : (sendMode === "schedule" ? "Schedule Message" : "Send Now")}
        </button>
      </form>
    </div>
  );
};

export default ProductBroadCasting;