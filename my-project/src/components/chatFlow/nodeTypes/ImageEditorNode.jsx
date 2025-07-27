import React, { useState } from 'react';
import BaseNode from './BaseNode';
import api from '../../../utils/api';
import { ErrorToast, SuccessToast } from '../../../utils/Toast';
import { useParams } from 'react-router-dom';

const ImageEditorNode = ({ data, id }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [manualUrl, setManualUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { id: projectId } = useParams();

  // const handleFileChange = async (event) => {
  //   const file = event.target.files?.[0];
  //   console.log("file", file)
  //   if (!file) {
  //     ErrorToast('No file selected');
  //     return;
  //   }

  //   setUploading(true);

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const response = await api.post(
  //       `/projects/${projectId}/messages/upload-media`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     console.log("response", response)

  //     const uploadedUrl = response?.data?.url;
  //     if (!uploadedUrl) {
  //       throw new Error('No URL returned from server');
  //     }

  //     setPreviewUrl(uploadedUrl);
  //     setManualUrl('');
  //     data.onChange?.(id, {
  //       ...data,
  //       imageFile: null,
  //       imageUrl: uploadedUrl,
  //     });

  //     SuccessToast('Image uploaded successfully');
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //     ErrorToast('Failed to upload image.');
  //   } finally {
  //     setUploading(false);
  //   }
  // };


  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      ErrorToast('No file selected');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file); // ✅ only the file

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

      // ✅ Save ID to state and pass it back
      setPreviewUrl(''); // no preview
      setManualUrl('');

      data.onChange?.(id, {
        ...data,
        imageFile: null,
        id: uploadedId, // <-- this is now ID instead of URL
      });

      SuccessToast('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      ErrorToast('Failed to upload image.');
    } finally {
      setUploading(false);
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
      SuccessToast('Image URL added successfully');
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
        disabled={uploading}
      >
        &#x2715;
      </button>

      <div className="nodrag w-full">
        {!previewUrl && (
          <div className="space-y-2">
            <label
              htmlFor={`fileUpload-${id}`}
              className={`block cursor-pointer w-full p-2 text-center text-xs border border-dashed rounded bg-gray-50 hover:bg-gray-100 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              📂 {uploading ? 'Uploading...' : 'Click to upload image'}
            </label>
            <input
              onChange={handleFileChange}
              id={`fileUpload-${id}`}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
            />

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Image URL"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1 px-2 w-[20px] py-1 bg-secondary-50 border rounded text-xs"
                disabled={uploading}
              />
              <button
                onClick={handleManualUrlSubmit}
                className={`bg-primary-700 text-white px-2 py-1 rounded text-xs transition ${uploading || manualUrl.trim() === ''
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-primary-600'
                  }`}
                disabled={uploading || manualUrl.trim() === ''}
              >
                {uploading ? 'Uploading...' : 'Add'}
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
              disabled={uploading}
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
      footer={uploading ? 'Uploading...' : 'Edit images'}
    />
  );
};

export default ImageEditorNode;
