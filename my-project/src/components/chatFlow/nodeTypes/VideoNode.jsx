import React, { useState } from 'react';
import BaseNode from './BaseNode';

const VideoEditorNode = ({ data, id }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [manualUrl, setManualUrl] = useState('');

  // Simulated upload
  const simulateUpload = () => {
    return new Promise((resolve) => {
      let value = 0;
      const interval = setInterval(() => {
        value += 10;
        setProgress(value);
        if (value >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 150);
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Video file selected:', file);

      setUploading(true);
      setProgress(0);

      await simulateUpload();

      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
      setUploading(false);

      data.onChange?.(id, {
        ...data,
        videoFile: file,
        videoUrl: localUrl,
      });
    }
  };

  const handleManualUrlSubmit = () => {
    if (manualUrl.trim() !== '') {
      setVideoUrl(manualUrl.trim());
      data.onChange?.(id, {
        ...data,
        videoFile: null,
        videoUrl: manualUrl.trim(),
      });
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl(null);
    setManualUrl('');
    setProgress(0);
    setUploading(false);
    data.onChange?.(id, {
      ...data,
      videoFile: null,
      videoUrl: null,
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
        {!videoUrl && !uploading && (
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
                placeholder="video URL"
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

        {videoUrl && !uploading && (
          <div className="relative w-full mt-2">
            <video
              src={videoUrl}
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
      footer="Edit videos "
    />
  );
};

export default VideoEditorNode;
