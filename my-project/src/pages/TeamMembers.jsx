import React, { useState } from 'react';
import axios from 'axios';
import { SuccessToast } from '../utils/Toast';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const AddCustomFieldModal = ({ isOpen, onClose, onSuccess }) => {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams()
  const handleSave = async () => {
    if (!label || !type) {
      ErrorToast('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const newField = { key: label, type: type };

      const res = await api.put(`/projects/${id}/contacts/contact-add-customField`, newField); // Update the URL if needed

      if (res?.data?.success) {
        onSuccess(newField);
        SuccessToast(res.data.message || 'Custom field added successfully');
        setLabel('');
        setType('');
        onClose(); // Close modal
      } else {
        ErrorToast(res.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Failed to save custom field', error);
      ErrorToast('Failed to save custom field');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add Custom Field</h2>

        <div className="mb-4">
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Company Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="" disabled>Select type</option>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="date">Date</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !label || !type}
            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-primary-300' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};


const showFieldsModal = () => <>
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

  </div>


</>

export default AddCustomFieldModal;
