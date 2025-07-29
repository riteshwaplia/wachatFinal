import React, { useEffect, useState } from 'react';
import { createFlowApi, updateFlowApi } from '../../apis/FlowApi';
import InputField from '../InputField';
import Button from '../Button';
import { useSearchParams } from 'react-router-dom';
import { ErrorToast, SuccessToast } from '../../utils/Toast';

export default function SaveFlowFormModal({ nodes, edges, projectId, onClose, flowUpdateData }) {
    // ✅ Form state with default "active"
    const [formData, setFormData] = useState({
        name: '',
        triggerKeyword: '',
        description: '',
        status: 'active',
    });


    const [searchParams] = useSearchParams();
    const flowId = searchParams.get('flowId');

    useEffect(() => {
        setFormData({
            name: flowUpdateData.name,
            triggerKeyword: flowUpdateData.triggerKeyword,
            description: flowUpdateData.description,
            status: flowUpdateData.status
        })
    }, [flowUpdateData])

    // ✅ Error state
    const [errros, setErrros] = useState({});

    // ✅ Form input change handler
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Toggle status between active/inactive
    const toggleStatus = () => {
        setFormData((prev) => ({
            ...prev,
            status: prev.status === 'active' ? 'inactive' : 'active',
        }));
    };

    // ✅ Validate form fields
    const validateForm = () => {
        const errors = {};
        // if (!formData.name) errors.name = 'Name is required';
        // if (!formData.triggerKeyword) errors.triggerKeyword = 'Trigger Keyword is required';
        // if (!formData.description) errors.description = 'Description is required';
        // if (!formData.status) errors.status = 'Status is required';

        setErrros(errors);
        return Object.keys(errors).length === 0;
    };

    // ✅ Final save to DB
    const saveFlowToDB = async () => {
        console.log("Clicked Save to Database");

        if (!validateForm()) return;

        if (!nodes || !edges || nodes.length === 0 || edges.length === 0) {
            alert("No flow data to save!");
            return;
        }

        try {
            const flowData = {
                nodes,
                edges,
                name: formData.name,
                triggerKeyword: formData.triggerKeyword,
                description: formData.description,
                status: formData.status,
            };

            let response;

            if (flowUpdateData) {
                // If updating existing flow
                response = await updateFlowApi(projectId, flowId, flowData);
            } else {
                // If creating new flow
                response = await createFlowApi(projectId, flowData);
            }

            console.log("Saved to DB:", response.data);
            SuccessToast("Flow uploaded to database successfully!");
            onClose(); // Close modal after save
        } catch (error) {
            console.error("Error saving flow:", error);
            ErrorToast("Failed to save flow to database!");
        }
    };


    // ✅ The actual UI
    const savePreBox = (
        <>
            <InputField
                label="Flow Name"
                name="name"
                value={formData.name}
                error={errros.name}
                helperText={errros.name}
                onChange={handleFormChange}
                placeholder="e.g., Test Flow 2"
            />

            {/* <InputField
                label="Trigger Keyword"
                name="triggerKeyword"
                value={formData.triggerKeyword}
                error={errros.triggerKeyword}
                helperText={errros.triggerKeyword}
                onChange={handleFormChange}
                placeholder="e.g., hello"
            />

            <InputField
                label="Description"
                name="description"
                value={formData.description}
                error={errros.description}
                helperText={errros.description}
                onChange={handleFormChange}
                placeholder="e.g., Greets the user and collects basic info"
            />

            <div className="mb-4">
                <label className="block font-medium mb-1">Status</label>
                <Button
                    className={`px-4 py-2 rounded ${formData.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}
                    onClick={toggleStatus}
                >
                    {formData.status === 'active' ? 'Active' : 'Inactive'}
                </Button>
            </div> */}

            <Button
                className="px-4 py-2 bg-primary-700 text-white rounded mt-4 w-full"
                onClick={saveFlowToDB}
            >
                Save to Database
            </Button>
        </>
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg p-6"
                onClick={(e) => e.stopPropagation()}  // prevent outside click
            >
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">Save Flow to Database</h2>
                {savePreBox}
            </div>
        </div>
    );
}
