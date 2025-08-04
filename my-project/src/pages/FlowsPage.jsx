import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getFlowsApi } from '../apis/FlowApi';
import { motion } from "framer-motion";



const FlowsPage = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
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
              <FlowCard key={flow._id} flow={flow} onOpen={handleOpenFlow} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


const FlowCard = ({ flow, onOpen }) => (
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

      {/* Footer Button */}
      <div className="pt-2 flex justify-end">
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
