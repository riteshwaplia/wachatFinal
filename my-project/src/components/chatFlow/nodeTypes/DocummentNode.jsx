import React, { useState } from 'react';
import BaseNode from './BaseNode';
import api from '../../../utils/api';
import { ErrorToast, SuccessToast } from '../../../utils/Toast';
import { useParams } from 'react-router-dom';

const DocumentEditorNode = ({ data, id }) => {
    const [docPreview, setDocPreview] = useState(null); // Manual URL or local filename
    const [manualUrl, setManualUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const { id: projectId } = useParams();

    // ✅ Handle Document Upload
    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        const file_name = file?.name;
        if (!file) {
            ErrorToast('No document selected');
            return;
        }

        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(
                `/projects/${projectId}/messages/upload-media`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percent);
                    },
                }
            );

            const uploadedId = response?.data?.data?.id;
            if (!uploadedId) {
                throw new Error('No file ID returned from server');
            }

            // ✅ Show local filename as preview
            setDocPreview(file.name);
            setManualUrl('');

            // ✅ Save in data with documentId
            data.onChange?.(id, {
                ...data,
                documentFile: null,
                documentUrl: null,
                document_name: file_name,
                documentId: uploadedId, // <-- store backend ID
            });

            SuccessToast('Document uploaded successfully');
        } catch (error) {
            console.error('Document upload failed:', error);
            ErrorToast('Failed to upload document.');
        } finally {
            setUploading(false);
        }
    };

    // ✅ Handle Manual URL
    const handleManualUrlSubmit = () => {
        if (manualUrl.trim() !== '') {
            setDocPreview(manualUrl.trim());
            data.onChange?.(id, {
                ...data,
                documentUrl: manualUrl.trim(),
                documentId: null, // clear ID if using external link
            });
            SuccessToast('Document URL added successfully');
        }
    };

    // ✅ Handle Remove
    const handleRemoveDocument = () => {
        setDocPreview(null);
        setManualUrl('');
        setProgress(0);
        setUploading(false);

        data.onChange?.(id, {
            ...data,
            documentFile: null,
            documentUrl: null,
            documentId: null,
        });
    };

    const body = (
        <>
            {/* Delete Node Button */}
            <button
                style={{ position: 'absolute', top: 2, right: 2, zIndex: 10 }}
                onClick={() => data.onDelete?.(id)}
                className="text-red-600 hover:text-red-800 bg-primary-100 hover:bg-primary-200 rounded-full w-4 h-4 flex items-center justify-center text-sm font-bold opacity-80 hover:opacity-100 transition-opacity duration-200"
                title="Delete Node"
            >
                &#x2715;
            </button>

            <div className="nodrag w-full space-y-2">
                {/* Upload & Manual URL */}
                {!docPreview && !uploading && (
                    <div className="space-y-2">
                        <label
                            htmlFor={`docUpload-${id}`}
                            className="block cursor-pointer w-full p-2 text-center text-xs border border-dashed border-gray-400 rounded bg-gray-50 hover:bg-gray-100 transition"
                        >
                            📄 Click to upload document
                        </label>
                        <input
                            onChange={handleFileChange}
                            id={`docUpload-${id}`}
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp3,.mp4"
                            className="hidden bg-secondary-50"
                        />

                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Document URL"
                                value={manualUrl}
                                onChange={(e) => setManualUrl(e.target.value)}
                                className="flex-1 px-1 py-1 border w-3 bg-secondary-50 rounded text-xs"
                            />
                            <button
                                onClick={handleManualUrlSubmit}
                                className="bg-primary-700 text-white px-2 py-1 rounded text-xs hover:bg-primary-600 transition"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                )}

                {/* Uploading Progress */}
                {uploading && (
                    <div className="mt-2 w-full">
                        <p className="text-xs text-gray-600 mb-1">Uploading Document...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-200"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-text mt-1">{progress}%</p>
                    </div>
                )}

                {/* Document Preview */}
                {docPreview && !uploading && (
                    <div className="mt-2">
                        <p className="text-xs break-words">{docPreview}</p>
                        {docPreview.startsWith('http') && (
                            <a
                                href={docPreview}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 text-xs underline"
                            >
                                Open Document
                            </a>
                        )}
                        <button
                            onClick={handleRemoveDocument}
                            className="ml-2 text-red-600 text-xs hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <BaseNode
            title="Document Editor"
            body={body}
            footer="Upload Document"
        />
    );
};

export default DocumentEditorNode;
