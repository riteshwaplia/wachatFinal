import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getFlowsApi } from '../apis/FlowApi';
import { motion } from "framer-motion";
import api from '../utils/api';
import Modal from '../components/Modal';
import { ErrorToast, SuccessToast } from '../utils/Toast';
import { Trash2 } from "lucide-react";



const FlowsPage = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false); // separate state for delete action
  const [selectedFlowId, setSelectedFlowId] = useState(null);
  const lastErrorTimeRef = useRef(0);

  const navigate = useNavigate();




  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const res = await getFlowsApi(id);
        const summaries = res.data.map(flow => ({
          _id: flow._id,
          name: flow.name,
          description: flow.description,
          triggerKeyword: flow.entryPoint,
          status: flow.isActive
        }));
        console.log("summaries", summaries)
        // Optional delay to simulate loading
        setTimeout(() => {
          setFlows(summaries);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to fetch flows:", error);
        setLoading(false);
      }
    };

    fetchFlows();
  }, []);

  const openDeleteModal = (flowId) => {
    setSelectedFlowId(flowId);
    setIsModalOpen(true);
  };

  // ✅ Delete flow
  const handleDelete = async (flowId) => {
    if (!flowId) return;

    try {
      setDeleting(true);
      const res = await api.delete(`/projects/${projectId}/flows/${flowId}`);

      if (res.status === 200 || res.status === 204) {
        SuccessToast("Flow deleted successfully!");
        setFlows((prevFlows) => prevFlows.filter((flow) => flow._id !== flowId));
        setIsModalOpen(false);
        setSelectedFlowId(null);
      } else {
        alert("Failed to delete the flow. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting flow:", error);
      const now = Date.now();

      if (now - lastErrorTimeRef.current > 3000) {
        ErrorToast(error.response?.data?.message || "Something went wrong while deleting the flow.");
        lastErrorTimeRef.current = now;
      }
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Open flow builder in new tab
  const handleOpenFlow = (flowId) => {
    const url = `/project/${id}/flow-builder?flowId=${flowId}`;
    window.open(url, '_blank');
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-dark-surface">
      <div className="w-full mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-dark-text-primary text-gray-800">Chat Flows</h1>
          <Link target="_blank" to={`/project/${id}/flow-builder`}>
            <button
              className="px-4 py-2  bg-primary-600 hover:bg-primary-700 text-white rounded-md "
            >
              + Create New Flow
            </button>
          </Link>
        </header>

        {loading ? (
          <div className="text-center text-gray-500">Loading flows...</div>
        ) : flows.length === 0 ? (
          <div className="text-center text-gray-400">
            No flows found. Click "Create New Flow" to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {flows.map(flow => (
              // <FlowCard key={flow._id} flow={flow} onOpen={handleOpenFlow} />
              <FlowCard
                key={flow._id}
                flow={flow}
                onOpen={handleOpenFlow}
                onDelete={() => openDeleteModal(flow._id)}
              />
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => !deleting && setIsModalOpen(false)}
          title="Confirm Delete"
          size="sm"
        >
          <p className="text-gray-700 dark:text-dark-text-primary mb-4">
            Are you sure you want to delete this flow?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              disabled={deleting}
              className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                       bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-dark-text-primary
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(selectedFlowId)}
              disabled={deleting}
              className="px-4 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 
                       text-white transition disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>



      </div>
    </div>
  );
};




const FlowCard = ({ flow, onOpen, onDelete }) => (
  <motion.div
    className="max-w-sm w-full bg-white rounded-2xl shadow-md border border-primary-100 
               hover:shadow-xl transition-shadow duration-300 mx-auto"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="p-5 space-y-4">
      {/* Header with Name & Entry */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-primary-800 truncate">{flow.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            Entry Keyword:
            <span className="ml-1 font-semibold text-secondary-500">
              {flow.triggerKeyword || "N/A"}
            </span>
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 shrink-0 ${flow.status
            ? "bg-secondary-100 text-secondary-700"
            : "bg-primary-100 text-primary-700"
            }`}
        >
          {flow.status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 line-clamp-2">{flow.description}</p>

      {/* Footer Buttons */}
      <div className="pt-2 flex justify-between">
        {/* Delete Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 
                     text-white text-xs font-medium shadow transition"
        >
          <Trash2 size={16} />
        </motion.button>

        {/* Open Flow Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpen(flow._id)}
          className="px-4 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 
                     text-white text-xs font-medium shadow transition"
        >
          Open Flow
        </motion.button>
      </div>
    </div>
  </motion.div>
);




export default FlowsPage;
