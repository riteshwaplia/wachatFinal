import React, { useState } from "react";
import { initialCatalogues } from "../data/mockData";
import AddCatalogueModal from "../components/catalogue/AddCatalogueModal";
import EditCatalogueModal from "../components/catalogue/EditCatalogueModal";
import DeleteConfirmModal from "../components/catalogue/DeleteConfirmModal";
import CatalogueCard from "../components/catalogue/CatalogueCard";

const CataloguePage = () => {
  const [catalogues, setCatalogues] = useState(initialCatalogues);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleAdd = (newCatalogue) => {
    setCatalogues([...catalogues, { id: Date.now(), ...newCatalogue }]);
    setShowAdd(false);
  };

  const handleEdit = (updatedCatalogue) => {
    setCatalogues(
      catalogues.map((c) =>
        c.id === updatedCatalogue.id ? updatedCatalogue : c
      )
    );
    setEditing(null);
  };

  const handleDelete = (id) => {
    setCatalogues(catalogues.filter((c) => c.id !== id));
    setDeleting(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Catalogue</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Catalogue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] pr-2">
        {catalogues.map((c) => (
          <CatalogueCard
            key={c.id}
            catalogue={c}
            onEdit={() => setEditing(c)}
            onDelete={() => setDeleting(c)}
          />
        ))}
      </div>

      {showAdd && (
        <AddCatalogueModal onClose={() => setShowAdd(false)} onSave={handleAdd} />
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
          onConfirm={() => handleDelete(deleting.id)}
        />
      )}
    </div>
  );
};

export default CataloguePage;
