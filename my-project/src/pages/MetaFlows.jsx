import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import Loader from "../components/Loader";
const MetaFlows = () => {
    const  {id} = useParams();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const project = localStorage.getItem("currentProject")
    ? JSON.parse(localStorage.getItem("currentProject"))
    : null;
  const businessProfileId = project?.businessProfileId._id || null;
  // ✅ Fetch Flows from backend
  const fetchFlows = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/metaflows/${businessProfileId}`);
      if (res.data.success) {
        setFlows(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching flows:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sync Flows with Meta
  const syncFlows = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/metaflows/${businessProfileId}/sync`);
      if (res.data.success) {
        setFlows(res.data.data);
      }
    } catch (err) {
      console.error("Error syncing flows:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessProfileId) fetchFlows();
  }, [businessProfileId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meta Flows</h1>
            <p className="text-gray-600">
              Manage your WhatsApp automation flows
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate(`/project/${id}/metaflows/create`)}
            >
              + Create Flow
            </Button>
            <Button
              onClick={syncFlows}
                variant="secondary"
            >
              🔄 Sync Flows
            </Button>
          </div>
        </header>
        {/* Flows List */}
        {loading ? (
          <Loader />
        ) : flows.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No flows found. Create or sync now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <div
                key={flow._id}
                className="bg-white rounded-lg shadow p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {flow.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Meta ID: {flow.metaFlowId || "N/A"}
                </p>

                <div className="flex items-center mt-3 space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      flow.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-700"
                        : flow.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {flow.status}
                  </span>
                  <span className="text-xs text-gray-600">
                    {flow.categories?.join(", ")}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Updated: {new Date(flow.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaFlows;
