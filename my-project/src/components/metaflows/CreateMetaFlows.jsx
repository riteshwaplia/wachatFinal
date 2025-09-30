import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// ----- Draggable Component Item (Palette) -----
const ComponentItem = ({ type, label, config }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COMPONENT",
    item: { type, config },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 border rounded mb-2 cursor-move bg-white hover:bg-gray-50 border-gray-200 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-gray-500">{type}</div>
    </div>
  );
};

// ----- Droppable Canvas -----
const ScreenCanvas = ({ screen, onDropComponent, onSelectComponent, onUpdateScreenTitle }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "COMPONENT",
    drop: (item) => onDropComponent(screen.id, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <input
          type="text"
          value={screen.title}
          onChange={(e) => onUpdateScreenTitle(screen.id, e.target.value)}
          className="w-full text-lg font-semibold border-none focus:outline-none focus:ring-0"
          placeholder="Screen title..."
        />
      </div>
      <div
        ref={drop}
        className={`min-h-[400px] p-4 transition-colors ${
          isOver ? "bg-blue-50 border-blue-200" : "bg-gray-50"
        }`}
      >
        {screen.layout.children[0].children.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <div className="text-lg mb-2">📱</div>
              <p>Drag components here to build your screen</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {screen.layout.children[0].children.map((comp, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                onClick={() => onSelectComponent(screen.id, idx)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {comp.type}
                      </span>
                      {comp.required && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <div className="font-medium text-gray-900">{comp.label}</div>
                    {comp.name && (
                      <div className="text-sm text-gray-500 mt-1">Name: {comp.name}</div>
                    )}
                    {comp.helperText && (
                      <div className="text-sm text-gray-400 mt-1">{comp.helperText}</div>
                    )}
                    {comp["data-source"] && (
                      <div className="text-sm text-gray-500 mt-2">
                        Options: {comp["data-source"].length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ----- Component Editor -----
const ComponentEditor = ({ component, onChange, onDelete }) => {
  if (!component) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="text-4xl mb-2">⚙️</div>
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  const handleChange = (updates) => {
    onChange({ ...component, ...updates });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit {component.type}</h3>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
        >
          Delete
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={component.label || ""}
            onChange={(e) => handleChange({ label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter label..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Name
          </label>
          <input
            type="text"
            value={component.name || ""}
            onChange={(e) => handleChange({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter field name..."
          />
        </div>

        {component.type !== "Footer" && (
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={component.required || false}
                onChange={(e) => handleChange({ required: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Required Field</span>
            </label>
          </div>
        )}

        {(component.type === "TextInput" || component.type === "TextArea") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Helper Text
            </label>
            <input
              type="text"
              value={component.helperText || ""}
              onChange={(e) => handleChange({ helperText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Helper text..."
            />
          </div>
        )}

        {component.type === "TextInput" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Input Type
            </label>
            <select
              value={component["input-type"] || "text"}
              onChange={(e) => handleChange({ "input-type": e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="tel">Telephone</option>
              <option value="url">URL</option>
            </select>
          </div>
        )}

        {(component.type === "Dropdown" || component.type === "RadioButtonsGroup" || component.type === "CheckboxGroup") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options (one per line)
            </label>
            <textarea
              value={component.options ? component.options.join("\n") : ""}
              onChange={(e) => {
                const options = e.target.value.split("\n").filter(opt => opt.trim());
                const dataSource = options.map((opt, index) => ({
                  id: `${index}_${opt.replace(/\s+/g, '_')}`,
                  title: opt.trim()
                }));
                handleChange({ 
                  options: options,
                  "data-source": dataSource 
                });
              }}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter each option on a new line..."
            />
          </div>
        )}

        {component.type === "Footer" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Label
            </label>
            <input
              type="text"
              value={component.label || "Continue"}
              onChange={(e) => handleChange({ label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Button text..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ----- JSON Preview -----
const JSONPreview = ({ screens, flowName }) => {
  const generateFlowJSON = () => {
    const flowScreens = screens.map((screen, index) => {
      const baseScreen = {
        id: screen.id,
        title: screen.title,
        data: index > 0 ? {} : {}, // You can enhance this with actual data flow
        layout: screen.layout,
        terminal: index === screens.length - 1
      };

      // Add navigation actions to non-terminal screens
      if (index < screens.length - 1) {
        const formChildren = baseScreen.layout.children[0].children;
        const footerIndex = formChildren.findIndex(child => child.type === "Footer");
        if (footerIndex !== -1) {
          formChildren[footerIndex] = {
            ...formChildren[footerIndex],
            "on-click-action": {
              name: "navigate",
              next: {
                type: "screen",
                name: screens[index + 1].id
              },
              payload: {} // You can enhance this with actual payload mapping
            }
          };
        }
      }

      // Add complete action to terminal screen
      if (index === screens.length - 1) {
        const formChildren = baseScreen.layout.children[0].children;
        const footerIndex = formChildren.findIndex(child => child.type === "Footer");
        if (footerIndex !== -1) {
          formChildren[footerIndex] = {
            ...formChildren[footerIndex],
            "on-click-action": {
              name: "complete",
              payload: {} // You can enhance this with actual payload
            }
          };
        }
      }

      return baseScreen;
    });

    return {
      name: flowName || "Untitled Flow",
      categories: ["CUSTOM"],
      screens: flowScreens,
      version: "7.2"
    };
  };

  const flowJSON = generateFlowJSON();

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">JSON Preview</h3>
      </div>
      <div className="p-4">
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm max-h-96">
          {JSON.stringify(flowJSON, null, 2)}
        </pre>
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify(flowJSON, null, 2))}
          className="mt-3 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Copy JSON
        </button>
      </div>
    </div>
  );
};

// ----- Main Flow Builder -----
const CreateMetaFlows = () => {
  const [flowName, setFlowName] = useState("My Flow");
  const [screens, setScreens] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [activeTab, setActiveTab] = useState("builder"); // "builder" or "preview"

  // Add screen
  const addScreen = () => {
    const newScreen = {
      id: `screen_${Date.now()}`,
      title: `Screen ${screens.length + 1}`,
      layout: { 
        type: "SingleColumnLayout", 
        children: [{ 
          type: "Form", 
          name: "form",
          children: [] 
        }] 
      },
    };
    setScreens([...screens, newScreen]);
    setSelectedScreenId(newScreen.id);
  };

  // Update screen title
  const handleUpdateScreenTitle = (screenId, newTitle) => {
    setScreens(prev =>
      prev.map(screen =>
        screen.id === screenId ? { ...screen, title: newTitle } : screen
      )
    );
  };

  // Drop component into screen
  const handleDropComponent = (screenId, item) => {
    const newComponent = {
      ...item.config,
      name: item.config.name || `${item.type.toLowerCase()}_${Date.now()}`,
      label: item.config.label || item.type
    };

    setScreens(prev =>
      prev.map(screen =>
        screen.id === screenId
          ? {
              ...screen,
              layout: {
                ...screen.layout,
                children: screen.layout.children.map(child =>
                  child.type === "Form"
                    ? { 
                        ...child, 
                        children: [...child.children, newComponent] 
                      }
                    : child
                ),
              },
            }
          : screen
      )
    );
  };

  // Select component
  const handleSelectComponent = (screenId, compIdx) => {
    setSelectedScreenId(screenId);
    const screen = screens.find(s => s.id === screenId);
    const comp = screen?.layout.children[0].children[compIdx];
    if (comp) {
      setSelectedComponent({ ...comp, screenId, compIdx });
    }
  };

  // Update component
  const handleUpdateComponent = (updated) => {
    const { screenId, compIdx, ...componentData } = updated;
    
    setScreens(prev =>
      prev.map(screen =>
        screen.id === screenId
          ? {
              ...screen,
              layout: {
                ...screen.layout,
                children: screen.layout.children.map(child =>
                  child.type === "Form"
                    ? {
                        ...child,
                        children: child.children.map((c, i) =>
                          i === compIdx ? componentData : c
                        ),
                      }
                    : child
                ),
              },
            }
          : screen
      )
    );
    setSelectedComponent(updated);
  };

  // Delete component
  const handleDeleteComponent = () => {
    if (!selectedComponent) return;
    
    const { screenId, compIdx } = selectedComponent;
    
    setScreens(prev =>
      prev.map(screen =>
        screen.id === screenId
          ? {
              ...screen,
              layout: {
                ...screen.layout,
                children: screen.layout.children.map(child =>
                  child.type === "Form"
                    ? {
                        ...child,
                        children: child.children.filter((_, i) => i !== compIdx),
                      }
                    : child
                ),
              },
            }
          : screen
      )
    );
    setSelectedComponent(null);
  };

  // Delete screen
  const handleDeleteScreen = (screenId) => {
    const newScreens = screens.filter(screen => screen.id !== screenId);
    setScreens(newScreens);
    
    if (selectedScreenId === screenId) {
      setSelectedScreenId(newScreens.length > 0 ? newScreens[0].id : null);
      setSelectedComponent(null);
    }
  };

  // Component palette
  const palette = [
    { 
      type: "TextInput", 
      label: "Text Input", 
      config: { 
        type: "TextInput", 
        name: "text_input",
        label: "Text Input",
        "input-type": "text"
      } 
    },
    { 
      type: "TextArea", 
      label: "Text Area", 
      config: { 
        type: "TextArea", 
        name: "text_area",
        label: "Text Area" 
      } 
    },
    { 
      type: "Dropdown", 
      label: "Dropdown", 
      config: { 
        type: "Dropdown", 
        name: "dropdown",
        label: "Dropdown",
        options: ["Option 1", "Option 2"],
        "data-source": [
          { id: "0_Option_1", title: "Option 1" },
          { id: "1_Option_2", title: "Option 2" }
        ]
      } 
    },
    { 
      type: "RadioButtonsGroup", 
      label: "Radio Group", 
      config: { 
        type: "RadioButtonsGroup", 
        name: "radio_group",
        label: "Radio Group",
        options: ["Yes", "No"],
        "data-source": [
          { id: "0_Yes", title: "Yes" },
          { id: "1_No", title: "No" }
        ]
      } 
    },
    { 
      type: "CheckboxGroup", 
      label: "Checkbox Group", 
      config: { 
        type: "CheckboxGroup", 
        name: "checkbox_group",
        label: "Checkbox Group",
        options: ["Option A", "Option B"],
        "data-source": [
          { id: "0_Option_A", title: "Option A" },
          { id: "1_Option_B", title: "Option B" }
        ]
      } 
    },
    { 
      type: "Footer", 
      label: "Footer Button", 
      config: { 
        type: "Footer", 
        label: "Continue" 
      } 
    },
  ];

  const selectedScreen = screens.find(s => s.id === selectedScreenId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Flow Builder</h1>
                <input
                  type="text"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  className="text-lg text-gray-600 border-none bg-transparent focus:outline-none focus:ring-0 mt-1"
                  placeholder="Enter flow name..."
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab("builder")}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeTab === "builder" 
                        ? "bg-white shadow-sm text-gray-900" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Builder
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeTab === "preview" 
                        ? "bg-white shadow-sm text-gray-900" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    JSON Preview
                  </button>
                </div>
                <button
                  onClick={addScreen}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Screen
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === "builder" ? (
            <div className="grid grid-cols-12 gap-6">
              {/* Left Sidebar - Screens & Components */}
              <div className="col-span-3 space-y-6">
                {/* Screens List */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h2 className="text-lg font-semibold mb-3">Screens</h2>
<div className="space-y-2">
  {screens.map((screen) => (
    <div
      key={screen.id}
      className={`p-3 border rounded-lg transition-colors ${
        selectedScreenId === screen.id 
          ? "bg-blue-50 border-blue-300" 
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      }`}
    >
      {/* Make only specific elements clickable, not the entire container */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setSelectedScreenId(screen.id)}
      >
        <span className="font-medium text-sm">{screen.title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteScreen(screen.id);
          }}
          className="text-red-500 hover:text-red-700 text-xs"
        >
          ×
        </button>
      </div>
      <div 
        className="text-xs text-gray-500 mt-1 cursor-pointer"
        onClick={() => setSelectedScreenId(screen.id)}
      >
        {screen.layout.children[0].children.length} components
      </div>
    </div>
  ))}
</div>
                  {screens.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No screens yet. Add your first screen!
                    </p>
                  )}
                </div>

                {/* Component Palette */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h2 className="text-lg font-semibold mb-3">Components</h2>
                  <p className="text-sm text-gray-500 mb-3">Drag components to the canvas</p>
                  <div className="space-y-2">
                    {palette.map((item, index) => (
                      <ComponentItem
                        key={index}
                        type={item.type}
                        label={item.label}
                        config={item.config}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle - Canvas */}
              <div className="col-span-6">
                {selectedScreen ? (
                  <ScreenCanvas
                    screen={selectedScreen}
                    onDropComponent={handleDropComponent}
                    onSelectComponent={handleSelectComponent}
                    onUpdateScreenTitle={handleUpdateScreenTitle}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-xl font-semibold mb-2">Welcome to Flow Builder</h3>
                    <p className="text-gray-500 mb-4">
                      Create your first screen to start building your flow
                    </p>
                    <button
                      onClick={addScreen}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Your First Screen
                    </button>
                  </div>
                )}
              </div>

              {/* Right - Component Editor */}
              <div className="col-span-3">
                <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
                  <ComponentEditor
                    component={selectedComponent}
                    onChange={handleUpdateComponent}
                    onDelete={handleDeleteComponent}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* JSON Preview Tab */
            <div className="grid grid-cols-1 gap-6">
              <JSONPreview screens={screens} flowName={flowName} />
              
              {/* Screens Summary */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Flow Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{screens.length}</div>
                    <div className="text-sm text-blue-800">Screens</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {screens.reduce((total, screen) => 
                        total + screen.layout.children[0].children.length, 0
                      )}
                    </div>
                    <div className="text-sm text-green-800">Total Components</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {screens.reduce((total, screen) => 
                        total + screen.layout.children[0].children.filter(c => c.required).length, 0
                      )}
                    </div>
                    <div className="text-sm text-purple-800">Required Fields</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default CreateMetaFlows;