import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import io from "socket.io-client";
import CustomSelect from "../CustomSelect";
import * as XLSX from 'xlsx';
import GroupWiseBroadcasting from "./GroupWiseBroadcasting";
import { toast } from "react-hot-toast";

// Import react-datepicker components and styles
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from 'date-fns'; // For setting default time in date picker

const VITE_SOCKET_IO_URL = import.meta.env.VITE_SOCKET_IO_URL || 'http://localhost:5001';
const socket = io(VITE_SOCKET_IO_URL, { transports: ["websocket", "polling"] });

const cleanTemplateComponents = (components) => {
  if (!components) return [];
  try {
    const parsedComponents = typeof components === 'string' ? JSON.parse(components) : components;
    return parsedComponents.map(component => {
      if (component.parameters) {
        // Ensure parameters are correctly formatted for Meta API
        component.parameters = component.parameters.map(({ format, ...param }) => param);
      }
      return component;
    });
  } catch (e) {
    console.error("Error parsing template components:", e);
    return [];
  }
};

const SendMessagePage = () => {
  const { user, token } = useAuth();
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState({
    templates: true,
    sending: false,
    uploading: false
  });
  const [activeTab, setActiveTab] = useState("group");

  // Bulk message state
  const [bulkTemplateName, setBulkTemplateName] = useState("");
  const [bulkTemplateLanguage, setBulkTemplateLanguage] = useState("en_US");
  const [bulkTemplateComponents, setBulkTemplateComponents] = useState("");
  const [bulkContactsFile, setBulkContactsFile] = useState(null);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [expectedColumns, setExpectedColumns] = useState([]);
  const [mismatchedHeaders, setMismatchedHeaders] = useState([]);
  const [imageId, setImageId] = useState("");

  // Scheduling state
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleType, setScheduleType] = useState('one-time'); // 'one-time' or 'recurring'
  const [scheduledDateTime, setScheduledDateTime] = useState(
    setHours(setMinutes(new Date(), 0), new Date().getHours() + 1) // Default to next hour
  );
  const [recurrencePattern, setRecurrencePattern] = useState('daily'); // 'daily', 'weekly', 'monthly', 'custom'
  const [customCronExpression, setCustomCronExpression] = useState('');

  const [templates, setTemplates] = useState([]);
  const [messageStatus, setMessageStatus] = useState({
    latest: null,
    recent: []
  });

  const project = JSON.parse(localStorage.getItem("currentProject")) || "";
  const businessProfileId = project?.businessProfileId?._id || null;

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/templates/allapprovedtemplates", {
        ...config,
        params: { businessProfileId }
      });
      setTemplates(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load templates");
      console.error("Template fetch error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, templates: false }));
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (businessProfileId) {
      fetchTemplates();

      socket.emit("joinRoom", user._id);
      socket.emit("joinRoom", `project-${projectId}`);

      const handleStatusUpdate = (data) => {
        setMessageStatus(prev => ({
          latest: data,
          recent: [
            { ...data, receivedAt: new Date().toLocaleTimeString() },
            ...prev.recent.slice(0, 4)
          ]
        }));
      };

      socket.on("messageStatusUpdate", handleStatusUpdate);

      return () => {
        socket.off("messageStatusUpdate", handleStatusUpdate);
        socket.emit("leaveRoom", user._id);
        socket.emit("leaveRoom", `project-${projectId}`);
      };
    }
  }, [token, projectId, navigate, businessProfileId, user]); // Added user to dependencies

  useEffect(() => {
    if (bulkTemplateName && templates.length) {
      const selectedTpl = templates.find(tpl => tpl.name === bulkTemplateName);
      if (selectedTpl) {
        setBulkTemplateComponents(JSON.stringify(selectedTpl.components || [], null, 2));
        setBulkTemplateLanguage(selectedTpl.language || "en_US");
      } else {
        setBulkTemplateComponents("");
        setBulkTemplateLanguage("en_US");
      }
    }
  }, [bulkTemplateName, templates]);

  const handleBulkFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkContactsFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const headers = json[0]?.map(h => h.toLowerCase().trim()) || [];

      setExcelHeaders(headers);

      try {
        const parsed = JSON.parse(bulkTemplateComponents);
        let expected = ["mobilenumber"];

        parsed.forEach(comp => {
          if (comp.type === "HEADER" && comp.example?.header_text) {
            comp.example.header_text.forEach(v =>
              expected.push(`header_${v.toLowerCase()}`)
            );
          }
          if (comp.type === "BODY" && comp.example?.body_text) {
            comp.example.body_text[0]?.forEach(v =>
              expected.push(`body_${v.toLowerCase()}`)
            );
          }
        });

        setExpectedColumns(expected);
        setMismatchedHeaders(expected.filter(col => !headers.includes(col)));
      } catch (err) {
        console.error("Template parsing error:", err);
        setExpectedColumns([]);
        setMismatchedHeaders([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkMessageSubmit = async (e) => {
    e.preventDefault();

    if (!bulkContactsFile) {
      toast.warning("Please select a contacts file");
      return;
    }

    let cleanedComponents;
    try {
      cleanedComponents = cleanTemplateComponents(bulkTemplateComponents);
    } catch (err) {
      toast.error("Invalid template components format");
      return;
    }

    setIsLoading(prev => ({ ...prev, sending: true }));

    const formData = new FormData();
    formData.append("file", bulkContactsFile);
    formData.append("imageId", imageId);
    formData.append("templateName", bulkTemplateName);
    formData.append("message", JSON.stringify({
      language: { code: bulkTemplateLanguage },
      components: cleanedComponents
    }));

    // Add scheduling data if enabled
    if (isScheduled) {
      if (scheduleType === 'one-time') {
        if (!scheduledDateTime || scheduledDateTime <= new Date()) {
          toast.error("Please select a valid future date and time for one-time scheduling.");
          setIsLoading(prev => ({ ...prev, sending: false }));
          return;
        }
        formData.append("scheduledTime", scheduledDateTime.toISOString());
      } else if (scheduleType === 'recurring') {
        let cronString = '';
        switch (recurrencePattern) {
          case 'daily':
            cronString = '0 0 * * *'; // Every day at midnight
            break;
          case 'weekly':
            cronString = '0 0 * * 0'; // Every Sunday at midnight
            break;
          case 'monthly':
            cronString = '0 0 1 * *'; // First day of every month at midnight
            break;
          case 'custom':
            if (!customCronExpression) {
              toast.error("Please provide a custom cron expression.");
              setIsLoading(prev => ({ ...prev, sending: false }));
              return;
            }
            cronString = customCronExpression;
            break;
          default:
            toast.error("Please select a valid recurrence pattern.");
            setIsLoading(prev => ({ ...prev, sending: false }));
            return;
        }
        formData.append("recurrence", cronString);
      }
    }

    try {
      const res = await api.post(
        `/projects/${projectId}/bulk-send`, // Corrected endpoint as per multi-tenant backend
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Bulk messages initiated");
      setBulkContactsFile(null);
      setBulkTemplateName("");
      document.getElementById("bulkContactsFile").value = "";
      // navigate(-1); // Removed direct navigation, let user see success message
    } catch (error) {
      setBulkContactsFile(null);
      setBulkTemplateName("");
      document.getElementById("bulkContactsFile").value = "";
      toast.error(error.response?.data?.message || "Failed to send bulk messages");
      console.error("Bulk send error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, sending: false }));
      // navigate(-1); // Removed direct navigation, let user see success message
    }
  };

  const renderHeaderImageUpload = () => {
    try {
      const parsed = JSON.parse(bulkTemplateComponents);
      const header = parsed.find(c => c.type === "HEADER" && c.format === "IMAGE");

      if (!header) return null;

      return (
        <div className="mt-4">
          <label className="block font-medium text-gray-700 mb-1">
            Upload Header Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              setIsLoading(prev => ({ ...prev, uploading: true }));

              const formData = new FormData();
              formData.append("file", file);
              formData.append("type", "image");

              try {
                const res = await api.post(
                  `/projects/${projectId}/messages/upload-media`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                setImageId(res.data?.id || res.data?.data.id || "");
                const mediaHandle = res.data?.id || res.data?.data.id;
                if (!mediaHandle) {
                  alert("Upload succeeded but media handle missing");
                  return;
                }

                // Update the HEADER example with new handle
                const updatedComponents = parsed.map((comp) => {
                  if (comp.type === "HEADER" && comp.format === "IMAGE") {
                    return {
                      ...comp,
                      example: {
                        header_handle: [mediaHandle],
                      },
                    };
                  }
                  return comp;
                });

                setBulkTemplateComponents(JSON.stringify(updatedComponents, null, 2));
                toast.success("Image uploaded successfully");
              } catch (error) {
                toast.error("Image upload failed");
                console.error("Upload error:", error);
              } finally {
                setIsLoading(prev => ({ ...prev, uploading: false }));
              }
            }}
            className="block w-full border dark:bg-dark-surface rounded-md p-2 dark:text-dark-text-primary  bg-white"
            disabled={isLoading.uploading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Required for templates with image headers
          </p>
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  const renderTemplatePreview = () => {
    try {
      const parsed = JSON.parse(bulkTemplateComponents);
      let headerVars = [];
      let bodyVars = [];

      parsed.forEach(comp => {
        if (comp.type === "HEADER" && comp.example?.header_text) {
          headerVars = comp.example.header_text;
        }
        if (comp.type === "BODY" && comp.example?.body_text) {
          bodyVars = comp.example.body_text[0] || [];
        }
      });

      if (headerVars.length === 0 && bodyVars.length === 0) return null;

      const columns = ["mobilenumber", ...headerVars.map(v => `header_${v}`), ...bodyVars.map(v => `body_${v}`)];
      const sampleRow = {
        mobilenumber: "919999999999",
        ...Object.fromEntries(headerVars.map((v, i) => [`header_${v}`, `Header${i + 1}`])),
        ...Object.fromEntries(bodyVars.map((v, i) => [`body_${v}`, `Body${i + 1}`]))
      };

      return (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Required Excel Format
          </h4>
          <div className="overflow-auto border rounded-md bg-white mb-3">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map(col => (
                    <th key={col} className="border px-3 py-2 text-sm font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {columns.map(col => (
                    <td key={col} className="border px-3 py-2 text-sm">
                      {sampleRow[col] || ""}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <button
            onClick={() => {
              const csv = [columns.join(","), columns.map(c => sampleRow[c]).join(",")].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "template_sample.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Download Sample CSV
          </button>
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "group" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
          onClick={() => setActiveTab("group")}
        >
          Group Messaging
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "bulk" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
          onClick={() => setActiveTab("bulk")}
        >
          Bulk Messages
        </button>
      </div>

      <div className="mb-8 p-4 border dark:bg-dark-surface dark:border-dark-border dark:text-dark-text-primary border-blue-200 rounded-lg bg-blue-50">
        <h3 className="text-xl font-semibold mb-3">Message Status</h3>
        {messageStatus.latest ? (
          <div className="space-y-2">
            <p>
              <span className="font-medium">To:</span> {messageStatus.latest.to}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className={`font-semibold ${messageStatus.latest.newStatus === "delivered" ? "text-green-600" :
                messageStatus.latest.newStatus === "read" ? "text-blue-600" :
                  messageStatus.latest.newStatus === "failed" ? "text-red-600" : "text-yellow-600"
                }`}>
                {messageStatus.latest.newStatus.toUpperCase()}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              {messageStatus.latest.receivedAt || new Date().toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">Awaiting status updates...</p>
        )}

        {messageStatus.recent.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Recent Updates</h4>
            <ul className="space-y-1 text-sm">
              {messageStatus.recent.map((update, i) => (
                <li key={i} className="bg-white p-2 rounded border">
                  {update.to} - {update.newStatus.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {activeTab === "group" ? (
        <GroupWiseBroadcasting />
      ) : (
        <div className="p-4 border dark:border-dark-border dark:boder-dark-border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold dark:text-dark-text-primary mb-4">Bulk Template Messages</h3>

          <form onSubmit={handleBulkMessageSubmit} className="space-y-4">
            <div>
              <label className="block dark:text-dark-text-primary font-medium mb-1">Template</label>
              <select
                className="w-full border dark:bg-dark-surface dark:text-dark-text-primary rounded-md p-2"
                value={bulkTemplateName}
                onChange={(e) => setBulkTemplateName(e.target.value)}
                required
                disabled={isLoading.templates}
              >
                <option value="">Select Template</option>
                {templates.map(tpl => (
                  <option key={tpl._id} value={tpl.name}>
                    {tpl.name} ({tpl.language})
                  </option>
                ))}
              </select>
              {templates.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  No approved templates found
                </p>
              )}
            </div>

            {renderHeaderImageUpload()}

            {renderTemplatePreview()}

            <div>
              <label className="block dark:text-dark-text-primary font-medium mb-1">Contacts File</label>
              <input
                type="file"
                id="bulkContactsFile"
                className="w-full border dark:text-dark-text-primary dark:bg-dark-surface rounded-md p-2"
                onChange={handleBulkFileChange}
                accept=".csv,.xlsx,.xls"
                required
              />
              {excelHeaders.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium">Detected Columns:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {excelHeaders.map(header => (
                      <span key={header} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {header}
                      </span>
                    ))}
                  </div>
                  {mismatchedHeaders.length > 0 && (
                    <p className="text-sm text-red-500 mt-2">
                      Missing columns: {mismatchedHeaders.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Scheduling Section */}
            <div className="border p-4 rounded-md space-y-3 dark:border-dark-border dark:bg-dark-surface">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                />
                <span className="text-lg font-semibold dark:text-dark-text-primary">Schedule Message</span>
              </label>

              {isScheduled && (
                <div className="space-y-4 mt-3">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="scheduleType"
                        value="one-time"
                        checked={scheduleType === 'one-time'}
                        onChange={() => setScheduleType('one-time')}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 dark:text-dark-text-primary">One-time Schedule</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="scheduleType"
                        value="recurring"
                        checked={scheduleType === 'recurring'}
                        onChange={() => setScheduleType('recurring')}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 dark:text-dark-text-primary">Recurring Schedule</span>
                    </label>
                  </div>

                  {scheduleType === 'one-time' && (
                    <div>
                      <label className="block font-medium text-gray-700 dark:text-dark-text-primary mb-1">
                        Select Date and Time
                      </label>
                      <DatePicker
                        selected={scheduledDateTime}
                        onChange={(date) => setScheduledDateTime(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        minDate={new Date()} // Cannot select past dates
                        className="w-full border dark:bg-dark-surface dark:text-dark-text-primary rounded-md p-2"
                      />
                    </div>
                  )}

                  {scheduleType === 'recurring' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-medium text-gray-700 dark:text-dark-text-primary mb-1">
                          Recurrence Pattern
                        </label>
                        <select
                          className="w-full border dark:bg-dark-surface dark:text-dark-text-primary rounded-md p-2"
                          value={recurrencePattern}
                          onChange={(e) => setRecurrencePattern(e.target.value)}
                        >
                          <option value="daily">Daily (Every day at midnight)</option>
                          <option value="weekly">Weekly (Every Sunday at midnight)</option>
                          <option value="monthly">Monthly (First day of month at midnight)</option>
                          <option value="custom">Custom Cron Expression</option>
                        </select>
                      </div>

                      {recurrencePattern === 'custom' && (
                        <div>
                          <label className="block font-medium text-gray-700 dark:text-dark-text-primary mb-1">
                            Custom Cron Expression
                          </label>
                          <input
                            type="text"
                            className="w-full border dark:bg-dark-surface dark:text-dark-text-primary rounded-md p-2"
                            placeholder="e.g., 0 0 * * *"
                            value={customCronExpression}
                            onChange={(e) => setCustomCronExpression(e.target.value)}
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Learn more about cron expressions:{" "}
                            <a
                              href="https://crontab.guru/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              crontab.guru
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading.sending || isLoading.uploading || mismatchedHeaders.length > 0}
            >
              {isLoading.sending ? "Processing..." : (isScheduled ? "Schedule Bulk Messages" : "Send Bulk Messages")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SendMessagePage;
