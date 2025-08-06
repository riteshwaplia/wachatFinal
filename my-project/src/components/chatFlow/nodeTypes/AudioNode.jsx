import React, { useState } from 'react';
import BaseNode from './BaseNode';
import api from '../../../utils/api';
import { ErrorToast, SuccessToast } from '../../../utils/Toast';
import { useParams } from 'react-router-dom';

const AudioEditorNode = ({ data, id }) => {
    const [audioPreview, setAudioPreview] = useState(null); // for manual URL or local preview
    const [manualUrl, setManualUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const { id: projectId } = useParams();

    // ✅ Handle File Upload
    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            ErrorToast('No audio file selected');
            return;
        }

        setUploading(true);

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
                }
            );

            const uploadedId = response?.data?.data?.id;
            if (!uploadedId) {
                throw new Error('No file ID returned from server');
            }

            // ✅ Reset manual input & preview
            setAudioPreview(URL.createObjectURL(file));
            setManualUrl('');

            // ✅ Pass back uploaded file ID
            // data.onChange?.(id, {
            //     ...data,
            //     audioFile: null,
            //     imageId: uploadedId, // store the backend ID
            // });
            data.onChange?.(id, {
                ...data,
                audioId: uploadedId, // <-- store the backend ID here
            });

            SuccessToast('Audio uploaded successfully');
        } catch (error) {
            console.error('Audio upload failed:', error);
            ErrorToast('Failed to upload audio.');
        } finally {
            setUploading(false);
        }
    };

    // ✅ Handle Manual URL
    const handleManualUrlSubmit = () => {
        if (manualUrl.trim() !== '') {
            setAudioPreview(manualUrl.trim());
            data.onChange?.(id, {
                ...data,
                audioFile: null,
                audioUrl: manualUrl.trim(),
            });
            SuccessToast('Audio URL added successfully');
        }
    };

    // ✅ Handle Remove
    const handleRemoveAudio = () => {
        setAudioPreview(null);
        setManualUrl('');
        data.onChange?.(id, {
            ...data,
            audioFile: null,
            audioUrl: null,
        });
    };

    const body = (
        <div className="space-y-2">
            {/* Upload Button */}
            <input
                type="file"
                accept="audio/*"
                className="nodrag w-full px-2 py-1 bg-secondary-50 border border-gray-300 rounded cursor-pointer"
                onChange={handleFileChange}
            />

            {uploading && <p className="text-xs text-primary-500">Uploading...</p>}

            {/* Manual URL Input */}
            <div className="flex gap-2 mt-2">
                <input
                    type="text"
                    placeholder="Enter audio URL"
                    value={manualUrl}
                    onChange={(e) => setManualUrl(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                    onClick={handleManualUrlSubmit}
                    className="bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 text-sm"
                >
                    Add
                </button>
            </div>

            {/* Audio Preview */}
            {audioPreview && (
                <div className="mt-2">
                    <audio controls className="w-full">
                        <source src={audioPreview} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    <button
                        onClick={handleRemoveAudio}
                        className="text-red-600 text-xs mt-1 hover:underline"
                    >
                        Remove Audio
                    </button>
                </div>
            )}
        </div>
    );

    return <BaseNode title="Audio" body={body} footer="Upload Audio" />;
};

export default AudioEditorNode;
