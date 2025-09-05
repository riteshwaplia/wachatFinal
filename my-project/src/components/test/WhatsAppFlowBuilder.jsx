import React, { useState, useRef, useEffect } from 'react';

const WhatsAppFlowBuilder = () => {
  const [nodes, setNodes] = useState([]);
  const [flows, setFlows] = useState([]);
  const [currentFlow, setCurrentFlow] = useState({ id: null, name: 'Untitled Flow' });
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingNode, setConnectingNode] = useState(null);
  const [connectingButton, setConnectingButton] = useState(null);
  const [connectingBranch, setConnectingBranch] = useState(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [canvasStartDrag, setCanvasStartDrag] = useState({ x: 0, y: 0 });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');

  const canvasRef = useRef();
  const svgRef = useRef();

  // Available components for drag and drop
  const components = [
    { type: 'message', label: 'Text Message', icon: '💬', color: 'blue' },
    { type: 'image', label: 'Image', icon: '🖼️', color: 'green' },
    { type: 'video', label: 'Video', icon: '🎥', color: 'purple' },
    { type: 'template', label: 'Template', icon: '📋', color: 'yellow' },
    { type: 'buttons', label: 'Interactive Buttons', icon: '🔘', color: 'pink' },
    { type: 'catalog', label: 'Product Catalog', icon: '📦', color: 'indigo' },
    { type: 'condition', label: 'Condition', icon: '⚖️', color: 'red' },
    { type: 'delay', label: 'Delay', icon: '⏱️', color: 'gray' },
    { type: 'start', label: 'Start', icon: '🚀', color: 'emerald' }
  ];

  // Initialize with a start node and load saved flows
  useEffect(() => {
    const savedFlows = JSON.parse(localStorage.getItem('whatsapp-flows') || '[]');
    setFlows(savedFlows);
    
    // Create initial flow if no flows exist
    if (savedFlows.length === 0) {
      createNewFlow();
    } else {
      // Load the first flow
      loadFlow(savedFlows[0]);
    }
  }, []);

  const createNewFlow = () => {
    const startNode = {
      id: 'start-node',
      type: 'start',
      position: { x: 100, y: 100 },
      content: 'Start of Flow',
      connections: [],
      triggerKeyword: 'hello'
    };
    setNodes([startNode]);
    setCurrentFlow({ id: Date.now().toString(), name: 'New Flow' });
    setSelectedNode(null);
  };

  const saveFlow = (flowName = null) => {
    const name = flowName || currentFlow.name;
    const flowData = {
      id: currentFlow.id || Date.now().toString(),
      name,
      nodes,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const existingFlows = JSON.parse(localStorage.getItem('whatsapp-flows') || '[]');
    const flowIndex = existingFlows.findIndex(f => f.id === flowData.id);
    
    if (flowIndex >= 0) {
      existingFlows[flowIndex] = flowData;
    } else {
      existingFlows.push(flowData);
    }

    localStorage.setItem('whatsapp-flows', JSON.stringify(existingFlows));
    setFlows(existingFlows);
    setCurrentFlow({ id: flowData.id, name });
    setShowSaveModal(false);
    setNewFlowName('');
  };

  const loadFlow = (flow) => {
    setNodes(flow.nodes || []);
    setCurrentFlow({ id: flow.id, name: flow.name });
    setSelectedNode(null);
    setShowLoadModal(false);
  };

  const deleteFlow = (flowId) => {
    const existingFlows = JSON.parse(localStorage.getItem('whatsapp-flows') || '[]');
    const updatedFlows = existingFlows.filter(f => f.id !== flowId);
    localStorage.setItem('whatsapp-flows', JSON.stringify(updatedFlows));
    setFlows(updatedFlows);
    
    if (currentFlow.id === flowId) {
      if (updatedFlows.length > 0) {
        loadFlow(updatedFlows[0]);
      } else {
        createNewFlow();
      }
    }
  };

  const exportFlow = () => {
    const flowData = {
      id: currentFlow.id,
      name: currentFlow.name,
      nodes,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentFlow.name.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importFlow = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flowData = JSON.parse(e.target.result);
        flowData.id = Date.now().toString(); // Generate new ID
        flowData.name = `${flowData.name} (Imported)`;
        
        const existingFlows = JSON.parse(localStorage.getItem('whatsapp-flows') || '[]');
        existingFlows.push(flowData);
        localStorage.setItem('whatsapp-flows', JSON.stringify(existingFlows));
        
        setFlows(existingFlows);
        loadFlow(flowData);
      } catch (error) {
        alert('Error importing flow: Invalid file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleDragStart = (event, componentType) => {
    event.dataTransfer.setData('componentType', componentType);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const componentType = event.dataTransfer.getData('componentType');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - canvasOffset.x) / canvasScale;
    const y = (event.clientY - rect.top - canvasOffset.y) / canvasScale;
    
    const newNode = createNodeData(componentType, { x, y });
    setNodes([...nodes, newNode]);
  };

  const createNodeData = (type, position) => {
    const baseNode = {
      id: `node-${Date.now()}`,
      type,
      position,
      connections: []
    };

    switch (type) {
      case 'message':
        return { ...baseNode, content: 'Type your message here' };
      case 'image':
        return { ...baseNode, content: '', imageUrl: '', caption: 'Image caption' };
      case 'video':
        return { ...baseNode, content: '', videoUrl: '', caption: 'Video caption' };
      case 'template':
        return { 
          ...baseNode, 
          templateId: '', 
          templateName: 'My Template',
          parameters: []
        };
      case 'buttons':
        return {
          ...baseNode,
          content: 'Choose an option:',
          buttons: [
            { id: 1, text: 'Option 1', target: null },
            { id: 2, text: 'Option 2', target: null },
            { id: 3, text: 'Option 3', target: null }
          ]
        };
      case 'catalog':
        return { 
          ...baseNode, 
          catalogId: '',
          title: 'Browse our products',
          content: 'Product Catalog'
        };
      case 'condition':
        return {
          ...baseNode,
          condition: { type: 'keyword', value: '' },
          trueBranch: null,
          falseBranch: null,
          content: 'Condition'
        };
      case 'delay':
        return { 
          ...baseNode, 
          delayTime: 5,
          delayUnit: 'seconds',
          content: '5 seconds delay'
        };
      case 'start':
        return { 
          ...baseNode, 
          content: 'Start of Flow',
          triggerKeyword: 'hello'
        };
      default:
        return { ...baseNode, content: 'Node' };
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleNodeClick = (node, event) => {
    if (connectingNode && connectingNode.id !== node.id) {
      if (connectingBranch) {
        setNodes(nodes.map(n => {
          if (n.id === connectingNode.id) {
            return { 
              ...n, 
              [connectingBranch === 'true' ? 'trueBranch' : 'falseBranch']: node.id 
            };
          }
          return n;
        }));
        setConnectingNode(null);
        setConnectingBranch(null);
      } else if (connectingButton) {
        setNodes(nodes.map(n => {
          if (n.id === connectingNode.id) {
            const updatedButtons = n.buttons.map(btn => 
              btn.id === connectingButton ? { ...btn, target: node.id } : btn
            );
            return { ...n, buttons: updatedButtons };
          }
          return n;
        }));
        setConnectingNode(null);
        setConnectingButton(null);
      } else {
        setNodes(nodes.map(n => {
          if (n.id === connectingNode.id) {
            return { ...n, connections: [...n.connections, node.id] };
          }
          return n;
        }));
        setConnectingNode(null);
      }
    } else {
      setSelectedNode(node);
      setConnectingNode(null);
      setConnectingButton(null);
      setConnectingBranch(null);
    }
    
    event.stopPropagation();
  };

  const handleCanvasClick = () => {
    setSelectedNode(null);
    setConnectingNode(null);
    setConnectingButton(null);
    setConnectingBranch(null);
  };

  const startConnecting = (node, event) => {
    setConnectingNode(node);
    event.stopPropagation();
  };

  const startButtonConnecting = (node, buttonId, event) => {
    setConnectingNode(node);
    setConnectingButton(buttonId);
    event.stopPropagation();
  };

  const startBranchConnecting = (node, branch, event) => {
    setConnectingNode(node);
    setConnectingBranch(branch);
    event.stopPropagation();
  };

  const startDragging = (node, event) => {
    setDraggingNode(node);
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left - canvasOffset.x) / canvasScale - node.position.x;
    const offsetY = (event.clientY - rect.top - canvasOffset.y) / canvasScale - node.position.y;
    setDragOffset({ x: offsetX, y: offsetY });
    event.stopPropagation();
  };

  const handleMouseMove = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left - canvasOffset.x) / canvasScale;
    const mouseY = (event.clientY - rect.top - canvasOffset.y) / canvasScale;

    if (isDraggingCanvas) {
      setCanvasOffset({
        x: canvasOffset.x + (event.clientX - canvasStartDrag.x),
        y: canvasOffset.y + (event.clientY - canvasStartDrag.y)
      });
      setCanvasStartDrag({ x: event.clientX, y: event.clientY });
      return;
    }

    if (!draggingNode) return;
    
    setNodes(nodes.map(node => 
      node.id === draggingNode.id 
        ? { ...node, position: { x: mouseX - dragOffset.x, y: mouseY - dragOffset.y } } 
        : node
    ));
  };

  const handleMouseDown = (event) => {
    if (event.target === canvasRef.current || event.target === svgRef.current) {
      setIsDraggingCanvas(true);
      setCanvasStartDrag({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    setIsDraggingCanvas(false);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left - canvasOffset.x) / canvasScale;
    const mouseY = (event.clientY - rect.top - canvasOffset.y) / canvasScale;
    
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(canvasScale * delta, 0.3), 3);
    
    setCanvasOffset({
      x: canvasOffset.x - (mouseX * (newScale - canvasScale)),
      y: canvasOffset.y - (mouseY * (newScale - canvasScale))
    });
    
    setCanvasScale(newScale);
  };

  const updateNode = (nodeId, updates) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  const addButtonToNode = (nodeId) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId && node.buttons) {
        const newButton = {
          id: Math.max(...node.buttons.map(b => b.id)) + 1,
          text: `Option ${node.buttons.length + 1}`,
          target: null
        };
        return { ...node, buttons: [...node.buttons, newButton] };
      }
      return node;
    }));
  };

  const removeButtonFromNode = (nodeId, buttonId) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId && node.buttons) {
        return { ...node, buttons: node.buttons.filter(b => b.id !== buttonId) };
      }
      return node;
    }));
  };

  const updateButtonText = (nodeId, buttonId, text) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId && node.buttons) {
        const updatedButtons = node.buttons.map(btn => 
          btn.id === buttonId ? { ...btn, text } : btn
        );
        return { ...node, buttons: updatedButtons };
      }
      return node;
    }));
  };

  const findNodePosition = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? {
      x: node.position.x * canvasScale + canvasOffset.x,
      y: node.position.y * canvasScale + canvasOffset.y
    } : { x: 0, y: 0 };
  };

  const findNodeCenter = (nodeId) => {
    const pos = findNodePosition(nodeId);
    return {
      x: pos.x + 100 * canvasScale,
      y: pos.y + 40 * canvasScale
    };
  };

  const deleteNode = (nodeId) => {
    if (nodeId === 'start-node') {
      alert('Cannot delete the start node');
      return;
    }

    const updatedNodes = nodes.map(node => {
      const filteredConnections = node.connections.filter(conn => conn !== nodeId);
      
      let trueBranch = node.trueBranch;
      let falseBranch = node.falseBranch;
      if (node.trueBranch === nodeId) trueBranch = null;
      if (node.falseBranch === nodeId) falseBranch = null;
      
      let buttons = node.buttons;
      if (node.buttons) {
        buttons = node.buttons.map(btn => ({
          ...btn,
          target: btn.target === nodeId ? null : btn.target
        }));
      }
      
      return {
        ...node,
        connections: filteredConnections,
        trueBranch,
        falseBranch,
        buttons
      };
    });
    
    setNodes(updatedNodes.filter(node => node.id !== nodeId));
    setSelectedNode(null);
  };

  const duplicateNode = (nodeId) => {
    const nodeToDuplicate = nodes.find(n => n.id === nodeId);
    if (!nodeToDuplicate) return;

    const newNode = {
      ...nodeToDuplicate,
      id: `node-${Date.now()}`,
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50
      },
      connections: [],
      trueBranch: null,
      falseBranch: null,
      buttons: nodeToDuplicate.buttons ? nodeToDuplicate.buttons.map(btn => ({
        ...btn,
        target: null
      })) : undefined
    };

    setNodes([...nodes, newNode]);
  };

  const renderConnection = (sourceId, targetId, label = '', branch = '', color = '#3b82f6') => {
    const sourcePos = findNodeCenter(sourceId);
    const targetPos = findNodePosition(targetId);
    
    const midX = (sourcePos.x + targetPos.x + 20 * canvasScale) / 2;
    const midY = (sourcePos.y + targetPos.y + 40 * canvasScale) / 2;
    
    return (
      <g key={`${sourceId}-${targetId}-${label}`}>
        <line
          x1={sourcePos.x}
          y1={sourcePos.y}
          x2={targetPos.x + 20 * canvasScale}
          y2={targetPos.y + 40 * canvasScale}
          stroke={color}
          strokeWidth={2 * canvasScale}
          markerEnd="url(#arrowhead)"
        />
        {label && (
          <text 
            x={midX} 
            y={midY - 10 * canvasScale} 
            fill="#666" 
            fontSize={`${12 * canvasScale}px`}
            textAnchor="middle"
            className="select-none"
          >
            {label}
          </text>
        )}
        {branch && (
          <text 
            x={midX} 
            y={midY + 5 * canvasScale} 
            fill="#666" 
            fontSize={`${12 * canvasScale}px`} 
            fontWeight="bold"
            textAnchor="middle"
            className="select-none"
          >
            {branch === 'true' ? 'YES' : 'NO'}
          </text>
        )}
      </g>
    );
  };

  const renderNode = (node) => {
    const nodeStyle = {
      left: node.position.x * canvasScale + canvasOffset.x,
      top: node.position.y * canvasScale + canvasOffset.y,
      transform: `scale(${canvasScale})`,
      transformOrigin: 'top left',
      width: 200 * canvasScale,
      minHeight: 80 * canvasScale
    };
    
    const colorClass = components.find(c => c.type === node.type)?.color || 'gray';
    let nodeClass = `absolute p-3 rounded-lg shadow-md cursor-pointer min-w-[200px] bg-${colorClass}-100 border-2 border-${colorClass}-300 hover:shadow-lg transition-shadow`;
    
    const isSelected = selectedNode && selectedNode.id === node.id;
    if (isSelected) {
      nodeClass += ` ring-2 ring-blue-500 border-blue-500`;
    }
    
    const isConnecting = connectingNode && connectingNode.id === node.id;
    if (isConnecting) {
      nodeClass += ` ring-2 ring-green-500 border-green-500`;
    }

    const getNodeIcon = () => components.find(c => c.type === node.type)?.icon || '📄';
    
    return (
      <div
        key={node.id}
        className={nodeClass}
        style={nodeStyle}
        onClick={(e) => handleNodeClick(node, e)}
        onMouseDown={(e) => startDragging(node, e)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getNodeIcon()}</span>
            <span className="font-semibold text-sm capitalize">{node.type}</span>
          </div>
          <div className="flex gap-1">
            <button 
              className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600"
              onClick={(e) => startConnecting(node, e)}
              title="Connect to another node"
            >
              +
            </button>
            {node.id !== 'start-node' && (
              <button 
                className="w-6 h-6 bg-gray-500 text-white rounded-full text-xs hover:bg-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateNode(node.id);
                }}
                title="Duplicate node"
              >
                ⧉
              </button>
            )}
          </div>
        </div>
        
        <div className="text-sm break-words">
          {renderNodeContent(node)}
        </div>
      </div>
    );
  };

  const renderNodeContent = (node) => {
    switch (node.type) {
      case 'message':
        return <div className="break-words">{node.content}</div>;
      case 'image':
        return <div>📸 {node.caption || "Image message"}</div>;
      case 'video':
        return <div>🎬 {node.caption || "Video message"}</div>;
      case 'template':
        return <div>📋 {node.templateName || "Template message"}</div>;
      case 'buttons':
        return (
          <div>
            <div className="font-semibold mb-1">{node.content}</div>
            {node.buttons.map(button => (
              <div 
                key={button.id}
                className="bg-white p-1 mb-1 rounded border text-xs flex justify-between items-center hover:bg-gray-50"
                onClick={(e) => startButtonConnecting(node, button.id, e)}
              >
                <span>{button.text}</span>
                {button.target && <span className="text-green-600">✓</span>}
              </div>
            ))}
          </div>
        );
      case 'catalog':
        return <div>🛍️ {node.title}</div>;
      case 'condition':
        return (
          <div>
            <div className="font-semibold mb-1">
              {node.condition?.type === 'keyword' ? 'Keyword: ' + (node.condition.value || 'Not set') : 'Condition'}
            </div>
            <div className="flex justify-between mt-1">
              <span 
                className="text-green-600 text-xs cursor-pointer px-1 py-0.5 bg-green-100 rounded"
                onClick={(e) => startBranchConnecting(node, 'true', e)}
              >
                Yes {node.trueBranch ? '✓' : ''}
              </span>
              <span 
                className="text-red-600 text-xs cursor-pointer px-1 py-0.5 bg-red-100 rounded"
                onClick={(e) => startBranchConnecting(node, 'false', e)}
              >
                No {node.falseBranch ? '✓' : ''}
              </span>
            </div>
          </div>
        );
      case 'delay':
        return <div>⏱️ {node.delayTime} {node.delayUnit}</div>;
      case 'start':
        return (
          <div>
            <div className="font-bold">🚀 START</div>
            <div className="text-xs mt-1">Trigger: "{node.triggerKeyword}"</div>
          </div>
        );
      default:
        return <div>Node</div>;
    }
  };

  const renderNodeEditor = () => {
    if (!selectedNode) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit {selectedNode.type}</h3>
          <div className="flex gap-2">
            <button
              className="bg-gray-500 text-white px-2 py-1 text-xs rounded hover:bg-gray-600"
              onClick={() => duplicateNode(selectedNode.id)}
            >
              Duplicate
            </button>
            {selectedNode.id !== 'start-node' && (
              <button
                className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                onClick={() => deleteNode(selectedNode.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        
        {selectedNode.type === 'start' && (
          <div>
            <label className="block text-sm font-medium mb-1">Trigger Keyword</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-sm"
              value={selectedNode.triggerKeyword || ''}
              onChange={(e) => updateNode(selectedNode.id, { triggerKeyword: e.target.value })}
              placeholder="Enter trigger keyword"
            />
            <p className="text-xs text-gray-500 mt-1">This keyword will start the flow</p>
          </div>
        )}
        
        {selectedNode.type === 'message' && (
          <div>
            <label className="block text-sm font-medium mb-1">Message Content</label>
            <textarea
              className="w-full p-2 border rounded text-sm"
              value={selectedNode.content || ''}
              onChange={(e) => updateNode(selectedNode.id, { content: e.target.value })}
              rows="4"
              placeholder="Enter your message here..."
            />
          </div>
        )}

        {selectedNode.type === 'image' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.imageUrl || ''}
                onChange={(e) => updateNode(selectedNode.id, { imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Caption</label>
              <textarea
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.caption || ''}
                onChange={(e) => updateNode(selectedNode.id, { caption: e.target.value })}
                rows="2"
                placeholder="Image caption..."
              />
            </div>
          </div>
        )}

        {selectedNode.type === 'video' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Video URL</label>
              <input
                type="url"
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.videoUrl || ''}
                onChange={(e) => updateNode(selectedNode.id, { videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Caption</label>
              <textarea
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.caption || ''}
                onChange={(e) => updateNode(selectedNode.id, { caption: e.target.value })}
                rows="2"
                placeholder="Video caption..."
              />
            </div>
          </div>
        )}

        {selectedNode.type === 'template' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Template Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.templateName || ''}
                onChange={(e) => updateNode(selectedNode.id, { templateName: e.target.value })}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Template ID</label>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.templateId || ''}
                onChange={(e) => updateNode(selectedNode.id, { templateId: e.target.value })}
                placeholder="Enter WhatsApp template ID"
              />
            </div>
          </div>)}
        {selectedNode.type === 'buttons' && (
          <div className="space-y-3">
            <div>   
                <label className="block text-sm font-medium mb-1">Prompt Text</label>   
                <textarea
                  className="w-full p-2 border rounded text-sm"
                  value={selectedNode.content || ''}
                  onChange={(e) => updateNode(selectedNode.id, { content: e.target.value })}
                  rows="2"
                  placeholder="Enter prompt text..."
                />
              </div>
            <div>
              <label className="block text-sm font-medium mb-1">Buttons</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedNode.buttons && selectedNode.buttons.map(button => (
                  <div key={button.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-grow p-2 border rounded text-sm"
                      value={button.text}
                      onChange={(e) => updateButtonText(selectedNode.id, button.id, e.target.value)}
                      placeholder="Button text"
                    />
                    <button
                      className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                      onClick={() => removeButtonFromNode(selectedNode.id, button.id)}
                      title="Remove button"
                    >
                      &times;
                    </button>
                    {button.target && <span className="text-green-600 text-xs">Connected ✓</span>}
                  </div>
                ))}
              </div>
              {selectedNode.buttons && selectedNode.buttons.length < 3 && (
                <button
                  className="mt-2 bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600"
                  onClick={() => addButtonToNode(selectedNode.id)}
                >
                  Add Button
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">Click a button to connect it to another node</p>
          </div>
        )}

        {selectedNode.type === 'catalog' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Catalog ID</label>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.catalogId || ''}
                onChange={(e) => updateNode(selectedNode.id, { catalogId: e.target.value })}
                placeholder="Enter WhatsApp catalog ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.title || ''}
                onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
                placeholder="Enter catalog title"
              />
            </div>
          </div>
        )}

        {selectedNode.type === 'condition' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Condition Type</label>
              <select
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.condition?.type || 'keyword'}
                onChange={(e) => updateNode(selectedNode.id, { condition: { type: e.target.value, value: '' } })}
              >
                <option value="keyword">Keyword Match</option>
                <option value="time">Time-based</option>
              </select>
            </div>
            {selectedNode.condition?.type === 'keyword' && (
              <div>
                <label className="block text-sm font-medium mb-1">Keyword</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded text-sm"
                  value={selectedNode.condition.value || ''}
                  onChange={(e) => updateNode(selectedNode.id, { condition: { ...selectedNode.condition, value: e.target.value } })}
                  placeholder="Enter keyword to match"
                />
              </div>
            )}
            {selectedNode.condition?.type === 'time' && (
              <div>
                <label className="block text-sm font-medium mb-1">Time (in hours)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded text-sm"
                  value={selectedNode.condition.value || ''}
                  onChange={(e) => updateNode(selectedNode.id, { condition: { ...selectedNode.condition, value: e.target.value } })}
                  placeholder="Enter time in hours"
                />
              </div>
            )}
            <p className="text-xs text-gray-500">Connect the "Yes" and "No" branches to other nodes</p>
          </div>
        )}

        {selectedNode.type === 'delay' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Delay Time</label>
              <input
                type="number"
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.delayTime || 5}
                onChange={(e) => updateNode(selectedNode.id, { delayTime: parseInt(e.target.value) })}
                placeholder="Enter delay time"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Unit</label>
              <select
                className="w-full p-2 border rounded text-sm"
                value={selectedNode.delayUnit || 'seconds'}
                onChange={(e) => updateNode(selectedNode.id, { delayUnit: e.target.value })}
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Components</h2>
        <div className="flex-grow space-y-3 overflow-y-auto">
          {components.map(comp => (
            <div
              key={comp.type}
              className={`flex items-center gap-2 p-2 bg-${comp.color}-100 border border-${comp.color}-300 rounded cursor-move hover:bg-${comp.color}-200`}
              draggable
              onDragStart={(e) => handleDragStart(e, comp.type)}
            >
              <span className="text-lg">{comp.icon}</span>
              <span className="font-medium text-sm">{comp.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <button
            className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            onClick={() => setShowSaveModal(true)}
          >
            Save Flow
          </button>
          <button
            className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowLoadModal(true)}
          >
            Load Flow
          </button>
          <button
            className="w-full bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={exportFlow}
          >
            Export Flow
          </button>
          <label className="w-full bg-purple-500 text-white px-3 py-2 rounded text-center cursor-pointer hover:bg-purple-600">
            Import Flow
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={importFlow}
            />
          </label>
          <button
            className="w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            onClick={createNewFlow}
          >
            New Flow
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        className="flex-grow relative bg-white overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        ref={canvasRef}
      >
        <svg 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          ref={svgRef}
        >
          <defs>
            <marker 
              id="arrowhead"
              markerWidth="10" 
              markerHeight="7" 
              refX="10" 
              refY="3.5" 
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>
          {nodes.map(node => (
            node.connections.map(targetId => 
              renderConnection(node.id, targetId)
            )
          ))}
          {nodes.map(node => (
            node.type === 'condition' && node.trueBranch
              ? renderConnection(node.id, node.trueBranch, '', 'true', '#10b981')
              : null
          ))}
          {nodes.map(node => (
            node.type === 'condition' && node.falseBranch
              ? renderConnection(node.id, node.falseBranch, '', 'false', '#ef4444')
              : null
          ))}
          {nodes.map(node => (
            node.type === 'buttons' && node.buttons
              ? node.buttons.map(button => 
                  button.target ? renderConnection(node.id, button.target, button.text, '', '#8b5cf6') : null
                )
              : null
          ))}
        </svg>
        {nodes.map(node => renderNode(node))}
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-gray-50 border-l p-4 overflow-y-auto">
        {selectedNode ? (
          renderNodeEditor()
        ) : (
          <div className="text-gray-500 italic">Select a node to edit its properties</div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Save Flow</h3>
            <input
              type="text"
              className="w-full p-2 border rounded text-sm mb-4"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Enter flow name"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => setShowSaveModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={saveFlow}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Load Flow</h3>
            {savedFlows.length === 0 ? (
              <div className="text-gray-500 italic">No saved flows found</div>
            ) : (
              <ul className="space-y-2">
                {savedFlows.map(flow => (
                  <li key={flow.name} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                    <span className="font-medium">{flow.name}</span>
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600"
                        onClick={() => loadFlow(flow.name)}
                      >
                        Load
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                        onClick={() => deleteFlow(flow.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => setShowLoadModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  

export default WhatsAppFlowBuilder;