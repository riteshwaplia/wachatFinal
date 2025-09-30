import React, { useState } from "react";
import Modal from "../Modal";
import api from "../../utils/api"; // your axios wrapper
import toast from "react-hot-toast";
import Button from "../Button";
const AddFeedModal = ({ isOpen, onClose, onFeedCreated, fetchFeeds,catalogId ,businessProfileId}) => {
  const [form, setForm] = useState({ name: "", url: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.url) return toast.error("Please enter name and sheet URL");

    try {
      setLoading(true);

      if (!businessProfileId) {
        return toast.error("Business Profile ID not found in local storage");
      }

      // fixed schedule
      const schedule = {
        interval: "DAILY",
        url: form.url,
        hour: "22",
      };

      const payload = {
        catalogId,
        businessProfileId,
        name: form.name,
        schedule,
      };

      const res = await api.post("/productfeed/feed", payload);

      if (res.data.success) {
        toast.success("Feed created successfully!");
        setForm({ name: "", url: "" });
        onClose();
        fetchFeeds(); // refresh feed list
      } else {
        toast.error(res.data.message || "Failed to create feed");
      }
    } catch (err) {
      console.error("Error creating feed:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
        <div className="flex justify-end">
            <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="secondary"
        >
          {loading ? "Creating..." : "Add Feed"}
        </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddFeedModal;
