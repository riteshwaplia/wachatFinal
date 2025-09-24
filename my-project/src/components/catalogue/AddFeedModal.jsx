import React, { useState } from "react";
import Modal from "../Modal";

const AddFeedModal = ({ isOpen, onClose, onAddFeed }) => {
  const [form, setForm] = useState({ name: "", url: "" });

  const handleSubmit = () => {
    if (!form.name || !form.url) return alert("Please enter name and sheet URL");

    const newFeed = {
      id: Date.now(),
      name: form.name,
      url: form.url,
      status: "inactive",
      lastSynced: "Not synced yet",
      nextScheduled: "Not scheduled",
      summary: { updated: 0, notUploaded: 0, hidden: 0, removed: 0 },
    };

    onAddFeed(newFeed);
    setForm({ name: "", url: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Feed" size="md">
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Feed Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Google Sheet URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Add Feed
        </button>
      </div>
    </Modal>
  );
};

export default AddFeedModal;
