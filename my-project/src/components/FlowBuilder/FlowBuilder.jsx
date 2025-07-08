// client/src/components/FlowBuilder/FlowBuilder.js
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css'; // Default reactflow styles
import { useParams, useNavigate } from 'react-router-dom';
import {
  createFlowApi,
  getFlowByIdApi,
  updateFlowApi,
  deleteFlowApi
} from '../../apis/FlowApi';
import { uploadMedaiData, getAllTemplates } from '../../apis/TemplateApi';
import {
  MessageSquare, Play, Send, List, GitBranch, Save, Trash2, PlusCircle, PenTool, XCircle,
  Image, FileText, Video, MessageCircleMore, Code, Handshake, CornerUpLeft, AlertTriangle, Type
} from 'lucide-react';

// --- Custom Node Types ---

// Base styling for all custom nodes
const baseNodeStyle = "text-white p-3 rounded-lg shadow-md border-2 flex flex-col items-center justify-center min-w-[150px] min-h-[80px]";
const handleStyle = "absolute w-4 h-4 rounded-full border-2 border-white";

// Start Node
const StartNode = ({ data }) => (
  <div className={`${baseNodeStyle} bg-green-500 border-green-700 min-w-[120px] min-h-[60px]`}>
    <Play className="w-5 h-5 mr-2" />
    <div className="text-sm font-semibold">{data.label}</div>
    <div className={`${handleStyle} bg-green-700 -right-2 top-1/2 -translate-y-1/2`} data-handleid="a" data-nodetype="source" data-position="right" />
  </div>
);

// Send Text Message Node
const SendTextNode = ({ data }) => (
  <div className={`${baseNodeStyle} bg-blue-500 border-blue-700`}>
    <Type className="w-5 h-5 mb-1" />
    <div className="text-sm font-semibold mb-1">{data.label}</div>
    <div className="text-xs text-center opacity-80 line-clamp-2">{data.messageContent || 'No text set'}</div>
    <div className={`${handleStyle} bg-blue-700 -right-2 top-1/2 -translate-y-1/2`} data-handleid="a" data-nodetype="source" data-position="right" />
    <div className={`${handleStyle} bg-blue-700 -left-2 top-1/2 -translate-y-1/2`} data-handleid="b" data-nodetype="target" data-position="left" />
  </div>
);

// Send Media Node (Image, Document, Video)
const SendMediaNode = ({ data }) => {
  let bgColor, borderColor, Icon;
  switch (data.mediaType) {
    case 'image': bgColor = 'bg-indigo-500'; borderColor = 'border-indigo-700'; Icon = Image; break;
    case 'document': bgColor = 'bg-yellow-500'; borderColor = 'border-yellow-700'; Icon = FileText; break;
    case 'video': bgColor = 'bg-red-500'; borderColor = 'border-red-700'; Icon = Video; break;
    default: bgColor = 'bg-gray-500'; borderColor = 'border-gray-700'; Icon = Send;
  }
  return (
    <div className={`${baseNodeStyle} ${bgColor} ${borderColor}`}>
      {Icon && <Icon className="w-5 h-5 mb-1" />}
      <div className="text-sm font-semibold mb-1">{data.label}</div>
      <div className="text-xs text-center opacity-80 line-clamp-2">
        {data.mediaHandle ? `Media: ${data.fileName || data.mediaHandle.substring(0, 10)}...` : 'No media'}
      </div>
      <div className={`${handleStyle} ${bgColor.replace('500', '700')} -right-2 top-1/2 -translate-y-1/2`} data-handleid="a" data-nodetype="source" data-position="right" />
      <div className={`${handleStyle} ${bgColor.replace('500', '700')} -left-2 top-1/2 -translate-y-1/2`} data-handleid="b" data-nodetype="target" data-position="left" />
    </div>
  );
};

// Send Template Node
const SendTemplateNode = ({ data }) => (
  <div className={`${baseNodeStyle} bg-purple-500 border-purple-700`}>
    <Code className="w-5 h-5 mb-1" />
    <div className="text-sm font-semibold mb-1">{data.label}</div>
    <div className="text-xs text-center opacity-80 line-clamp-2">
      {data.templateName ? `Template: ${data.templateName}` : 'No template selected'}
    </div>
    <div className={`${handleStyle} bg-purple-700 -right-2 top-1/2 -translate-y-1/2`} data-handleid="a" data-nodetype="source" data-position="right" />
    <div className={`${handleStyle} bg-purple-700 -left-2 top-1/2 -translate-y-1/2`} data-handleid="b" data-nodetype="target" data-position="left" />
  </div>
);

// Send Buttons Node (Interactive)
const SendButtonsNode = ({ data }) => (
  <div className={`${baseNodeStyle} bg-orange-500 border-orange-700 min-w-[160px] min-h-[90px]`}>
    <MessageCircleMore className="w-5 h-5 mb-1" />
    <div className="text-sm font-semibold mb-1">{data.label}</div>
    <div className="text-xs text-center opacity-80 line-clamp-1">{data.messageContent || 'No text'}</div>
    <div className="text-xs text-center opacity-80">
      {data.buttons?.length > 0 ? `${data.buttons.length} buttons` : 'No buttons'}
    </div>
    <div className={`${handleStyle} bg-orange-700 -left-2 top-1/2 -translate-y-1/2`} data-handleid="a" data-nodetype="target" data-position="left" />
    {/* Dynamic Source Handles for each button */}
    {data.buttons && data.buttons.map((btn, index) => (
      <div
        key={btn.id} // Use button ID for handle ID
        className={`${handleStyle} bg-orange-700 -right-2`}
        style={{ top: `${20 + index * (60 / data.buttons.length)}%` }}
        data-handleid={btn.id} // Handle ID matches button ID
        data-nodetype="source"
        data-position="right"
      />
    ))}
  </div>
);

// Collect Input Node (e.g., for contact form)
const CollectInputNode = ({ data }) => (
  <div className={`${baseNodeStyle} bg-teal-500 border-teal-700`}>
    <PenTool className="w-5 h-5 mb-1" />
    <div className="text-sm font-semibold mb-1">{data.label}</div>
    <div className="text-xs text-center opacity-80">
      {data.fields?.length > 0 ? `${data.fields.length} fields` : 'No fields'}
    </div>
    <div className={`${handleStyle} bg-teal-700 -right-2 top-1/2 -translate-y-1/2`} data-handleid="a" data-nodetype="source" data-position="right" />
    <div className={`${handleStyle} bg-teal-700 -left-2 top-1/2 -translate-y-1/2`} data-handleid="b" data-nodetype="target" data-position="left" />
  </div>
);

// Action Node (e.g., Live Chat Handoff, Back to Main Menu)
const ActionNode = ({ data }) => (
  <div className={`${baseNodeStyle} bg-gray-700 border-gray-900`}>
    {data.actionType === 'handoff_to_agent' && <Handshake className="w-5 h-5 mb-1" />}
    {data.actionType === 'return_to_main_menu' && <CornerUpLeft className="w-5 h-5 mb-1" />}
    <div className="text-sm font-semibold mb-1">{data.label}</div>
    <div className="text-xs text-center opacity-80">
      {data.actionType === 'handoff_to_agent' ? 'Handoff to Agent' : 'Return to Main'}
    </div>
    {/* This node can have multiple target handles if it's triggered by multiple paths */}
    <div className={`${handleStyle} bg-gray-900 -left-2 top-1/2 -translate-y-1/2`} data-handleid="a" data-nodetype="target" data-position="left" />
    {/* No source handles if it's an end action, or one if it leads to somewhere else */}
  </div>
);

// Conditional Node (Branching)
const ConditionalNode = ({ data }) => (
  <div className={`${baseNodeStyle} bg-pink-500 border-pink-700 min-w-[140px] min-h-[70px]`}>
    <GitBranch className="w-5 h-5 mb-1" />
    <div className="text-sm font-semibold mb-1">{data.label}</div>
    <div className="text-xs text-center opacity-80">{data.condition || 'No condition'}</div>
    <div className={`${handleStyle} bg-pink-700 -left-2 top-1/2 -translate-y-1/2`} data-handleid="a" data-nodetype="target" data-position="left" />
    <div className={`${handleStyle} bg-pink-700 -right-2 top-1/4 -translate-y-1/2`} data-handleid="true" data-nodetype="source" data-position="right" />
    <div className={`${handleStyle} bg-pink-700 -right-2 bottom-1/4 -translate-y-1/2`} data-handleid="false" data-nodetype="source" data-position="right" />
  </div>
);

// Fallback Node (Error Response)
const FallbackNode = ({ data }) => (
  <div className={`${baseNodeStyle} bg-red-600 border-red-800`}>
    <AlertTriangle className="w-5 h-5 mb-1" />
    <div className="text-sm font-semibold mb-1">{data.label}</div>
    <div className="text-xs text-center opacity-80 line-clamp-2">{data.messageContent || 'Default error message'}</div>
    <div className={`${handleStyle} bg-red-800 -left-2 top-1/2 -translate-y-1/2`} data-handleid="a" data-nodetype="target" data-position="left" />
    {/* Fallback might not have an output if it just ends the conversation or loops */}
  </div>
);


const nodeTypes = {
  startNode: StartNode,
  sendTextNode: SendTextNode,
  sendMediaNode: SendMediaNode,
  sendTemplateNode: SendTemplateNode,
  sendButtonsNode: SendButtonsNode,
  collectInputNode: CollectInputNode,
  actionNode: ActionNode,
  conditionalNode: ConditionalNode,
  fallbackNode: FallbackNode,
};

const initialNodes = [
  {
    id: 'start-1',
    type: 'startNode',
    position: { x: 50, y: 100 },
    data: { label: 'On Message Received' },
  },
];

const initialEdges = [];

const FlowBuilder = () => {
  const { projectId, flowId: urlFlowId } = useParams();
  const navigate = useNavigate();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [flowName, setFlowName] = useState('');
  const [triggerKeyword, setTriggerKeyword] = useState('');
  const [flowStatus, setFlowStatus] = useState('draft');
  const [currentFlowId, setCurrentFlowId] = useState(urlFlowId || null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [businessProfileId, setBusinessProfileId] = useState(null);
  const [availableTemplates, setAvailableTemplates] = useState([]);

  // Fetch businessProfileId from localStorage (assuming it's stored with current project)
  useEffect(() => {
    const project = localStorage.getItem("currentProject")
      ? JSON.parse(localStorage.getItem("currentProject"))
      : null;
    if (project?.businessProfileId?._id) {
      setBusinessProfileId(project.businessProfileId._id);
    }
  }, []);

  // Fetch templates when businessProfileId is available
  useEffect(() => {
    const fetchTemplates = async () => {
      if (businessProfileId) {
        try {
          const response = await getAllTemplates();
          if (response.success) {
            setAvailableTemplates(response.data.filter(t => t.metaStatus === 'APPROVED'));
          } else {
            console.error("Failed to fetch templates:", response.message);
          }
        } catch (err) {
          console.error("Error fetching templates:", err);
        }
      }
    };
    fetchTemplates();
  }, [businessProfileId]);


  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)), [setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY - 50,
      });

      const newNode = {
        id: `${type}-${Date.now()}`, // Use timestamp for more unique IDs
        type,
        position,
        data: { label: label || type.replace(/([A-Z])/g, ' $1').trim() },
      };

      // Set initial data for new nodes based on type
      if (type === 'sendTextNode') {
        newNode.data.messageContent = '';
      } else if (type === 'sendMediaNode') {
        newNode.data.mediaType = 'image'; // Default to image
        newNode.data.mediaHandle = '';
        newNode.data.caption = '';
        newNode.data.fileName = '';
      } else if (type === 'sendTemplateNode') {
        newNode.data.templateId = '';
        newNode.data.templateName = '';
        newNode.data.templateLanguage = '';
        newNode.data.templateComponents = [];
        newNode.data.templateParameters = [];
      } else if (type === 'sendButtonsNode') {
        newNode.data.messageContent = '';
        newNode.data.buttons = [{ id: 'button_1', text: 'Option 1', type: 'quick_reply', value: '' }]; // Default button
      } else if (type === 'collectInputNode') {
        newNode.data.messageContent = 'Please provide the following information:';
        newNode.data.fields = [{ id: 'field_1', prompt: 'Enter your name:', type: 'text' }];
        newNode.data.confirmationMessage = 'Thank you for your input!';
      } else if (type === 'actionNode') {
        newNode.data.actionType = 'handoff_to_agent'; // Default action
        newNode.data.messageContent = ''; // Optional message for action
      } else if (type === 'conditionalNode') {
        newNode.data.condition = '';
      } else if (type === 'fallbackNode') {
        newNode.data.messageContent = 'Sorry, I didn\'t understand that. Please try again.';
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, setNodes],
  );

  // Load flow data if flowId is present in URL
  useEffect(() => {
    const loadFlow = async () => {
      if (urlFlowId && projectId) {
        setLoading(true);
        setError(null);
        try {
          const result = await getFlowByIdApi(projectId, urlFlowId);
          if (result.success) {
            setFlowName(result.data.name);
            setTriggerKeyword(result.data.triggerKeyword || '');
            setFlowStatus(result.data.status || 'draft');
            setNodes(result.data.nodes);
            setEdges(result.data.edges);
            setCurrentFlowId(result.data._id);
            setSuccessMessage("Flow loaded successfully!");
          } else {
            setError(result.message || "Failed to load flow.");
          }
        } catch (err) {
          setError(err.message || "Failed to load flow.");
        } finally {
          setLoading(false);
        }
      } else {
        setFlowName('');
        setTriggerKeyword('');
        setFlowStatus('draft');
        setNodes(initialNodes);
        setEdges(initialEdges);
        setCurrentFlowId(null);
      }
    };
    loadFlow();
  }, [urlFlowId, projectId, setNodes, setEdges]);


  // Handle saving the flow
  const handleSaveFlow = async () => {

    // if (!flowName.trim()) {
    //   setError("Flow name is required.");
    //   return;
    // }
    // if (!projectId) {
    //     setError("Project ID is missing. Cannot save flow.");
    //     return;
    // }

    // setLoading(true);
    // setError(null);
    // setSuccessMessage(null);

    const flowData = {
      name: flowName.trim(),
      triggerKeyword: triggerKeyword.trim() || undefined,
      description: '',
      nodes,
      edges,
      status: flowStatus,
    };
        console.log("flowData", flowData);

    try {
      let result;
      if (currentFlowId) {
        result = await updateFlowApi(projectId, currentFlowId, flowData);
      } else {
        result = await createFlowApi(projectId, flowData);
        if (result.success) {
          setCurrentFlowId(result.data._id);
          navigate(`/projects/${projectId}/flow-builder/${result.data._id}`);
        }
      }

      if (result.success) {
        setSuccessMessage(result.message || "Flow saved successfully!");
      } else {
        setError(result.message || "Failed to save flow.");
      }
    } catch (err) {
      setError(err.message || "Failed to save flow.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting the flow
  const handleDeleteFlow = async () => {
    if (!currentFlowId || !projectId) {
      setError("No flow selected to delete or Project ID is missing.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this flow? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await deleteFlowApi(projectId, currentFlowId);
      if (result.success) {
        setSuccessMessage(result.message || "Flow deleted successfully!");
        setFlowName('');
        setTriggerKeyword('');
        setFlowStatus('draft');
        setNodes(initialNodes);
        setEdges(initialEdges);
        setCurrentFlowId(null);
        navigate(`/projects/${projectId}/flow-builder`);
      } else {
        setError(result.message || "Failed to delete flow.");
      }
    } catch (err) {
      setError(err.message || "Failed to delete flow.");
    } finally {
      setLoading(false);
    }
  };


  // Handle updating node data from sidebar
  const handleNodeDataChange = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
    setSelectedNode((prev) => (prev && prev.id === nodeId ? { ...prev, data: { ...prev.data, ...newData } } : prev));
  };

  // Handle media file upload for SendMediaNode
  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!businessProfileId || !projectId) {
      alert("Please ensure a project and business profile are selected before uploading media.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const uploadResponse = await uploadMedaiData(file, businessProfileId, projectId);
      if (uploadResponse.success) {
        handleNodeDataChange(selectedNode.id, {
          mediaHandle: uploadResponse.id, // 'id' from uploadMedaiData is the 'h' value
          caption: selectedNode.data.caption || '',
          fileName: file.name,
        });
        setSuccessMessage("Media uploaded successfully!");
      } else {
        setError(uploadResponse.message || "Media upload failed.");
      }
    } catch (err) {
      setError(err.message || "Error during media upload.");
    } finally {
      setLoading(false);
    }
  };

  // Handle template selection for SendTemplateNode
  const handleTemplateSelection = (e) => {
    const selectedTemplateId = e.target.value;
    const template = availableTemplates.find(t => t._id === selectedTemplateId);

    if (template) {
      // Initialize parameters based on template components
      const newTemplateParameters = [];
      template.components.forEach(comp => {
        if (comp.type === 'BODY' && comp.variables) {
          comp.variables.forEach(varNum => {
            newTemplateParameters.push({ type: 'body', index: varNum, text: '' });
          });
        }
        // Add more logic here for HEADER_TEXT variables, URL buttons, etc.
        // For now, focusing on body parameters as per your example structure
      });

      handleNodeDataChange(selectedNode.id, {
        templateId: template._id,
        templateName: template.name,
        templateLanguage: template.language,
        templateComponents: template.components, // Store full components for reference
        templateParameters: newTemplateParameters,
      });
    } else {
      handleNodeDataChange(selectedNode.id, {
        templateId: '',
        templateName: '',
        templateLanguage: '',
        templateComponents: [],
        templateParameters: [],
      });
    }
  };

  // Handle template parameter changes
  const handleTemplateParameterChange = (index, value) => {
    const newParameters = [...selectedNode.data.templateParameters];
    const paramToUpdate = newParameters.find(p => p.index === index && p.type === 'body');
    if (paramToUpdate) {
      paramToUpdate.text = value;
      handleNodeDataChange(selectedNode.id, { templateParameters: newParameters });
    }
  };

  // Handle adding a new button to SendButtonsNode
  const handleAddButton = () => {
    const newButtonId = `button_${Date.now()}`; // Unique ID for the button
    const newButtons = [...(selectedNode.data.buttons || []), { id: newButtonId, text: 'New Button', type: 'quick_reply', value: '' }];
    handleNodeDataChange(selectedNode.id, { buttons: newButtons });
  };

  // Handle updating a button in SendButtonsNode
  const handleButtonChange = (index, field, value) => {
    const newButtons = [...selectedNode.data.buttons];
    newButtons[index][field] = value;
    handleNodeDataChange(selectedNode.id, { buttons: newButtons });
  };

  // Handle removing a button from SendButtonsNode
  const handleRemoveButton = (indexToRemove) => {
    const newButtons = selectedNode.data.buttons.filter((_, index) => index !== indexToRemove);
    handleNodeDataChange(selectedNode.id, { buttons: newButtons });
  };

  // Handle adding a new field to CollectInputNode
  const handleAddField = () => {
    const newFieldId = `field_${Date.now()}`;
    const newFields = [...(selectedNode.data.fields || []), { id: newFieldId, prompt: 'New Field:', type: 'text' }];
    handleNodeDataChange(selectedNode.id, { fields: newFields });
  };

  // Handle updating a field in CollectInputNode
  const handleFieldChange = (index, field, value) => {
    const newFields = [...selectedNode.data.fields];
    newFields[index][field] = value;
    handleNodeDataChange(selectedNode.id, { fields: newFields });
  };

  // Handle removing a field from CollectInputNode
  const handleRemoveField = (indexToRemove) => {
    const newFields = selectedNode.data.fields.filter((_, index) => index !== indexToRemove);
    handleNodeDataChange(selectedNode.id, { fields: newFields });
  };


  return (
    <div className="flex h-screen bg-gray-100 font-inter">
      {/* Sidebar for Node Types */}
      <div className="w-64 bg-white p-4 shadow-lg flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Flow Elements</h2>
        <div className="space-y-4">
          <div
            className="flex items-center p-3 rounded-lg bg-green-100 text-green-800 cursor-grab shadow hover:shadow-md transition-shadow"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'startNode');
              event.dataTransfer.setData('application/reactflow-label', 'Start');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <Play className="w-5 h-5 mr-2" /> Start
          </div>
          <div
            className="flex items-center p-3 rounded-lg bg-blue-100 text-blue-800 cursor-grab shadow hover:shadow-md transition-shadow"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'sendTextNode');
              event.dataTransfer.setData('application/reactflow-label', 'Send Text');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <Type className="w-5 h-5 mr-2" /> Send Text
          </div>
          <div
            className="flex items-center p-3 rounded-lg bg-indigo-100 text-indigo-800 cursor-grab shadow hover:shadow-md transition-shadow"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'sendMediaNode');
              event.dataTransfer.setData('application/reactflow-label', 'Send Media');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <Image className="w-5 h-5 mr-2" /> Send Media
          </div>
          <div
            className="flex items-center p-3 rounded-lg bg-purple-100 text-purple-800 cursor-grab shadow hover:shadow-md transition-shadow"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'sendTemplateNode');
              event.dataTransfer.setData('application/reactflow-label', 'Send Template');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <Code className="w-5 h-5 mr-2" /> Send Template
          </div>
          <div
            className="flex items-center p-3 rounded-lg bg-orange-100 text-orange-800 cursor-grab shadow hover:shadow-md transition-shadow"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'sendButtonsNode');
              event.dataTransfer.setData('application/reactflow-label', 'Send Buttons');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <MessageCircleMore className="w-5 h-5 mr-2" /> Send Buttons
          </div>
          <div
            className="flex items-center p-3 rounded-lg bg-teal-100 text-teal-800 cursor-grab shadow hover:shadow-md transition-shadow"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'collectInputNode');
              event.dataTransfer.setData('application/reactflow-label', 'Collect Input');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <PenTool className="w-5 h-5 mr-2" /> Collect Input
          </div>
          <div
            className="flex items-center p-3 rounded-lg bg-pink-100 text-pink-800 cursor-grab shadow hover:shadow-md transition-shadow"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'conditionalNode');
              event.dataTransfer.setData('application/reactflow-label', 'Conditional');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <GitBranch className="w-5 h-5 mr-2" /> Conditional
          </div>
          <div
            className="flex items-center p-3 rounded-lg bg-gray-200 text-gray-800 cursor-grab shadow hover:shadow-md transition-shadow"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'actionNode');
              event.dataTransfer.setData('application/reactflow-label', 'Action');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <Handshake className="w-5 h-5 mr-2" /> Action (Handoff/Back)
          </div>
          <div
            className="flex items-center p-3 rounded-lg bg-red-100 text-red-800 cursor-grab shadow hover:shadow-md transition-shadow"
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'fallbackNode');
              event.dataTransfer.setData('application/reactflow-label', 'Fallback');
              event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
          >
            <AlertTriangle className="w-5 h-5 mr-2" /> Fallback
          </div>
        </div>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>

        {/* Top Bar for Flow Name, Trigger, Save/Delete */}
        <div className="absolute top-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-4 z-10">
          <div className="flex-1 flex items-center space-x-3">
            <label htmlFor="flowName" className="text-gray-700 font-medium">Flow Name:</label>
            <input
              id="flowName"
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="e.g., Welcome Message Flow"
              className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex-1 flex items-center space-x-3">
            <label htmlFor="triggerKeyword" className="text-gray-700 font-medium">Trigger Keyword:</label>
            <input
              id="triggerKeyword"
              type="text"
              value={triggerKeyword}
              onChange={(e) => setTriggerKeyword(e.target.value)}
              placeholder="e.g., hi, support"
              className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex-1 flex items-center space-x-3">
            <label htmlFor="flowStatus" className="text-gray-700 font-medium">Status:</label>
            <select
              id="flowStatus"
              value={flowStatus}
              onChange={(e) => setFlowStatus(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <button
            onClick={handleSaveFlow}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            disabled={loading}
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Flow'}</span>
          </button>
          {currentFlowId && (
            <button
              onClick={handleDeleteFlow}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              disabled={loading}
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Flow</span>
            </button>
          )}
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-20">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-20">
            {error}
          </div>
        )}
      </div>

      {/* Node Configuration Sidebar */}
      {selectedNode && (
        <div className="w-80 bg-white p-4 shadow-lg flex flex-col border-l border-gray-200 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Configure Node</h2>
            <button onClick={() => setSelectedNode(null)} className="text-gray-500 hover:text-gray-700">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="nodeLabel" className="block text-sm font-medium text-gray-700">Node Label:</label>
            <input
              id="nodeLabel"
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => handleNodeDataChange(selectedNode.id, { label: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Configuration for SendTextNode */}
          {selectedNode.type === 'sendTextNode' && (
            <div className="mb-4">
              <label htmlFor="messageContent" className="block text-sm font-medium text-gray-700">Message Text:</label>
              <textarea
                id="messageContent"
                value={selectedNode.data.messageContent || ''}
                onChange={(e) => handleNodeDataChange(selectedNode.id, { messageContent: e.target.value })}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter message text..."
              ></textarea>
            </div>
          )}

          {/* Configuration for SendMediaNode */}
          {selectedNode.type === 'sendMediaNode' && (
            <div className="space-y-4">
              <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700">Media Type:</label>
              <select
                id="mediaType"
                value={selectedNode.data.mediaType || 'image'}
                onChange={(e) => handleNodeDataChange(selectedNode.id, { mediaType: e.target.value, mediaHandle: '', fileName: '' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="image">Image</option>
                <option value="document">Document</option>
                <option value="video">Video</option>
              </select>
              <div className="mb-4 space-y-2">
                <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-700">Upload Media ({selectedNode.data.mediaType}):</label>
                <input
                  id="mediaFile"
                  type="file"
                  accept={
                    selectedNode.data.mediaType === 'image' ? 'image/*' :
                    selectedNode.data.mediaType === 'video' ? 'video/*' :
                    '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
                  }
                  onChange={handleMediaUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {selectedNode.data.mediaHandle && (
                  <p className="text-sm text-green-600">
                    Uploaded: {selectedNode.data.fileName || 'Media file'} (ID: {selectedNode.data.mediaHandle.substring(0, 10)}...)
                  </p>
                )}
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption (Optional):</label>
                <textarea
                  id="caption"
                  value={selectedNode.data.caption || ''}
                  onChange={(e) => handleNodeDataChange(selectedNode.id, { caption: e.target.value })}
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter caption..."
                ></textarea>
              </div>
            </div>
          )}

          {/* Configuration for SendTemplateNode */}
          {selectedNode.type === 'sendTemplateNode' && (
            <div className="mb-4 space-y-2">
              <label htmlFor="templateSelect" className="block text-sm font-medium text-gray-700">Select Template:</label>
              <select
                id="templateSelect"
                value={selectedNode.data.templateId || ''}
                onChange={handleTemplateSelection}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Select an Approved Template --</option>
                {availableTemplates.map(template => (
                  <option key={template._id} value={template._id}>
                    {template.name} ({template.language})
                  </option>
                ))}
              </select>

              {selectedNode.data.templateId && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Template Parameters:</h4>
                  {selectedNode.data.templateParameters?.length > 0 ? (
                    selectedNode.data.templateParameters.map((param, idx) => (
                      <div key={idx} className="mb-2">
                        <label htmlFor={`param-${idx}`} className="block text-sm font-medium text-gray-600">
                          Variable {`{{${param.index}}}`} (Body):
                        </label>
                        <input
                          id={`param-${idx}`}
                          type="text"
                          value={param.text}
                          onChange={(e) => handleTemplateParameterChange(param.index, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                          placeholder={`Enter value for variable {{${param.index}}}`}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No variables found in selected template's body.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Configuration for SendButtonsNode */}
          {selectedNode.type === 'sendButtonsNode' && (
            <div className="space-y-4">
              <label htmlFor="interactiveMessageContent" className="block text-sm font-medium text-gray-700">Message Text (Optional, above buttons):</label>
              <textarea
                id="interactiveMessageContent"
                value={selectedNode.data.messageContent || ''}
                onChange={(e) => handleNodeDataChange(selectedNode.id, { messageContent: e.target.value })}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter message text (optional, for interactive messages)"
              ></textarea>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">Buttons:</h3>
              {selectedNode.data.buttons?.map((button, index) => (
                <div key={button.id} className="flex flex-col space-y-2 p-3 border border-gray-200 rounded-md bg-gray-50 mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={button.text}
                      onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Button text"
                    />
                    <select
                      value={button.type || 'quick_reply'}
                      onChange={(e) => handleButtonChange(index, 'type', e.target.value)}
                      className="border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="quick_reply">Quick Reply</option>
                      <option value="url">URL</option>
                      <option value="phone_number">Phone Number</option>
                    </select>
                    <button
                      onClick={() => handleRemoveButton(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {(button.type === 'url' || button.type === 'phone_number') && (
                    <input
                      type="text"
                      value={button.value || ''}
                      onChange={(e) => handleButtonChange(index, 'value', e.target.value)}
                      className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                      placeholder={button.type === 'url' ? 'URL (e.g., https://example.com)' : 'Phone Number (e.g., +1234567890)'}
                    />
                  )}
                </div>
              ))}
              <button
                onClick={handleAddButton}
                className="w-full bg-indigo-500 text-white py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-indigo-600 transition-colors mt-2"
              >
                <PlusCircle className="w-5 h-5" /> Add Button
              </button>
            </div>
          )}

          {/* Configuration for CollectInputNode */}
          {selectedNode.type === 'collectInputNode' && (
            <div className="space-y-4">
              <label htmlFor="collectInputMessage" className="block text-sm font-medium text-gray-700">Initial Message:</label>
              <textarea
                id="collectInputMessage"
                value={selectedNode.data.messageContent || ''}
                onChange={(e) => handleNodeDataChange(selectedNode.id, { messageContent: e.target.value })}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Message to prompt user for input..."
              ></textarea>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">Input Fields:</h3>
              {selectedNode.data.fields?.map((field, index) => (
                <div key={field.id} className="flex flex-col space-y-2 p-3 border border-gray-200 rounded-md bg-gray-50 mb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={field.prompt}
                      onChange={(e) => handleFieldChange(index, 'prompt', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Field prompt (e.g., Your Name:)"
                    />
                    <select
                      value={field.type || 'text'}
                      onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                      className="border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone Number</option>
                    </select>
                    <button
                      onClick={() => handleRemoveField(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddField}
                className="w-full bg-teal-500 text-white py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-teal-600 transition-colors mt-2"
              >
                <PlusCircle className="w-5 h-5" /> Add Field
              </button>

              <label htmlFor="confirmationMessage" className="block text-sm font-medium text-gray-700">Confirmation Message:</label>
              <textarea
                id="confirmationMessage"
                value={selectedNode.data.confirmationMessage || ''}
                onChange={(e) => handleNodeDataChange(selectedNode.id, { confirmationMessage: e.target.value })}
                rows="2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Message after collecting all inputs..."
              ></textarea>
            </div>
          )}

          {/* Configuration for ConditionalNode */}
          {selectedNode.type === 'conditionalNode' && (
            <div className="mb-4">
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition (e.g., "user_input == 'yes'"):</label>
              <input
                id="condition"
                type="text"
                value={selectedNode.data.condition || ''}
                onChange={(e) => handleNodeDataChange(selectedNode.id, { condition: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., user_input == 'yes'"
              />
              <p className="text-xs text-gray-500 mt-1">
                Define the condition for branching. Output handles are 'true' and 'false'.
              </p>
            </div>
          )}

          {/* Configuration for ActionNode */}
          {selectedNode.type === 'actionNode' && (
            <div className="space-y-4">
              <label htmlFor="actionType" className="block text-sm font-medium text-gray-700">Action Type:</label>
              <select
                id="actionType"
                value={selectedNode.data.actionType || 'handoff_to_agent'}
                onChange={(e) => handleNodeDataChange(selectedNode.id, { actionType: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-gray-700 focus:border-gray-700"
              >
                <option value="handoff_to_agent">Handoff to Live Agent</option>
                <option value="return_to_main_menu">Return to Main Menu</option>
                {/* Add other actions like 'end_flow', 'trigger_webhook' etc. */}
              </select>

              <label htmlFor="actionMessage" className="block text-sm font-medium text-gray-700">Message for User (Optional):</label>
              <textarea
                id="actionMessage"
                value={selectedNode.data.messageContent || ''}
                onChange={(e) => handleNodeDataChange(selectedNode.id, { messageContent: e.target.value })}
                rows="2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-gray-700 focus:border-gray-700"
                placeholder="e.g., Connecting you to an agent..."
              ></textarea>
            </div>
          )}

          {/* Configuration for FallbackNode */}
          {selectedNode.type === 'fallbackNode' && (
            <div className="mb-4">
              <label htmlFor="fallbackMessage" className="block text-sm font-medium text-gray-700">Fallback Message:</label>
              <textarea
                id="fallbackMessage"
                value={selectedNode.data.messageContent || ''}
                onChange={(e) => handleNodeDataChange(selectedNode.id, { messageContent: e.target.value })}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Message to send when input is not understood..."
              ></textarea>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlowBuilder;