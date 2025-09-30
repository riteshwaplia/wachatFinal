import React, { useState, useEffect } from "react";
import AddFeedModal from "./AddFeedModal";
import Button from "../Button";
import { BackButton } from "../BackButton";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

const DataFeeds = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [businessProfileId, setBusinessProfileId] = useState(null);
  const navigate = useNavigate();
  const { catelogueId } = useParams();
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
const [loadingAction, setLoadingAction] = useState(null); 

  // get project info
  useEffect(() => {
    const project = localStorage.getItem("currentProject")
      ? JSON.parse(localStorage.getItem("currentProject"))
      : null;
    if (project?.businessProfileId?._id) {
      setBusinessProfileId(project.businessProfileId._id);
    } else {
      alert("Please select a project with a linked Business Profile.");
      navigate("/projects");
    }
  }, [navigate]);

  // fetch feeds
  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/productfeed/${catelogueId}/feeds`);
      if (res.data.success) {
        setFeeds(res.data.data || []);
      } else {
        setFeeds([]);
      }
    } catch (err) {
      console.error("Error fetching feeds:", err);
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (catelogueId) fetchFeeds();
  }, [catelogueId]);

  const handleAddFeed = (newFeed) => {
    setFeeds([newFeed, ...feeds]);
    setIsOpen(false);
  };

const handleRequestUpdate = async (id) => {
  try {
    setLoadingAction({ id, action: "sync" });
    await api.put(`/productfeed/feed/${catelogueId}/${id}`);
    alert("Update request sent successfully!");
    fetchFeeds();
  } catch (err) {
    console.error(err);
    alert("Failed to request update");
  } finally {
    setLoadingAction(null);
  }
};


  const handleSyncNow = async () => {
    try {
      setLoading(true);
      await api.post(`/productfeed/feed/${catelogueId}/sync`);
      alert("Sync started successfully!");
      fetchFeeds();
    } catch (err) {
      console.error(err);
      alert("Failed to sync feed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeed = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this feed?");
  if (!confirmDelete) return;

  try {
    setLoadingAction({ id, action: "delete" });
    await api.delete(`/productfeed/feed/${catelogueId}/${id}`);
    fetchFeeds();
  } catch (err) {
    console.error(err);
    alert("Failed to delete feed");
  } finally {
    setLoadingAction(null);
  }
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <BackButton />
        <div className="flex gap-2">
          <Button onClick={() => setIsOpen(true)}>+ Add New Feed</Button>
          <Button variant="secondary" onClick={handleSyncNow} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Feeds"}
          </Button>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3 mt-4">Feeds</h3>

      {loading ? (
        <p className="text-gray-500">Loading feeds...</p>
      ) : feeds.length === 0 ? (
        <p className="text-gray-500">No feeds found.</p>
      ) : (
        <div className="space-y-4 ">
          {feeds.map((feed) => (
            <div
              key={feed._id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold text-lg text-gray-800">{feed.name}</p>
                  <a
                    href={feed.schedule?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate block"
                  >
                    {feed.schedule?.url
                      ? feed.schedule.url.length > 60
                        ? feed.schedule.url.slice(0, 60) + "..."
                        : feed.schedule.url
                      : ""}
                  </a>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    feed.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {feed.status || "unknown"}
                </span>
              </div>

              {/* Sync info */}
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>
                  <span className="font-medium">Last synced:</span>{" "}
                  {feed.latest_upload?.end_time
                    ? new Date(feed.latest_upload.end_time).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Next scheduled upload:</span>{" "}
                  {feed.schedule
                    ? `${feed.schedule.interval} at ${feed.schedule.hour}:00`
                    : "N/A"}
                </p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                <p>
                  <span className="font-medium">Items count:</span>{" "}
                  {feed.product_count || 0}
                </p>
                <p>
                  <span className="font-medium">Feed ID:</span> {feed.meta_feed_id}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
               <Button
  variant="accent"
  size="sm"
  onClick={() => handleRequestUpdate(feed._id)}
  disabled={loadingAction?.id === feed._id && loadingAction?.action === "sync"}
>
  {loadingAction?.id === feed._id && loadingAction?.action === "sync"
    ? "Updating..."
    : "Sync products"}
</Button>

<button
  onClick={() => handleDeleteFeed(feed._id)}
  disabled={loadingAction?.id === feed._id && loadingAction?.action === "delete"}
  className={`px-4 py-2 rounded text-white transition ${
    loadingAction?.id === feed._id && loadingAction?.action === "delete"
      ? "bg-red-400 cursor-not-allowed"
      : "bg-red-600 hover:bg-red-700"
  }`}
>
  {loadingAction?.id === feed._id && loadingAction?.action === "delete"
    ? "Deleting..."
    : "Delete"}
</button>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new feed modal */}
      <AddFeedModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddFeed={handleAddFeed}
        businessProfileId={businessProfileId}
        catalogId={catelogueId}
        fetchFeeds={fetchFeeds}
      />
    </div>
  );
};

export default DataFeeds;
