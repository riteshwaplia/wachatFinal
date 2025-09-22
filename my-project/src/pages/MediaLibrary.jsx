import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Upload, 
  Image, 
  Video, 
  FileText, 
  File,
  X,
  Loader,
  Grid,
  List
} from "lucide-react";

export default function MediaLibrary({ onSelect }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("images");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Fetch user media
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://1618551e8894.ngrok-free.app/api/media", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setMedia(data.data || []);
    } catch (err) {
      console.error("Error fetching media:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Upload media
  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await axios.post(
          "https://1618551e8894.ngrok-free.app/api/media/upload", 
          formData, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setMedia((prev) => [data.data, ...prev]);
      }
    } catch (err) {
      console.error("Upload failed:", err.message);
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = null;
    }
  };

  // Filter media by type
  const filteredMedia = media.filter(item => {
    if (activeTab === "images") {
      return item.type?.startsWith('image/') || item.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
    } else if (activeTab === "videos") {
      return item.type?.startsWith('video/') || item.url.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i);
    } else if (activeTab === "documents") {
      return item.type?.startsWith('application/') || item.url.match(/\.(pdf|doc|docx|txt|rtf)$/i);
    }
    return true;
  });

  // Get file type icon
  const getFileIcon = (item) => {
    if (item.type?.startsWith('image/') || item.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      return <Image className="w-8 h-8" />;
    } else if (item.type?.startsWith('video/') || item.url.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i)) {
      return <Video className="w-8 h-8" />;
    } else {
      return <FileText className="w-8 h-8" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {/* Header with tabs and view controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "images" ? "bg-blue-100 text-blue-700" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("images")}
          >
            <Image className="w-4 h-4" />
            Images
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "videos" ? "bg-blue-100 text-blue-700" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("videos")}
          >
            <Video className="w-4 h-4" />
            Videos
          </button>
          {/* <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === "documents" ? "bg-blue-100 text-blue-700" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => setActiveTab("documents")}
          >
            <FileText className="w-4 h-4" />
            Documents
          </button> */}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white shadow" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              className={`p-2 rounded-md ${viewMode === "list" ? "bg-white shadow" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {uploading ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload"}
            <input 
              type="file" 
              multiple 
              onChange={handleUpload} 
              className="hidden" 
              accept={activeTab === "images" ? "image/*" : activeTab === "videos" ? "video/*" : "*"} 
            />
          </label>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading media...</span>
        </div>
      )}

      {/* Media Display */}
      {!loading && (
        <>
          {filteredMedia.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item._id}
                    className="group relative cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-all"
                    onClick={() => onSelect(item.url)}
                  >
                    {(item.type?.startsWith('image/') || item.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) ? (
                      <img
                        src={item.url}
                        alt={item.name || "Media"}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                        {getFileIcon(item)}
                      </div>
                    )}
                    
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">{item.name || "Untitled"}</p>
                      {item.size && (
                        <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg divide-y">
                {filteredMedia.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => onSelect(item.url)}
                  >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                      {getFileIcon(item)}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <p className="font-medium truncate">{item.name || "Untitled"}</p>
                      <div className="flex text-sm text-gray-500">
                        {item.size && <span className="mr-3">{formatFileSize(item.size)}</span>}
                        <span className="truncate">{item.url}</span>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <File className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No {activeTab} uploaded yet.</p>
              <label className="inline-block mt-3 text-blue-600 hover:text-blue-800 cursor-pointer">
                Upload your first file
                <input 
                  type="file" 
                  onChange={handleUpload} 
                  className="hidden" 
                  accept={activeTab === "images" ? "image/*" : activeTab === "videos" ? "video/*" : "*"} 
                />
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );
}