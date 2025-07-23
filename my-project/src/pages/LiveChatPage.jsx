// client/src/pages/LiveChatPage.js
import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import { FaChevronLeft } from "react-icons/fa";

const VITE_SOCKET_IO_URL =
  import.meta.env.VITE_SOCKET_IO_URL || "http://localhost:5000";
const socket = io(VITE_SOCKET_IO_URL, { transports: ["websocket", "polling"] });
import { ChevronLeft } from "lucide-react";
import Avatar from "../components/Avatar";
import { IoMdSend } from "react-icons/io";
import Loader from "../components/Loader";

const LiveChatPage = () => {
  const { user, token } = useAuth();
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [messageType, setMessageType] = useState("text"); // 'text', 'template', 'image', 'video', 'audio'
  const [templateName, setTemplateName] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [uploadedMediaData, setUploadedMediaData] = useState(null);
  const [first, setFirst] = useState(false);

  const messagesEndRef = useRef(null); // For auto-scrolling chat
  function truncate(str, maxLength) {
    if (typeof str !== "string") return "";
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
  }
  const fileInputRef = useRef(null);
  const project = localStorage.getItem("currentProject")
    ? JSON.parse(localStorage.getItem("currentProject"))
    : null;
  const businessProfileId = project?.businessProfileId._id || null;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Important for file uploads
    },
  };

  // Fetch available templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await api.get("/templates", {
          ...config,
          params: {
            businessProfileId: businessProfileId,
          },
        });
        setTemplates(res.data.data || []);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, [projectId, token]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/projects/${projectId}/conversations`, config);
      setConversations(res.data.data || []);
      setMessage("");
      console.log("conversations", res);
    } catch (error) {
      console.error(
        "Error fetching conversations:",
        error.response?.data?.message || error.message
      );
      setMessage(
        `Error loading conversations: ${
          error.response?.data?.message || "Failed to fetch conversations."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fetch Messages for Selected Conversation ---
  const fetchMessages = async (conversationId) => {
    setIsLoading(true);
    try {
      const res = await api.get(
        `/projects/${projectId}/conversations/${conversationId}/messages`,
        config
      );
      setMessages(res.data.data || []);
      setMessage("");
      // Mark conversation as read on the backend
      await api.put(
        `/projects/${projectId}/conversations/${conversationId}/read`,
        {},
        config
      );
      // Optimistically update unread count in frontend
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error.response?.data?.message || error.message
      );
      setMessage(
        `Error loading messages: ${
          error.response?.data?.message || "Failed to fetch messages."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      ![
        "image/jpeg",
        "image/png",
        "application/pdf",
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ].includes(file.type)
    ) {
      alert(
        "Only JPEG, PNG, PDF, audio (MP3/WAV), or video (MP4/WebM) files are allowed"
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert("File size exceeds 25MB limit");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
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
      setMediaFile(file); // store selected file
      setUploadedMediaData(res.data.data); // contains { id, mimeType, fileSize }
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err);
      throw err;
    }
  };

  // Clear media selection
  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedConversation) {
      setMessage("Please select a conversation.");
      return;
    }

    // Validate inputs based on message type
    if (messageType === "text" && !newMessageText.trim()) {
      setMessage("Please enter a message.");
      return;
    }
    if (messageType === "template" && !templateName) {
      setMessage("Please select a template.");
      return;
    }
    if (
      ["image", "document", "audio", "video"].includes(messageType) &&
      !mediaFile
    ) {
      setMessage(`Please select a ${messageType} file.`);
      return;
    }

    setIsSending(true);
    setMessage("");

    try {
      // Prepare payload according to backend expectations
      const endpoint = `/projects/${projectId}/conversations/${selectedConversation._id}/messages`;
      let payload = {
        messageType,
        [messageType === "text" ? "messageContent" : ""]: newMessageText.trim(),
      };

      // Handle each message type specifically
      switch (messageType) {
        case "text":
          // Payload already contains messageContent
          break;

        case "template":
          const selectedTemplate = templates.find(
            (t) => t.name === templateName
          );
          if (!selectedTemplate) throw new Error("Selected template not found");

          payload = {
            ...payload,
            templateName,
            templateLanguage: selectedTemplate.language || "en_US",
            templateComponents: JSON.stringify([]), // Add components if needed
          };
          break;
        case "image":
        case "document":
        case "audio":
        case "video":
          if (!uploadedMediaData || !uploadedMediaData.id) {
            throw new Error("Media not uploaded properly. Please try again.");
          }

          payload = {
            ...payload,
            mediaId: uploadedMediaData.id,
            ...(["document", "audio", "video"].includes(messageType) && {
              mediaFilename: mediaFile.name,
            }),
            ...(newMessageText.trim() && {
              mediaCaption: newMessageText.trim(),
            }),
          };
          break;

        default:
          throw new Error("Unsupported message type");
      }

      // Send the message to the backend
      const response = await api.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Optimistically update UI with the new message
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

      // Set message content based on type
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
    } catch (error) {
      console.error("Message send error:", error);
      setMessage(
        `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Failed to send message"
        }`
      );
    } finally {
      setIsSending(false);
    }
  };
  // Enhanced send message function
  //   const handleSendMessage = async (e) => {
  //     e.preventDefault();
  //     if (!selectedConversation) {
  //       setMessage("Please select a conversation.");
  //       return;
  //     }

  //     // Validate based on message type
  //     if (messageType === "text" && !newMessageText.trim()) {
  //       setMessage("Please enter a message.");
  //       return;
  //     }
  //     if (messageType === "template" && !templateName) {
  //       setMessage("Please select a template.");
  //       return;
  //     }
  //     if (
  //       (messageType === "image" ||
  //         messageType === "video" ||
  //         messageType === "audio") &&
  //       !mediaFile
  //     ) {
  //       setMessage(`Please select a ${messageType} file.`);
  //       return;
  //     }

  //     setIsSending(true);
  //     setMessage("");

  //     try {
  //       let messagePayload;
  //       const formData = new FormData();

  //       if (messageType === "text") {
  //         messagePayload = {
  //           messageType: "text",
  //           messageContent: newMessageText.trim(),
  //         };
  //       } else if (messageType === "template") {
  //         messagePayload = {
  //           messageType: "template",
  //           templateName: templateName,
  //         };
  //         // Add template parameters if needed
  //         // messagePayload.templateParameters = {...};
  //       } else {
  //         // For media messages
  //         formData.append("file", mediaFile);
  //         formData.append("messageType", messageType);
  //         if (newMessageText.trim()) {
  //           formData.append("caption", newMessageText.trim());
  //         }
  //       }

  //       const endpoint = `/projects/${projectId}/conversations/${selectedConversation._id}/messages`;
  //       const res =
  //         messageType === "text" || messageType === "template"
  //           ? await api.post(endpoint, messagePayload, {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //                 "Content-Type": "application/json",
  //               },
  //             })
  //           : await api.post(endpoint, formData, {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //                 "Content-Type": "multipart/form-data",
  //               },
  //             });

  //       // Optimistically add message to UI
  //       const newMessage = {
  //         _id: res.data.data._id,
  //         conversationId: selectedConversation._id,
  //         direction: "outbound",
  //         type: messageType,
  //         status: "pending",
  //         sentAt: new Date(),
  //         metaMessageId: res.data.data.metaMessageId,
  //       };

  //       if (messageType === "text") {
  //         newMessage.message = { body: newMessageText.trim() };
  //       } else if (messageType === "template") {
  //         newMessage.message = { name: templateName };
  //       } else {
  //         newMessage.message = {
  //           link: URL.createObjectURL(mediaFile),
  //           caption: newMessageText.trim() || undefined,
  //           fileName: mediaFile.name,
  //           mimeType: mediaFile.type,
  //         };
  //       }

  //       setMessages((prev) => [...prev, newMessage]);

  //       // Update conversation list
  //       setConversations((prev) => {
  //         const updated = prev
  //           .map((conv) => {
  //             if (conv._id === selectedConversation._id) {
  //               return {
  //                 ...conv,
  //                 latestMessage:
  //                   messageType === "text"
  //                     ? newMessageText.trim()
  //                     : `[${messageType} message]`,
  //                 latestMessageType: messageType,
  //                 lastActivityAt: new Date(),
  //                 unreadCount: 0,
  //               };
  //             }
  //             return conv;
  //           })
  //           .sort(
  //             (a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt)
  //           );
  //         return updated;
  //       });

  //       // Reset form
  //       setNewMessageText("");
  //       setTemplateName("");
  //       clearMedia();
  //       setMessageType("text");
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //       setMessage(
  //         `Error: ${error.response?.data?.message || "Failed to send message"}`
  //       );
  //     } finally {
  //       setIsSending(false);
  //     }
  //   };
  const handleConversationSelect = (conv) => {
    if (selectedConversation?._id !== conv._id) {
      // Only re-fetch if a different conversation is selected
      setSelectedConversation(conv);
      setNewMessageText(""); // Clear message input
      fetchMessages(conv._id); // Fetch messages for the newly selected conversation
    }
  };
  // Render media preview in chat
  const renderMediaPreview = () => {
    if (!uploadedMediaData) return null;

    if (uploadedMediaData.type.startsWith("image/")) {
      return (
        <div className="relative mb-2">
          <img
            src={uploadedMediaData}
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

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Fetch initial data
    fetchConversations();

    // Join specific Socket.IO rooms
    socket.emit("joinRoom", user._id); // For general user updates (e.g., new conversation)
    socket.emit("joinRoom", `project-${projectId}`); // For project-wide updates

    // Socket.IO Listener for NEW INBOUND messages (updates conversation list)
    socket.on("newInboundMessage", (data) => {
      console.log(
        "Socket: newInboundMessage received (for Conversation List update):",
        data
      );
      // This is for new messages that might create a new conversation or update an existing one not currently selected
      setConversations((prevConversations) => {
        const existingConvIndex = prevConversations.findIndex(
          (conv) => conv._id === data.conversation._id
        );
        let updatedConversationsList;

        if (existingConvIndex > -1) {
          // Update existing conversation details
          updatedConversationsList = [...prevConversations];
          updatedConversationsList[existingConvIndex] = {
            ...updatedConversationsList[existingConvIndex],
            latestMessage:
              data.message.type === "text"
                ? data.message.message.body
                : `[${data.message.type}]`,
            latestMessageType: data.message.type,
            lastActivityAt: data.message.sentAt,
            // Increment unread count only if NOT the currently selected conversation
            unreadCount:
              selectedConversation &&
              selectedConversation._id === data.conversation._id
                ? 0 // If selected, it's immediately read
                : (updatedConversationsList[existingConvIndex].unreadCount ||
                    0) + 1,
          };
        } else {
          // Add new conversation if it doesn't exist
          updatedConversationsList = [
            {
              ...data.conversation,
              contactId: data.contact, // Ensure populated contact details are used
              unreadCount: 1, // New conversation starts with 1 unread message
            },
            ...prevConversations,
          ];
        }
        // Sort by latest activity for display
        return updatedConversationsList.sort(
          (a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt)
        );
      });

      // If the message is for the currently selected conversation, also add it to chat history
      if (
        selectedConversation &&
        data.conversation._id === selectedConversation._id
      ) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    // Socket.IO Listener for NEW CHAT MESSAGES (updates selected conversation's messages)
    // This is typically for messages within the *currently open* chat window
    socket.on("newChatMessage", (data) => {
      console.log(
        "Socket: newChatMessage received (for Chat Window update):",
        data
      );
      if (
        selectedConversation &&
        data.conversationId === selectedConversation._id
      ) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
        // If this is an inbound message for the currently selected conversation, mark as read
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
            .catch((err) =>
              console.error("Error marking as read via socket:", err)
            );
        }
      }
    });

    // Socket.IO Listener for message status updates (for messages *we* sent)
    socket.on("messageStatusUpdate", (data) => {
      console.log("Socket: messageStatusUpdate received:", data);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.metaMessageId === data.metaMessageId
            ? { ...msg, status: data.newStatus, sentAt: data.sentAt }
            : msg
        )
      );
    });

    // Cleanup on unmount
    return () => {
      socket.off("newInboundMessage");
      socket.off("newChatMessage");
      socket.off("messageStatusUpdate");
      socket.emit("leaveRoom", user._id);
      socket.emit("leaveRoom", `project-${projectId}`);
    };
  }, [user, token, projectId, navigate, selectedConversation]); // Re-run effect if selectedConversation changes

  // Auto-scroll messages to bottom when messages array changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="md:flex md:h-[calc(100vh-120px)] bg-white rounded-lg shadow-md mt-8 overflow-hidden">
      {" "}
      {/* Left Panel: Conversation List (unchanged) */}
      <div className="md:w-1/3 w-full border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="flex-grow overflow-y-auto">
          {!first && conversations.length === 0 ? (
            <p className="p-4 text-gray-500 text-sm">
              No conversations yet. Messages from WhatsApp users will appear
              here.
            </p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`flex  p-3 cursor-pointer border-b  border-gray-200 hover:bg-gray-100 transition duration-150 ${
                  selectedConversation?._id === conv._id
                    ? "bg-gray-100 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => {
                  handleConversationSelect(conv);
                  setFirst(true);
                }}
              >
                <div className="flex-grow">
                  <div className="flex w-[100%] gap-[30px] items-center ">
                    <div className="w-[10%]">
                      <Avatar
                        src="https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVufGVufDB8fDB8fHww"
                        alt="profile picture"
                        size="md"
                      ></Avatar>
                    </div>
                    <div className="flex w-[90%] justify-between ">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {conv.contactId?.profileName ||
                            conv.contactId?.name ||
                            conv.contactId?.mobileNumber ||
                            "Unknown Contact"}
                        </h4>
                        <div className="text-sm ">
                          <p className="text-sm text-gray-600  truncate">
                            {conv.latestMessageType === "text"
                              ? truncate(conv.latestMessage, 10)
                              : `[${conv.latestMessageType} message]`}
                          </p>
                        </div>
                      </div>
                      <div>
                        <div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(conv.lastActivityAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 truncate">
                    {conv.latestMessageType === "text"
                      ? `${conv.latestMessage?.slice(0, 5)}...`
                      : `[${conv.latestMessageType} message]`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(conv.lastActivityAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Right Panel: Chat Window */}
      <div className="md:w-2/3 md:flex hidden w-[100vw] flex flex-col bg-white">
        {selectedConversation ? (
          <>
            <div className="p-4 flex gap-5 border-b border-gray-200 bg-gray-50">
              <Avatar
                src="https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVufGVufDB8fDB8fHww"
                alt="profile picture"
                size="md"
              ></Avatar>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Chat with{" "}
                  {selectedConversation.contactId?.profileName ||
                    selectedConversation.contactId?.name ||
                    selectedConversation.contactId?.mobileNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  Mobile: {selectedConversation.contactId?.countryCode}
                  {selectedConversation.contactId?.mobileNumber}
                </p>
              </div>
            </div>
            <div className="flex-grow p-4 overflow-y-scroll space-y-4 bg-[url('https://i.pinimg.com/736x/0b/f2/80/0bf280388937448d38392b76c15bd441.jpg')]">
              {" "}
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">
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
                      className={`max-w-xs p-3 rounded-lg shadow-sm ${
                        msg.direction === "outbound"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-800"
                      }`}
                    >
                      {msg.type === "text" && <p>{msg.message.body}</p>}
                      {/* Render other message types if needed */}
                      {msg.type === "template" && (
                        <p className="font-semibold">
                          Template: {msg.message.name}
                        </p>
                      )}
                      {(msg.type === "image" || msg.type === "document") && (
                        <div>
                          <p className="font-semibold">
                            {msg.type.toUpperCase()}
                          </p>
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
                            <p className="text-xs">Meta ID: {msg.message.id}</p>
                          )}
                          {msg.message.caption && (
                            <p className="text-sm italic">
                              {msg.message.caption}
                            </p>
                          )}
                        </div>
                      )}
                      {/* Fallback for unhandled message types */}
                      {!["text", "template", "image", "document"].includes(
                        msg.type
                      ) && (
                        <p className="italic text-sm">
                          [Unsupported Message Type: {msg.type}]
                        </p>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          msg.direction === "outbound"
                            ? "text-blue-100"
                            : "text-gray-600"
                        }`}
                      >
                        {new Date(msg.sentAt).toLocaleTimeString()}
                        {msg.direction === "outbound" && (
                          <span className="ml-2">
                            {msg.status === "sent" && "✓"}
                            {msg.status === "delivered" && "✓✓"}
                            {msg.status === "read" && "✓✓ (Read)"}
                            {msg.status === "failed" && "✗ (Failed)"}
                            {msg.status === "pending" && "..."}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}{" "}
              <div ref={messagesEndRef} /> {/* For auto-scrolling */}
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-gray-50"
            >
              {/* Message Type Selector */}
              <div className="flex flex-wrap gap-2 mb-3">
                {["text", "template", "image", "video", "audio"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-3 py-1 text-sm rounded ${
                      messageType === type
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => {
                      setMessageType(type);
                      if (["video", "audio"].includes(type)) {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}

                {/* Image Upload (Direct input) */}
                {messageType === "image" && (
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="text-sm px-3 py-1 bg-white border rounded cursor-pointer"
                  />
                )}

                {/* Hidden File Upload (For video/audio triggered programmatically) */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept={
                    messageType === "video"
                      ? "video/*"
                      : messageType === "audio"
                      ? "audio/*"
                      : "*"
                  }
                  className="hidden"
                />
              </div>

              {/* Template Dropdown */}
              {messageType === "template" && (
                <div className="mb-2">
                  <select
                    className="w-full p-2 border rounded"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    disabled={isSending}
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

              {/* Media Preview (If any) */}
              {/* {renderMediaPreview()} */}

              {/* Message Input + Send */}
              <div className="flex items-center space-x-3 mt-2">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    messageType === "text"
                      ? "Type a message..."
                      : messageType === "template"
                      ? "Add template parameters..."
                      : "Add a caption (optional)..."
                  }
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  disabled={isSending}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                  disabled={isSending}
                >
                  {isSending ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
      <div className="md:w-2/3 md:hidden fixed top-0 left-0 overflow-scroll w-[100vw] flex flex-col bg-white">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800">
                Chat with{" "}
                {selectedConversation.contactId?.profileName ||
                  selectedConversation.contactId?.name ||
                  selectedConversation.contactId?.mobileNumber}
              </h3>
              <p className="text-sm text-gray-600">
                Mobile: {selectedConversation.contactId?.countryCode}
                {selectedConversation.contactId?.mobileNumber}
              </p>
            </div>
            <div className="flex-grow p-4 h-screen pb-[160px]  overflow-y-auto space-y-4 bg-gray-100">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div>
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden absolute top-[75px] left-4 z-50 bg-white p-2 rounded-full  transition"
                        aria-label="Go back"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <div
                        key={msg._id}
                        className={`flex ${
                          msg.direction === "outbound"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg shadow-sm ${
                            msg.direction === "outbound"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-800"
                          }`}
                        >
                          {msg.type === "text" && <p>{msg.message.body}</p>}
                          {/* Render other message types if needed */}
                          {msg.type === "template" && (
                            <p className="font-semibold">
                              Template: {msg.message.name}
                            </p>
                          )}
                          {(msg.type === "image" ||
                            msg.type === "document") && (
                            <div>
                              <p className="font-semibold">
                                {msg.type.toUpperCase()}
                              </p>
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
                                <p className="text-xs">
                                  Meta ID: {msg.message.id}
                                </p>
                              )}
                              {msg.message.caption && (
                                <p className="text-sm italic">
                                  {msg.message.caption}
                                </p>
                              )}
                            </div>
                          )}
                          {/* Fallback for unhandled message types */}
                          {!["text", "template", "image", "document"].includes(
                            msg.type
                          ) && (
                            <p className="italic text-sm">
                              [Unsupported Message Type: {msg.type}]
                            </p>
                          )}
                          <p
                            className={`text-xs mt-1 ${
                              msg.direction === "outbound"
                                ? "text-blue-100"
                                : "text-gray-600"
                            }`}
                          >
                            {new Date(msg.sentAt).toLocaleTimeString()}
                            {msg.direction === "outbound" && (
                              <span className="ml-2">
                                {msg.status === "sent" && "✓"}
                                {msg.status === "delivered" && "✓✓"}
                                {msg.status === "read" && "✓✓ (Read)"}
                                {msg.status === "failed" && "✗ (Failed)"}
                                {msg.status === "pending" && "..."}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div ref={messagesEndRef} /> {/* For auto-scrolling */}
            </div>
<form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50 flex items-center space-x-3">
                            <input
                                type="text"
                                className="flex-grow border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Type a message..."
                                value={newMessageText}
                                onChange={(e) => setNewMessageText(e.target.value)}
                                disabled={isSending}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    // <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    // </svg>
                               <IoMdSend size={18} />
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-500">
                        Select a conversation to start chatting.
                    </div>
                )}
            </div>
            <div className="md:w-2/3 md:hidden fixed top-0 left-0 overflow-scroll w-[100vw] flex flex-col bg-white">
 
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Chat with {selectedConversation.contactId?.profileName || selectedConversation.contactId?.name || selectedConversation.contactId?.mobileNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Mobile: {selectedConversation.contactId?.countryCode}{selectedConversation.contactId?.mobileNumber}
                            </p>
                        </div>
                        <div className="flex-grow p-4 h-screen pb-[160px]  overflow-y-auto space-y-4 bg-[url('https://i.pinimg.com/736x/0b/f2/80/0bf280388937448d38392b76c15bd441.jpg')]">
                            {messages.length === 0 ? (
                                <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
                            ) : (
                                <>
<div className='bg-white absolute top-[60px] w-full left-0 '>
    <div className='flex justify-between  items-center'>
 
 
 
          <div className="p-4 flex w-full gap-5 border-b border-gray-200 bg-gray-50">
                             <Avatar src="https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVufGVufDB8fDB8fHww" alt='profile picture' size='md'>
 
                                    </Avatar>
              <div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                Chat with {selectedConversation.contactId?.profileName || selectedConversation.contactId?.name || selectedConversation.contactId?.mobileNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Mobile: {selectedConversation.contactId?.countryCode}{selectedConversation.contactId?.mobileNumber}
                            </p>
              </div>
                        </div>
                         <button
                                                    onClick={() => setSelectedConversation(null)}
                                                    className="md:hidden   left-4 z-50 bg-white p-2 rounded-full  transition"
                                                    aria-label="Go back"
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
 
    </div>
 
                                                
</div>
                                    {
 
 
                                        messages.map(msg => (
                                            <div>
                                              {/* <div className='bg-red-500 border  z-[100]  w-full top-0 left-0 p-4'> */}
                                                 
                                              {/* </div> */}
                                   
                                                <div
                                                    key={msg._id}
                                                    className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                                                >
 
                                                    <div
                                                        className={`max-w-xs p-3 rounded-lg shadow-sm ${msg.direction === 'outbound'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-300 text-gray-800'
                                                            }`}
                                                    >
                                                        {msg.type === 'text' && <p>{msg.message.body}</p>}
                                                        {/* Render other message types if needed */}
                                                        {msg.type === 'template' && (
                                                            <p className="font-semibold">Template: {msg.message.name}</p>
                                                        )}
                                                        {(msg.type === 'image' || msg.type === 'document') && (
                                                            <div>
                                                                <p className="font-semibold">{msg.type.toUpperCase()}</p>
                                                                {msg.message.link && <a href={msg.message.link} target="_blank" rel="noopener noreferrer" className="text-blue-200 underline break-all">{msg.message.link.substring(0, 30)}...</a>}
                                                                {msg.message.id && <p className="text-xs">Meta ID: {msg.message.id}</p>}
                                                                {msg.message.caption && <p className="text-sm italic">{msg.message.caption}</p>}
                                                            </div>
                                                        )}
                                                        {/* Fallback for unhandled message types */}
                                                        {!['text', 'template', 'image', 'document'].includes(msg.type) && (
                                                            <p className="italic text-sm">[Unsupported Message Type: {msg.type}]</p>
                                                        )}
                                                        <p className={`text-xs mt-1 ${msg.direction === 'outbound' ? 'text-blue-100' : 'text-gray-600'}`}>
                                                            {new Date(msg.sentAt).toLocaleTimeString()}
                                                            {msg.direction === 'outbound' && (
                                                                <span className="ml-2">
                                                                    {msg.status === 'sent' && '✓'}
                                                                    {msg.status === 'delivered' && '✓✓'}
                                                                    {msg.status === 'read' && '✓✓ (Read)'}
                                                                    {msg.status === 'failed' && '✗ (Failed)'}
                                                                    {msg.status === 'pending' && '...'}
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </>
 
                            )}
                            <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t fixed bottom-0 z-[9999] w-full border-gray-200 bg-gray-50 flex items-center space-x-3">
                            <input
                                type="text"
                                className="flex-grow border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Type a message..."
                                value={newMessageText}
                                onChange={(e) => setNewMessageText(e.target.value)}
                                disabled={isSending}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                                disabled={isSending}
                            >
                                {isSending ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
                            </button>
                        </form>
 
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatPage;
