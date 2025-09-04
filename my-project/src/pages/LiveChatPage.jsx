import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import { FaChevronLeft, FaSpinner } from "react-icons/fa";
import { ChevronLeft } from "lucide-react";
import Avatar from "../components/Avatar";
import { IoMdSend } from "react-icons/io";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

const VITE_SOCKET_IO_URL =
  import.meta.env.VITE_SOCKET_IO_URL || "http://localhost:5000";
const socket = io(VITE_SOCKET_IO_URL, { transports: ["websocket", "polling"] });

const LiveChatPage = () => {
  const { user, token } = useAuth();
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [isLoading, setIsLoading] = useState({
    conversations: true,
    messages: false,
    sending: false,
    templates: true,
    media: false,
  });
  const [messageType, setMessageType] = useState("text");
  const [templateName, setTemplateName] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [uploadedMediaData, setUploadedMediaData] = useState(null);
  const [first, setFirst] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const project = localStorage.getItem("currentProject")
    ? JSON.parse(localStorage.getItem("currentProject"))
    : null;
  const businessProfileId = project?.businessProfileId._id || null;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  // Helper functions
  function truncate(str, maxLength) {
    if (typeof str !== "string") return "";
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
  }

  // Data fetching
  const fetchTemplates = async () => {
    try {
      const res = await api.get("/templates/plain", {
        ...config,
        params: { businessProfileId },
      });
      setTemplates(res.data.data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setIsLoading((prev) => ({ ...prev, templates: false }));
    }
  };

  const fetchConversations = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, conversations: true }));
      const res = await api.get(`/projects/${projectId}/conversations`, config);
      setConversations(res.data.data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
      setError(
        error.response?.data?.message || "Failed to fetch conversations"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, conversations: false }));
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setIsLoading((prev) => ({ ...prev, messages: true }));
      const res = await api.get(
        `/projects/${projectId}/conversations/${conversationId}/messages`,
        config
      );
      setMessages(res.data.data || []);

      // Mark as read
      await api.put(
        `/projects/${projectId}/conversations/${conversationId}/read`,
        {},
        config
      );

      // Update unread count
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      setError(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      setIsLoading((prev) => ({ ...prev, messages: false }));
    }
  };

  // Media handling
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
  };

  console.log("message type", messageType, fileInputRef);
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type;

    // File type mapping
    const typeMapping = {
      image: ["image/jpeg", "image/png"],
      document: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
      ],
      audio: ["audio/mpeg", "audio/ogg", "audio/amr", "audio/wav"],
      video: ["video/mp4", "video/3gpp"],
    };

    // Determine message type from MIME
    let detectedType = null;
    for (const [key, types] of Object.entries(typeMapping)) {
      if (types.includes(fileType)) {
        detectedType = key;
        break;
      }
    }

    if (!detectedType) {
      toast.error(
        "Only JPEG, PNG, PDF, audio (MP3/WAV), or video (MP4/3GPP) files are allowed"
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size exceeds 25MB limit");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading((prev) => ({ ...prev, media: true }));
      const res = await api.post(
        `/projects/${projectId}/messages/upload-media`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessageType(detectedType); // ✅ Automatically update message type
      setMediaFile(file);
      setUploadedMediaData(res.data.data);
      toast.success("Media uploaded successfully");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload media");
    } finally {
      setIsLoading((prev) => ({ ...prev, media: false }));
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Message handling
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedConversation) {
      toast.warning("Please select a conversation");
      return;
    }

    // Validation
    if (messageType === "text" && !newMessageText.trim()) {
      toast.warning("Please enter a message");
      return;
    }
    if (messageType === "template" && !templateName) {
      toast.warning("Please select a template");
      return;
    }
    if (
      ["image", "document", "audio", "video"].includes(messageType) &&
      !mediaFile
    ) {
      toast.warning(`Please select a ${messageType} file`);
      return;
    }

    try {
      setIsLoading((prev) => ({ ...prev, sending: true }));

      const endpoint = `/projects/${projectId}/conversations/${selectedConversation._id}/messages`;
      let payload = { messageType };

      switch (messageType) {
        case "text":
          payload.messageContent = newMessageText.trim();
          break;
        case "template":
          const selectedTemplate = templates.find(
            (t) => t.name === templateName
          );
          if (!selectedTemplate) throw new Error("Template not found");
          payload = {
            ...payload,
            templateName,
            templateLanguage: selectedTemplate.language || "en_US",
            templateComponents: JSON.stringify([]),
          };
          break;
        case "image":
        case "document":
        case "audio":
        case "video":
          if (!uploadedMediaData?.id)
            throw new Error("Media upload incomplete");
          payload = {
            ...payload,
            mediaId: uploadedMediaData.id,
            ...(newMessageText.trim() && {
              mediaCaption: newMessageText.trim(),
            }),
          };
          break;
        default:
          throw new Error("Unsupported message type");
      }

      const response = await api.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Update UI optimistically
      const newMessage = response.data.data;
      const formattedMessage = {
        _id: newMessage._id,
        conversationId: selectedConversation._id,
        direction: "outbound",
        type: messageType,
        status: "pending",
        sentAt: new Date(),
        metaMessageId: newMessage.metaMessageId,
        message: {},
        to: newMessage.to,
        metaPhoneNumberID: newMessage.metaPhoneNumberID,
        ...(messageType === "template" && {
          templateName: newMessage.templateName,
          templateLanguage: newMessage.templateLanguage,
        }),
      };

      // Set message content
      if (messageType === "text") {
        formattedMessage.message.body = newMessageText.trim();
      } else if (messageType === "template") {
        formattedMessage.message = {
          name: templateName,
          language: { code: payload.templateLanguage },
          components: [],
        };
      } else {
        formattedMessage.message = {
          link: URL.createObjectURL(mediaFile),
          ...(messageType === "document" && { filename: mediaFile.name }),
          ...(newMessageText.trim() && { caption: newMessageText.trim() }),
        };
      }

      // Update state
      setMessages((prev) => [...prev, formattedMessage]);
      setConversations((prev) =>
        prev
          .map((conv) =>
            conv._id === selectedConversation._id
              ? {
                  ...conv,
                  latestMessage:
                    messageType === "text"
                      ? newMessageText.trim()
                      : `[${messageType} message]`,
                  latestMessageType: messageType,
                  lastActivityAt: new Date(),
                  unreadCount: 0,
                }
              : conv
          )
          .sort(
            (a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt)
          )
      );

      // Reset form
      setNewMessageText("");
      setTemplateName("");
      clearMedia();
      setMessageType("text");
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Message send error:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsLoading((prev) => ({ ...prev, sending: false }));
    }
  };

  const handleConversationSelect = (conv) => {
    if (selectedConversation?._id !== conv._id) {
      setSelectedConversation(conv);
      setNewMessageText("");
      fetchMessages(conv._id);
      setFirst(true);
    }
  };

  const handleDownloadMedia = async (mediaId) => {
    try {
      setIsLoading((prev) => ({ ...prev, media: true }));
      const response = await api.post(
        `/projects/${projectId}/messages/download-media`,
        { imageId: mediaId },
        { responseType: "blob" }
      );

      const contentType = response.headers["content-type"];
      const extension = contentType.split("/")[1] || "jpg";
      const blob = new Blob([response.data], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `media.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("Media downloaded successfully");
    } catch (error) {
      console.error("Failed to download media:", error);
      toast.error("Failed to download media");
    } finally {
      setIsLoading((prev) => ({ ...prev, media: false }));
    }
  };

  // Socket.IO handlers
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Initial data fetch
    fetchConversations();
    fetchTemplates();

    // Socket.IO setup
    socket.emit("joinRoom", user._id);
    socket.emit("joinRoom", `project-${projectId}`);

    // Message handlers
    const handleNewInboundMessage = (data) => {
      const { message, conversation, contact } = data;

      // Update conversation preview
      setConversations((prev) => {
        const existingConvIndex = prev.findIndex(
          (c) => c._id === conversation._id
        );

        let previewText;
        switch (message.type) {
          case "text":
            previewText = message.message.body;
            break;
          case "image":
            previewText = message.message.caption || "[Image]";
            break;
          case "video":
            previewText = message.message.caption || "[Video]";
            break;
          case "document":
            previewText = message.message.filename || "[Document]";
            break;
          case "audio":
            previewText = "[Audio]";
            break;
          case "sticker":
            previewText = "[Sticker]";
            break;
          case "location":
            previewText = "[Location]";
            break;
          case "contacts":
            previewText = "[Contact Card]";
            break;
          case "interactive":
            previewText = message.message.title || "[Interactive Reply]";
            break;
          case "order":
            previewText = "[Order]";
            break;
          default:
            previewText = `[${message.type}]`;
        }

        if (existingConvIndex > -1) {
          const updated = [...prev];
          updated[existingConvIndex] = {
            ...updated[existingConvIndex],
            latestMessage: previewText,
            latestMessageType: message.type,
            lastActivityAt: message.timestamp || new Date(),
            unreadCount:
              selectedConversation?._id === conversation._id
                ? 0
                : (updated[existingConvIndex].unreadCount || 0) + 1,
          };
          return updated.sort(
            (a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt)
          );
        } else {
          return [
            {
              ...conversation,
              contactId: contact,
              latestMessage: previewText,
              latestMessageType: message.type,
              unreadCount: 1,
            },
            ...prev,
          ].sort(
            (a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt)
          );
        }
      });

      // Update messages in real time
      if (selectedConversation?._id === conversation._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleNewChatMessage = (data) => {
      if (selectedConversation?._id === data.conversationId) {
        setMessages((prev) => [...prev, data.message]);
        if (data.message.direction === "inbound") {
          api
            .put(
              `/projects/${projectId}/conversations/${selectedConversation._id}/read`,
              {},
              config
            )
            .then(() => {
              setConversations((prev) =>
                prev.map((conv) =>
                  conv._id === selectedConversation._id
                    ? { ...conv, unreadCount: 0 }
                    : conv
                )
              );
            })
            .catch((err) => console.error("Error marking as read:", err));
        }
      }
    };

    const handleMessageStatusUpdate = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.metaMessageId === data.metaMessageId
            ? { ...msg, status: data.newStatus, sentAt: data.sentAt }
            : msg
        )
      );
    };

    socket.on("newInboundMessage", handleNewInboundMessage);
    socket.on("newChatMessage", handleNewChatMessage);
    socket.on("messageStatusUpdate", handleMessageStatusUpdate);

    return () => {
      socket.off("newInboundMessage", handleNewInboundMessage);
      socket.off("newChatMessage", handleNewChatMessage);
      socket.off("messageStatusUpdate", handleMessageStatusUpdate);
      socket.emit("leaveRoom", user._id);
      socket.emit("leaveRoom", `project-${projectId}`);
    };
  }, [user, token, projectId, navigate, selectedConversation]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Render media preview
  const renderMediaPreview = () => {
    if (!mediaFile) return null;

    if (mediaFile.type.startsWith("image/") && mediaPreview) {
      return (
        <div className="relative mb-2">
          <img
            src={mediaPreview}
            alt="Preview"
            className="max-w-xs max-h-40 rounded-lg"
          />
          <button
            type="button"
            onClick={clearMedia}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
          >
            ×
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
        <span className="truncate">{mediaFile.name}</span>
        <button
          type="button"
          onClick={clearMedia}
          className="text-red-500 ml-2"
        >
          ×
        </button>
      </div>
    );
  };
  const CallPermissionReply = ({ contactName, waId, replyData, timestamp }) => {
    const { response, response_source, expiration_timestamp } = replyData;

    const isAccepted = response === "accept";
    const date = new Date(timestamp * 1000).toLocaleString();
    const expiry = new Date(expiration_timestamp * 1000).toLocaleString();

    const handleCallNow = () => {
      window.open(`tel:${waId}`, "_self");
    };

    return (
      <div
        className={`w-full max-w-sm rounded-xl p-4 mb-3 border ${
          isAccepted
            ? "bg-green-50 border-green-400"
            : "bg-red-50 border-red-400"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="font-semibold text-sm">{contactName || waId}</div>
          <div className="text-xs text-gray-500">{date}</div>
        </div>

        <div className="mt-2">
          {isAccepted ? (
            <div className="text-green-700 text-sm">
              Accepted call permission ✅
              <div className="text-gray-600 text-xs mt-1">
                Expires at: {expiry}
              </div>
            </div>
          ) : (
            <div className="text-red-700 text-sm">
              Missed or declined call ❌
              <div className="text-gray-600 text-xs mt-1">
                Source: {response_source}
              </div>
              <button
                onClick={handleCallNow}
                className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                📞 Call Now
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render message status icon
  const renderStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return "✓✓ (Read)";
      case "failed":
        return "✗ (Failed)";
      case "pending":
        return <FaSpinner className="animate-spin" />;
      default:
        return null;
    }
  };

  // // Render message content based on type
  // const renderMessageContent = (msg) => {
  //   switch (msg.type) {
  //     case "text":
  //       return <p>{msg.message.body}</p>;

  //     case "template":
  //       return <p className="font-semibold">📩 Template: {msg.message.name}</p>;

  //     case "image":
  //       return (
  //         <div>
  //           <img
  //             src={msg.message.link}
  //             alt="Image"
  //             className="max-w-xs rounded-lg"
  //           />
  //           {msg.message.caption && (
  //             <p className="text-sm">{msg.message.caption}</p>
  //           )}
  //         </div>
  //       );

  //     case "video":
  //       return (
  //         <div>
  //           <video controls className="max-w-xs rounded-lg">
  //             <source src={msg.message.link} type="video/mp4" />
  //           </video>
  //           {msg.message.caption && (
  //             <p className="text-sm">{msg.message.caption}</p>
  //           )}
  //         </div>
  //       );

  //     case "audio":
  //       return <audio controls src={msg.message.link} className="w-full" />;

  //     case "document":
  //       return (
  //         <div>
  //           <p>📄 {msg.message.filename || "Document"}</p>
  //           <button
  //             onClick={() => handleDownloadMedia(msg.message.id)}
  //             className="text-blue-500 underline"
  //           >
  //             Download
  //           </button>
  //         </div>
  //       );

  //     case "sticker":
  //       return (
  //         <img
  //           src={msg.message.link}
  //           alt="Sticker"
  //           className="w-20 h-20 rounded"
  //         />
  //       );

  //     case "location":
  //       return (
  //         <div className="p-2 bg-blue-50 rounded-lg text-sm">
  //           📍 Location shared: {msg.message.latitude}, {msg.message.longitude}
  //           <a
  //             href={`https://maps.google.com/?q=${msg.message.latitude},${msg.message.longitude}`}
  //             target="_blank"
  //             rel="noopener noreferrer"
  //             className="block text-blue-500 underline mt-1"
  //           >
  //             View on Map
  //           </a>
  //         </div>
  //       );

  //     case "contacts":
  //       return (
  //         <div className="p-2 border rounded bg-gray-50">
  //           👤 Contact shared:
  //           {msg.message.map((c, i) => (
  //             <p key={i}>{c.name?.formatted_name}</p>
  //           ))}
  //         </div>
  //       );

  //     case "order":
  //       return (
  //         <div className="border border-green-300 rounded-lg p-3 bg-green-50 text-sm">
  //           <p className="font-semibold mb-2">🛒 Order Received</p>
  //           {msg.message.product_items?.map((item, i) => (
  //             <div key={i}>
  //               {item.product_retailer_id} × {item.quantity}
  //             </div>
  //           ))}
  //         </div>
  //       );

  //     default:
  //       return <p className="italic">[Unsupported Message Type: {msg.type}]</p>;
  //   }
  // };
const renderMessageContent = (msg) => {
  switch (msg.type) {
    case "text":
      return <p>{msg.message.body}</p>;

    case "template":
      return <p className="font-semibold">Template: {msg.message.name}</p>;

    case "call_permission_reply":
    case "interactive":
      if (
        msg.message?.call_permission_reply ||
        msg.call_permission_reply
      ) {
        const replyData = msg.message?.call_permission_reply || msg.call_permission_reply;

        return (
          <CallPermissionReply
            contactName={msg.from}
            waId={msg.from}
            timestamp={Math.floor(new Date(msg.sentAt).getTime() / 1000)}
            replyData={{
              response: replyData.response,
              response_source: replyData.response_source,
              expiration_timestamp: replyData.expiration_timestamp,
            }}
          />
        );
      }
      return <p className="italic text-sm">[Unsupported interactive message]</p>;

    case "image":
    case "document":
    case "video":
    case "audio":
      return (
        <div>
          <p className="font-semibold">{msg.type.toUpperCase()}</p>
          {msg.message.link && (
            <a
              href={msg.message.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 underline break-all"
            >
              {msg.message.link.substring(0, 30)}...
            </a>
          )}
          {msg.message.id && (
            <button
              onClick={() => handleDownloadMedia(msg.message.id)}
              className="text-blue-500 underline text-sm"
            >
              Download
            </button>
          )}
          {msg.message.caption && (
            <p className="text-sm italic">{msg.message.caption}</p>
          )}
        </div>
      );

    case "order":
      const items = msg.message?.product_items || [];
      return (
        <div className="border border-blue-300 rounded-lg p-3 bg-blue-50 text-sm">
          <p className="font-semibold mb-2">🛒 Order Received</p>
          {items.map((item, i) => (
            <div key={i} className="mb-1 pl-2">
              <div>Retailer ID: <span className="font-medium">{item.product_retailer_id}</span></div>
              <div>Quantity: {item.quantity}</div>
              <div>Price: {item.item_price} {item.currency}</div>
            </div>
          ))}
          <div className="text-xs text-gray-500 mt-2">
            Catalog ID: {msg.message.catalog_id}
          </div>
        </div>
      );
case "sticker":
        return (
          <img
            src={msg.message.link}
            alt="Sticker"
            className="w-20 h-20 rounded"
          />
        );

      case "location":
        return (
          <div className="p-2 bg-blue-50 rounded-lg text-sm">
            📍 Location shared: {msg.message.latitude}, {msg.message.longitude}
            <a
              href={`https://maps.google.com/?q=${msg.message.latitude},${msg.message.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-500 underline mt-1"
            >
              View on Map
            </a>
          </div>
        );

      case "contacts":
        return (
          <div className="p-2 border rounded bg-gray-50">
            👤 Contact shared:
            {msg.message.map((c, i) => (
              <p key={i}>{c.name?.formatted_name}</p>
            ))}
          </div>
        );

    default:
      return (
        <p className="italic text-sm">
          [Unsupported Message Type: {msg.type}]
        </p>
      );
  }
};
  return (
    <div className="md:flex md:h-[calc(100vh-120px)] bg-white rounded-lg shadow-md mt-8 overflow-hidden">
      {/* Left Panel: Conversation List */}
      <div className="md:w-1/3 w-full dark:border-dark-border   dark:bg-bg-dark-primary border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="flex-grow overflow-y-auto dark:bg-dark-surface">
          {isLoading.conversations ? (
            <div className="flex justify-center items-center h-full">
              <Loader size="lg" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-gray-500 dark:bg-dark-surface dark:text-dark-text-primary text-sm">
              No conversations yet. Messages from WhatsApp users will appear
              here.
            </p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`flex p-3 dark:text-dark-text-primary dark:border-dark-border dark:bg-dark-surface cursor-pointer border-b border-gray-200 hover:bg-gray-100 transition duration-150 ${
                  selectedConversation?._id === conv._id
                    ? "bg-gray-100 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => handleConversationSelect(conv)}
              >
                <div className="flex-grow">
                  <div className="flex w-full gap-5 items-center">
                    <div className="w-10">
                      <Avatar
                        src="https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVufGVufDB8fDB8fHww"
                        alt="profile picture"
                        size="md"
                      />
                    </div>
                    <div className="flex flex-1 justify-between">
                      <div>
                        <h4 className="font-semibold dark:text-dark-text-primary dark:bg-dark-surface text-gray-800">
                          {conv.contactId?.profileName ||
                            conv.contactId?.name ||
                            conv.contactId?.mobileNumber ||
                            "Unknown Contact"}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.latestMessageType === "text"
                            ? truncate(conv.latestMessage, 30)
                            : `[${conv.latestMessageType} message]`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(conv.lastActivityAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div className="md:w-2/3 w-full fixed top-0 z-1  left-0 md:static   md:flex flex-col bg-white dark:bg-dark-surface">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 flex gap-4 items-center   dark:border-dark-border dark:bg-dark-surface border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden mr-2 p-1 rounded-full dark:text-dark-text-primary hover:bg-gray-200 transition"
                aria-label="Go back"
              >
                <ChevronLeft size={20} />
              </button>
              <Avatar
                src="https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVufGVufDB8fDB8fHww"
                alt="profile picture"
                size="md"
              />
              <div>
                <h3 className="text-lg font-semibold dark:text-dark-text-primary  text-gray-800">
                  {selectedConversation.contactId?.profileName ||
                    selectedConversation.contactId?.name ||
                    selectedConversation.contactId?.mobileNumber}
                </h3>
                <p className="text-sm text-gray-600 dark:text-dark-text-primary">
                  {selectedConversation.contactId?.countryCode}
                  {selectedConversation.contactId?.mobileNumber}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow h-[79vh] p-4 overflow-y-auto space-y-4 bg-[url('https://i.pinimg.com/736x/0b/f2/80/0bf280388937448d38392b76c15bd441.jpg')] dark:bg-[url('https://i.pinimg.com/736x/54/3d/e8/543de8a1f2887da54f7b7de6772f6aa2.jpg')]  bg-opacity-50">
              {isLoading.messages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader size="lg" />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.direction === "outbound"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg dark:bg-dark-surface dark:text-dark-text-primary dark:border-dark-surface shadow-sm ${
                        msg.direction === "outbound"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      {renderMessageContent(msg)}
                      <p
                        className={`text-xs mt-1 flex items-center ${
                          msg.direction === "outbound"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {msg.direction === "outbound" && (
                          <span className="ml-2">
                            {renderStatusIcon(msg.status)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t fixed md:static bottom-0 border-gray-200 dark:border-dark-border dark-border-dark-border dark:bg-dark-surface bg-gray-50"
            >
              {/* Message Type Selector */}
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  "text",
                  "template",
                  "image",
                  "video",
                  "audio",
                  "document",
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-3 py-1 dark:bg-dark-bg-primary dark:text-dark-text-primary text-sm rounded transition ${
                      messageType === type
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      setMessageType(type);
                      if (
                        ["image", "video", "audio", "document"].includes(type)
                      ) {
                        setTimeout(() => {
                          fileInputRef.current?.click();
                        }, 0);
                      }
                    }}
                    disabled={isLoading.media}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept={
                    messageType === "image"
                      ? "image/jpeg,image/png"
                      : messageType === "video"
                      ? "video/mp4,video/3gpp"
                      : messageType === "audio"
                      ? "audio/mpeg,audio/ogg,audio/amr,audio/wav"
                      : messageType === "document"
                      ? "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                      : ""
                  }
                  className="hidden"
                />
              </div>

              {/* Template Selector */}
              {messageType === "template" && (
                <div className="mb-3">
                  <select
                    className="w-full p-2 dark:bg-dark-surface dark:text-dark-text-primary dark:border-dark-border border rounded bg-white"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    disabled={isLoading.templates}
                  >
                    <option value="">Select a template</option>
                    {templates.map((template) => (
                      <option key={template.name} value={template.name}>
                        {template.name} ({template.language})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Media Preview */}
              {renderMediaPreview()}

              {/* Message Input */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 dark:text-dark-text-primary dark:border-dark-border dark:bg-dark-surface rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    messageType === "text"
                      ? "Type a message..."
                      : messageType === "template"
                      ? "Add template parameters..."
                      : "Add a caption (optional)..."
                  }
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  disabled={isLoading.sending}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center justify-center disabled:opacity-50"
                  disabled={isLoading.sending || isLoading.media}
                >
                  {isLoading.sending ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <IoMdSend size={20} />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-grow hidden md:flex items-center justify-center text-gray-500">
            {isLoading.conversations ? (
              <Loader size="lg" />
            ) : (
              "Select a conversation to start chatting"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatPage;
