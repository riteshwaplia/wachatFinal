import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// ComponentItem for draggable palette items
const ComponentItem = ({ type, label, config }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type, config },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 border border-gray-200 rounded-lg bg-white cursor-move transition-all ${
        isDragging ? 'opacity-50' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
    </div>
  );
};

// ScreenCanvas for drop targets
const ScreenCanvas = ({ screen, onDropComponent, onSelectComponent, onUpdateScreenTitle, isSelected }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item) => onDropComponent(screen.id, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const formChildren = screen.layout.children[0].children;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
        isSelected ? 'border-blue-500' : 'border-gray-200'
      } ${isOver ? 'bg-blue-50' : ''}`}
    >
      <div className="mb-4">
        <input
          type="text"
          value={screen.title}
          onChange={(e) => onUpdateScreenTitle(screen.id, e.target.value)}
          className="text-xl font-bold w-full border-none focus:outline-none focus:ring-0 bg-transparent"
          placeholder="Screen title..."
        />
      </div>

      <div
        ref={drop}
        className={`min-h-200 p-4 border-2 border-dashed rounded-lg transition-colors ${
          isOver ? 'border-blue-400 bg-blue-25' : 'border-gray-300'
        }`}
      >
        {formChildren.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">⬇️</div>
            <p>Drag components here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {formChildren.map((component, index) => (
              <div
                key={index}
                onClick={() => onSelectComponent(screen.id, index)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  false /* Add your selection logic here */
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{component.type}</span>
                  <span className="text-xs text-gray-500">
                    {component.label || component.text || 'No content'}
                  </span>
                </div>
                {component.text && (
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {component.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ComponentEditor - Fixed to exclude label/name for text components
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

  // Component type arrays
  const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
  const optionComponents = ["Dropdown", "RadioButtonsGroup", "CheckboxGroup", "ChipsSelector"];
  const pickerComponents = ["DatePicker", "CalendarPicker"];
  const specialComponents = ["OptIn", "EmbeddedLink", "Image", "Footer"];

  // Check if component should have label/name fields
  const shouldShowLabelName = !textComponents.includes(component.type) && 
                              !specialComponents.includes(component.type);

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
        {/* Label & Name - Only show for non-text components */}
        {shouldShowLabelName && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={component.label || ""}
                onChange={(e) => handleChange({ label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter label..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
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
                  <span className="text-sm font-medium text-gray-700">
                    Required Field
                  </span>
                </label>
              </div>
            )}
          </>
        )}

        {/* Text content for text components */}
        {textComponents.includes(component.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              value={component.text || ""}
              onChange={(e) => handleChange({ text: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter text content..."
            />
          </div>
        )}

        {/* Helper text for TextInput & TextArea */}
        {(component.type === "TextInput" || component.type === "TextArea") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Helper Text</label>
            <input
              type="text"
              value={component.helperText || ""}
              onChange={(e) => handleChange({ helperText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Helper text..."
            />
          </div>
        )}

        {/* Input type for TextInput */}
        {component.type === "TextInput" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Input Type</label>
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

        {/* Options for Dropdown, Radio, Checkbox, ChipsSelector */}
        {optionComponents.includes(component.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Options (one per line)</label>
            <textarea
              value={component.options ? component.options.join("\n") : ""}
              onChange={(e) => {
                const options = e.target.value.split("\n").filter((opt) => opt.trim());
                const dataSource = options.map((opt, index) => ({
                  id: `${index}_${opt.replace(/\s+/g, "_")}`,
                  title: opt.trim(),
                }));
                handleChange({ options, "data-source": dataSource });
              }}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter each option on a new line..."
            />
          </div>
        )}

        {/* Special cases */}
        {component.type === "Footer" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
            <input
              type="text"
              value={component.label || "Continue"}
              onChange={(e) => handleChange({ label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Button text..."
            />
          </div>
        )}

        {component.type === "OptIn" && (
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={component.checked || false}
                onChange={(e) => handleChange({ checked: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Checked by default</span>
            </label>
          </div>
        )}

        {component.type === "EmbeddedLink" && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">URL</label>
            <input
              type="text"
              value={component.url || ""}
              onChange={(e) => handleChange({ url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
        )}

        {(component.type === "DatePicker" || component.type === "CalendarPicker") && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">Date Format</label>
            <input
              type="text"
              value={component.format || "YYYY-MM-DD"}
              onChange={(e) => handleChange({ format: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="YYYY-MM-DD"
            />
          </div>
        )}

        {component.type === "Image" && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={component.src || ""}
              onChange={(e) => handleChange({ src: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.png"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// JSONPreview - Fixed to exclude text components from payload
const JSONPreview = ({ screens, flowName }) => {
  const generateFlowJSON = () => {
    const flowScreens = screens.map((screen, index) => {
      // Build data structure for incoming data (from previous screens)
      const dataStructure = {};
      if (index > 0) {
        // Collect all field names from previous screens (excluding text components)
        for (let prevIndex = 0; prevIndex < index; prevIndex++) {
          const prevScreen = screens[prevIndex];
          const formChildren = prevScreen.layout.children[0].children || [];
          formChildren.forEach((child, fieldIndex) => {
            // Only include components that have name and are not text components
            const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
            if (child.name && !textComponents.includes(child.type) && child.type !== "Footer") {
              const dataKey = `screen_${prevIndex}_${child.name}_${fieldIndex}`;
              if (child.type === "CheckboxGroup") {
                // CheckboxGroup should be an array
                dataStructure[dataKey] = {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  __example__: [],
                };
              } else {
                dataStructure[dataKey] = {
                  type: "string",
                  __example__: "Example value",
                };
              }
            }
          });
        }
      }

      const baseScreen = {
        id: screen.id,
        title: screen.title,
        data: dataStructure,
        layout: JSON.parse(JSON.stringify(screen.layout)), // Deep clone to avoid mutations
        terminal: index === screens.length - 1,
      };

      // Clean up layout - remove label/name from text components in the final JSON
      const cleanLayout = (layout) => {
        if (layout.children && Array.isArray(layout.children)) {
          layout.children = layout.children.map(child => {
            const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
            if (textComponents.includes(child.type)) {
              // Only include type and text for text components
              const { type, text } = child;
              return { type, text };
            }
            return child;
          });
        }
        return layout;
      };

      baseScreen.layout = cleanLayout(baseScreen.layout);

      // Add navigation actions to non-terminal screens
      if (index < screens.length - 1) {
        const formChildren = baseScreen.layout.children[0].children;
        const footerIndex = formChildren.findIndex(
          (child) => child.type === "Footer"
        );
        if (footerIndex !== -1) {
          // Build payload mapping for navigation (excluding text components)
          const payloadMapping = {};
          const currentFormChildren = screen.layout.children[0].children || [];

          currentFormChildren.forEach((child, fieldIndex) => {
            const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
            if (child.name && !textComponents.includes(child.type) && child.type !== "Footer") {
              const payloadKey = `screen_${index}_${child.name}_${fieldIndex}`;
              payloadMapping[payloadKey] = `\${form.${child.name}}`;
            }
          });

          // Also include data from previous screens
          Object.keys(dataStructure).forEach((dataKey) => {
            payloadMapping[dataKey] = `\${data.${dataKey}}`;
          });

          formChildren[footerIndex] = {
            ...formChildren[footerIndex],
            "on-click-action": {
              name: "navigate",
              next: {
                type: "screen",
                name: screens[index + 1].id,
              },
              payload: payloadMapping,
            },
          };
        }
      }

      // Add complete action to terminal screen
      if (index === screens.length - 1) {
        const formChildren = baseScreen.layout.children[0].children;
        const footerIndex = formChildren.findIndex(
          (child) => child.type === "Footer"
        );
        if (footerIndex !== -1) {
          // Build complete payload with ALL data (excluding text components)
          const completePayload = {};

          // Add current screen form data (excluding text components)
          const currentFormChildren = screen.layout.children[0].children || [];
          currentFormChildren.forEach((child, fieldIndex) => {
            const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
            if (child.name && !textComponents.includes(child.type) && child.type !== "Footer") {
              const payloadKey = `screen_${index}_${child.name}_${fieldIndex}`;
              completePayload[payloadKey] = `\${form.${child.name}}`;
            }
          });

          // Add all previous screens data
          Object.keys(dataStructure).forEach((dataKey) => {
            completePayload[dataKey] = `\${data.${dataKey}}`;
          });

          formChildren[footerIndex] = {
            ...formChildren[footerIndex],
            "on-click-action": {
              name: "complete",
              payload: completePayload,
            },
          };
        }
      }

      return baseScreen;
    });

    return {
      name: flowName || "Untitled Flow",
      categories: ["CUSTOM"],
      screens: flowScreens,
      version: "7.2",
    };
  };

  const flowJSON = generateFlowJSON();

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">JSON Preview</h3>
        <p className="text-sm text-gray-500 mt-1">
          Dynamic payload and data flow between screens (text components excluded from payload)
        </p>
      </div>
      <div className="p-4">
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm max-h-96">
          {JSON.stringify(flowJSON, null, 2)}
        </pre>
        <button
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(flowJSON, null, 2))
          }
          className="mt-3 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Copy JSON
        </button>
      </div>
    </div>
  );
};

// Main Component
const CreateMetaFlows = () => {
  const [flowName, setFlowName] = useState("My Flow");
  const [screens, setScreens] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [activeTab, setActiveTab] = useState("builder");

  // Add screen
  const addScreen = () => {
    const newScreen = {
   id: `screen-${Math.random().toString(36).replace(/[^a-z]/g, "").substring(0, 8)}`,

      title: `Screen ${screens.length + 1}`,
      layout: {
        type: "SingleColumnLayout",
        children: [
          {
            type: "Form",
            name: "form",
            children: [],
          },
        ],
      },
    };
    setScreens([...screens, newScreen]);
    setSelectedScreenId(newScreen.id);
  };

  // Update screen title
  const handleUpdateScreenTitle = (screenId, newTitle) => {
    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === screenId ? { ...screen, title: newTitle } : screen
      )
    );
  };

  // Drop component into screen - Fixed for text components
  const handleDropComponent = (screenId, item) => {
    const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
    
    let newComponent;
    
    if (textComponents.includes(item.type)) {
      // For text components, only include type and text
      newComponent = {
        type: item.type,
        text: item.config.text || item.type,
      };
    } else if (item.type === "Footer") {
      // For Footer, only include type and label
      newComponent = {
        type: item.type,
        label: item.config.label || "Continue",
      };
    } else {
      // For other components, include all config properties
      newComponent = {
        ...item.config,
        label: item.config.label || item.type,
        name: item.config.name || `${item.type.toLowerCase()}_${Date.now()}`,
      };
    }

    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === screenId
          ? {
              ...screen,
              layout: {
                ...screen.layout,
                children: screen.layout.children.map((child) =>
                  child.type === "Form"
                    ? {
                        ...child,
                        children: [...child.children, newComponent],
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
    const screen = screens.find((s) => s.id === screenId);
    const comp = screen?.layout.children[0].children[compIdx];
    if (comp) {
      setSelectedComponent({ ...comp, screenId, compIdx });
    }
  };

  // Update component
  const handleUpdateComponent = (updated) => {
    const { screenId, compIdx, ...componentData } = updated;

    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === screenId
          ? {
              ...screen,
              layout: {
                ...screen.layout,
                children: screen.layout.children.map((child) =>
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

    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === screenId
          ? {
              ...screen,
              layout: {
                ...screen.layout,
                children: screen.layout.children.map((child) =>
                  child.type === "Form"
                    ? {
                        ...child,
                        children: child.children.filter(
                          (_, i) => i !== compIdx
                        ),
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
    const newScreens = screens.filter((screen) => screen.id !== screenId);
    setScreens(newScreens);

    if (selectedScreenId === screenId) {
      setSelectedScreenId(newScreens.length > 0 ? newScreens[0].id : null);
      setSelectedComponent(null);
    }
  };

  // Auto-connect screens with proper payload
  const autoConnectScreens = () => {
    if (screens.length < 2) return;

    const updatedScreens = [...screens];

    // Connect each screen to the next one
    for (let i = 0; i < updatedScreens.length - 1; i++) {
      const currentScreen = updatedScreens[i];
      const nextScreen = updatedScreens[i + 1];

      // Find and update footer in current screen
      const formChildren = currentScreen.layout.children[0].children;
      const footerIndex = formChildren.findIndex(
        (child) => child.type === "Footer"
      );

      if (footerIndex !== -1) {
        // Build payload mapping for current screen fields (excluding text components)
        const payloadMapping = {};
        const currentFields = currentScreen.layout.children[0].children || [];
        const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];

        currentFields.forEach((child, fieldIndex) => {
          if (child.name && !textComponents.includes(child.type) && child.type !== "Footer") {
            const payloadKey = `screen_${i}_${child.name}_${fieldIndex}`;
            payloadMapping[payloadKey] = `\${form.${child.name}}`;
          }
        });

        // Update the footer with navigation
        formChildren[footerIndex] = {
          ...formChildren[footerIndex],
          "on-click-action": {
            name: "navigate",
            next: {
              type: "screen",
              name: nextScreen.id,
            },
            payload: payloadMapping,
          },
        };
      }
    }

    setScreens(updatedScreens);
  };

  // Component palette - Fixed for text components
  const palette = [
    {
      type: "TextInput",
      label: "Text Input",
      config: {
        type: "TextInput",
        name: "text_input",
        label: "Text Input",
        "input-type": "text",
      },
    },
    {
      type: "TextArea",
      label: "Text Area",
      config: {
        type: "TextArea",
        name: "text_area",
        label: "Text Area",
      },
    },
    {
      type: "Dropdown",
      label: "Dropdown",
      config: {
        type: "Dropdown",
        name: "dropdown",
        label: "Dropdown",
        "data-source": [
          { id: "0_Option_1", title: "Option 1" },
          { id: "1_Option_2", title: "Option 2" },
        ],
      },
    },
    {
      type: "RadioButtonsGroup",
      label: "Radio Group",
      config: {
        type: "RadioButtonsGroup",
        name: "radio_group",
        label: "Radio Group",
        "data-source": [
          { id: "0_Yes", title: "Yes" },
          { id: "1_No", title: "No" },
        ],
      },
    },
    {
      type: "CheckboxGroup",
      label: "Checkbox Group",
      config: {
        type: "CheckboxGroup",
        name: "checkbox_group",
        label: "Checkbox Group",
        "data-source": [
          { id: "0_Option_A", title: "Option A" },
          { id: "1_Option_B", title: "Option B" },
        ],
      },
    },
    {
      type: "Footer",
      label: "Footer Button",
      config: {
        type: "Footer",
        label: "Continue",
      },
    },
    {
      type: "Heading",
      label: "Heading",
      config: { type: "TextHeading", text: "Heading" },
    },
    {
      type: "Subheading",
      label: "Subheading",
      config: { type: "TextSubheading", text: "Subheading" },
    },
    {
      type: "Body",
      label: "Body",
      config: { type: "TextBody", text: "Body text" },
    },
    {
      type: "Caption",
      label: "Caption",
      config: { type: "Caption", text: "TextCaption" },
    },
    {
      type: "RichText",
      label: "Rich Text",
      config: { type: "RichText", text: "Rich text content" },
    },
    {
      type: "OptIn",
      label: "Opt In",
      config: { type: "OptIn", name: "optin", label: "Opt In" },
    },
    {
      type: "EmbeddedLink",
      label: "Embedded Link",
      config: {
        type: "EmbeddedLink",
        name: "embedded_link",
        label: "Embedded Link",
      },
    },
    {
      type: "DatePicker",
      label: "Date Picker",
      config: { type: "DatePicker", name: "date_picker", label: "Date Picker" },
    },
    {
      type: "CalendarPicker",
      label: "Calendar Picker",
      config: {
        type: "CalendarPicker",
        name: "calendar_picker",
        label: "Calendar Picker",
      },
    },
    {
      type: "Image",
      label: "Image",
      config: { type: "Image", name: "image", label: "Image" },
    },
    {
      type: "ChipsSelector",
      label: "Chips Selector",
      config: {
        type: "ChipsSelector",
        name: "chips_selector",
        label: "Chips Selector",
      },
    },
  ];

  const selectedScreen = screens.find((s) => s.id === selectedScreenId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Flow Builder
                </h1>
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

                {screens.length > 1 && (
                  <button
                    onClick={autoConnectScreens}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Auto-Connect Screens
                  </button>
                )}

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
                    {screens.map((screen, index) => (
                      <div
                        key={screen.id}
                        className={`p-3 border rounded-lg transition-colors ${
                          selectedScreenId === screen.id
                            ? "bg-blue-50 border-blue-300"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <button
                          className="w-full text-left flex items-center justify-between cursor-pointer"
                          onClick={() => setSelectedScreenId(screen.id)}
                          type="button"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {screen.title}
                            </span>
                            {index === screens.length - 1 && (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                Final
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScreen(screen.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-xs"
                            type="button"
                          >
                            ×
                          </button>
                        </button>
                        <div className="w-full text-left text-xs text-gray-500 mt-1">
                          {screen.layout.children[0].children.length} components
                          {index > 0 && (
                            <span className="ml-2 text-orange-600">
                              • Receives data from {index} previous screens
                            </span>
                          )}
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
                  <p className="text-sm text-gray-500 mb-3">
                    Drag components to the canvas
                  </p>
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
              <div className="col-span-6 space-y-6">
                {screens.length > 0 ? (
                  screens.map((screen) => (
                    <ScreenCanvas
                      key={screen.id}
                      screen={screen}
                      onDropComponent={handleDropComponent}
                      onSelectComponent={handleSelectComponent}
                      onUpdateScreenTitle={handleUpdateScreenTitle}
                      isSelected={selectedScreenId === screen.id}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-xl font-semibold mb-2">
                      Welcome to Flow Builder
                    </h3>
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
            <div className="grid grid-cols-1 gap-6">
              <JSONPreview screens={screens} flowName={flowName} />

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Flow Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {screens.length}
                    </div>
                    <div className="text-sm text-blue-800">Screens</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {screens.reduce(
                        (total, screen) =>
                          total + screen.layout.children[0].children.length,
                        0
                      )}
                    </div>
                    <div className="text-sm text-green-800">
                      Total Components
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {screens.reduce(
                        (total, screen) =>
                          total +
                          screen.layout.children[0].children.filter(
                            (c) => c.required
                          ).length,
                        0
                      )}
                    </div>
                    <div className="text-sm text-purple-800">
                      Required Fields
                    </div>
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
// const CreateMetaFlows = () => {
//   const [flowName, setFlowName] = useState("My Flow");
//   const [screens, setScreens] = useState([]);
//   const [selectedScreenId, setSelectedScreenId] = useState(null);
//   const [selectedComponent, setSelectedComponent] = useState(null);
//   const [activeTab, setActiveTab] = useState("builder"); // "builder" or "preview"

//   // Add screen
//   const addScreen = () => {
//     const newScreen = {
//       id: `screen_${Date.now()}`,
//       title: `Screen ${screens.length + 1}`,
//       layout: {
//         type: "SingleColumnLayout",
//         children: [
//           {
//             type: "Form",
//             name: "form",
//             children: [],
//           },
//         ],
//       },
//     };
//     setScreens([...screens, newScreen]);
//     setSelectedScreenId(newScreen.id);
//   };

//   // Update screen title
//   const handleUpdateScreenTitle = (screenId, newTitle) => {
//     setScreens((prev) =>
//       prev.map((screen) =>
//         screen.id === screenId ? { ...screen, title: newTitle } : screen
//       )
//     );
//   };

//   // Drop component into screen
//   const handleDropComponent = (screenId, item) => {
//     const newComponent = {
//       ...item.config,
//       name: item.config.name || `${item.type.toLowerCase()}_${Date.now()}`,
//       label: item.config.label || item.type,
//     };

//     setScreens((prev) =>
//       prev.map((screen) =>
//         screen.id === screenId
//           ? {
//               ...screen,
//               layout: {
//                 ...screen.layout,
//                 children: screen.layout.children.map((child) =>
//                   child.type === "Form"
//                     ? {
//                         ...child,
//                         children: [...child.children, newComponent],
//                       }
//                     : child
//                 ),
//               },
//             }
//           : screen
//       )
//     );
//   };

//   // Select component
//   const handleSelectComponent = (screenId, compIdx) => {
//     setSelectedScreenId(screenId);
//     const screen = screens.find((s) => s.id === screenId);
//     const comp = screen?.layout.children[0].children[compIdx];
//     if (comp) {
//       setSelectedComponent({ ...comp, screenId, compIdx });
//     }
//   };

//   // Update component
//   const handleUpdateComponent = (updated) => {
//     const { screenId, compIdx, ...componentData } = updated;

//     setScreens((prev) =>
//       prev.map((screen) =>
//         screen.id === screenId
//           ? {
//               ...screen,
//               layout: {
//                 ...screen.layout,
//                 children: screen.layout.children.map((child) =>
//                   child.type === "Form"
//                     ? {
//                         ...child,
//                         children: child.children.map((c, i) =>
//                           i === compIdx ? componentData : c
//                         ),
//                       }
//                     : child
//                 ),
//               },
//             }
//           : screen
//       )
//     );
//     setSelectedComponent(updated);
//   };

//   // Delete component
//   const handleDeleteComponent = () => {
//     if (!selectedComponent) return;

//     const { screenId, compIdx } = selectedComponent;

//     setScreens((prev) =>
//       prev.map((screen) =>
//         screen.id === screenId
//           ? {
//               ...screen,
//               layout: {
//                 ...screen.layout,
//                 children: screen.layout.children.map((child) =>
//                   child.type === "Form"
//                     ? {
//                         ...child,
//                         children: child.children.filter(
//                           (_, i) => i !== compIdx
//                         ),
//                       }
//                     : child
//                 ),
//               },
//             }
//           : screen
//       )
//     );
//     setSelectedComponent(null);
//   };

//   // Delete screen
//   const handleDeleteScreen = (screenId) => {
//     const newScreens = screens.filter((screen) => screen.id !== screenId);
//     setScreens(newScreens);

//     if (selectedScreenId === screenId) {
//       setSelectedScreenId(newScreens.length > 0 ? newScreens[0].id : null);
//       setSelectedComponent(null);
//     }
//   };
//   // Auto-connect screens with proper payload
//   const autoConnectScreens = () => {
//     if (screens.length < 2) return;

//     const updatedScreens = [...screens];

//     // Connect each screen to the next one
//     for (let i = 0; i < updatedScreens.length - 1; i++) {
//       const currentScreen = updatedScreens[i];
//       const nextScreen = updatedScreens[i + 1];

//       // Find and update footer in current screen
//       const formChildren = currentScreen.layout.children[0].children;
//       const footerIndex = formChildren.findIndex(
//         (child) => child.type === "Footer"
//       );

//       if (footerIndex !== -1) {
//         // Build payload mapping for current screen fields
//         const payloadMapping = {};
//         const currentFields = currentScreen.layout.children[0].children || [];

//         currentFields.forEach((child, fieldIndex) => {
//           if (child.name && child.type !== "Footer") {
//             const payloadKey = `screen_${i}_${child.name}_${fieldIndex}`;
//             payloadMapping[payloadKey] = `\${form.${child.name}}`;
//           }
//         });

//         // Update the footer with navigation
//         formChildren[footerIndex] = {
//           ...formChildren[footerIndex],
//           "on-click-action": {
//             name: "navigate",
//             next: {
//               type: "screen",
//               name: nextScreen.id,
//             },
//             payload: payloadMapping,
//           },
//         };
//       }
//     }

//     setScreens(updatedScreens);
//   };

//   // Call this whenever screens change or add a button to trigger it
//   // Component palette
//   const palette = [
//     {
//       type: "TextInput",
//       label: "Text Input",
//       config: {
//         type: "TextInput",
//         name: "text_input",
//         label: "Text Input",
//         "input-type": "text",
//       },
//     },
//     {
//       type: "TextArea",
//       label: "Text Area",
//       config: {
//         type: "TextArea",
//         name: "text_area",
//         label: "Text Area",
//       },
//     },
//     {
//       type: "Dropdown",
//       label: "Dropdown",
//       config: {
//         type: "Dropdown",
//         name: "dropdown",
//         label: "Dropdown",
//         options: ["Option 1", "Option 2"],
//         "data-source": [
//           { id: "0_Option_1", title: "Option 1" },
//           { id: "1_Option_2", title: "Option 2" },
//         ],
//       },
//     },
//     {
//       type: "RadioButtonsGroup",
//       label: "Radio Group",
//       config: {
//         type: "RadioButtonsGroup",
//         name: "radio_group",
//         label: "Radio Group",
//         options: ["Yes", "No"],
//         "data-source": [
//           { id: "0_Yes", title: "Yes" },
//           { id: "1_No", title: "No" },
//         ],
//       },
//     },
//     {
//       type: "CheckboxGroup",
//       label: "Checkbox Group",
//       config: {
//         type: "CheckboxGroup",
//         name: "checkbox_group",
//         label: "Checkbox Group",
//         options: ["Option A", "Option B"],
//         "data-source": [
//           { id: "0_Option_A", title: "Option A" },
//           { id: "1_Option_B", title: "Option B" },
//         ],
//       },
//     },
//     {
//       type: "Footer",
//       label: "Footer Button",
//       config: {
//         type: "Footer",
//         label: "Continue",
//       },
//     },
//   ];

//   const selectedScreen = screens.find((s) => s.id === selectedScreenId);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="min-h-screen bg-gray-50">
//         {/* Header */}
//         <div className="bg-white shadow-sm border-b">
//           <div className="max-w-7xl mx-auto px-4 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   Flow Builder
//                 </h1>
//                 <input
//                   type="text"
//                   value={flowName}
//                   onChange={(e) => setFlowName(e.target.value)}
//                   className="text-lg text-gray-600 border-none bg-transparent focus:outline-none focus:ring-0 mt-1"
//                   placeholder="Enter flow name..."
//                 />
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="flex bg-gray-100 rounded-lg p-1">
//                   <button
//                     onClick={() => setActiveTab("builder")}
//                     className={`px-4 py-2 rounded-md text-sm font-medium ${
//                       activeTab === "builder"
//                         ? "bg-white shadow-sm text-gray-900"
//                         : "text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     Builder
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("preview")}
//                     className={`px-4 py-2 rounded-md text-sm font-medium ${
//                       activeTab === "preview"
//                         ? "bg-white shadow-sm text-gray-900"
//                         : "text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     JSON Preview
//                   </button>
//                 </div>

//                 {screens.length > 1 && (
//                   <button
//                     onClick={autoConnectScreens}
//                     className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
//                   >
//                     Auto-Connect Screens
//                   </button>
//                 )}

//                 <button
//                   onClick={addScreen}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   + Add Screen
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-4 py-6">
//           {activeTab === "builder" ? (
//             <div className="grid grid-cols-12 gap-6">
//               {/* Left Sidebar - Screens & Components */}
//               <div className="col-span-3 space-y-6">
//                 {/* Screens List */}
//                 {/* <div className="bg-white rounded-lg shadow-sm border p-4">
//                   <h2 className="text-lg font-semibold mb-3">Screens</h2>
// <div className="space-y-2">
//   {screens.map((screen) => (
//     <div
//       key={screen.id}
//       className={`p-3 border rounded-lg transition-colors ${
//         selectedScreenId === screen.id
//           ? "bg-blue-50 border-blue-300"
//           : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//       }`}
//     >
//       <div
//         className="flex items-center justify-between cursor-pointer"
//         onClick={() => setSelectedScreenId(screen.id)}
//       >
//         <span className="font-medium text-sm">{screen.title}</span>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             handleDeleteScreen(screen.id);
//           }}
//           className="text-red-500 hover:text-red-700 text-xs"
//         >
//           ×
//         </button>
//       </div>
//       <div
//         className="text-xs text-gray-500 mt-1 cursor-pointer"
//         onClick={() => setSelectedScreenId(screen.id)}
//       >
//         {screen.layout.children[0].children.length} components
//       </div>
//     </div>
//   ))}
// </div>
//                   {screens.length === 0 && (
//                     <p className="text-gray-500 text-sm text-center py-4">
//                       No screens yet. Add your first screen!
//                     </p>
//                   )}
//                 </div> */}
//                 {/* Screens List */}
//                 <div className="bg-white rounded-lg shadow-sm border p-4">
//                   <h2 className="text-lg font-semibold mb-3">Screens</h2>
//                   <div className="space-y-2">
//                     {screens.map((screen, index) => (
//                       <div
//                         key={screen.id}
//                         className={`p-3 border rounded-lg transition-colors ${
//                           selectedScreenId === screen.id
//                             ? "bg-blue-50 border-blue-300"
//                             : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//                         }`}
//                       >
//                         <div
//                           className="flex items-center justify-between cursor-pointer"
//                           onClick={() => setSelectedScreenId(screen.id)}
//                         >
//                           <div className="flex items-center gap-2">
//                             <span className="font-medium text-sm">
//                               {screen.title}
//                             </span>
//                             {index === screens.length - 1 && (
//                               <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded">
//                                 Final
//                               </span>
//                             )}
//                           </div>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDeleteScreen(screen.id);
//                             }}
//                             className="text-red-500 hover:text-red-700 text-xs"
//                           >
//                             ×
//                           </button>
//                         </div>
//                         <div
//                           className="text-xs text-gray-500 mt-1 cursor-pointer"
//                           onClick={() => setSelectedScreenId(screen.id)}
//                         >
//                           {screen.layout.children[0].children.length} components
//                           {index > 0 && (
//                             <span className="ml-2 text-orange-600">
//                               • Receives data from {index} previous screens
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {screens.length === 0 && (
//                     <p className="text-gray-500 text-sm text-center py-4">
//                       No screens yet. Add your first screen!
//                     </p>
//                   )}
//                 </div>
//                 {/* Component Palette */}
//                 <div className="bg-white rounded-lg shadow-sm border p-4">
//                   <h2 className="text-lg font-semibold mb-3">Components</h2>
//                   <p className="text-sm text-gray-500 mb-3">
//                     Drag components to the canvas
//                   </p>
//                   <div className="space-y-2">
//                     {palette.map((item, index) => (
//                       <ComponentItem
//                         key={index}
//                         type={item.type}
//                         label={item.label}
//                         config={item.config}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Middle - Canvas */}
//               <div className="col-span-6">
//                 {selectedScreen ? (
//                   <ScreenCanvas
//                     screen={selectedScreen}
//                     onDropComponent={handleDropComponent}
//                     onSelectComponent={handleSelectComponent}
//                     onUpdateScreenTitle={handleUpdateScreenTitle}
//                   />
//                 ) : (
//                   <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
//                     <div className="text-6xl mb-4">🚀</div>
//                     <h3 className="text-xl font-semibold mb-2">
//                       Welcome to Flow Builder
//                     </h3>
//                     <p className="text-gray-500 mb-4">
//                       Create your first screen to start building your flow
//                     </p>
//                     <button
//                       onClick={addScreen}
//                       className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       Create Your First Screen
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Right - Component Editor */}
//               <div className="col-span-3">
//                 <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
//                   <ComponentEditor
//                     component={selectedComponent}
//                     onChange={handleUpdateComponent}
//                     onDelete={handleDeleteComponent}
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-6">
//               <JSONPreview screens={screens} flowName={flowName} />

//               <div className="bg-white rounded-lg shadow-sm border p-6">
//                 <h3 className="text-lg font-semibold mb-4">Flow Summary</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="text-center p-4 bg-blue-50 rounded-lg">
//                     <div className="text-2xl font-bold text-blue-600">
//                       {screens.length}
//                     </div>
//                     <div className="text-sm text-blue-800">Screens</div>
//                   </div>
//                   <div className="text-center p-4 bg-green-50 rounded-lg">
//                     <div className="text-2xl font-bold text-green-600">
//                       {screens.reduce(
//                         (total, screen) =>
//                           total + screen.layout.children[0].children.length,
//                         0
//                       )}
//                     </div>
//                     <div className="text-sm text-green-800">
//                       Total Components
//                     </div>
//                   </div>
//                   <div className="text-center p-4 bg-purple-50 rounded-lg">
//                     <div className="text-2xl font-bold text-purple-600">
//                       {screens.reduce(
//                         (total, screen) =>
//                           total +
//                           screen.layout.children[0].children.filter(
//                             (c) => c.required
//                           ).length,
//                         0
//                       )}
//                     </div>
//                     <div className="text-sm text-purple-800">
//                       Required Fields
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </DndProvider>
//   );
// };
// ----- Main Flow Builder -----
