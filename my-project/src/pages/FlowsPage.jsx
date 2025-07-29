import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getFlowsApi } from '../apis/FlowApi';



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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Chat Flows</h1>
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
  <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-5 flex flex-col justify-between gap-3 border border-gray-100">
    <div className="space-y-1">
      <h2 className="text-xl font-semibold text-black">{flow.name}</h2>
      <p className="text-sm text-gray-600">{flow.description}</p>

      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700">
        <div>
          <span className="font-medium text-black">entry point:</span>{" "}
          {flow.triggerKeyword || "N/A"}
        </div>
        <div className="mt-1 sm:mt-0">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${flow.status === true
              ? "bg-green-100 text-green-800"
              : flow.status === false
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-200 text-gray-700"
              }`}
          >
            {flow.status === true ? "Active" : "inActive"}
          </span>
        </div>
      </div>
    </div>

    <button
      className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-black rounded-md"
      onClick={() => onOpen(flow._id)}
    >
      Open Flow
    </button>
  </div>
);


export default FlowsPage;
