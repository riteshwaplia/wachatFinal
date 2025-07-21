import React, { useState } from 'react';
import BaseNode from './BaseNode';

const ImageEditorNode = ({ data, id }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [manualUrl, setManualUrl] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file);

      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);

      data.onChange?.(id, {
        ...data,
        imageFile: file,
        imageUrl,
      });
    }
  };

  const handleManualUrlSubmit = () => {
    if (manualUrl.trim() !== '') {
      setPreviewUrl(manualUrl.trim());
      data.onChange?.(id, {
        ...data,
        imageFile: null,
        imageUrl: manualUrl.trim(),
      });
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setManualUrl('');
    data.onChange?.(id, {
      ...data,
      imageFile: null,
      imageUrl: null,
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
        {!previewUrl && (
          <div className="space-y-2">
            <label
              htmlFor={`fileUpload-${id}`}
              className="block cursor-pointer w-full p-2 text-center text-xs border border-dashed border-gray-400 rounded bg-gray-50 hover:bg-gray-100 transition"
            >
              📂 Click to upload image
            </label>
            <input
              onChange={handleFileChange}
              id={`fileUpload-${id}`}
              type="file"
              accept="image/*"
              className="hidden bg-secondary-50"
            />

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="image URL"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1 w-3 px-2 py-1 bg-secondary-50 border rounded text-xs"
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

        {previewUrl && (
          <div className="relative w-full mt-0">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-44 object-contain border rounded"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs text-gray-600 hover:text-red-600 hover:border-red-400 transition"
              title="Remove Image"
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
      title="Image Editor"
      body={body}
      footer="Edit images "
    />
  );
};

export default ImageEditorNode;
