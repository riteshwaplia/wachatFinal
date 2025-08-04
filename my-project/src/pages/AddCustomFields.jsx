import React, { useState } from 'react';
import axios from 'axios';
import { ErrorToast, SuccessToast } from '../utils/Toast';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/Button';
import Modal from '../components/Modal';

const AddCustomFieldModal = ({ isOpen, onClose, onSuccess, fields }) => {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams()
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!label || !type) {
      ErrorToast('Please fill all fields');
      return;
    }

    if (label?.length < 3) {
      setError("Label must be at least 3 characters long");
      return
    }

    setLoading(true);
    try {
      setLoading(true);
      const newField = { key: label, type: type };

      const res = await api.put(
        `/projects/${id}/contacts/contact-add-customField`,
        newField
      );

      if (res?.data?.success) {
        onSuccess(newField);
        SuccessToast(res.data.message || "Custom field added successfully");
        setLabel("");
        setType("");
        onClose(); // Close modal
      } else {
        ErrorToast(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Failed to save custom field", error);

      // Extract server error message if available
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save custom field";

      ErrorToast(serverMessage);
    } finally {
      setLoading(false);
    }

  };


  const handleLabelChange = (e) => {
    const newValue = e.target.value;

    // ✅ Allow letters, digits, space, underscore only
    const isValid = /^[a-zA-Z0-9_\s]*$/.test(newValue);

    if (!isValid) {
      setError("Only letters, numbers, spaces, and underscore (_) are allowed.");
      return; // Stop updating label for invalid input
    }

    // ✅ Clear previous error when input is valid
    setError("");

    // ✅ Update state
    setLabel(newValue);


  };


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {fields ? (<>
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <Modal isOpen={isOpen} onClose={onClose} title="Custom Fields">
<div className='max-h-[80vh] overflow-y-auto'>
     <form className="space-y-4">
              {fields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    disabled={true}
                    type={field.type}
                    placeholder={field.label}
                    className="border border-gray-300 dark:bg-dark-surface rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>


              ))}
              {fields.length === 0 && <><p>No any custom fields exist</p></>}
            </form>

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"

              >
                Close
              </button>
            </div>
</div>
          </Modal>
          {/* <div className="bg-white dark:bg-dark-surface rounded-xl shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl dark:text-dark-text-primary font-semibold mb-4 dark:text-dark-text-primary text-center">Custom Fields</h2>

            <form className="space-y-4">
              {fields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    disabled={true}
                    type={field.type}
                    placeholder={field.label}
                    className="border border-gray-300 dark:bg-dark-surface rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>


              ))}
              {fields.length === 0 && <><p>No any custom fields exist</p></>}
            </form>

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"

              >
                Close
              </button>
            </div>
          </div> */}
        </div></>) :



        <Modal onClose={onClose} isOpen={isOpen} title="Add Custom Field" >
          <div className="mb-4">
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={handleLabelChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
          ${error
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                }`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:bg-dark-surface dark:text-dark-text-primary rounded-md focus:outline-none focus:ring focus:ring-primary-200"
            >
              <option value="" disabled>Select type</option>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="date">Date</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={onClose}
              className="px-4 py-2 border dark:text-dark-text-primary border-gray-300 rounded-md dark:hover:bg-dark-surface hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              onClick={handleSave}
              disabled={loading || !label || !type}
              className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-primary-300' : 'bg-primary-600 hover:bg-primary-700'}`}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Modal>

        // <div className="bg-white rounded-lg shadow-lg w-full dark:bg-dark-surface max-w-md p-6">
        //   <h2 className="text-xl dark:text-dark-text-primary font-semibold mb-4 dark:text-dark-text-primary">Add Custom Field</h2>

        //   <div className="mb-4">
        //     <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
        //       Label
        //     </label>
        //     <input
        //       id="label"
        //       type="text"
        //       maxLength={30}
        //       value={label}
        //       onChange={(e) => {
        //         const newValue = e.target.value;
        //         const isValid = /^[a-zA-Z0-9@_\s]*$/.test(newValue); // allows letters, digits, space, @, _
        //         if (isValid) {
        //           setLabel(newValue);
        //         }
        //       }}
        //       placeholder="e.g. Company Name"
        //       className="w-full px-3 dark:text-dark-text-primary py-2 border border-gray-300 dark:bg-dark-surface rounded-md focus:outline-none focus:ring focus:ring-primary-200"
        //     />
        //   </div>

        //   <div className="mb-4">
        //     <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
        //       Type
        //     </label>
        //     <select
        //       id="type"
        //       value={type}
        //       onChange={(e) => setType(e.target.value)}
        //       className="w-full px-3 py-2 border border-gray-300 dark:bg-dark-surface dark:text-dark-text-primary rounded-md focus:outline-none focus:ring focus:ring-primary-200"
        //     >
        //       <option value="" disabled>Select type</option>
        //       <option value="text">Text</option>
        //       <option value="number">Number</option>
        //       <option value="email">Email</option>
        //       <option value="date">Date</option>
        //     </select>
        //   </div>

        //   <div className="flex justify-end space-x-2">
        //     <Button
        //       onClick={onClose}
        //       className="px-4 py-2 border dark:text-dark-text-primary border-gray-300 rounded-md dark:hover:bg-dark-surface hover:bg-gray-100"
        //     >
        //       Cancel
        //     </Button>
        //     <Button
        //       loading={loading}
        //       onClick={handleSave}
        //       disabled={loading || !label || !type}
        //       className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-primary-300' : 'bg-primary-600 hover:bg-primary-700'}`}
        //     >
        //       {loading ? 'Saving...' : 'Save'}
        //     </Button>
        //   </div>
        // </div>
      }
    </div>
  );
};







export default AddCustomFieldModal;
