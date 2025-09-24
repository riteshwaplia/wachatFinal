import React, { useState } from "react";
import AddFeedModal from "./AddFeedModal";
import Button from "../Button";
import {BackButton} from "../BackButton"
const DataFeeds = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feeds, setFeeds] = useState([
    {
      id: 1,
      name: "Test Feed",
      url: "https://docs.google.com/spreadsheets/d/1wRQ98PGauNHmYPrl8CUDgrcQw0BFEu7CSnTuzgOIZKk/edit?usp=sharing",
      status: "active",
      lastSynced: "23 Sep at 03:18 GMT-07:00",
      nextScheduled: "23 Sep at 22:00 GMT-07:00",
      summary: { updated: 22, notUploaded: 0, hidden: 0, removed: 0 },
    },
    {
      id: 2,
      name: "Summer Products",
      url: "https://docs.google.com/spreadsheets/d/2",
      status: "inactive",
      lastSynced: "22 Sep at 11:45 GMT-07:00",
      nextScheduled: "23 Sep at 20:00 GMT-07:00",
      summary: { updated: 10, notUploaded: 2, hidden: 1, removed: 0 },
    },
  ]);

  const handleAddFeed = (newFeed) => {
    setFeeds([newFeed, ...feeds]);
    setIsOpen(false);
  };

  const handleRequestUpdate = (id) => {
    alert(`Requesting update for feed ID: ${id}`);
    // later: call backend API to sync now
  };

  return (
    <div  className="p-6 bg-gray-50 min-h-screen">
        <BackButton />
      <Button onClick={() => setIsOpen(true)}>Add New Feed</Button>

      <h3 className="text-lg font-semibold mb-3 mt-4">Feeds</h3>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-semibold text-lg text-gray-800">{feed.name}</p>
                <a
                  href={feed.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate block"
                >
                  {feed.url}
                </a>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  feed.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {feed.status}
              </span>
            </div>

            {/* Sync info */}
            <div className="text-sm text-gray-600 space-y-1 mb-3">
              <p>
                <span className="font-medium">Last synced:</span>{" "}
                {feed.lastSynced}
              </p>
              <p>
                <span className="font-medium">Next scheduled upload:</span>{" "}
                {feed.nextScheduled}
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
              <p>
                <span className="font-medium">Items updated/added:</span>{" "}
                {feed.summary.updated}
              </p>
              <p>
                <span className="font-medium">Items not uploaded:</span>{" "}
                {feed.summary.notUploaded}
              </p>
              <p>
                <span className="font-medium">Items hidden:</span>{" "}
                {feed.summary.hidden}
              </p>
              <p>
                <span className="font-medium">Items removed:</span>{" "}
                {feed.summary.removed}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                onClick={() => handleRequestUpdate(feed.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Request Update
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new feed modal */}
      <AddFeedModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddFeed={handleAddFeed}
      />
    </div>
  );
};

export default DataFeeds;
