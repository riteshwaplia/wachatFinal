import React, { useState } from "react";
import MediaLibrary from "./MediaLibrary";

export default function MainMedia() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState("image");

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Media Library</h2>
            <MediaLibrary onSelect={(url) => setSelectedMedia(url)} />
      {selectedMedia && (
        <div className="mt-6 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Selected Media</h3>
            <button 
              onClick={() => setSelectedMedia(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
                close
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            {selectedMedia.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
              <img
                src={selectedMedia}
                alt="Selected"
                className="max-w-full max-h-64 object-contain border rounded"
              />
            ) : selectedMedia.match(/\.(mp4|mov|avi|wmv|flv|webm)$/i) ? (
              <video 
                src={selectedMedia} 
                controls 
                className="max-w-full max-h-64 border rounded"
              />
            ) : (
              <div className="p-4 border rounded flex flex-col items-center">
                <FileText className="w-12 h-12 text-gray-400 mb-2" />
                <a 
                  href={selectedMedia} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {selectedMedia}
                </a>
              </div>
            )}
            
            <div className="mt-3 text-sm text-gray-600 break-all max-w-full">
              {selectedMedia}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}