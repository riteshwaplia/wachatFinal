import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import CustomSelect from "../CustomSelect";
import { languages } from "../../components/languages/Language";

const CreateTemplateFromFlowModal = ({ isOpen, onClose, prefillData, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    language: "en_US",
    category: "MARKETING",
    businessProfileId: "",
    bodyText: "",
    flowId: "",
    buttonText: "View Offers",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Prefill form with flow data
  useEffect(() => {
    if (prefillData && Object.keys(prefillData).length > 0) {
      setForm((prev) => ({
        ...prev,
        flowId: prefillData.flowId || "",
        name: prefillData.name ? `${prefillData.name}_template` : "",
        businessProfileId: prefillData.businessProfileId || "",
      }));
    }
  }, [prefillData]);
console.log('prefillData:', prefillData);
  // ✅ Handle input change
  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Validate required fields
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Template name is required";
    if (!form.language) newErrors.language = "Language is required";
    if (!form.bodyText.trim()) newErrors.bodyText = "Body text is required";
    return newErrors;
  };

  // ✅ Submit logic
  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/templates/create-with-flow", form);
      if (res.data.success) {
        toast.success("Template created successfully!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data.message || "Failed to create template");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🧩 Create Template from Flow" size="md">
      <div className="space-y-4">
        {/* Template Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Template Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Language */}
        <CustomSelect
          label="Select Language"
          required
          options={languages}
          placeholder="Select Language"
          value={languages.find((opt) => opt.value === form.language)}
          onChange={(selected) => handleInputChange("language", selected?.value)}
          error={errors.language}
          disabled={loading}
        />

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          >
            <option value="MARKETING">MARKETING</option>
            <option value="UTILITY">UTILITY</option>
            <option value="AUTHENTICATION">AUTHENTICATION</option>
          </select>
        </div>

        {/* Body Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Body Text</label>
          <textarea
            name="bodyText"
            value={form.bodyText}
            onChange={(e) => handleInputChange("bodyText", e.target.value)}
            rows={3}
            className="w-full border rounded-lg p-2 mt-1"
          />
          {errors.bodyText && <p className="text-red-500 text-xs mt-1">{errors.bodyText}</p>}
        </div>

        {/* Button Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Text</label>
          <input
            type="text"
            name="buttonText"
            value={form.buttonText}
            onChange={(e) => handleInputChange("buttonText", e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Creating..." : "Create Template"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

CreateTemplateFromFlowModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  prefillData: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default CreateTemplateFromFlowModal;
