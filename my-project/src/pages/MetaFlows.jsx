import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
// import CreateTemplateFromFlowModal from "./component/metaflows/CreateTemplateFromFlowModal"; // 👈 new import
import CreateTemplateFromFlowModal from "../components/metaflows/CreateTemplateFromFlowModal"; // 👈 new import
const MetaFlows = () => {
  const { id } = useParams();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null);

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
  // /api/metaflows/:businessProfileId/:metaFlowId
  const deleteFlows = async (metaFlowId) => {
    try {
      const res = await api.delete(`/metaflows/${businessProfileId}/${metaFlowId}`);
      if (res.data.success) {
        toast.success("Flow deleted successfully"); }
    } catch (err) {
      toast.error(err.message || "Error deleting flow");
      console.error("Error deelete flows:", err.response?.data || err.message);
    } 
  };

  useEffect(() => {
    if (businessProfileId) fetchFlows();
  }, [businessProfileId]);

  // ✅ Handle opening modal with flow data
  const handleCreateTemplate = (flow) => {
    setSelectedFlow({
      name: flow.name || "new_flow_template",
      language: "en_US",
      category: "MARKETING",
      businessProfileId: businessProfileId,
      bodyText: flow.bodyText || "Hi {{1}}, welcome to our store! Tap below to explore our special offers.",
      flowId: flow.metaFlowId || "",
      buttonText: "View Offers",
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Meta Flows</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your WhatsApp automation flows
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => navigate(`/project/${id}/metaflows/create`)}>
              + Create Flow
            </Button>
            <Button onClick={syncFlows} variant="secondary">
              🔄 Sync Flows
            </Button>
          </div>
        </header>

        {/* Flows List */}
        {loading ? (
          <Loader />
        ) : flows.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400">No flows found. Create or sync now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <div
                key={flow._id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 hover:shadow-md transition border border-gray-200 dark:border-gray-800"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {flow.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Meta ID: {flow.metaFlowId || "N/A"}
                </p>

                <div className="flex items-center mt-3 space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      flow.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                        : flow.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    }`}
                  >
                    {flow.status}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {flow.categories?.join(", ")}
                  </span>
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                  Updated: {new Date(flow.updatedAt).toLocaleString()}
                </p>

                <div className="flex mt-4 justify-between w-full">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCreateTemplate(flow)}
                  >
                    Create Template
                  </Button>
                  <Button
                    size="sm"
                    variant="text"
                    onClick={() => deleteFlows(flow.metaFlowId)}
                  >
                    Delete Flow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🧩 Create Template Modal */}
      <CreateTemplateFromFlowModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        prefillData={selectedFlow}
        onSuccess={fetchFlows}
      />
    </div>
  );
};

export default MetaFlows;
