
// import React, { useState, useEffect } from "react";
// import AddCatalogueModal from "../components/catalogue/AddCatalogueModal";
// import EditCatalogueModal from "../components/catalogue/EditCatalogueModal";
// import DeleteConfirmModal from "../components/catalogue/DeleteConfirmModal";
// import CatalogueCard from "../components/catalogue/CatalogueCard";
// import api from "../utils/api";
// import { getMetaBusinessId } from "../utils/getappid";
// import toast from "react-hot-toast";
// import { SuccessToast } from "../utils/Toast";

// const CataloguePage = () => {
//   const [catalogues, setCatalogues] = useState([]);
//   console.log("catalouges",catalogues);
//   const [showAdd, setShowAdd] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [deleting, setDeleting] = useState(null);
//   console.log("deleteinggg",deleting);
//   const [loading, setLoading] = useState(false);

//   const [page, setPage] = useState(1);
//   const [limit,setLimit] = useState(10); // change limit per page if needed
//   const [totalPages, setTotalPages] = useState(1);

//   const metabusinessId = getMetaBusinessId();

//   const fetchCatalogues = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(
//         `/catalog/${metabusinessId}?page=${page}&limit=${limit}`
//       );
//       console.log("response", res);
//       setCatalogues(res.data.data || []);
//       setTotalPages(res.data.pagination?.totalPages || 1); 
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch catalogues");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCatalogues();
//   }, [page,limit]);

//   const catalougeSync = async()=>
//   {
//     try {
//       setLoading(true);
//       const res = await api.get(
//         `/catalog/sync/${metabusinessId}`
//       );
//       if(res.data.success){
//         fetchCatalogues(); // refresh after sync
//       }
//       SuccessToast("Catalogues synched successfully")
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to sync catalogues");
//     } finally {
//       setLoading(false);
//   }
//   const handleAdd = async (newCatalogue) => {
//     try {
//       setLoading(true);
//       await api.post(`catalog/${metabusinessId}`, newCatalogue);
//       setShowAdd(false);
//       toast.success("Catalogue created successfully");
//       fetchCatalogues(); // refresh after adding
//     } catch (err) {
//       console.error(err);
//       toast.error("Unable to create the catalogue");
//     } finally {
//       setLoading(false);
//     }}
//   };

//   const handleEdit = async (updatedCatalogue) => {
//     try {
//       const res = await api.put(
//         `/catalog/${metabusinessId}/${updatedCatalogue.id}`,
//         updatedCatalogue
//       );
//       setCatalogues((prev) =>
//         prev.map((c) => (c.id === res.data.id ? res.data : c))
//       );
//       setEditing(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };
// const handleAdd = async (newCatalogue) => {
//     try {
//       setLoading(true);
//       const res = await api.post(`catalog/${metabusinessId}`, newCatalogue);
//       console.log('RES',res);
// fetchCatalogues();
//       setShowAdd(false);
//       toast.success("Catalouge created successfully");

//     } catch (err) {
//       console.error(err);
//       toast.error("Unable to create the catalouge");
//     }
//     finally{
//       setLoading(false);
//     }
//   };
//   const handleDelete = async (id) => {
//     try {
//       setLoading(true);
//       await api.delete(`/catalog/${id}`);
//       fetchCatalogues();
//       // setCatalogues(catalogues.filter((c) => c.id !== id));
//       setDeleting(null);
//     } catch (err) {
//       console.error(err);
//     }
//     finally{
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
// <div className="flex justify-between items-center mb-4">
//   <h1 className="text-2xl font-bold">Catalogue</h1>
//   <div className="flex items-center gap-2">
//     {/* Limit Selector */}
//     <select
//       value={limit}
//       onChange={(e) => {
//         setLimit(Number(e.target.value));
//         setPage(1); // reset to page 1 when limit changes
//       }}
//       className="border rounded px-2 py-1 text-sm"
//     >
//       <option value={10}>10 / page</option>
//       <option value={20}>20 / page</option>
//       <option value={30}>30 / page</option>
//       <option value={40}>40 / page</option>
//     </select>

//     <button
//       onClick={catalougeSync}
//       disabled={loading}
//       className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
//     >
//       🔄 {loading ? "Syncing..." : "Sync"}
//     </button>
//     <button
//       onClick={() => setShowAdd(true)}
//       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//     >
//       + Add Catalogue
//     </button>
//   </div>
// </div>

//       {/* Catalogue List / Loader */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] pr-2">
//           {catalogues.length > 0 ? (
//             catalogues.map((c) => (
//               <CatalogueCard
//                 key={c.id}
//                 catalogue={c}
//                 onEdit={() => setEditing(c)}
//                 onDelete={() => setDeleting(c)}
//               />
//             ))
//           ) : (
//             <p className="text-gray-500 text-center col-span-3">
//               No catalogues found
//             </p>
//           )}
//         </div>
//       )}

//       {/* Pagination */}
//       {!loading && (
//         <div className="flex justify-center items-center gap-4 mt-4">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>
//             Page {page} of {totalPages}
//           </span>
//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Modals */}
//       {showAdd && (
//         <AddCatalogueModal
//           onClose={() => setShowAdd(false)}
//           onSave={handleAdd}
//           loading={loading}
//         />
//       )}
//       {editing && (
//         <EditCatalogueModal
//           catalogue={editing}
//           onClose={() => setEditing(null)}
//           onSave={handleEdit}
//         />
//       )}
//       {deleting && (
//         <DeleteConfirmModal
//           catalogue={deleting}
//           onClose={() => setDeleting(null)}
//           onConfirm={() => handleDelete(deleting._id)}
//           loading={loading}
//         />
//       )}
//     </div>
//   );
// };

// export default CataloguePage;


import React, { useState, useEffect } from "react";
import AddCatalogueModal from "../components/catalogue/AddCatalogueModal";
import EditCatalogueModal from "../components/catalogue/EditCatalogueModal";
import DeleteConfirmModal from "../components/catalogue/DeleteConfirmModal";
import CatalogueCard from "../components/catalogue/CatalogueCard";
import api from "../utils/api";
import { getMetaBusinessId } from "../utils/getappid";
import toast from "react-hot-toast";
import { SuccessToast } from "../utils/Toast";

const CataloguePage = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const metabusinessId = getMetaBusinessId();

  // ✅ Fetch catalogues with pagination
  const fetchCatalogues = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/catalog/${metabusinessId}?page=${page}&limit=${limit}`
      );
      setCatalogues(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch catalogues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogues();
  }, [page, limit]);

  // ✅ Sync catalogues from Meta
  const handleSync = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/catalog/sync/${metabusinessId}`);
      if (res.data.success) {
        SuccessToast("Catalogues synced successfully");
        fetchCatalogues();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync catalogues");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new catalogue
  const handleAdd = async (newCatalogue) => {
    try {
      setLoading(true);
      await api.post(`/catalog/${metabusinessId}`, newCatalogue);
      toast.success("Catalogue created successfully");
      setShowAdd(false);
      fetchCatalogues();
    } catch (err) {
      console.error(err);
      toast.error("Unable to create the catalogue");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit catalogue
  const handleEdit = async (updatedCatalogue) => {
    try {
      const res = await api.put(
        `/catalog/${metabusinessId}/${updatedCatalogue.id}`,
        updatedCatalogue
      );
      setCatalogues((prev) =>
        prev.map((c) => (c._id === res.data._id ? res.data : c))
      );
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("Unable to update catalogue");
    }
  };

  // ✅ Delete catalogue
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/catalog/${id}`);
      toast.success("Catalogue deleted");
      fetchCatalogues();
      setDeleting(null);
    } catch (err) {
      console.error(err);
      toast.error("Unable to delete catalogue");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Switch active catalogue
  const handleActivate = async (catalogMongoId) => {
    try {
      setLoading(true);
      const res = await api.post(
        `/catalog/switch-catalog/${metabusinessId}`,
        { catalogMongoId }
      );
      if (res.data.success) {
        toast.success("Catalogue activated successfully");
        fetchCatalogues();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to activate catalogue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold">Catalogues</h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Limit selector */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>

          <button
            onClick={handleSync}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            🔄 {loading ? "Syncing..." : "Sync"}
          </button>

          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Catalogue
          </button>
        </div>
      </div>

      {/* Catalogue Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogues.length > 0 ? (
            catalogues.map((c) => (
              <CatalogueCard
                key={c._id}
                catalogue={c}
                onEdit={() => setEditing(c)}
                onDelete={() => setDeleting(c)}
                onActivate={() => handleActivate(c._id)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No catalogues found
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddCatalogueModal
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
          loading={loading}
        />
      )}

      {editing && (
        <EditCatalogueModal
          catalogue={editing}
          onClose={() => setEditing(null)}
          onSave={handleEdit}
        />
      )}

      {deleting && (
        <DeleteConfirmModal
          catalogue={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={() => handleDelete(deleting._id)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default CataloguePage;




