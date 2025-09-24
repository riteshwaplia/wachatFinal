import React from "react";
import { FaTrash, FaWhatsapp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const CatalogueCard = ({ catalogue, onDelete, onToggleActive }) => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const addProduct = () => {
    navigate(`/project/${projectId}/catalogue/${catalogue._id}/products`);
  };

  const handleToggleActive = () => {
    if (onToggleActive) {
      onToggleActive(catalogue._id, !catalogue.isActive);
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col">
      {/* Image Banner (optional shop style) */}
      <div className="h-32 bg-gradient-to-r from-green-50 to-green-100 rounded-t-2xl flex items-center justify-center">
        <FaWhatsapp className="text-green-500 text-5xl" />
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{catalogue.name}</h2>
          <p className="text-sm text-gray-500 mb-2">
            {catalogue.description || "No description provided"}
          </p>

          {/* Status badge */}
          {catalogue.isActive ? (
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
              Active on WhatsApp
            </span>
          ) : (
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              Inactive
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <button
              className="px-3 py-2 text-sm rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
              onClick={onDelete}
            >
              <FaTrash className="inline mr-1" />
              Delete
            </button>
            <button
              className="px-3 py-2 text-sm rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition"
              onClick={addProduct}
            >
              + Add Product
            </button>
          </div>

          <button
            onClick={handleToggleActive}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              catalogue.isActive
                ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {catalogue.isActive ? "Make Inactive" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCard;
