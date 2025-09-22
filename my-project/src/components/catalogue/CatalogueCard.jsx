import React, { use } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const CatalogueCard = ({ catalogue, onEdit, onDelete }) => {
    const {id : projectId}=useParams();
const  navigate=useNavigate();
    const addproduct=()=>{
        navigate(`/project/${projectId}/catalogue/${catalogue._id}/products`);
    }
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between border">
      <h2 className="text-lg font-semibold">{catalogue.name}</h2>
      {/* <p className="text-gray-500">{catalogue.description}</p> */}
      {/* {catalogue.tag && (
        <span className="mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white">
          {catalogue.tag}
        </span>
      )} */}
      <div className="flex justify-end gap-3 mt-4">
        {/* <button
          className="text-blue-500 hover:text-blue-700"
          onClick={onEdit}
        >
          <FaEdit />
        </button> */}
        <button
          className="text-red-500 hover:text-red-700"
          onClick={onDelete}
        >
          <FaTrash />
        </button>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        {/* <button
          className="text-blue-500 hover:text-blue-700"
        //   onClick={onEdit}
        >
        View Detail
        </button> */}
        <button
          className="text-green-500 hover:text-green-700"
          onClick={addproduct}
        >
            Add Product
        </button>
      </div>
    </div>
  );
};

export default CatalogueCard;
