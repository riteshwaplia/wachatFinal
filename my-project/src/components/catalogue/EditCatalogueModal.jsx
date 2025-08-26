import React, { useState } from "react";

const EditCatalogueModal = ({ catalogue, onClose, onSave }) => {
  const [form, setForm] = useState(catalogue);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit Catalogue</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          name="tag"
          value={form.tag}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCatalogueModal;
