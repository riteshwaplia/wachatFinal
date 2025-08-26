// SendTemplateMessage.jsx

import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiRefreshCw,
  FiChevronDown,
  FiSend, FiCopy, FiCheck
} from "react-icons/fi";
import { BiCheckDouble } from "react-icons/bi";
import Badge from "../Badge";
import Button from "../Button";
import Alert from "../Alert";
import Card from "../Card";
import Modal from "../Modal";
import InputField from "../InputField";
import SelectField from "../SelectField";
import TextArea from "../TextArea";
import { BackButton } from "../BackButton";

const SendTemplateMessage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const { id: projectId } = useParams();
  const { contactid } = useParams();
  const [templates, setTemplates] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [templateType, setTemplateType] = useState("");
  const project = localStorage.getItem("currentProject")
    ? JSON.parse(localStorage.getItem("currentProject"))
    : null;
  const businessProfileId = project?.businessProfileId._id || null;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [contactDetail, setContactDetail] = useState(null);
  const [sendingTemplateId, setSendingTemplateId] = useState(null);
  const [sendStatus, setSendStatus] = useState({});

  // Form state

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchTemplates = async (type) => {
    setIsLoading(true);
    try {
      const res = await api.get("/templates", {
        ...config,
        params: {
          businessProfileId,
          page,
          limit: 6,
          type: type, // adjust per row/column size
        },
      });

      setTemplates(res.data.data);
      setTotalPages(res.data.pagination?.totalPages || 1);
      if (res.data.data.length === 0) {
        setMessage({
          text: "No templates found. Create your first template.",
          type: "info",
        });
      } else {
        setMessage({ text: "", type: "" });
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to load templates",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
console.log("contact",contactDetail)
  const fetchContactDetail = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/contacts/${contactid}`);
      setContactDetail(res.data.data);
    } catch (error) {
      console.error("Error fetching contact details:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to load contact details",
        type: "error",
      });
    }
  };

  const sendTemplateMessage = async (template) => {
    if (!contactDetail) {
      setMessage({
        text: "Contact details not loaded. Please try again.",
        type: "error",
      });
      return;
    }

    setSendingTemplateId(template._id);
    setSendStatus({ ...sendStatus, [template._id]: "sending" });

    try {
      // Prepare the message payload according to your API requirements
      const messagePayload = {
        to: contactDetail.mobileNumber, // Assuming phoneNumber is the field
        type: "template",
        message: {
          name: template.name,
          language: {
            code: template.language || "en", // Default to English if not specified
          },
          components: template.components || [],
        },
      };

      const response = await api.post(
        `/projects/${projectId}/messages/send`,
        messagePayload,
        config
      );

      if (response.data.success) {
        setSendStatus({ ...sendStatus, [template._id]: "success" });
        setMessage({
          text: `Template "${template.name}" sent successfully!`,
          type: "success",
        });
      } else {
        setSendStatus({ ...sendStatus, [template._id]: "error" });
        setMessage({
          text: response.data.message || "Failed to send template",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error sending template:", error);
      setSendStatus({ ...sendStatus, [template._id]: "error" });
      setMessage({
        text: error.response?.data?.message || "Failed to send template",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setSendingTemplateId(null);
        setSendStatus({ ...sendStatus, [template._id]: null });
      }, 3000);
    }
  };

  useEffect(() => {
    if (user && token && projectId) {
      fetchTemplates(templateType);
      if (contactid) {
        fetchContactDetail();
      }
    } else if (!user) {
      navigate("/login");
    }
  }, [user, token, projectId, page, templateType, contactid]);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        Redirecting to login...
      </div>
    );

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        {/* Left section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
            Send WhatsApp Templates
          </h1>
          {contactDetail && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              To: {contactDetail.name || contactDetail.phoneNumber}
            </p>
          )}
        </div>

        {/* Right section - Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          <p>temp;lyte</p>
        </div>
      </div>

      {/* Filter dropdown */}
      <div className="w-full flex justify-end items-end sm:w-auto">
        <select
          id="template"
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 
               rounded-lg bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-200
               focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none
               transition-colors"
        >
          <option value="">All Templates</option>
          <option value="regular">Regular Template</option>
          <option value="carousel">Carousel Template</option>
        </select>
      </div>

      {/* Message Alert */}
      {message.text && (
        <Alert variant={message.type} className="mb-6">
          {message.text}
        </Alert>
      )}
                  <BackButton text="back" />

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-64"></div>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center dark:bg-dark-surface py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
          {templates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onSend={() => sendTemplateMessage(template)}
              isSending={sendingTemplateId === template._id}
              sendStatus={sendStatus[template._id]}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 mt-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default SendTemplateMessage;

const TemplateCard = ({ template, onSend, isSending, sendStatus }) => {
  const [copiedButton, setCopiedButton] = useState(null);
  
  const copyButtonText = (text, buttonIndex) => {
    navigator.clipboard.writeText(text);
    setCopiedButton(buttonIndex);
    setTimeout(() => setCopiedButton(null), 2000);
  };

  const getStatusIcon = () => {
    switch (sendStatus) {
      case "success":
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case "error":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case "sending":
        return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />;
      default:
        return null;
    }
  };

  const formatTemplateText = (text) => {
    if (!text) return "";
    return text.replace(/\{\{(\d+)\}\}/g, (match, number) => {
      return `<span class="bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded text-xs font-medium">${number}</span>`;
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-gradient-to-br from-[#e5ddd5] to-[#d6ccc4] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      
      {/* Status indicator */}
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        {getStatusIcon()}
        {sendStatus === "success" && (
          <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
            Sent
          </span>
        )}
        {sendStatus === "error" && (
          <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded-full">
            Failed
          </span>
        )}
      </div>

      {/* Template info badge */}
      <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
        {template.language || "en"} • {template.category?.name || "Template"}
      </div>

      {/* Chat bubble container */}
      <div className="p-4 flex flex-col space-y-3">
        {/* WhatsApp chat header simulation */}
        <div className="flex items-center space-x-2 pb-2 border-b border-white/20">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">W</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700">Business</div>
            <div className="text-xs text-gray-500">WhatsApp Business</div>
          </div>
        </div>

        {template.components?.map((component, index) => {
          switch (component.type) {
            case "HEADER":
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-3 max-w-[90%] mx-auto border border-gray-100"
                >
                  {component.format === "IMAGE" ? (
                    <div className="relative">
                      <img
                        src={
                          component.example?.header_handle?.[0] ||
                          "https://placehold.co/300x120?text=Header+Image"
                        }
                        alt="Header"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/300x120?text=Image+Not+Found";
                        }}
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
                        ADVERTISEMENT
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-sm text-gray-800 text-center">
                      {component.text || "Header Text"}
                    </div>
                  )}
                </div>
              );

            case "BODY":
              return (
                <div className="relative group">
                  <div 
                    className="bg-white rounded-xl shadow-md px-4 py-3 text-sm max-w-[85%] ml-auto border border-green-100"
                    dangerouslySetInnerHTML={{ 
                      __html: formatTemplateText(component.text) || "Body with {{1}} {{2}} placeholders" 
                    }}
                  />
                  <div className="flex justify-end items-center space-x-1 mt-1">
                    <span className="text-[10px] text-gray-500">12:45</span>
                    <BiCheckDouble className="text-blue-500" size={12} />
                  </div>
                </div>
              );

            case "FOOTER":
              return (
                <div className="bg-white/90 text-gray-500 text-xs px-3 py-2 rounded-lg max-w-[70%] mx-auto shadow-sm border border-gray-100">
                  {component.text || "Optional footer text"}
                </div>
              );

            case "BUTTONS":
              return (
                <div className="flex flex-col items-center space-y-2 mt-3">
                  {component.buttons?.map((btn, idx) => (
                    <div key={idx} className="relative group">
                      <button
                        className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-200 transform hover:scale-105 min-w-[120px] ${
                          btn.type === "URL"
                            ? "bg-[#008069] text-white hover:bg-[#006f5c]"
                            : "bg-white text-[#008069] border border-[#008069] hover:bg-[#f8f9fa]"
                        }`}
                      >
                        {btn.text}
                      </button>
                      <button
                        onClick={() => copyButtonText(btn.text, idx)}
                        className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                        title="Copy button text"
                      >
                        {copiedButton === idx ? (
                          <FiCheck className="text-green-500" size={12} />
                        ) : (
                          <FiCopy className="text-gray-500" size={12} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              );

            case "CAROUSEL":
              return (
                <div className="relative">
                  <div className="flex space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
                    {component.cards?.map((card, idx) => (
                      <div
                        key={idx}
                        className="min-w-[200px] max-w-[200px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 border border-gray-100"
                      >
                        {card.components?.map((c, cIdx) => {
                          if (c.type === "HEADER" && c.format === "IMAGE") {
                            return (
                              <img
                                key={cIdx}
                                src={
                                  c.example?.header_handle?.[0] ||
                                  "https://placehold.co/300x150?text=Carousel+Image"
                                }
                                alt="Carousel Header"
                                className="w-full h-28 object-cover"
                                onError={(e) => {
                                  e.target.src = "https://placehold.co/300x150?text=Image+Not+Found";
                                }}
                              />
                            );
                          }
                          if (c.type === "BODY") {
                            return (
                              <div key={cIdx} className="p-3 text-sm text-gray-700">
                                {c.text || "Carousel body text"}
                              </div>
                            );
                          }
                          if (c.type === "BUTTONS") {
                            return (
                              <div key={cIdx} className="p-3 space-y-2 border-t border-gray-100">
                                {c.buttons?.map((btn, bIdx) => (
                                  <button
                                    key={bIdx}
                                    className="w-full px-3 py-2 rounded-lg text-sm bg-[#f8f9fa] text-[#008069] border border-[#008069] hover:bg-[#e8f4f1] transition-colors"
                                  >
                                    {btn.text}
                                  </button>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-2">
                    Scroll → to see more
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Footer with Send Button */}
      <div className="p-4 bg-white/95 border-t border-gray-200 flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate" title={template.name}>
            {template.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {template.components?.length || 0} components • {template.status || "Approved"}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onSend}
          disabled={isSending}
          className="flex items-center gap-2 bg-[#008069] hover:bg-[#006f5c] px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 min-w-[100px] justify-center"
        >
          {isSending ? (
            <>
              <FiRefreshCw className="animate-spin" size={14} />
              <span>Sending</span>
            </>
          ) : (
            <>
              <FiSend size={14} />
              <span>Send</span>
            </>
          )}
        </Button>
      </div>

      {/* Hover effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};