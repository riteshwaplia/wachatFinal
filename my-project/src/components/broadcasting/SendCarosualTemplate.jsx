// import React, { useState, useEffect } from "react";
// import api from "../../utils/api"; // Using api directly for clarity, assuming api utility is an api instance
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext"; // Adjust import path if AuthContext is elsewhere
// import io from "socket.io-client";
// import * as XLSX from 'xlsx';

// // IMPORTANT: Ensure this matches your backend Socket.IO port
// const VITE_SOCKET_IO_URL = import.meta.env.VITE_SOCKET_IO_URL || 'http://localhost:5001'; // Assuming your server runs on 5001

// const socket = io(VITE_SOCKET_IO_URL, {
//   transports: ["websocket", "polling"],
// });

// // Helper function to clean template components before sending to Meta
// // This removes the "format" key from individual parameters which Meta's API does not expect.
// const cleanTemplateComponents = (components) => {
//   if (!components) return [];
//   try {
//     const parsedComponents = typeof components === 'string' ? JSON.parse(components) : components;
//     return parsedComponents.map(component => {
//       if (component.parameters && Array.isArray(component.parameters)) {
//         component.parameters = component.parameters.map(param => {
//           const newParam = { ...param };
//           if (newParam.format !== undefined) {
//             delete newParam.format; // Remove the problematic 'format' key
//           }
//           return newParam;
//         });
//       }
//       return component;
//     });
//   } catch (e) {
//     console.error("Error parsing or cleaning template components JSON:", e);
//     return []; // Return empty array on error
//   }
// };


// const SendCarosualTemplate = () => {
//   const { user, token } = useAuth();
//   const { id:projectId } = useParams(); // FIX: Changed from 'id' to 'projectId'
//   const navigate = useNavigate();
//   const customer_name = user?.username || user?.email || "User"; // Use username or email

//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("group"); // 'single' or 'bulk'
  
//   // Single message state
//   const [singleRecipient, setSingleRecipient] = useState("");
//   const [singleMessageType, setSingleMessageType] = useState("text");
//   const [singleMessageText, setSingleMessageText] = useState("");
//   const [singleMessageTemplateName, setSingleMessageTemplateName] = useState("");
//   const [singleMessageTemplateLanguage, setSingleMessageTemplateLanguage] = useState("en_US");
//   const [singleMessageTemplateComponents, setSingleMessageTemplateComponents] = useState(""); // Will be JSON string

//   const [singleMessageMediaLink, setSingleMessageMediaLink] = useState("");
//   const [singleMessageMediaId, setSingleMessageMediaId] = useState("");
//   const [singleMessageMediaFilename, setSingleMessageMediaFilename] = useState("");
//   const [singleMessageMediaCaption, setSingleMessageMediaCaption] = useState(""); // Added caption field

//   // Bulk message state
//   const [bulkTemplateName, setBulkTemplateName] = useState("");
//   const [bulkTemplateLanguage, setBulkTemplateLanguage] = useState("en_US");
//   const [bulkTemplateComponents, setBulkTemplateComponents] = useState(""); // Will be JSON string
//   const [bulkContactsFile, setBulkContactsFile] = useState(null);
// const [excelHeaders, setExcelHeaders] = useState([]);
// const [expectedColumns, setExpectedColumns] = useState([]);
// const [mismatchedHeaders, setMismatchedHeaders] = useState([]);

//   const [templates, setTemplates] = useState([]);
//   const [contacts, setContacts] = useState([]); // This state is not directly used in the current UI logic
// const [imageId,setImageId]=useState("")
//   // Real-time message status
//   const [latestMessageStatus, setLatestMessageStatus] = useState(null);
//   const [recentMessageUpdates, setRecentMessageUpdates] = useState([]);
// const project = localStorage.getItem("currentProject")
//     ? JSON.parse(localStorage.getItem("currentProject"))
//     : null;
//   const businessProfileId = project?.businessProfileId._id || null;
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };




//   const fetchTemplatesAndContacts = async () => {
//     setIsLoading(true);
//     try {
//       // Use projectDetails.businessProfileId._id for fetching templates
//       // Ensure projectDetails is loaded before this call
     
//       const templatesRes = await api.get("/templates/allapprovedcarouseltemplates", { // Use api directly with /api/
//         ...config,
//         params: {
//           businessProfileId: businessProfileId,
//         },
//       });
//       setTemplates(templatesRes.data.data || []);
//       // Contacts are not directly used in this page's logic for now
//       // const contactsRes = await api.get(`/api/projects/${projectId}/contacts`, config);
//       // setContacts(contactsRes.data.data || []);
//       setMessage(''); // Clear previous messages if successful
//     } catch (error) {
//       console.error(
//         "Error fetching templates/contacts:",
//         error.response?.data?.message || error.message
//       );
//       setMessage(
//         `Error fetching resources: ${
//           error.response?.data?.message || "Failed to fetch templates/contacts."
//         }`
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       navigate("/login", { replace: true });
//       return;
//     }
//   }, [ navigate, projectId]); // Depend on projectId as well

//   useEffect(() => {
//     // Fetch templates and contacts ONLY after projectDetails is available
//     if (businessProfileId) {
//         fetchTemplatesAndContacts();

//         socket.emit("joinRoom", user._id);
//         socket.emit("joinRoom", `project-${projectId}`);

//         socket.on("messageStatusUpdate", (data) => {
//             console.log("Received message status update:", data);
//             setLatestMessageStatus(data);
//             setRecentMessageUpdates((prevUpdates) => {
//                 const newUpdates = [
//                     { ...data, receivedAt: new Date().toLocaleTimeString() },
//                     ...prevUpdates,
//                 ];
//                 return newUpdates.slice(0, 5);
//             });
//         });

//         return () => {
//             socket.off("messageStatusUpdate");
//             socket.emit("leaveRoom", user._id);
//             socket.emit("leaveRoom", `project-${projectId}`);
//         };
//     }
//   }, [token, projectId, navigate]); // Rerun when projectDetails is set

//   // Effect to populate single template components when singleMessageTemplateName changes
//   useEffect(() => {
//     if (singleMessageTemplateName && templates.length > 0) {
//       const selectedTpl = templates.find(
//         (tpl) => tpl.name === singleMessageTemplateName
//       );
//       if (selectedTpl) {
//         // Stringify components and set to state, also set language
//         setSingleMessageTemplateComponents(JSON.stringify(selectedTpl.components || [], null, 2));
//         setSingleMessageTemplateLanguage(selectedTpl.language || "en_US");
//       }
//     } else {
//       // Clear if no template selected
//       setSingleMessageTemplateComponents("");
//       setSingleMessageTemplateLanguage("en_US");
//     }
//   }, [singleMessageTemplateName, templates]);

//   // Effect to populate bulk template components when bulkTemplateName changes
//   useEffect(() => {
//     if (bulkTemplateName && templates.length > 0) {
//       const selectedTpl = templates.find(
//         (tpl) => tpl.name === bulkTemplateName
//       );
//       if (selectedTpl) {
//         setBulkTemplateComponents(JSON.stringify(selectedTpl.components || [], null, 2));
//         setBulkTemplateLanguage(selectedTpl.language || "en_US");
//       }
//     } else {
//       setBulkTemplateComponents("");
//       setBulkTemplateLanguage("en_US");
//     }
//   }, [bulkTemplateName, templates]);


//   const handleSingleMessageSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setIsLoading(true);
//     setLatestMessageStatus(null);
//     setRecentMessageUpdates([]);

//     let payloadMessage = {};
//     if (singleMessageType === "text") {
//       payloadMessage = { body: singleMessageText }; // Use 'body' for text as per Meta API
//     } else if (singleMessageType === "template") {
//       try {
//         // Clean components before sending
//         const cleanedComponents = cleanTemplateComponents(singleMessageTemplateComponents);
//         payloadMessage = {
//           name: singleMessageTemplateName,
//           language: { code: singleMessageTemplateLanguage },
//           components: cleanedComponents, // Use cleaned components
//         };
//       } catch (err) {
//         setMessage("Error parsing or cleaning template components JSON. Please check JSON format.");
//         setIsLoading(false);
//         return;
//       }
//     } else if (
//       singleMessageType === "image" ||
//       singleMessageType === "document"
//     ) {
//       payloadMessage = {
//         link: singleMessageMediaLink,
//         id: singleMessageMediaId,
//         caption: singleMessageMediaCaption, // Include caption
//       };
//       if (singleMessageType === "document") {
//         payloadMessage.filename = singleMessageMediaFilename;
//       }
//     }

//     try {
//       const res = await api.post( // Use api directly with /api/
//         `/projects/${projectId}/messages/send`,
//         {
//           to: singleRecipient,
//           type: singleMessageType,
//           message: payloadMessage,
//         },
//         config
//       );
//       setMessage(
//         res.data.message ||
//           "Message sent successfully! Awaiting status updates..."
//       );
//       setLatestMessageStatus({
//         to: singleRecipient,
//         newStatus: "sent",
//         metaMessageId: res.data.data.apiResponse?.messages?.[0]?.id || "N/A",
//         sentAt: new Date().toLocaleTimeString(),
//         type: singleMessageType,
//       });

//       // Clear form
//       setSingleRecipient("");
//       setSingleMessageText("");
//       setSingleMessageTemplateName(""); // This will trigger useEffect to clear components too
//       setSingleMessageTemplateLanguage("en_US");
//       setSingleMessageMediaLink("");
//       setSingleMessageMediaId("");
//       setSingleMessageMediaFilename("");
//       setSingleMessageMediaCaption(""); // Clear caption
//     } catch (error) {
//       console.error(
//         "Error sending single message:",
//         error.response?.data?.message || error.message
//       );
//       setMessage(
//         `Error: ${error.response?.data?.message || "Failed to send message."}`
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const handleBulkFileChange = (e) => {
//   //   setBulkContactsFile(e.target.files[0]);
//   // };

//   const handleBulkMessageSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setIsLoading(true);
//     setLatestMessageStatus(null);
//     setRecentMessageUpdates([]);

//     if (!bulkContactsFile) {
//       setMessage("Please select an Excel/CSV file for bulk sending.");
//       setIsLoading(false);
//       return;
//     }

//     let cleanedBulkComponents = [];
//     try {
//         cleanedBulkComponents = cleanTemplateComponents(bulkTemplateComponents);
//     } catch (err) {
//         setMessage("Error parsing or cleaning bulk template components JSON. Please check JSON format.");
//         setIsLoading(false);
//         return;
//     }


//     const formData = new FormData();
//     formData.append("file", bulkContactsFile);
//     formData.append("imageId", imageId);
//     formData.append("templateName", bulkTemplateName);
//     formData.append(
//       "message",
//       JSON.stringify({
//         language: { code: bulkTemplateLanguage },
//         components: cleanedBulkComponents, // Use cleaned components
//       })
//     );

//     try {
//       const res = await api.post( // Use api directly with /api/
//         `/projects/${projectId}/messages/bulk-messages`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setMessage(
//         res.data.message ||
//           "Bulk messages initiated. Awaiting status updates..."
//       );
//       setBulkContactsFile(null);
//       document.getElementById("bulkContactsFile").value = "";
//       setBulkTemplateName(""); // This will trigger useEffect to clear components too
//       setBulkTemplateLanguage("en_US");
//     } catch (error) {
//       console.error(
//         "Error sending bulk messages:",
//         error.response?.data?.message || error.message
//       );
//       setMessage(
//         `Error: ${
//           error.response?.data?.message || "Failed to send bulk messages."
//         }`
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   console.log("imageId",imageId)

//  const handleBulkFileChange = (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   setBulkContactsFile(file);

//   const reader = new FileReader();
//   reader.onload = (evt) => {
//     const data = new Uint8Array(evt.target.result);
//     const workbook = XLSX.read(data, { type: "array" });
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // get rows as arrays
//     const headers = json[0] || [];

//     setExcelHeaders(headers.map((h) => h.toLowerCase().trim()));

//     // Recompute expected headers
//     try {
//       const parsed = JSON.parse(bulkTemplateComponents);
//       let expected = ["mobilenumber"];
//       for (const comp of parsed) {
//         if (comp.type === "HEADER" && comp.example?.header_text) {
//           comp.example.header_text.forEach((v) =>
//             expected.push(`header_${v.toLowerCase()}`)
//           );
//         }
//         if (comp.type === "BODY" && comp.example?.body_text) {
//           comp.example.body_text[0]?.forEach((v) =>
//             expected.push(`body_${v.toLowerCase()}`)
//           );
//         }
//       }

//       setExpectedColumns(expected);

//       // Compare
//       const missing = expected.filter(
//         (col) => !headers.map((h) => h.toLowerCase().trim()).includes(col)
//       );
//       setMismatchedHeaders(missing);
//     } catch (err) {
//       console.error("Error parsing template components:", err);
//       setExpectedColumns([]);
//       setMismatchedHeaders([]);
//     }
//   };

//   reader.readAsArrayBuffer(file);
// };


//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    

//       {message && (
//         <div
//           className={`p-3 mb-4 rounded-md ${
//             message.startsWith("Error")
//               ? "bg-red-100 text-red-700"
//               : "bg-green-100 text-green-700"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* Tab Navigation */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`py-2 px-4 font-medium ${
//             activeTab === "group"
//               ? "text-blue-600 border-b-2 border-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//           onClick={() => setActiveTab("group")}
//         >
//           Send message to group 
//         </button>
//         <button
//           className={`py-2 px-4 font-medium ${
//             activeTab === "bulk"
//               ? "text-blue-600 border-b-2 border-blue-600"
//               : "text-gray-500 hover:text-gray-700"
//           }`}
//           onClick={() => setActiveTab("bulk")}
//         >
//           Send Bulk Messages
//         </button>
//       </div>

//       {/* Real-time Message Status Section */}
//       <div className="mb-10 p-4 border border-blue-400 rounded-lg bg-blue-50">
//         <h3 className="text-2xl font-semibold text-gray-700 mb-4">
//           Real-time Message Status Updates
//         </h3>
//         {latestMessageStatus ? (
//           <div className="text-lg text-gray-800">
//             <p className="font-bold">Latest Update:</p>
//             <p>
//               To: <span className="font-mono">{latestMessageStatus.to}</span>
//             </p>
//             <p>
//               Status:{" "}
//               <span
//                 className={`font-semibold ${
//                   latestMessageStatus.newStatus === "delivered"
//                     ? "text-green-600"
//                     : latestMessageStatus.newStatus === "read"
//                     ? "text-blue-600"
//                     : latestMessageStatus.newStatus === "failed"
//                     ? "text-red-600"
//                     : "text-yellow-600"
//                 }`}
//               >
//                 {latestMessageStatus.newStatus.toUpperCase()}
//               </span>
//             </p>
//             <p className="text-sm text-gray-600">
//               Meta ID: {latestMessageStatus.metaMessageId}
//             </p>
//             <p className="text-sm text-gray-600">
//               Type: {latestMessageStatus.type}
//             </p>
//             <p className="text-sm text-gray-600">
//               Time:{" "}
//               {latestMessageStatus.receivedAt ||
//                 new Date().toLocaleTimeString()}
//             </p>
//           </div>
//         ) : (
//           <p className="text-gray-600">Awaiting message status updates...</p>
//         )}

//         {recentMessageUpdates.length > 0 && (
//           <div className="mt-4">
//             <h4 className="text-lg font-semibold text-gray-700 mb-2">
//               Recent Updates:
//             </h4>
//             <ul className="space-y-2 text-sm">
//               {recentMessageUpdates.map((update, index) => (
//                 <li
//                   key={index}
//                   className="bg-blue-100 p-2 rounded-md border border-blue-200"
//                 >
//                   To: <span className="font-mono text-xs">{update.to}</span> |
//                   Status:{" "}
//                   <span
//                     className={`font-semibold ${
//                       update.newStatus === "delivered"
//                         ? "text-green-600"
//                         : update.newStatus === "read"
//                         ? "text-blue-600"
//                         : update.newStatus === "failed"
//                         ? "text-red-600"
//                         : "text-yellow-600"
//                     }`}
//                   >
//                     {update.newStatus.toUpperCase()}
//                   </span>{" "}
//                   at {update.receivedAt}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Single Message Tab Content */}
//       {activeTab === "group" && (
//         <div className="mb-10 p-4 border border-teal-200 rounded-lg bg-teal-50">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-4">
//             Send Single Message
//           </h3>
//           <form onSubmit={handleSingleMessageSubmit} className="space-y-4">
//             <div>
//               <label className="block text-gray-700">
//                 Recipient Phone Number (e.g., 91xxxxxxxxxx):
//               </label>
//               <input
//                 type="text"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 value={singleRecipient}
//                 onChange={(e) => setSingleRecipient(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">Message Type:</label>
//               <select
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 value={singleMessageType}
//                 onChange={(e) => setSingleMessageType(e.target.value)}
//               >
//                 <option value="text">Text</option>
//                 <option value="template">Template</option>
//                 <option value="image">Image (Link/ID)</option>
//                 <option value="document">Document (Link/ID)</option>
//               </select>
//             </div>

//             {singleMessageType === "text" && (
//               <div>
//                 <label className="block text-gray-700">Text Message:</label>
//                 <textarea
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                   rows="3"
//                   value={singleMessageText}
//                   onChange={(e) => setSingleMessageText(e.target.value)}
//                   required
//                 ></textarea>
//               </div>
//             )}

//             {singleMessageType === "template" && (
//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-gray-700">Template Name:</label>
//                   <select
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     value={singleMessageTemplateName}
//                     onChange={(e) =>
//                       setSingleMessageTemplateName(e.target.value)
//                     }
//                     required
//                   >
//                     <option value="">Select a Template</option>
//                     {templates.map((tpl) => (
//                       <option key={tpl._id} value={tpl.name}>
//                         {tpl.name} ({tpl.language}) - {tpl.metaStatus}
//                       </option>
//                     ))}
//                   </select>
//                   {templates.length === 0 && <p className="text-sm text-red-500 mt-1">No templates found for this project's linked WhatsApp account. Sync from Meta via the Template Management page.</p>}
//                 </div>
//                 <div>
//                   <label className="block text-gray-700">
//                     Template Language Code (e.g., en_US):
//                   </label>
//                   <input
//                     type="text"
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     value={singleMessageTemplateLanguage}
//                     onChange={(e) =>
//                       setSingleMessageTemplateLanguage(e.target.value)
//                     }
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700">
//                     Template Components (JSON Array for Parameters):
//                   </label>
//                   <textarea
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm"
//                     rows="5"
//                     value={singleMessageTemplateComponents}
//                     onChange={(e) =>
//                       setSingleMessageTemplateComponents(e.target.value)
//                     }
//                     placeholder={`[
//   {
//     "type": "HEADER",
//     "parameters": [
//       { "type": "text", "text": "{{your_header_variable_name}}" }
//     ]
//   },
//   {
//     "type": "BODY",
//     "parameters": [
//       { "type": "text", "text": "{{your_body_variable1_name}}" },
//       { "type": "text", "text": "{{your_body_variable2_name}}" }
//     ]
//   }
// ]`}
//                   ></textarea>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Define `parameters` array for HEADER, BODY, or BUTTON
//                     components. For template with placeholders like , these variables will be replaced by fields from your contacts (e.g., 'Name', 'OrderId').
//                     The JSON here should match the structure Meta expects, but use `{{variable_name}}` for dynamic content.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {(singleMessageType === "image" ||
//               singleMessageType === "document") && (
//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-gray-700">
//                     {singleMessageType} Link (URL):
//                   </label>
//                   <input
//                     type="url"
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     value={singleMessageMediaLink}
//                     onChange={(e) => setSingleMessageMediaLink(e.target.value)}
//                     placeholder="https://example.com/media.jpg OR media ID"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Provide either a direct URL or a media ID.
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700">
//                     {singleMessageType} ID (Meta API Media ID):
//                   </label>
//                   <input
//                     type="text"
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     value={singleMessageMediaId}
//                     onChange={(e) => setSingleMessageMediaId(e.target.value)}
//                     placeholder="e.g., 1234567890123456"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700">Caption (Optional):</label>
//                   <input
//                     type="text"
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                     value={singleMessageMediaCaption}
//                     onChange={(e) => setSingleMessageMediaCaption(e.target.value)}
//                     placeholder="Enter caption for your media"
//                   />
//                 </div>
//                 {singleMessageType === "document" && (
//                   <div>
//                     <label className="block text-gray-700">
//                       Filename (for Document):
//                     </label>
//                     <input
//                       type="text"
//                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                       value={singleMessageMediaFilename}
//                       onChange={(e) =>
//                         setSingleMessageMediaFilename(e.target.value)
//                       }
//                       placeholder="MyDocument.pdf"
//                     />
//                   </div>
//                 )}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="bg-teal-600 text-white px-6 py-2 rounded-lg shadow hover:bg-teal-700 transition duration-300"
//               disabled={isLoading}
//             >
//               {isLoading ? "Sending..." : "Send Single Message"}
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Bulk Message Tab Content */}
//       {activeTab === "bulk" && (
//         <div className="mb-10 p-4 border border-purple-200 rounded-lg bg-purple-50">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-4">
//             Send Bulk Template Messages
//           </h3>
//           <form onSubmit={handleBulkMessageSubmit} className="space-y-4">
//             <div>
//               <label className="block text-gray-700">
//                 Template Name for Bulk Send:
//               </label>
//               <select
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 value={bulkTemplateName}
//                 onChange={(e) => setBulkTemplateName(e.target.value)}
//                 required
//               >
//                 <option value="">Select an Approved Template</option>
//                 {templates.map((tpl) => (
//                   <option key={tpl._id} value={tpl.name}>
//                     {tpl.name} ({tpl.language}) - {tpl.metaStatus}
//                   </option>
//                 ))}
//               </select>
//               {templates.length === 0 && <p className="text-sm text-red-500 mt-1">No templates found for this project's linked WhatsApp account. Sync from Meta via the Template Management page.</p>}
//               <p className="text-xs text-gray-500 mt-1">
//                 Only approved templates will be used. Ensure your selected
//                 template is suitable for dynamic variables.
//               </p>
//             </div>
//             <div>
//               <label className="block text-gray-700">
//                 Template Language Code (e.g., en_US):
//               </label>
//               <input
//                 type="text"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 value={bulkTemplateLanguage}
//                 onChange={(e) => setBulkTemplateLanguage(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700">
//                 Template Components for Variables (JSON Array):
//               </label>
//               <textarea
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-mono text-sm"
//                 rows="5"
//                 value={bulkTemplateComponents}
//                 onChange={(e) => setBulkTemplateComponents(e.target.value)}
              
//               ></textarea>
//               {(() => {
//   try {
//     const parsedComponents = JSON.parse(bulkTemplateComponents);
//     const header = parsedComponents.find(
//       (c) => c.type === "HEADER" && c.format === "IMAGE"
//     );

//     if (header) {
//       return (
//         <div className="mt-4">
//           <label className="block text-gray-700 font-semibold mb-1">
//             Upload Header Image:
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={async (e) => {
//               const file = e.target.files[0];
//               if (!file) return;

//               const formData = new FormData();
//               formData.append("file", file);
//               formData.append("type", "image");

//               try {
//                 const res = await api.post(
//         `/projects/${projectId}/messages/upload-media`,
//                   formData,
//                   {
//                     headers: {
//                       "Content-Type": "multipart/form-data",
//                       Authorization: `Bearer ${token}`,
//                     },
//                   }
//                 );
//                 console.log("Image upload response:", res);
//                   setImageId(res.data?.id || res.data?.data.id || "");
// // {
// //     "success": true,
// //     "data": {
// //         "id": "786010917420570",
// //         "mimeType": "image/jpeg",
// //         "fileSize": 38565
// //     }
// // }
//                 const mediaHandle = res.data?.id || res.data?.data.id;
//                 if (!mediaHandle) {
//                   alert("Upload succeeded but media handle missing");
//                   return;
//                 }

//                 // Update the HEADER example with new handle
//                 const updatedComponents = parsedComponents.map((comp) => {
//                   if (comp.type === "HEADER" && comp.format === "IMAGE") {
//                     return {
//                       ...comp,
//                       example: {
//                         header_handle: [mediaHandle],
//                       },
//                     };
//                   }
//                   return comp;
//                 });

//                 setBulkTemplateComponents(JSON.stringify(updatedComponents, null, 2));
//               } catch (error) {
//                 console.error("Error uploading header image:", error);
//                 alert("Image upload failed");
//               }
//             }}
//             className="block w-full border border-gray-300 rounded-md p-2 bg-white"
//           />
//           <p className="text-sm text-gray-500 mt-1">
//             Upload the image to be used in the HEADER of your template. It will be auto-attached.
//           </p>
//         </div>
//       );
//     }
//   } catch (e) {
//     return null; 
//   }
// })()}
// {/* Show preview if header/body has variables */}
// {(() => {
//   try {
//     const parsed = JSON.parse(bulkTemplateComponents);
//     let headerVars = [];
//     let bodyVars = [];

//     for (const comp of parsed) {
//       if (comp.type === "HEADER" && comp.example?.header_text) {
//         headerVars = comp.example.header_text;
//       }
//       if (comp.type === "BODY" && comp.example?.body_text) {
//         bodyVars = comp.example.body_text[0] || [];
//       }
//     }

//     if (headerVars.length === 0 && bodyVars.length === 0) return null;

//     const columns = ["mobilenumber"];
//     columns.push(...headerVars.map(v => `header_${v}`));
//     columns.push(...bodyVars.map(v => `body_${v}`));

//     const sampleRow = {
//       mobilenumber: "919999999999",
//     };
//     headerVars.forEach((v, i) => (sampleRow[`header_${v}`] = `SampleHeader${i+1}`));
//     bodyVars.forEach((v, i) => (sampleRow[`body_${v}`] = `SampleBody${i+1}`));

//     return (
//       <div className="mt-6">
//         <h4 className="text-lg font-semibold text-gray-700 mb-2">
//           Excel Column Format Preview
//         </h4>
//         <div className="overflow-auto border rounded-md bg-white">
//           <table className="min-w-full table-auto border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 {columns.map((col) => (
//                   <th key={col} className="border px-3 py-2 text-sm font-medium text-gray-700">
//                     {col}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 {columns.map((col) => (
//                   <td key={col} className="border px-3 py-2 text-sm text-gray-800">
//                     {sampleRow[col] || ""}
//                   </td>
//                 ))}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//         <button
//   className="mt-3 px-4 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
//   onClick={() => {
//     const csv = [
//       columns.join(","),
//       columns.map((c) => sampleRow[c] || "").join(",")
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.setAttribute("download", "sample_template.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }}
// >
//   Download Sample CSV
// </button>

//         <p className="text-sm text-gray-500 mt-2">
//           Make sure your Excel/CSV file includes these columns to match the template variables.
//         </p>
//       </div>
//     );
//   } catch (e) {
//     return null; // Don't crash if JSON is broken
//   }
// })()}

//                <p className="text-xs text-gray-500 mt-1">
//                     Define `parameters` array with `text` fields using double curly braces 
//                     These will be replaced by column headers from your Excel/CSV file (e.g., 'Name', 'OrderId').
//                     If this field is left empty, the service will attempt to fetch components from the locally stored template for the given name.
//                 </p>
//             </div>
//             <div>
//               <label className="block text-gray-700">
//                 Upload Contacts File (Excel/CSV):
//               </label>
//               <input
//                 type="file"
//                 id="bulkContactsFile"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
//                 onChange={handleBulkFileChange}
//                 accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//                 required
//               />
//               {excelHeaders.length > 0 && (
//   <div className="mt-4">
//     <h4 className="text-lg font-semibold text-gray-700 mb-2">
//       Uploaded Excel Column Preview
//     </h4>
//     <div className="overflow-auto border rounded-md bg-white mb-2">
//       <table className="min-w-full table-auto border-collapse">
//         <thead>
//           <tr className="bg-gray-100">
//             {excelHeaders.map((header) => (
//               <th
//                 key={header}
//                 className="border px-3 py-2 text-sm font-medium text-gray-700"
//               >
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//       </table>
//     </div>
//     {mismatchedHeaders.length > 0 ? (
//       <div className="text-sm text-red-600">
//         ❌ Missing required columns:{" "}
//         <strong>{mismatchedHeaders.join(", ")}</strong>
//       </div>
//     ) : (
//       <div className="text-sm text-green-600">✅ All required columns matched.</div>
//     )}
//   </div>
// )}
//               <p className="text-xs text-gray-500 mt-1">
//                 File must contain 'countrycode' and 'mobilenumber' columns.
//                 Other columns (e.g., 'name', 'order_id') will be used to fill
//                 template variables.
//               </p>
//             </div>
//             <button
//               type="submit"
//               className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition duration-300"
//               disabled={isLoading}
//             >
//               {isLoading ? "Sending..." : "Send Bulk Messages"}
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SendCarosualTemplate;

import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import io from "socket.io-client";
import * as XLSX from 'xlsx';
import GroupWiseBroadcasting from "./GroupWiseBroadcasting";
import { toast } from "react-hot-toast";

const VITE_SOCKET_IO_URL = import.meta.env.VITE_SOCKET_IO_URL || 'http://localhost:5001';
const socket = io(VITE_SOCKET_IO_URL, { transports: ["websocket", "polling"] });

const cleanTemplateComponents = (components) => {
  if (!components) return [];
  try {
    const parsedComponents = typeof components === 'string' ? JSON.parse(components) : components;
    return parsedComponents.map(component => {
      if (component.parameters) {
        component.parameters = component.parameters.map(({ format, ...param }) => param);
      }
      return component;
    });
  } catch (e) {
    console.error("Error parsing template components:", e);
    return [];
  }
};

const SendCarosualTemplate = () => {
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
      const res = await api.get("/templates/allapprovedcarouseltemplates", {
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
  }, [token, projectId, navigate, businessProfileId]);

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

    try {
      const res = await api.post(
        `/projects/${projectId}/messages/bulk-messages`,
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send bulk messages");
      console.error("Bulk send error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, sending: false }));
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
            className="block w-full border rounded-md p-2 bg-white"
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
        ...Object.fromEntries(headerVars.map((v, i) => [`header_${v}`, `Header${i+1}`])),
        ...Object.fromEntries(bodyVars.map((v, i) => [`body_${v}`, `Body${i+1}`]))
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
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "group" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("group")}
        >
          Group Messaging
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "bulk" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("bulk")}
        >
          Bulk Messages
        </button>
      </div>

      <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50">
        <h3 className="text-xl font-semibold mb-3">Message Status</h3>
        {messageStatus.latest ? (
          <div className="space-y-2">
            <p>
              <span className="font-medium">To:</span> {messageStatus.latest.to}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className={`font-semibold ${
                messageStatus.latest.newStatus === "delivered" ? "text-green-600" :
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
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Bulk Template Messages</h3>
          
          <form onSubmit={handleBulkMessageSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Template</label>
              <select
                className="w-full border rounded-md p-2"
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

            <div>
              <label className="block font-medium mb-1">Template Components</label>
              <textarea
                className="w-full border rounded-md p-2 font-mono text-sm h-32"
                value={bulkTemplateComponents}
                onChange={(e) => setBulkTemplateComponents(e.target.value)}
                placeholder="JSON components will auto-populate when template is selected"
                readOnly={!!bulkTemplateName}
              />
            </div>

            {renderTemplatePreview()}

            <div>
              <label className="block font-medium mb-1">Contacts File</label>
              <input
                type="file"
                id="bulkContactsFile"
                className="w-full border rounded-md p-2"
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading.sending || isLoading.uploading || mismatchedHeaders.length > 0}
            >
              {isLoading.sending ? "Sending..." : "Send Bulk Messages"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SendCarosualTemplate;
