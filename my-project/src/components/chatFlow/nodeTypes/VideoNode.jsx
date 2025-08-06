import React, { useState } from 'react';
import BaseNode from './BaseNode';
import api from '../../../utils/api';
import { ErrorToast, SuccessToast } from '../../../utils/Toast';
import { useParams } from 'react-router-dom';

const VideoEditorNode = ({ data, id }) => {
  const [videoPreview, setVideoPreview] = useState(null); // Local preview or manual URL
  const [manualUrl, setManualUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { id: projectId } = useParams();

  // ✅ Handle File Upload
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      ErrorToast('No video file selected');
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

      // ✅ Local preview
      setVideoPreview(URL.createObjectURL(file));
      setManualUrl('');

      // ✅ Save inside `data` with videoId
      data.onChange?.(id, {
        ...data,
        videoFile: null,
        videoUrl: null, // only use manualUrl for external links
        videoId: uploadedId, // <-- store backend ID
      });

      SuccessToast('Video uploaded successfully');
    } catch (error) {
      console.error('Video upload failed:', error);
      ErrorToast('Failed to upload video.');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle Manual URL
  const handleManualUrlSubmit = () => {
    if (manualUrl.trim() !== '') {
      setVideoPreview(manualUrl.trim());
      data.onChange?.(id, {
        ...data,
        videoUrl: manualUrl.trim(),
        videoId: null, // clear any uploaded ID if using external URL
      });
      SuccessToast('Video URL added successfully');
    }
  };

  // ✅ Handle Remove
  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setManualUrl('');
    setProgress(0);
    setUploading(false);

    data.onChange?.(id, {
      ...data,
      videoFile: null,
      videoUrl: null,
      videoId: null,
    });
  };

  const body = (
    <>
      <button
        style={{ position: 'absolute', top: 2, right: 2, zIndex: 10 }}
        onClick={() => data.onDelete?.(id)}
        className="text-red-600 hover:text-red-800 primary-100 hover:primary-200 rounded-full w-4 h-4 flex items-center justify-center text-sm font-bold opacity-80 hover:opacity-100 transition-opacity duration-200"
        title="Delete Node"
      >
        &#x2715;
      </button>

      <div className="nodrag w-full">
        {/* Upload & Manual URL */}
        {!videoPreview && !uploading && (
          <div className="space-y-2">
            <label
              htmlFor={`videoUpload-${id}`}
              className="block cursor-pointer w-full p-2 text-center text-xs border border-dashed border-gray-400 rounded bg-gray-50 hover:bg-gray-100 transition"
            >
              🎥 Click to upload video
            </label>
            <input
              onChange={handleFileChange}
              id={`videoUpload-${id}`}
              type="file"
              accept="video/*"
              className="hidden bg-secondary-50"
            />

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Video URL"
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
            <p className="text-xs text-gray-600 mb-1">Uploading Video...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-text mt-1">{progress}%</p>
          </div>
        )}

        {/* Video Preview */}
        {videoPreview && !uploading && (
          <div className="relative w-full mt-2">
            <video
              src={videoPreview}
              controls
              className="w-full max-h-48 border rounded"
            />
            <button
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-600 hover:text-red-600 hover:border-red-400 transition"
              title="Remove Video"
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
      title="Video Editor"
      body={body}
      footer="Upload Video"
    />
  );
};

export default VideoEditorNode;
