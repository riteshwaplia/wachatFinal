// import React, { useState,useEffect } from "react";
// import { initialCatalogues } from "../data/mockData";
// import AddCatalogueModal from "../components/catalogue/AddCatalogueModal";
// import EditCatalogueModal from "../components/catalogue/EditCatalogueModal";
// import DeleteConfirmModal from "../components/catalogue/DeleteConfirmModal";
// import CatalogueCard from "../components/catalogue/CatalogueCard";
// import api from "../utils/api";
// import {getMetaBusinessId} from "../utils/getappid";
// import toast from "react-hot-toast";


// const CataloguePage = () => {
//   const [catalogues, setCatalogues] = useState([]);
//   const [showAdd, setShowAdd] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [deleting, setDeleting] = useState(null);
//   const  [loading,setLoading] = useState(false);
// const metabusinessId = getMetaBusinessId();
// console.log("metabusinessId",metabusinessId);
//    useEffect(() => {
//     api.get(`/catalog/${metabusinessId}`)
//       .then(res => setCatalogues(res.data.data))
//       .catch(err => console.error(err));
//   }, []);

//   // const handleAdd = (newCatalogue) => {
//   //   setCatalogues([...catalogues, { id: Date.now(), ...newCatalogue }]);
//   //   setShowAdd(false);
//   // };
//  const handleAdd = async (newCatalogue) => {
//     try {
//       setLoading(true);
//       const res = await api.post(`catalog/${metabusinessId}`, newCatalogue);
//       // setCatalogues([...catalogues, res.data.data]);  // API se aaya data add karo
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
//   const handleEdit = async (updatedCatalogue) => {
//     try {
//       const res = await axios.put(`/api/catalogues/${updatedCatalogue.id}`, updatedCatalogue);
//       setCatalogues(
//         catalogues.map((c) => (c.id === res.data.id ? res.data : c))
//       );
//       setEditing(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//  const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/catalogues/${id}`);
//       setCatalogues(catalogues.filter((c) => c.id !== id));
//       setDeleting(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Catalogue</h1>
//         <button
//           onClick={() => setShowAdd(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           + Add Catalogue
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] pr-2">
//         {catalogues.map((c) => (
//           <CatalogueCard
//             key={c.id}
//             catalogue={c}
//             onEdit={() => setEditing(c)}
//             onDelete={() => setDeleting(c)}
//           />
//         ))}
//       </div>

//       {showAdd && (
//         <AddCatalogueModal onClose={() => setShowAdd(false)} onSave={handleAdd} loading={loading} />
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
//           onConfirm={() => handleDelete(deleting.id)}
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
  console.log("catalouges",catalogues);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  console.log("deleteinggg",deleting);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit,setLimit] = useState(10); // change limit per page if needed
  const [totalPages, setTotalPages] = useState(1);

  const metabusinessId = getMetaBusinessId();

  const fetchCatalogues = async () => {
    try {
      // GET http://164.52.197.192:5001/api/catalog/sync/68c5440a295ebf8ea5a31919
      setLoading(true);
      const res = await api.get(
        `/catalog/${metabusinessId}?page=${page}&limit=${limit}`
      );
      console.log("response", res);
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
  }, [page,limit]);

  const catalougeSync = async()=>
  {
    try {
      setLoading(true);
      const res = await api.get(
        `/catalog/sync/${metabusinessId}`
      );
      SuccessToast("Catalogues synched successfully")
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync catalogues");
    } finally {
      setLoading(false);
  }
  const handleAdd = async (newCatalogue) => {
    try {
      setLoading(true);
      await api.post(`catalog/${metabusinessId}`, newCatalogue);
      setShowAdd(false);
      toast.success("Catalogue created successfully");
      fetchCatalogues(); // refresh after adding
    } catch (err) {
      console.error(err);
      toast.error("Unable to create the catalogue");
    } finally {
      setLoading(false);
    }}
  };

  const handleEdit = async (updatedCatalogue) => {
    try {
      const res = await api.put(
        `/catalog/${metabusinessId}/${updatedCatalogue.id}`,
        updatedCatalogue
      );
      setCatalogues((prev) =>
        prev.map((c) => (c.id === res.data.id ? res.data : c))
      );
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };
const handleAdd = async (newCatalogue) => {
    try {
      setLoading(true);
      const res = await api.post(`catalog/${metabusinessId}`, newCatalogue);
      console.log('RES',res);
fetchCatalogues();
      setShowAdd(false);
      toast.success("Catalouge created successfully");

    } catch (err) {
      console.error(err);
      toast.error("Unable to create the catalouge");
    }
    finally{
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/catalog/${id}`);
      fetchCatalogues();
      // setCatalogues(catalogues.filter((c) => c.id !== id));
      setDeleting(null);
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
<div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">Catalogue</h1>
  <div className="flex items-center gap-2">
    {/* Limit Selector */}
    <select
      value={limit}
      onChange={(e) => {
        setLimit(Number(e.target.value));
        setPage(1); // reset to page 1 when limit changes
      }}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value={10}>10 / page</option>
      <option value={20}>20 / page</option>
      <option value={30}>30 / page</option>
      <option value={40}>40 / page</option>
    </select>

    <button
      onClick={catalougeSync}
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

      {/* Catalogue List / Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] pr-2">
          {catalogues.length > 0 ? (
            catalogues.map((c) => (
              <CatalogueCard
                key={c.id}
                catalogue={c}
                onEdit={() => setEditing(c)}
                onDelete={() => setDeleting(c)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              No catalogues found
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && (
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
