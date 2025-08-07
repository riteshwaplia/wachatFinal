import React, { useState, useEffect, useCallback } from 'react';
import BaseNode from './BaseNode';
import { getAllTemplates } from '../../../apis/TemplateApi';
import api from '../../../utils/api';
import { ErrorToast, SuccessToast } from '../../../utils/Toast';
import { useParams } from 'react-router-dom';

const TemplateNode = ({ data, id }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const { id: projectId } = useParams();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await getAllTemplates();
                setTemplates(response || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load templates');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    // ✅ Check if a template requires an image
    
    const requiresImage = (template) => {
        return template?.components?.some(
            (component) => component.type === 'HEADER' && component.format === 'IMAGE'
        );
    };

    // ✅ Handle template selection
    const handleChange = useCallback(
        (e) => {
            const selectedId = e.target.value;
            const selectedTemplate = templates?.find((t) => t._id === selectedId);

            // Reset preview if template changes
            setPreviewUrl('');

            data.onChange?.(id, {
                ...data,
                selectedTemplateId: selectedId,
                selectedTemplateName: selectedTemplate?.name || '',
                selectedTemplateLanguage: selectedTemplate?.language || '',
                requiresImage: requiresImage(selectedTemplate),
                imageMediaId: null, // clear previous image
            });
        },
        [data, id, templates]
    );

    // ✅ Handle image upload for selected template
    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        const file_name = file.name
        if (!file) return ErrorToast('No file selected');

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(
                `/projects/${projectId}/messages/upload-media`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            const uploadedId = response?.data?.data?.id;
            const preview = URL.createObjectURL(file);

            if (!uploadedId) throw new Error('No file ID returned from server');

            // ✅ Save uploaded ID and preview
            setPreviewUrl(preview);

            data.onChange?.(id, {
                ...data,
                imageMediaId: uploadedId,
                fileName: file_name,
            });

            SuccessToast('Image uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            ErrorToast('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    // ✅ Handle image remove
    const handleRemoveImage = () => {
        setPreviewUrl('');
        data.onChange?.(id, {
            ...data,
            imageMediaId: null,

        });
    };

    const selectedTemplate = templates.find(
        (t) => t._id === data?.selectedTemplateId
    );

    const body = (
        <>
            <button
                style={{ position: 'absolute', top: 2, right: 2, zIndex: 10 }}
                onClick={() => data.onDelete?.(id)}
                className="text-red-600 hover:text-red-800 rounded-full w-4 h-4 flex items-center justify-center text-sm font-bold opacity-80 hover:opacity-100 transition-opacity duration-200"
                title="Delete Node"
            >
                &#x2715;
            </button>

            {loading && <p className="text-text text-sm">Loading templates...</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!loading && !error && (
                <>
                    <select
                        className="nodrag bg-secondary-50 w-full px-2 py-1 border border-gray-300 rounded"
                        value={data?.selectedTemplateId || ''}
                        onChange={handleChange}
                    >
                        <option value="">Select a template</option>
                        {templates.map((template) => (
                            <option key={template._id} value={template._id}>
                                {template.name}
                            </option>
                        ))}
                    </select>

                    {requiresImage(selectedTemplate) && (
                        <div className="mt-3 space-y-3">
                            {!previewUrl ? (
                                <label
                                    className={`block w-full p-3 border-2 border-dashed rounded-lg text-center text-sm cursor-pointer transition ${uploading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:border-primary-400 hover:bg-primary-50'
                                        }`}
                                >
                                    {uploading ? 'Uploading...' : '📂 Click to upload image'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden "
                                    />
                                </label>
                            ) : (
                                <div className="relative w-full">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full max-h-30 object-contain border rounded-lg"
                                    />
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-600 hover:text-red-600 hover:border-red-400 transition"
                                        disabled={uploading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </>
    );

    return (
        <BaseNode
            title="WhatsApp Template"
            body={body}
            footer={uploading ? 'Uploading image...' : 'Sends selected template to user'}
        />
    );
};

export default TemplateNode;
