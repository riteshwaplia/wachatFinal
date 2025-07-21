import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeTypes, edgeTypes } from './nodeTypes/NodeType';
import { NodeEditorPanel } from './nodeTypes/NodeEditor';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import FlowTester from './FlowTester';
import { CgLaptop } from 'react-icons/cg';
import SaveFlowForm from './SaveFlow';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { getFlowByIdApi, updateFlowApi } from '../../apis/FlowApi';


const idCounters = {
  node: 1, // Start from node_1
};

const getId = (type = 'node') => {
  if (!idCounters[type]) {
    idCounters[type] = 1; // Start from 1 for new types
  }
  return `${type}_${idCounters[type]++}`;
};


function Flow() {
  const reactFlowWrapper = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showFlowManager, setShowFlowManager] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const [save, setSave] = useState(false)
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const slugify = (str) => str.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [flowUpdate, setFlowUpdate] = useState('')

  const [nodes, setNodes] = useState([
    {
      id: 'node_0',
      type: 'text',
      position: { x: 100, y: 150 },
      data: {
        label: 'Welcome to the bot',
      },
    },
  ]);


  const [edges, setEdges] = useState([]);
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
 console.log("flowid", flowId)


  useEffect(() => {
    if (!flowId) return;

    const fetchFlow = async () => {
      try {
        const res = await getFlowByIdApi(id,flowId); // consider renaming this to `getFlowApi`
        const flow = res.data;
 
        const { nodes, edges, ...rest } = flow;

        setNodes(nodes || []);
        setEdges(edges || []);
        setFlowUpdate(rest); // optional: if you want to keep name/description/etc
      } catch (error) {
        console.error("Error fetching flow:", error);
      }
    };

    fetchFlow();
  }, [flowId]);



  const handleNewFlow = () => {
    const startNode = {
      id: 'start-1',
      type: 'start',
      position: { x: 100, y: 100 },
      data: { label: 'Start' }
    };
    const newNodes = [];
    const newEdges = [];

    setNodes(newNodes);
    setEdges(newEdges);
    // setStoreNodes(newNodes);
    // setStoreEdges(newEdges);
    // setSelectedNode(null);
    // nodeId = 1; // Reset node counter
  };

  // 🧠 Dynamic node data update
  const handleNodeDataChange = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              ...newData,
              onChange: handleNodeDataChange,
            },
          }
          : node
      )
    );
  }, []);

  // 🧠 Node change event
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // 🧠 Edge change event
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // 🔗 When a connection is made
  const onConnect = useCallback((params) => {
    if (params.source === params.target) return;
    setEdges((eds) =>
      addEdge({ ...params, type: 'custom' }, eds)
    );
  }, []);


  const updateNode = (updatedNode) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      )
    );
    setSelectedNode(updatedNode); // refresh the editor
  };

  // ⬇️ Drag-and-drop handler
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };


    const id = getId(); // Assuming getId() is declared globally
    const newNodeData = (() => {
      switch (type) {
        case 'interactive_buttons':
          return {
            header: 'Your Header Content',
            message: 'Choose an option:',
            footer: 'Optional footer content',
            buttons: [
              {
                id: `btn-0`,
                title: 'Button 1',
              },
            ],
            meta: {
              delay: 0,
              tags: [],
              conditions: [],
            },
            onChange: handleNodeDataChange,
          };

        case 'interactive_list_section':
          return {
            sectionTitle: 'Section 1',
            sectionId: id,
            previewRows: [],
            meta: {
              delay: 0,
              tags: [],
              conditions: [],
            },
            onChange: handleNodeDataChange,
          };

        case 'interactive_list_row': {
          const sectionNode = nodes.find((n) => n.type === 'interactive_list_section');
          const sectionId = sectionNode?.id || '';

          return {
            title: 'Row Title',
            description: 'Row description',
            sectionId,
            meta: {
              delay: 0,
              tags: [],
              conditions: [],
            },
            onChange: handleNodeDataChange,
          };
        }

        default:
          return {
            label: `${type} node`,
            message: '',
            meta: {
              delay: 0,
              tags: [],
              conditions: [],
            },
            onChange: handleNodeDataChange,
          };
      }
    })();




    const newNode = {
      id,
      type,
      position,
      data: newNodeData,
    };

    setNodes((nds) => nds.concat(newNode));
  }, [handleNodeDataChange]);



  const onNodeClick = useCallback((event, node) => {
    console.log("clicked", node)
    setSelectedNode(node);
  }, [setSelectedNode]);



  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  const onNodesDelete = useCallback(
    (deleted) => {
      setNodes((nds) => nds.filter((node) => !deleted.some((d) => d.id === node.id)));
      // Optionally, remove related edges:
      setEdges((eds) => eds.filter((edge) => !deleted.some((d) => edge.source === d.id || edge.target === d.id)));
    },
    []
  );

  const handleNodeDelete = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, []);





  const importFlow = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { nodes, edges } = JSON.parse(e.target.result);
        setNodes(nodes || []);
        setEdges(edges || []);
      } catch (err) {
        alert('Invalid flow file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
      {/* Sidebar (Left Panel) */}
      <div className="w-72 flex-shrink-0 h-full border-r bg-white">
        <Sidebar />
      </div>

      {/* Main Content + Node Editor (Center + Right) */}
      <div className="flex flex-grow h-full">
        {/* Center Panel (Flow Canvas + Toolbar) */}
        <div className="flex  w-full flex-col bg-gray-200 flex-grow ">
          {/* Toolbar */}
          <Toolbar
            importFlow={importFlow}
            data={{ nodes, edges, flowUpdate }}
            onNewFlow={handleNewFlow}
            onTestFlow={() => setShowTester(true)}
            onShowFlows={() => setShowFlowManager(true)}
            setSavFlow={() => setSave(true)}

          />

          {/* Flow Canvas */}
          <div
            className="flex-grow relative"
            ref={reactFlowWrapper}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  onChange: handleNodeDataChange,
                  onDelete: handleNodeDelete,
                },
              }))}
              edges={edges}
              onNodeClick={onNodeClick}
              onNodesDelete={onNodesDelete}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        </div>

        {/* Right Panel (Node Editor Panel) */}

        {showTester && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg w-[400px] max-h-[90vh] overflow-auto p-6 relative">
              <button
                className="absolute top-2 right-2 text-lg"
                onClick={() => setShowTester(false)}
              >×</button>
              <FlowTester nodes={nodes} edges={edges} />
            </div>
          </div>
        )}

        {save && (
          <div className="fixed inset-0 bg-black bg-opacity-40  flex items-center justify-center z-50">
            {/* nodes, edges, projectId, onClose */}
            <SaveFlowForm nodes={nodes} edges={edges} flowUpdateData={flowUpdate} projectId={id} onClose={() => setSave(false)} />

          </div>
        )}


        {selectedNode && (
          <div className="w-80 border-l bg-bg h-full overflow-auto">
            <NodeEditorPanel
              allNodes={nodes}
              selectedNode={selectedNode}
              updateNode={updateNode}
            />
          </div>
        )}
      </div>
    </div>

  );
};


export default Flow;