import React from "react";

const DeleteConfirmModal = ({ catalogue, onClose, onConfirm,loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Delete Catalogue</h2>
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{catalogue.name}</span>?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
              {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Deleteing...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
