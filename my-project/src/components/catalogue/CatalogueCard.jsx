import React from "react";
import { useNavigate } from "react-router-dom";
const CatalogueCard = ({ catalogue, onEdit, onDelete, onActivate }) => {
  const { name, catalogId, active, updatedAt } = catalogue;
  const navigate = useNavigate();
const projectId = localStorage.getItem("currentProject")
    ? JSON.parse(localStorage.getItem("currentProject"))._id
    : null;
  const addProduct = () => {
    navigate(`/project/${projectId}/catalogue/${catalogue._id}/products`);
  };
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 border hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg truncate  dark:text-white">{name}</h3>{" "}
          <div className="mt-">
            <button
              onClick={addProduct}
              className="text-xs bg-blue-600 text-white px-3 py-1  w-full rounded hover:bg-blue-700"
            >
             + Add Products
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">Catalog ID: {catalogId}</p>
        <p className="text-xs text-gray-400 mt-1">
          Updated: {new Date(updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>

        <div className="flex gap-2">
          {!active && (
            <button
              onClick={onActivate}
              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Activate
            </button>
          )}
          <button
            onClick={onEdit}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCard;
