// import React, { useState } from "react";

// const AddCatalogueModal = ({ onClose, onSave,loading }) => {
//   const [form, setForm] = useState({ name: "" });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     if (!form.name) return;
//     onSave(form);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-xl shadow-md w-96">
//         <h2 className="text-xl font-bold mb-4">Add Catalogue</h2>
//         <input
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full border p-2 mb-2 rounded"
//         />
//         {/* <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full border p-2 mb-2 rounded"
//         /> */}
//         {/* <input
//           name="tag"
//           placeholder="Tag"
//           value={form.tag}
//           onChange={handleChange}
//           className="w-full border p-2 mb-2 rounded"
//         /> */}
//         <div className="flex justify-end gap-2 mt-4">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddCatalogueModal;
import React, { useState } from "react";

const AddCatalogueModal = ({ onClose, onSave, loading }) => {
  const [form, setForm] = useState({ name: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || loading) return; // prevent double-submit
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Add Catalogue</h2>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          disabled={loading}
          className="w-full border p-2 mb-2 rounded disabled:bg-gray-100"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCatalogueModal;
