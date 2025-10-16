// import React, { useState } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import WhatsAppPreview from './WhatsAppPreview';
// // ComponentItem for draggable palette items
// const ComponentItem = ({ type, label, config }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'component',
//     item: { type, config },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       className={`p-3 border border-gray-200 rounded-lg bg-white cursor-move transition-all ${
//         isDragging ? 'opacity-50' : 'hover:shadow-md'
//       }`}
//     >
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-medium text-gray-700">{label}</span>
//       </div>
//     </div>
//   );
// };

// // ScreenCanvas for drop targets
// const ScreenCanvas = ({ screen, onDropComponent, onSelectComponent, onUpdateScreenTitle, isSelected }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: 'component',
//     drop: (item) => onDropComponent(screen.id, item),
//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//   }));

//   const formChildren = screen.layout.children[0].children;

//   return (
//     <div
//       className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
//         isSelected ? 'border-blue-500' : 'border-gray-200'
//       } ${isOver ? 'bg-blue-50' : ''}`}
//     >
//       <div className="mb-4">
//         <input
//           type="text"
//           value={screen.title}
//           onChange={(e) => onUpdateScreenTitle(screen.id, e.target.value)}
//           className="text-xl font-bold w-full border-none focus:outline-none focus:ring-0 bg-transparent"
//           placeholder="Screen title..."
//         />
//       </div>

//       <div
//         ref={drop}
//         className={`min-h-200 p-4 border-2 border-dashed rounded-lg transition-colors ${
//           isOver ? 'border-blue-400 bg-blue-25' : 'border-gray-300'
//         }`}
//       >
//         {formChildren.length === 0 ? (
//           <div className="text-center text-gray-500 py-8">
//             <div className="text-4xl mb-2">⬇️</div>
//             <p>Drag components here</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {formChildren.map((component, index) => (
//               <div
//                 key={index}
//                 onClick={() => onSelectComponent(screen.id, index)}
//                 className={`p-3 border rounded-lg cursor-pointer transition-colors ${
//                   false /* Add your selection logic here */
//                     ? 'bg-blue-50 border-blue-300'
//                     : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="font-medium text-sm">{component.type}</span>
//                   <span className="text-xs text-gray-500">
//                     {component.label || component.text || 'No content'}
//                   </span>
//                 </div>
//                 {component.text && (
//                   <p className="text-xs text-gray-600 mt-1 truncate">
//                     {component.text}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ComponentEditor - Fixed to exclude label/name for text components
// const ComponentEditor = ({ component, onChange, onDelete }) => {
//   if (!component) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         <div className="text-4xl mb-2">⚙️</div>
//         <p>Select a component to edit its properties</p>
//       </div>
//     );
//   }

//   const handleChange = (updates) => {
//     onChange({ ...component, ...updates });
//   };

//   // Component type arrays
//   const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
//   const optionComponents = ["Dropdown", "RadioButtonsGroup", "CheckboxGroup", "ChipsSelector"];
//   const pickerComponents = ["DatePicker", "CalendarPicker"];
//   const specialComponents = ["OptIn", "EmbeddedLink", "Image", "Footer"];

//   // Check if component should have label/name fields
//   const shouldShowLabelName = !textComponents.includes(component.type) &&
//                               !specialComponents.includes(component.type);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold">Edit {component.type}</h3>
//         <button
//           onClick={onDelete}
//           className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
//         >
//           Delete
//         </button>
//       </div>

//       <div className="space-y-4">
//         {/* Label & Name - Only show for non-text components */}
//         {shouldShowLabelName && (
//           <>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
//               <input
//                 type="text"
//                 value={component.label || ""}
//                 onChange={(e) => handleChange({ label: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter label..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
//               <input
//                 type="text"
//                 value={component.name || ""}
//                 onChange={(e) => handleChange({ name: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter field name..."
//               />
//             </div>

//             {component.type !== "Footer" && (
//               <div>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={component.required || false}
//                     onChange={(e) => handleChange({ required: e.target.checked })}
//                     className="mr-2"
//                   />
//                   <span className="text-sm font-medium text-gray-700">
//                     Required Field
//                   </span>
//                 </label>
//               </div>
//             )}
//           </>
//         )}

//         {/* Text content for text components */}
//         {textComponents.includes(component.type) && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Text Content
//             </label>
//             <textarea
//               value={component.text || ""}
//               onChange={(e) => handleChange({ text: e.target.value })}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter text content..."
//             />
//           </div>
//         )}

//         {/* Helper text for TextInput & TextArea */}
//         {(component.type === "TextInput" || component.type === "TextArea") && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Helper Text</label>
//             <input
//               type="text"
//               value={component.helperText || ""}
//               onChange={(e) => handleChange({ helperText: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Helper text..."
//             />
//           </div>
//         )}

//         {/* Input type for TextInput */}
//         {component.type === "TextInput" && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Input Type</label>
//             <select
//               value={component["input-type"] || "text"}
//               onChange={(e) => handleChange({ "input-type": e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="text">Text</option>
//               <option value="email">Email</option>
//               <option value="number">Number</option>
//               <option value="tel">Telephone</option>
//               <option value="url">URL</option>
//             </select>
//           </div>
//         )}

//         {/* Options for Dropdown, Radio, Checkbox, ChipsSelector */}
//         {optionComponents.includes(component.type) && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Options (one per line)</label>
//             <textarea
//               value={component.options ? component.options.join("\n") : ""}
//               onChange={(e) => {
//                 const options = e.target.value.split("\n").filter((opt) => opt.trim());
//                 const dataSource = options.map((opt, index) => ({
//                   id: `${index}_${opt.replace(/\s+/g, "_")}`,
//                   title: opt.trim(),
//                 }));
//                 handleChange({ options, "data-source": dataSource });
//               }}
//               rows={5}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter each option on a new line..."
//             />
//           </div>
//         )}

//         {/* Special cases */}
//         {component.type === "Footer" && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
//             <input
//               type="text"
//               value={component.label || "Continue"}
//               onChange={(e) => handleChange({ label: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Button text..."
//             />
//           </div>
//         )}

//         {component.type === "OptIn" && (
//           <div>
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={component.checked || false}
//                 onChange={(e) => handleChange({ checked: e.target.checked })}
//                 className="mr-2"
//               />
//               <span className="text-sm text-gray-700">Checked by default</span>
//             </label>
//           </div>
//         )}

//         {component.type === "EmbeddedLink" && (
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">URL</label>
//             <input
//               type="text"
//               value={component.url || ""}
//               onChange={(e) => handleChange({ url: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="https://example.com"
//             />
//           </div>
//         )}

//         {(component.type === "DatePicker" || component.type === "CalendarPicker") && (
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Date Format</label>
//             <input
//               type="text"
//               value={component.format || "YYYY-MM-DD"}
//               onChange={(e) => handleChange({ format: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="YYYY-MM-DD"
//             />
//           </div>
//         )}

//         {component.type === "Image" && (
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Image URL</label>
//             <input
//               type="text"
//               value={component.src || ""}
//               onChange={(e) => handleChange({ src: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="https://example.com/image.png"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // JSONPreview - Fixed to exclude text components from payload
// const JSONPreview = ({ screens, flowName }) => {
//   const generateFlowJSON = () => {
//     const flowScreens = screens.map((screen, index) => {
//       // Build data structure for incoming data (from previous screens)
//       const dataStructure = {};
//       if (index > 0) {
//         // Collect all field names from previous screens (excluding text components)
//         for (let prevIndex = 0; prevIndex < index; prevIndex++) {
//           const prevScreen = screens[prevIndex];
//           const formChildren = prevScreen.layout.children[0].children || [];
//           formChildren.forEach((child, fieldIndex) => {
//             // Only include components that have name and are not text components
//             const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
//             if (child.name && !textComponents.includes(child.type) && child.type !== "Footer") {
//               const dataKey = `screen_${prevIndex}_${child.name}_${fieldIndex}`;
//               if (child.type === "CheckboxGroup") {
//                 // CheckboxGroup should be an array
//                 dataStructure[dataKey] = {
//                   type: "array",
//                   items: {
//                     type: "string",
//                   },
//                   __example__: [],
//                 };
//               } else {
//                 dataStructure[dataKey] = {
//                   type: "string",
//                   __example__: "Example value",
//                 };
//               }
//             }
//           });
//         }
//       }

//       const baseScreen = {
//         id: screen.id,
//         title: screen.title,
//         data: dataStructure,
//         layout: JSON.parse(JSON.stringify(screen.layout)), // Deep clone to avoid mutations
//         terminal: index === screens.length - 1,
//       };

//       // Clean up layout - remove label/name from text components in the final JSON
//       const cleanLayout = (layout) => {
//         if (layout.children && Array.isArray(layout.children)) {
//           layout.children = layout.children.map(child => {
//             const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
//             if (textComponents.includes(child.type)) {
//               // Only include type and text for text components
//               const { type, text } = child;
//               return { type, text };
//             }
//             return child;
//           });
//         }
//         return layout;
//       };

//       baseScreen.layout = cleanLayout(baseScreen.layout);

//       // Add navigation actions to non-terminal screens
//       if (index < screens.length - 1) {
//         const formChildren = baseScreen.layout.children[0].children;
//         const footerIndex = formChildren.findIndex(
//           (child) => child.type === "Footer"
//         );
//         if (footerIndex !== -1) {
//           // Build payload mapping for navigation (excluding text components)
//           const payloadMapping = {};
//           const currentFormChildren = screen.layout.children[0].children || [];

//           currentFormChildren.forEach((child, fieldIndex) => {
//             const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
//             if (child.name && !textComponents.includes(child.type) && child.type !== "Footer") {
//               const payloadKey = `screen_${index}_${child.name}_${fieldIndex}`;
//               payloadMapping[payloadKey] = `\${form.${child.name}}`;
//             }
//           });

//           // Also include data from previous screens
//           Object.keys(dataStructure).forEach((dataKey) => {
//             payloadMapping[dataKey] = `\${data.${dataKey}}`;
//           });

//           formChildren[footerIndex] = {
//             ...formChildren[footerIndex],
//             "on-click-action": {
//               name: "navigate",
//               next: {
//                 type: "screen",
//                 name: screens[index + 1].id,
//               },
//               payload: payloadMapping,
//             },
//           };
//         }
//       }

//       // Add complete action to terminal screen
//       if (index === screens.length - 1) {
//         const formChildren = baseScreen.layout.children[0].children;
//         const footerIndex = formChildren.findIndex(
//           (child) => child.type === "Footer"
//         );
//         if (footerIndex !== -1) {
//           // Build complete payload with ALL data (excluding text components)
//           const completePayload = {};

//           // Add current screen form data (excluding text components)
//           const currentFormChildren = screen.layout.children[0].children || [];
//           currentFormChildren.forEach((child, fieldIndex) => {
//             const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];
//             if (child.name && !textComponents.includes(child.type) && child.type !== "Footer") {
//               const payloadKey = `screen_${index}_${child.name}_${fieldIndex}`;
//               completePayload[payloadKey] = `\${form.${child.name}}`;
//             }
//           });

//           // Add all previous screens data
//           Object.keys(dataStructure).forEach((dataKey) => {
//             completePayload[dataKey] = `\${data.${dataKey}}`;
//           });

//           formChildren[footerIndex] = {
//             ...formChildren[footerIndex],
//             "on-click-action": {
//               name: "complete",
//               payload: completePayload,
//             },
//           };
//         }
//       }

//       return baseScreen;
//     });

//     return {
//       name: flowName || "Untitled Flow",
//       categories: ["CUSTOM"],
//       screens: flowScreens,
//       version: "7.2",
//     };
//   };

//   const flowJSON = generateFlowJSON();

//   return (
//     <div className="bg-white rounded-lg shadow-sm border">
//       <div className="p-4 border-b">
//         <h3 className="text-lg font-semibold">JSON Preview</h3>
//         <p className="text-sm text-gray-500 mt-1">
//           Dynamic payload and data flow between screens (text components excluded from payload)
//         </p>
//       </div>
//       <div className="p-4">
//         <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm max-h-96">
//           {JSON.stringify(flowJSON, null, 2)}
//         </pre>
//         <button
//           onClick={() =>
//             navigator.clipboard.writeText(JSON.stringify(flowJSON, null, 2))
//           }
//           className="mt-3 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
//         >
//           Copy JSON
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const CreateMetaFlows = () => {
//   const [flowName, setFlowName] = useState("My Flow");
//   const [screens, setScreens] = useState([]);
//   const [selectedScreenId, setSelectedScreenId] = useState(null);
//   const [selectedComponent, setSelectedComponent] = useState(null);
//   const [activeTab, setActiveTab] = useState("builder");

//   // Add screen
//   const addScreen = () => {
//     const newScreen = {
//    id: `screen-${Math.random().toString(36).replace(/[^a-z]/g, "").substring(0, 8)}`,

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

//   // Drop component into screen - Fixed for text components
//   const handleDropComponent = (screenId, item) => {
//     const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];

//     let newComponent;

//     if (textComponents.includes(item.type)) {
//       // For text components, only include type and text
//       newComponent = {
//         type: item.type,
//         text: item.config.text || item.type,
//       };
//     } else if (item.type === "Footer") {
//       // For Footer, only include type and label
//       newComponent = {
//         type: item.type,
//         label: item.config.label || "Continue",
//       };
//     } else {
//       // For other components, include all config properties
//       newComponent = {
//         ...item.config,
//         label: item.config.label || item.type,
//         name: item.config.name || `${item.type.toLowerCase()}_${Date.now()}`,
//       };
//     }

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
//         // Build payload mapping for current screen fields (excluding text components)
//         const payloadMapping = {};
//         const currentFields = currentScreen.layout.children[0].children || [];
//         const textComponents = ["Heading", "Subheading", "Body", "Caption", "RichText"];

//         currentFields.forEach((child, fieldIndex) => {
//           if (child.name && !textComponents.includes(child.type) && child.type !== "Footer") {
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

//   // Component palette - Fixed for text components
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
//     {
//       type: "Heading",
//       label: "Heading",
//       config: { type: "TextHeading", text: "Heading" },
//     },
//     {
//       type: "Subheading",
//       label: "Subheading",
//       config: { type: "TextSubheading", text: "Subheading" },
//     },
//     {
//       type: "Body",
//       label: "Body",
//       config: { type: "TextBody", text: "Body text" },
//     },
//     {
//       type: "Caption",
//       label: "Caption",
//       config: { type: "Caption", text: "TextCaption" },
//     },
//     {
//       type: "RichText",
//       label: "Rich Text",
//       config: { type: "RichText", text: "Rich text content" },
//     },
//     {
//       type: "OptIn",
//       label: "Opt In",
//       config: { type: "OptIn", name: "optin", label: "Opt In" },
//     },
//     {
//       type: "EmbeddedLink",
//       label: "Embedded Link",
//       config: {
//         type: "EmbeddedLink",
//         name: "embedded_link",
//         label: "Embedded Link",
//       },
//     },
//     {
//       type: "DatePicker",
//       label: "Date Picker",
//       config: { type: "DatePicker", name: "date_picker", label: "Date Picker" },
//     },
//     {
//       type: "CalendarPicker",
//       label: "Calendar Picker",
//       config: {
//         type: "CalendarPicker",
//         name: "calendar_picker",
//         label: "Calendar Picker",
//       },
//     },
//     {
//       type: "Image",
//       label: "Image",
//       config: { type: "Image", name: "image", label: "Image" },
//     },
//     {
//       type: "ChipsSelector",
//       label: "Chips Selector",
//       config: {
//         type: "ChipsSelector",
//         name: "chips_selector",
//         label: "Chips Selector",
//       },
//     },
//   ];

//   const selectedScreen = screens.find((s) => s.id === selectedScreenId);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="min-h-screen bg-gray-50">
//         {/* Header */}
//         {/* <div className="bg-white shadow-sm border-b">
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
//         </div> */}
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
//                   <button
//                     onClick={() => setActiveTab("whatsapp")}
//                     className={`px-4 py-2 rounded-md text-sm font-medium ${
//                       activeTab === "whatsapp"
//                         ? "bg-white shadow-sm text-gray-900"
//                         : "text-gray-600 hover:text-gray-900"
//                     }`}
//                   >
//                     WhatsApp Preview
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
//          <div className="max-w-7xl mx-auto px-4 py-6">
//           {activeTab === "builder" ? (
//             <div className="grid grid-cols-12 gap-6">
//               {/* Left Sidebar - Screens & Components */}
//               <div className="col-span-3 space-y-6">
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
//                         <button
//                           className="w-full text-left flex items-center justify-between cursor-pointer"
//                           onClick={() => setSelectedScreenId(screen.id)}
//                           type="button"
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
//                             type="button"
//                           >
//                             ×
//                           </button>
//                         </button>
//                         <div className="w-full text-left text-xs text-gray-500 mt-1">
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
//               <div className="col-span-6 space-y-6">
//                 {screens.length > 0 ? (
//                   screens.map((screen) => (
//                     <ScreenCanvas
//                       key={screen.id}
//                       screen={screen}
//                       onDropComponent={handleDropComponent}
//                       onSelectComponent={handleSelectComponent}
//                       onUpdateScreenTitle={handleUpdateScreenTitle}
//                       isSelected={selectedScreenId === screen.id}
//                     />
//                   ))
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
//           ) : activeTab === "preview" ? (
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
//             </div> ) : (  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2">
//                 <div className="bg-white rounded-lg shadow-sm border p-6">
//                   <h2 className="text-xl font-semibold mb-4">WhatsApp Flow Preview</h2>
//                   <p className="text-gray-600 mb-6">
//                     See how your flow will appear to users in WhatsApp. Navigate through screens and test the user experience.
//                   </p>
//                   <div className="h-[600px]">
//                     <WhatsAppPreview screens={screens} flowName={flowName} />
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div className="bg-white rounded-lg shadow-sm border p-6">
//                   <h3 className="text-lg font-semibold mb-4">Preview Instructions</h3>
//                   <ul className="text-sm text-gray-600 space-y-2">
//                     <li>• Use navigation buttons to move between screens</li>
//                     <li>• Click "Continue" buttons to simulate user progression</li>
//                     <li>• Watch typing indicators between transitions</li>
//                     <li>• Final screen shows completion message</li>
//                     <li>• Reset to start from the beginning</li>
//                   </ul>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-sm border p-6">
//                   <h3 className="text-lg font-semibold mb-4">Flow Status</h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Total Screens:</span>
//                       <span className="font-semibold">{screens.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Components:</span>
//                       <span className="font-semibold">
//                         {screens.reduce((total, screen) =>
//                           total + (screen.layout?.children?.[0]?.children?.length || 0), 0)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Flow Ready:</span>
//                       <span className={`font-semibold ${
//                         screens.length > 0 ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {screens.length > 0 ? 'Yes' : 'No'}
//                       </span>
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

// export default CreateMetaFlows;
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

import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import WhatsAppPreview from "./WhatsAppPreview";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import {
  Type,
  AlignLeft,
  FileText,
  Quote,
  Edit3,
  ChevronDown,
  Radio,
  CheckSquare,
  ToggleRight,
  Link2,
  Calendar,
  List,
  CalendarDays,
  Image as ImageIcon,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import Button from "../Button";
import toast from "react-hot-toast";
import InstructionPanel from "./InstructionPanel";
// Modal Component for Editing
// const EditComponentModal = ({ component, onSave, onDelete, onClose }) => {
//   const [editedComponent, setEditedComponent] = useState(component);

//   const handleChange = (updates) => {
//     setEditedComponent({ ...editedComponent, ...updates });
//   };

//   const handleSave = () => {
//     onSave(editedComponent);
//     onClose();
//   };

//   // Component type arrays
//   const textComponents = [
//     "TextHeading",
//     "TextSubheading",
//     "TextBody",
//     "TextCaption",
//     "RichText",
//   ];
//   const optionComponents = [
//     "Dropdown",
//     "RadioButtonsGroup",
//     "CheckboxGroup",
//     "ChipsSelector",
//   ];
//   const pickerComponents = ["DatePicker", "CalendarPicker"];
//   const specialComponents = ["OptIn", "EmbeddedLink", "Image", "Footer"];

//   // Check if component should have label/name fields
//   const shouldShowLabelName =
//     !textComponents.includes(editedComponent.type) &&
//     !specialComponents.includes(editedComponent.type);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xl font-semibold">
//               Edit {editedComponent.type}
//             </h3>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 text-2xl"
//             >
//               ×
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Label & Name - Only show for non-text components */}
//           {shouldShowLabelName && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Label
//                 </label>
//                 <input
//                   type="text"
//                   value={editedComponent.label || ""}
//                   onChange={(e) => handleChange({ label: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter label..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Field Name
//                 </label>
//                 <input
//                   type="text"
//                   value={editedComponent.name || ""}
//                   onChange={(e) => handleChange({ name: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter field name..."
//                 />
//               </div>

//               {editedComponent.type !== "Footer" && (
//                 <div>
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={editedComponent.required || false}
//                       onChange={(e) =>
//                         handleChange({ required: e.target.checked })
//                       }
//                       className="mr-2"
//                     />
//                     <span className="text-sm font-medium text-gray-700">
//                       Required Field
//                     </span>
//                   </label>
//                 </div>
//               )}
//             </>
//           )}

//           {/* Text content for text components */}
//           {textComponents.includes(editedComponent.type) && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Text Content
//               </label>
//               <textarea
//                 value={editedComponent.text || ""}
//                 onChange={(e) => handleChange({ text: e.target.value })}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter text content..."
//               />
//             </div>
//           )}

//           {/* Helper text for TextInput & TextArea */}
//           {(editedComponent.type === "TextInput" ||
//             editedComponent.type === "TextArea") && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Helper Text
//               </label>
//               <input
//                 type="text"
//                 value={editedComponent.helperText || ""}
//                 onChange={(e) => handleChange({ helperText: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Helper text..."
//               />
//             </div>
//           )}

//           {/* Input type for TextInput */}
//           {editedComponent.type === "TextInput" && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Input Type
//               </label>
//               <select
//                 value={editedComponent["input-type"] || "text"}
//                 onChange={(e) => handleChange({ "input-type": e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="text">Text</option>
//                 <option value="email">Email</option>
//                 <option value="number">Number</option>
//                 <option value="tel">Telephone</option>
//                 <option value="url">URL</option>
//               </select>
//             </div>
//           )}

//           {/* Options for Dropdown, Radio, Checkbox, ChipsSelector */}
//           {optionComponents.includes(editedComponent.type) && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Options (one per line)
//               </label>
//               <textarea
//                 value={
//                   editedComponent.options
//                     ? editedComponent.options.join("\n")
//                     : ""
//                 }
//                 onChange={(e) => {
//                   const options = e.target.value
//                     .split("\n")
//                     .filter((opt) => opt.trim());
//                   const dataSource = options.map((opt, index) => ({
//                     id: `${index}_${opt.replace(/\s+/g, "_")}`,
//                     title: opt.trim(),
//                   }));
//                   handleChange({ options, "data-source": dataSource });
//                 }}
//                 rows={5}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter each option on a new line..."
//               />
//             </div>
//           )}

//           {/* Special cases */}
//           {editedComponent.type === "Footer" && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Button Label
//               </label>
//               <input
//                 type="text"
//                 value={editedComponent.label || "Continue"}
//                 onChange={(e) => handleChange({ label: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Button text..."
//               />
//             </div>
//           )}

//           {editedComponent.type === "OptIn" && (
//             <div>
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={editedComponent.checked || false}
//                   onChange={(e) => handleChange({ checked: e.target.checked })}
//                   className="mr-2"
//                 />
//                 <span className="text-sm text-gray-700">
//                   Checked by default
//                 </span>
//               </label>
//             </div>
//           )}

//           {editedComponent.type === "EmbeddedLink" && (
//             <div>
//               <label className="block text-sm text-gray-700 mb-1">URL</label>
//               <input
//                 type="text"
//                 value={editedComponent.url || ""}
//                 onChange={(e) => handleChange({ url: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="https://example.com"
//               />
//             </div>
//           )}

//           {(editedComponent.type === "DatePicker" ||
//             editedComponent.type === "CalendarPicker") && (
//             <div>
//               <label className="block text-sm text-gray-700 mb-1">
//                 Date Format
//               </label>
//               <input
//                 type="text"
//                 value={editedComponent.format || "YYYY-MM-DD"}
//                 onChange={(e) => handleChange({ format: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="YYYY-MM-DD"
//               />
//             </div>
//           )}

//           {editedComponent.type === "Image" && (
//             <div>
//               <label className="block text-sm text-gray-700 mb-1">
//                 Image URL
//               </label>
//               <input
//                 type="text"
//                 value={editedComponent.src || ""}
//                 onChange={(e) => handleChange({ src: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="https://example.com/image.png"
//               />
//             </div>
//           )}
//         </div>

//         <div className="p-6 border-t flex justify-between">
//           <button
//             onClick={onDelete}
//             className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//           >
//             Delete Component
//           </button>
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// ComponentItem for draggable palette items
// const ComponentItem = ({ type, label, config }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "component",
//     item: { type, config },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       className={`p-3 border border-gray-200 rounded-lg bg-white cursor-move transition-all ${
//         isDragging ? "opacity-50" : "hover:shadow-md"
//       }`}
//     >
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-medium text-gray-700">{label}</span>
//       </div>
//     </div>
//   );
// };

const EditComponentModal = ({ component, onSave, onDelete, onClose }) => {
  const [editedComponent, setEditedComponent] = useState(component);
const validationRules = {
  TextHeading: { max: 80, label: "Heading" },
  TextSubheading: { max: 80, label: "Subheading" },
  TextBody: { max: 4096, label: "Body" },
  TextCaption: { max: 409, label: "Caption" },
  Dropdown: { maxOptionLength: 30 },
  RadioButtonsGroup: { maxOptionLength: 30 },
  CheckboxGroup: { maxOptionLength: 30 },
  ChipsSelector: { maxOptionLength: 30 },
  TextInput: { max: 200 },
  TextArea: { max: 2000 },
};

// ✅ Validation rules before saving
const validateBeforeSave = () => {
  const type = editedComponent.type;

  // Common required field validation
  if (shouldShowLabelName && !editedComponent.label?.trim()) {
    toast.error("Label is required.");
    return false;
  }

  if (shouldShowLabelName && !editedComponent.name?.trim()) {
    toast.error("Field name is required.");
    return false;
  }

  // Component-type-specific validation
  switch (type) {
    case "TextHeading":
    case "TextSubheading":
    case "TextBody":
    case "TextCaption":
      if (!editedComponent.text?.trim()) {
        toast.error(`${type.replace("Text", "")} cannot be empty.`);
        return false;
      }
      break;

    case "Image":
      if (!editedComponent.src) {
        toast.error("Please upload or provide an image (Base64 or URL).");
        return false;
      }
      if (editedComponent.width <= 0 || editedComponent.height <= 0) {
        toast.error("Image width and height must be greater than zero.");
        return false;
      }
      break;

    case "Dropdown":
    case "RadioButtonsGroup":
    case "CheckboxGroup":
    case "ChipsSelector":
      if (!editedComponent["data-source"] || editedComponent["data-source"].length === 0) {
        toast.error("Please add at least one option.");
        return false;
      }
      break;

    case "Footer":
      if (!editedComponent.label?.trim()) {
        toast.error("Footer button label is required.");
        return false;
      }
      break;

    case "OptIn":
      if (!editedComponent.label?.trim()) {
        toast.error("Opt-in label is required.");
        return false;
      }
      if (!editedComponent.name?.trim()) {
        toast.error("Opt-in name is required.");
        return false;
      }
      break;

    case "EmbeddedLink":
      if (!editedComponent.text?.trim()) {
        toast.error("Embedded link text is required.");
        return false;
      }
      const action = editedComponent["on-click-action"]?.name;
      if (action === "open_url" && !editedComponent["on-click-action"]?.url?.trim()) {
        toast.error("URL is required for 'Open URL' action.");
        return false;
      }
      if (action === "navigate" && !editedComponent["on-click-action"]?.next?.name?.trim()) {
        toast.error("Next screen name is required for 'Navigate' action.");
        return false;
      }
      break;

    case "NavigationList":
      if (!editedComponent["list-items"] || editedComponent["list-items"].length === 0) {
        toast.error("Add at least one navigation list item.");
        return false;
      }
      for (const [index, item] of editedComponent["list-items"].entries()) {
        if (!item["main-content"].title?.trim()) {
          toast.error(`Item ${index + 1}: Title is required.`);
          return false;
        }
        if (!item["on-click-action"]?.next?.name?.trim()) {
          toast.error(`Item ${index + 1}: Next screen name is required.`);
          return false;
        }
      }
      break;

    case "PhotoPicker":
      if (!editedComponent.label?.trim()) {
        toast.error("Photo picker label is required.");
        return false;
      }
      if (!editedComponent["max-uploaded-photos"] || editedComponent["max-uploaded-photos"] < 1) {
        toast.error("Max uploaded photos must be at least 1.");
        return false;
      }
      break;

    case "DocumentPicker":
      if (!editedComponent.label?.trim()) {
        toast.error("Document picker label is required.");
        return false;
      }
      if (!editedComponent["max-uploaded-documents"] || editedComponent["max-uploaded-documents"] < 1) {
        toast.error("Max uploaded documents must be at least 1.");
        return false;
      }
      break;

    default:
      break;
  }

  return true; // ✅ all validations passed
};

  const handleChange = (updates) => {
    setEditedComponent({ ...editedComponent, ...updates });
  };
const validateTextLength = (value, max, fieldName) => {
  if (value.length > max) {
    toast.error(`${fieldName} cannot exceed ${max} characters.`);
    return value.slice(0, max); // auto-truncate safely
  }
  return value;
};
  const handleSave = () => {
  if (!validateBeforeSave()) return; // stop if invalid
  onSave(editedComponent);
  onClose();
};
// 🧩 Image uploader — converts to Base64 and updates component config
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // remove "data:image/png;base64,"
      handleChange({ src: base64String });
    };
    reader.readAsDataURL(file);
  };

  // Component type arrays
  const textComponents = [
    "TextHeading",
    "TextSubheading",
    "TextBody",
    "TextCaption",
    "RichText",
  ];
  const optionComponents = [
    "Dropdown",
    "RadioButtonsGroup",
    "CheckboxGroup",
    "ChipsSelector",
  ];
  const pickerComponents = ["DatePicker", "CalendarPicker"];
  const specialComponents = ["OptIn", "EmbeddedLink", "Image", "Footer"];

  const shouldShowLabelName =
    !textComponents.includes(editedComponent.type) &&
    !specialComponents.includes(editedComponent.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">Edit {editedComponent.type}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 🔹 Visible toggle (applies to all) */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editedComponent.visible ?? true}
                onChange={(e) => handleChange({ visible: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Visible</span>
            </label>
          </div>

          {/* Label & Name for non-text components */}
          {shouldShowLabelName && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
               <input
  type="text"
  value={editedComponent.label || ""}
  onChange={(e) => {
    const value = validateTextLength(e.target.value, 20, "Label");
    handleChange({ label: value });
  }}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
  placeholder="Enter label..."
/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name
                </label>
                <input
                  type="text"
                  value={editedComponent.name || ""}
                  onChange={(e) => handleChange({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter field name..."
                />
              </div>
{(editedComponent.type !== "Footer" && editedComponent.type !== "NavigationList") && (
  <div>
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={editedComponent.required || false}
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

          {/* Text content for Text components */}
          {textComponents.includes(editedComponent.type) && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Text Content
    </label>
    <textarea
      value={editedComponent.text || ""}
      onChange={(e) => {
        const rule = validationRules[editedComponent.type];
        const value = rule
          ? validateTextLength(e.target.value, rule.max, rule.label)
          : e.target.value;
        handleChange({ text: value });
      }}
      rows={3}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      placeholder="Enter text content..."
    />
  </div>
)}
          {/* Placeholder for TextInput/TextArea */}
          {/* {["TextInput", "TextArea"].includes(editedComponent.type) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={editedComponent.placeholder || ""}
                onChange={(e) => handleChange({ placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter placeholder..."
              />
            </div>
          )} */}

          {/* Default Value for input-like components */}
          {/* {["Dropdown", "RadioButtonsGroup"].includes(editedComponent.type) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Value
              </label>
              <input
                type="text"
                value={editedComponent.defaultValue || ""}
                onChange={(e) => handleChange({ defaultValue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Optional default..."
              />
            </div>
          )} */}

          {/* Helper text for TextInput & TextArea */}
          {(editedComponent.type === "TextInput" ||
            editedComponent.type === "TextArea") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Helper Text
              </label>
              <input
                type="text"
                value={editedComponent["helper-text"] || ""}
                onChange={(e) =>
                  handleChange({ ["helper-text"]: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Helper text..."
              />
            </div>
          )}

          {/* Input type for TextInput */}
          {editedComponent.type === "TextInput" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Input Type
              </label>
              <select
                value={editedComponent["input-type"] || "text"}
                onChange={(e) => handleChange({ "input-type": e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="password">password</option>
                <option value="phone">phone</option>
                <option value="passcode">passcode</option>
              </select>
            </div>
          )}
          {/* text, number, password, passcode, phone, email */}

          {/* Options for Dropdown/Radio/Checkbox/ChipsSelector */}
          {optionComponents.includes(editedComponent.type) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (one per line)
              </label>

              <div className="relative">
                {/* Local state for input */}
                {(() => {
                  const [newOption, setNewOption] = useState("");
                  const dataSource = editedComponent["data-source"] || [];

                  const addOption = () => {
                    const opt = newOption.trim();
                    if (opt && !dataSource.some((o) => o.title === opt)) {
                      const updated = [
                        ...dataSource,
                        {
                          id: `${dataSource.length}_${opt.replace(
                            /\s+/g,
                            "_"
                          )}`,
                          title: opt,
                        },
                      ];
                      handleChange({ "data-source": updated });
                      setNewOption(""); // local reset, not in payload
                    }
                  };

                  return (
                    <>
                      {/* Textarea for existing options */}
                      <textarea
                        value={dataSource.map((opt) => opt.title).join("\n")}
                        onKeyDown={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const options = e.target.value
                            .split("\n")
                            .filter((opt) => opt.trim());
                          const newData = options.map((opt, index) => ({
                            id: `${index}_${opt.replace(/\s+/g, "_")}`,
                            title: opt.trim(),
                          }));
                          handleChange({ "data-source": newData });
                        }}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder="Type each option on a new line..."
                      />

                      {/* Input + Add button */}
                      <div className="flex items-center gap-2 mt-3">
                        <input
                          type="text"
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addOption();
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new option..."
                        />
                        <button
                          type="button"
                          onClick={addOption}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                          Add
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Footer Button */}
          {editedComponent.type === "Footer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={editedComponent.label || "Continue"}
                onChange={(e) => handleChange({ label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Button text..."
              />
            </div>
          )}

          {/* OptIn */}
         {editedComponent.type === "OptIn" && (
  <div className="space-y-3">
    {/* Label */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Label
      </label>
      <input
        type="text"
        value={editedComponent.label || ""}
        onChange={(e) => handleChange({ label: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        placeholder="I agree to terms"
      />
    </div>

    {/* Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Name
      </label>
      <input
        type="text"
        value={editedComponent.name || ""}
        onChange={(e) => handleChange({ name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        placeholder="optin"
      />
    </div>

    {/* Required */}
    <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={editedComponent.required || false}
          onChange={(e) => handleChange({ required: e.target.checked })}
          className="mr-2"
        />
        <span className="text-sm text-gray-700">Required</span>
      </label>
    </div>

    {/* Visible */}
    <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={
            editedComponent.visible === undefined
              ? true
              : editedComponent.visible
          }
          onChange={(e) => handleChange({ visible: e.target.checked })}
          className="mr-2"
        />
        <span className="text-sm text-gray-700">Visible</span>
      </label>
    </div>

    {/* Checked by default */}
    {/* <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={editedComponent["init-value"] || false}
          onChange={(e) => handleChange({ ["init-value"]: e.target.checked })}
          className="mr-2"
        />
        <span className="text-sm text-gray-700">Checked by default</span>
      </label>
    </div> */}

    {/* on-click-action */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        On Click Action (Read more)
      </label>
      <select
        value={editedComponent["on-click-action"]?.name || ""}
        onChange={(e) =>
          handleChange({
            ["on-click-action"]: {
              ...editedComponent["on-click-action"],
              name: e.target.value,
            },
          })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="">None</option>
        <option value="data_exchange">Data Exchange</option>
        <option value="navigate">Navigate</option>
        <option value="open_url">Open URL</option>
      </select>

      {editedComponent["on-click-action"]?.name === "open_url" && (
        <div className="mt-2">
          <input
            type="text"
            value={editedComponent["on-click-action"]?.url || ""}
            onChange={(e) =>
              handleChange({
                ["on-click-action"]: {
                  ...editedComponent["on-click-action"],
                  url: e.target.value,
                },
              })
            }
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  </div>
)}
{editedComponent.type === "NavigationList" && (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold">Navigation List Items</h4>

    {/* Add new item button */}
    <button
      onClick={() => {
        const items = editedComponent["list-items"] || [];
        const newItem = {
          id: `item_${items.length + 1}`,
          "main-content": { title: "", metadata: "" },
          end: { title: "", description: "" },
          "on-click-action": {
            name: "navigate",
            next: { name: "", type: "screen" },
            payload: {}
          }
        };
        handleChange({ "list-items": [...items, newItem] });
      }}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
      + Add List Item
    </button>

    {(editedComponent["list-items"] || []).map((item, index) => (
      <div
        key={index}
        className="border rounded-md p-4 space-y-3 bg-gray-50"
      >
        <h5 className="font-medium text-gray-700">Item {index + 1}</h5>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={item["main-content"]?.title || ""}
            onChange={(e) => {
              const updated = [...(editedComponent["list-items"] || [])];
              updated[index]["main-content"].title = e.target.value;
              handleChange({ "list-items": updated });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Metadata */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Metadata
          </label>
          <input
            type="text"
            value={item["main-content"]?.metadata || ""}
            onChange={(e) => {
              const updated = [...(editedComponent["list-items"] || [])];
              updated[index]["main-content"].metadata = e.target.value;
              handleChange({ "list-items": updated });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End (price or secondary info) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">End Title</label>
            <input
              type="text"
              value={item.end?.title || ""}
              onChange={(e) => {
                const updated = [...(editedComponent["list-items"] || [])];
                updated[index].end.title = e.target.value;
                handleChange({ "list-items": updated });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              End Description
            </label>
            <input
              type="text"
              value={item.end?.description || ""}
              onChange={(e) => {
                const updated = [...(editedComponent["list-items"] || [])];
                updated[index].end.description = e.target.value;
                handleChange({ "list-items": updated });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Navigation Action */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Next Screen Name
          </label>
          <input
            type="text"
            value={item["on-click-action"]?.next?.name || ""}
            onChange={(e) => {
              const updated = [...(editedComponent["list-items"] || [])];
              updated[index]["on-click-action"].next.name = e.target.value;
              handleChange({ "list-items": updated });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="SECOND_SCREEN"
          />
        </div>

        {/* Delete Item */}
        <button
          onClick={() => {
            const updated = (editedComponent["list-items"] || []).filter(
              (_, i) => i !== index
            );
            handleChange({ "list-items": updated });
          }}
          className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
        >
          Delete Item
        </button>
      </div>
    ))}
  </div>
)}

{editedComponent.type === "PhotoPicker" && (
  <>
    <label className="block text-sm font-medium">Label</label>
    <input
      type="text"
      value={editedComponent.label || ""}
      onChange={(e) => handleChange({ label: e.target.value })}
      className="w-full px-2 py-1 border rounded"
    />

    <label className="block text-sm mt-2">Description</label>
    <textarea
      value={editedComponent.description || ""}
      onChange={(e) => handleChange({ description: e.target.value })}
      className="w-full px-2 py-1 border rounded"
    />

    <div className="grid grid-cols-2 gap-2 mt-2">
      <div>
        <label className="block text-xs">Min Photos</label>
        <input
          type="number"
          value={editedComponent["min-uploaded-photos"] || 1}
          onChange={(e) =>
            handleChange({ "min-uploaded-photos": parseInt(e.target.value) })
          }
          className="w-full px-2 py-1 border rounded"
        />
      </div>
      <div>
        <label className="block text-xs">Max Photos</label>
        <input
          type="number"
          value={editedComponent["max-uploaded-photos"] || 10}
          onChange={(e) =>
            handleChange({ "max-uploaded-photos": parseInt(e.target.value) })
          }
          className="w-full px-2 py-1 border rounded"
        />
      </div>
    </div>
  </>
)}

{editedComponent.type === "DocumentPicker" && (
  <>
    <label className="block text-sm font-medium">Label</label>
    <input
      type="text"
      value={editedComponent.label || ""}
      onChange={(e) => handleChange({ label: e.target.value })}
      className="w-full px-2 py-1 border rounded"
    />

    <label className="block text-sm mt-2">Description</label>
    <textarea
      value={editedComponent.description || ""}
      onChange={(e) => handleChange({ description: e.target.value })}
      className="w-full px-2 py-1 border rounded"
    />

    <div className="grid grid-cols-2 gap-2 mt-2">
      <div>
        <label className="block text-xs">Min Documents</label>
        <input
          type="number"
          value={editedComponent["min-uploaded-documents"] || 1}
          onChange={(e) =>
            handleChange({ "min-uploaded-documents": parseInt(e.target.value) })
          }
          className="w-full px-2 py-1 border rounded"
        />
      </div>
      <div>
        <label className="block text-xs">Max Documents</label>
        <input
          type="number"
          value={editedComponent["max-uploaded-documents"] || 1}
          onChange={(e) =>
            handleChange({ "max-uploaded-documents": parseInt(e.target.value) })
          }
          className="w-full px-2 py-1 border rounded"
        />
      </div>
    </div>
  </>
)}

          {/* EmbeddedLink */}
{editedComponent.type === "EmbeddedLink" && (
  <div className="space-y-3">
    {/* Header */}
    <label className="block text-sm font-medium text-gray-700">
      Embedded Link Settings
    </label>

    {/* Link Text */}
    <input
      type="text"
      value={editedComponent.text || ""}
      onChange={(e) => handleChange({ text: e.target.value })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      placeholder="Enter link text (e.g. Visit our website)"
    />

    {/* Action Type */}
    <div>
      <label className="block text-sm text-gray-700 mb-1">
        On Click Action
      </label>
      <select
        value={editedComponent["on-click-action"]?.name || ""}
        onChange={(e) => {
          const newAction = e.target.value;
          handleChange({
            "on-click-action": {
              name: newAction,
              ...(newAction === "navigate"
                ? { next: { type: "screen", name: "" } }
                : newAction === "open_url"
                ? { url: "" }
                : {}),
            },
          });
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="">None</option>
        <option value="navigate">Navigate</option>
        <option value="data_exchange">Data Exchange</option>
        <option value="open_url">Open URL</option>
      </select>
    </div>

    {/* If navigate → next screen input */}
    {editedComponent["on-click-action"]?.name === "navigate" && (
      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Next Screen Name
        </label>
        <input
          type="text"
          value={editedComponent["on-click-action"]?.next?.name || ""}
          onChange={(e) =>
            handleChange({
              "on-click-action": {
                ...editedComponent["on-click-action"],
                next: { type: "screen", name: e.target.value },
              },
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter next screen name..."
        />
      </div>
    )}

    {/* If open_url → show URL input */}
    {editedComponent["on-click-action"]?.name === "open_url" && (
      <div>
        <label className="block text-sm text-gray-700 mb-1">URL Link</label>
        <input
          type="text"
          value={editedComponent["on-click-action"]?.url || ""}
          onChange={(e) =>
            handleChange({
              "on-click-action": {
                ...editedComponent["on-click-action"],
                url: e.target.value,
              },
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com"
        />
      </div>
    )}

    {/* Visibility */}
    <label className="flex items-center mt-2">
      <input
        type="checkbox"
        checked={editedComponent.visible ?? true}
        onChange={(e) => handleChange({ visible: e.target.checked })}
        className="mr-2"
      />
      <span className="text-sm font-medium text-gray-700">Visible</span>
    </label>
  </div>
)}


          {/* Date / Calendar Picker */}
          {pickerComponents.includes(editedComponent.type) && (
            // <div>
            //   <label className="block text-sm text-gray-700 mb-1">
            //     Date Format
            //   </label>
            //   <input
            //     type="text"
            //     value={editedComponent.format || "YYYY-MM-DD"}
            //     onChange={(e) => handleChange({ format: e.target.value })}
            //     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            //     placeholder="YYYY-MM-DD"
            //   />
            // </div>
            ""
          )}

          {/* Image */}
          {editedComponent.type === "Image" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Image Settings
              </label>

              {/* 🖼️ Upload Image */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Upload Image (auto converts to Base64)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 102400) {
                      toast.error("Image must be under 100 KB.");
                      e.target.value = "";
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      // remove prefix "data:image/png;base64,"
                      const base64String = reader.result.split(",")[1];
                      handleChange({ src: base64String });
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 🔗 Manual Input (Base64 or URL) */}
              <input
                type="text"
                value={editedComponent.src || ""}
                onChange={(e) => handleChange({ src: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Paste Base64 string or image URL..."
              />

              {/* 📏 Width + Height */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={editedComponent.width || 200}
                    onChange={(e) =>
                      handleChange({ width: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={editedComponent.height || 200}
                    onChange={(e) =>
                      handleChange({ height: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Scale Type
                </label>
                <select
                  value={editedComponent["scale-type"] || "contain"}
                  onChange={(e) =>
                    handleChange({ "scale-type": e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                </select>
              </div>

              {/* 📝 Alt Text */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={editedComponent["alt-text"] || ""}
                  onChange={(e) => handleChange({ "alt-text": e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the image (for accessibility)"
                />
              </div>

              {/* 👁️ Visibility */}
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={editedComponent.visible ?? true}
                  onChange={(e) => handleChange({ visible: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Visible
                </span>
              </label>

              {/* 🧩 Optional Preview */}
              {editedComponent.src && (
                <div className="mt-3">
                  <label className="block text-sm text-gray-700 mb-1">
                    Preview
                  </label>
                  <img
                    src={
                      editedComponent.src.startsWith("data:image")
                        ? editedComponent.src
                        : `data:image/png;base64,${editedComponent.src}`
                    }
                    alt={editedComponent["alt-text"] || "Image preview"}
                    className="border rounded-md w-40 h-40 object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-between">
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Delete Component
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComponentItem = ({ type, label, icon: Icon, config }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { type, config },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Special styling for Footer
  const isFooter = type === "Footer";

  return (
    <div
      ref={drag}
      className={`p-3 border border-gray-200 rounded-lg bg-white cursor-move transition-all ${
        isDragging ? "opacity-50" : "hover:shadow-md"
      } ${isFooter ? "bg-green-50 border-green-200" : ""}`}
    >
      <div className="flex items-center gap-2">
        <Icon
          size={18}
          className={`${
            isFooter ? "text-green-600" : "text-gray-600"
          } flex-shrink-0`}
        />
        {!isFooter ? (
          <span className="text-sm font-medium text-gray-700">{label}</span>
        ) : (
          <button className="text-sm bg-green-500 text-white rounded-md px-3 py-1 font-medium shadow hover:bg-green-600">
            {label}
          </button>
        )}
      </div>
    </div>
  );
};

// ScreenCanvas for drop targets
const ScreenCanvas = ({
  screen,
  onDropComponent,
  onSelectComponent,
  onUpdateScreenTitle,
  isSelected,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => onDropComponent(screen.id, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const formChildren = screen.layout.children[0].children;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
        isSelected ? "border-blue-500" : "border-gray-200"
      } ${isOver ? "bg-blue-50" : ""}`}
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
          isOver ? "border-blue-400 bg-blue-25" : "border-gray-300"
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
                    ? "bg-blue-50 border-blue-300"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{component.type}</span>
                  <span className="text-xs text-gray-500">
                    {/* {component.label || component.text || "No content"} */}
                    Click to Edit
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

// WhatsAppPreview component - Updated to match the image exactly

// JSON Preview Modal Component
const JSONPreviewModal = ({
  screens,
  flowName,
  flowJSON,
  onClose,
  setJsontoSend,
}) => {
  // const generateFlowJSON = () => {
  //   const flowScreens = screens.map((screen, index) => {
  //     // Build data structure for incoming data (from previous screens)
  //     const dataStructure = {};
  //     if (index > 0) {
  //       // Collect all field names from previous screens (excluding text components)
  //       for (let prevIndex = 0; prevIndex < index; prevIndex++) {
  //         const prevScreen = screens[prevIndex];
  //         const formChildren = prevScreen.layout.children[0].children || [];
  //         formChildren.forEach((child, fieldIndex) => {
  //           // Only include components that have name and are not text components
  //           const textComponents = [
  //             "TextHeading",
  //             "TextSubheading",
  //             "TextBody",
  //             "TextCaption",
  //             "RichText",
  //           ];
  //           if (
  //             child.name &&
  //             !textComponents.includes(child.type) &&
  //             child.type !== "Footer"
  //           ) {
  //             const dataKey = `screen_${prevIndex}_${child.name}_${fieldIndex}`;
  //             if (child.type === "CheckboxGroup") {
  //               // CheckboxGroup should be an array
  //               dataStructure[dataKey] = {
  //                 type: "array",
  //                 items: {
  //                   type: "string",
  //                 },
  //                 __example__: [],
  //               };
  //             } else {
  //               dataStructure[dataKey] = {
  //                 type: "string",
  //                 __example__: "Example value",
  //               };
  //             }
  //           }
  //         });
  //       }
  //     }

  //     const baseScreen = {
  //       id: screen.id,
  //       title: screen.title,
  //       data: dataStructure,
  //       layout: JSON.parse(JSON.stringify(screen.layout)), // Deep clone to avoid mutations
  //       terminal: index === screens.length - 1,
  //     };

  //     // Clean up layout - remove label/name from text components in the final JSON
  //     const cleanLayout = (layout) => {
  //       if (layout.children && Array.isArray(layout.children)) {
  //         layout.children = layout.children.map((child) => {
  //           const textComponents = [
  //             "TextHeading",
  //             "TextSubheading",
  //             "TextBody",
  //             "TextCaption",
  //             "RichText",
  //           ];
  //           if (textComponents.includes(child.type)) {
  //             // Only include type and text for text components
  //             const { type, text } = child;
  //             return { type, text };
  //           }
  //           return child;
  //         });
  //       }
  //       return layout;
  //     };

  //     baseScreen.layout = cleanLayout(baseScreen.layout);

  //     // Add navigation actions to non-terminal screens
  //     if (index < screens.length - 1) {
  //       const formChildren = baseScreen.layout.children[0].children;
  //       const footerIndex = formChildren.findIndex(
  //         (child) => child.type === "Footer"
  //       );
  //       if (footerIndex !== -1) {
  //         // Build payload mapping for navigation (excluding text components)
  //         const payloadMapping = {};
  //         const currentFormChildren = screen.layout.children[0].children || [];

  //         currentFormChildren.forEach((child, fieldIndex) => {
  //           const textComponents = [
  //             "TextHeading",
  //             "TextSubheading",
  //             "TextBody",
  //             "TextCaption",
  //             "RichText",
  //           ];
  //           if (
  //             child.name &&
  //             !textComponents.includes(child.type) &&
  //             child.type !== "Footer"
  //           ) {
  //             const payloadKey = `screen_${index}_${child.name}_${fieldIndex}`;
  //             payloadMapping[payloadKey] = `\${form.${child.name}}`;
  //           }
  //         });

  //         // Also include data from previous screens
  //         Object.keys(dataStructure).forEach((dataKey) => {
  //           payloadMapping[dataKey] = `\${data.${dataKey}}`;
  //         });

  //         formChildren[footerIndex] = {
  //           ...formChildren[footerIndex],
  //           "on-click-action": {
  //             name: "navigate",
  //             next: {
  //               type: "screen",
  //               name: screens[index + 1].id,
  //             },
  //             payload: payloadMapping,
  //           },
  //         };
  //       }
  //     }

  //     // Add complete action to terminal screen
  //     if (index === screens.length - 1) {
  //       const formChildren = baseScreen.layout.children[0].children;
  //       const footerIndex = formChildren.findIndex(
  //         (child) => child.type === "Footer"
  //       );
  //       if (footerIndex !== -1) {
  //         // Build complete payload with ALL data (excluding text components)
  //         const completePayload = {};

  //         // Add current screen form data (excluding text components)
  //         const currentFormChildren = screen.layout.children[0].children || [];
  //         currentFormChildren.forEach((child, fieldIndex) => {
  //           const textComponents = [
  //             "TextHeading",
  //             "TextSubheading",
  //             "TextBody",
  //             "TextCaption",
  //             "RichText",
  //           ];
  //           if (
  //             child.name &&
  //             !textComponents.includes(child.type) &&
  //             child.type !== "Footer"
  //           ) {
  //             const payloadKey = `screen_${index}_${child.name}_${fieldIndex}`;
  //             completePayload[payloadKey] = `\${form.${child.name}}`;
  //           }
  //         });

  //         // Add all previous screens data
  //         Object.keys(dataStructure).forEach((dataKey) => {
  //           completePayload[dataKey] = `\${data.${dataKey}}`;
  //         });

  //         formChildren[footerIndex] = {
  //           ...formChildren[footerIndex],
  //           "on-click-action": {
  //             name: "complete",
  //             payload: completePayload,
  //           },
  //         };
  //       }
  //     }

  //     return baseScreen;
  //   });

  //   return {
  //     name: flowName || "Untitled Flow",
  //     categories: ["CUSTOM"],
  //     screens: flowScreens,
  //     version: "7.2",
  //   };
  // };

  useEffect(() => {
    setJsontoSend(flowJSON);
  }, [flowJSON, setJsontoSend]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">JSON Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-auto max-h-[70vh]">
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Dynamic payload and data flow between screens (text components
              excluded from payload)
            </p>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(flowJSON, null, 2)}
          </pre>
        </div>

        <div className="p-6 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {screens.length} screens,{" "}
            {screens.reduce(
              (total, screen) =>
                total + (screen.layout?.children?.[0]?.children?.length || 0),
              0
            )}{" "}
            components
          </div>
          <div className="flex gap-3">
            <button
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(flowJSON, null, 2))
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Copy JSON
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Main Component
const CreateMetaFlows = () => {
  const [flowName, setFlowName] = useState("");
  const [screens, setScreens] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showJSONModal, setShowJSONModal] = useState(false);
  const [selectedcategories, setSelectedCategories] = useState("");
  const [businessProfileId, setBusinessProfileId] = useState(null);
  const [jsontoSend, setJsontoSend] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const project = localStorage.getItem("currentProject")
      ? JSON.parse(localStorage.getItem("currentProject"))
      : null;
    if (project?.businessProfileId?._id) {
      setBusinessProfileId(project.businessProfileId._id);
    } else {
      alert("Please select a project with a linked Business Profile.");
      navigate("/projects");
    }
  }, [navigate]);
  const CATEGORY_OPTIONS = [
    "SIGN_UP",
    "SIGN_IN",
    "APPOINTMENT_BOOKING",
    "LEAD_GENERATION",
    "CONTACT_US",
    "CUSTOMER_SUPPORT",
    "SURVEY",
    "OTHER",
  ];
  // Add screen
  const addScreen = () => {
    const newScreen = {
      id: `screen_${Math.random()
        .toString(36)
        .replace(/[^a-z]/g, "")
        .substring(0, 8)}`,
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
    const textComponents = [
  "TextHeading",
  "TextSubheading",
  "TextBody",
  "TextCaption",
  "RichText",
  "EmbeddedLink",
  "Image",
];

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
      setShowEditModal(true);
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
    setShowEditModal(false);
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
          const textComponents = [
  "TextHeading",
  "TextSubheading",
  "TextBody",
  "TextCaption",
  "RichText",
  "EmbeddedLink",
    "Image",

];

            if (
              child.name &&
              !textComponents.includes(child.type) &&
              child.type !== "Footer"
            ) {
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

//       const cleanLayout = (layout) => {
//   if (layout.children && Array.isArray(layout.children)) {
//     layout.children = layout.children.map((child) => {
//       const textLikeComponents = [
//         "TextHeading",
//         "TextSubheading",
//         "TextBody",
//         "TextCaption",
//         "RichText",
//         "EmbeddedLink",
//           "Image",

//       ];

//       if (textLikeComponents.includes(child.type)) {
//         // Keep only relevant keys for text/display elements
//         const cleaned = {
//           type: child.type,
//         };

//         if (child.text) cleaned.text = child.text;
//         if (child.visible !== undefined) cleaned.visible = child.visible;
//         if (child["on-click-action"])
//           cleaned["on-click-action"] = child["on-click-action"];

//         return cleaned;
//       }

//       return child;
//     });
//   }
//   return layout;
// };
const cleanLayout = (layout) => {
  if (layout.children && Array.isArray(layout.children)) {
    layout.children = layout.children.map((child) => {
      const textLikeComponents = [
        "TextHeading",
        "TextSubheading",
        "TextBody",
        "TextCaption",
        "RichText",
        "EmbeddedLink",
      ];

      // Handle image separately
      if (child.type === "Image") {
        const cleaned = { type: "Image" };
        if (child.src) cleaned.src = child.src;
        if (child.visible !== undefined) cleaned.visible = child.visible;
        return cleaned;
      }

      if (textLikeComponents.includes(child.type)) {
        // Keep only relevant keys for text/display elements
        const cleaned = {
          type: child.type,
        };

        if (child.text) cleaned.text = child.text;
        if (child.visible !== undefined) cleaned.visible = child.visible;
        if (child["on-click-action"])
          cleaned["on-click-action"] = child["on-click-action"];

        return cleaned;
      }

      // Recursively clean nested children (like forms)
      if (child.children && Array.isArray(child.children)) {
        child.children = child.children.map((c) => cleanLayout({ children: [c] }).children[0]);
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
            const textComponents = [
  "TextHeading",
  "TextSubheading",
  "TextBody",
  "TextCaption",
  "RichText",
  "EmbeddedLink",
    "Image",
    'OptIn'

];

            if (
              child.name &&
              !textComponents.includes(child.type) &&
              child.type !== "Footer"
            ) {
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
            const textComponents = [
  "TextHeading",
  "TextSubheading",
  "TextBody",
  "TextCaption",
  "RichText",
  "EmbeddedLink",
    "Image",

];

            if (
              child.name &&
              !textComponents.includes(child.type) &&
              child.type !== "Footer"
            ) {
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
      // name: flowName || "Untitled Flow",
      // categories: ["CUSTOM"],
      screens: flowScreens,
      version: "7.2",
    };
  };

  const handleCreateFlow = async () => {
    if (!flowName.trim()) {
      toast.error("Please enter a flow name.");
      return;
    }
    if (screens.length === 0) {
      toast.error("Please add at least one screen.");
      return;
    }

    try {
      // ✅ Always generate a fresh JSON from current screens
      const flowJSON = generateFlowJSON();
      setJsontoSend(flowJSON); // Optional: for preview/debugging

      const payload = {
        name: flowName,
        categories: selectedcategories ? [selectedcategories] : ["CUSTOM"],
        flowJson: flowJSON,
      };

      const response = await api.post(
        `/metaflows/${businessProfileId}`,
        payload
      );
      console.log("✅ Flow Created:", payload);

      toast.success("Flow created successfully!");
      // Reset state
      setFlowName("");
      setSelectedCategories("");
      setScreens([]);
      setSelectedScreenId(null);
      setSelectedComponent(null);
      setJsontoSend(null);
    } catch (error) {
      console.error("❌ Error creating flow:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create flow. Please try again."
      );
    }
  };

  // Component palette
  // const palette = [
  //       {
  //     type: "TextHeading",
  //     label: "Heading",
  // icon: Type,
  //     config: { type: "TextHeading", text: "Heading" },
  //   },
  //   {
  //     type: "TextSubheading",
  //     label: "Subheading",
  //     icon: AlignLeft,
  //     config: { type: "TextSubheading", text: "Subheading" },
  //   },
  //   {
  //     type: "TextBody",
  //     label: "Body",
  //    icon: FileText,
  //     config: { type: "TextBody", text: "Body text" },
  //   },
  //   {
  //     type: "TextCaption",
  //     label: "Caption",
  //     icon: Quote,
  //     config: { type: "TextCaption", text: "TextCaption" },
  //   },
  //   {
  //     type: "RichText",
  //     label: "Rich Text",
  //     icon: Edit3,
  //     config: { type: "RichText", text: "Rich text content" },
  //   },
  //   {
  //     type: "TextInput",
  //     label: "Text Input",
  //     icon: Edit3,
  //     config: {
  //       type: "TextInput",
  //       name: "text_input",
  //       label: "Text Input",
  //       "input-type": "text",
  //     },
  //   },
  //   {
  //     type: "TextArea",
  //     label: "Text Area",
  //     icon: FileText,
  //     config: {
  //       type: "TextArea",
  //       name: "text_area",
  //       label: "Text Area",
  //     },
  //   },
  //   {
  //     type: "Dropdown",
  //     label: "Dropdown",
  //     icon: ChevronDown ,
  //     config: {
  //       type: "Dropdown",
  //       name: "dropdown",
  //       label: "Dropdown",
  //       "data-source": [
  //         { id: "0_Option_1", title: "Option 1" },
  //         { id: "1_Option_2", title: "Option 2" },
  //       ],
  //     },
  //   },
  //   {
  //     type: "RadioButtonsGroup",
  //     label: "Radio Group",
  //     icon: Radio,
  //     config: {
  //       type: "RadioButtonsGroup",
  //       name: "radio_group",
  //       label: "Radio Group",
  //       "data-source": [
  //         { id: "0_Yes", title: "Yes" },
  //         { id: "1_No", title: "No" },
  //       ],
  //     },
  //   },
  //   {
  //     type: "CheckboxGroup",
  //     label: "Checkbox Group",
  //     icon: CheckSquare,
  //     config: {
  //       type: "CheckboxGroup",
  //       name: "checkbox_group",
  //       label: "Checkbox Group",
  //       "data-source": [
  //         { id: "0_Option_A", title: "Option A" },
  //         { id: "1_Option_B", title: "Option B" },
  //       ],
  //     },
  //   },

  //   {
  //     type: "OptIn",
  //     label: "Opt In",
  //     icon: ToggleRight,
  //     config: { type: "OptIn", name: "optin", label: "Opt In" },
  //   },
  //   {
  //     type: "EmbeddedLink",
  //     label: "Embedded Link",
  //     icon: Link2,
  //     config: {
  //       type: "EmbeddedLink",
  //       name: "embedded_link",
  //       label: "Embedded Link",
  //     },
  //   },
  //   {
  //     type: "DatePicker",
  //     label: "Date Picker",
  //     icon: Calendar,
  //     config: { type: "DatePicker", name: "date_picker", label: "Date Picker" },
  //   },
  //   {
  //     type: "CalendarPicker",
  //     label: "Calendar Picker",
  //     icon: CalendarDays,
  //     config: {
  //       type: "CalendarPicker",
  //       name: "calendar_picker",
  //       label: "Calendar Picker",
  //     },
  //   },
  //   {
  //     type: "Image",
  //     label: "Image",
  //     icon: Image,
  //     config: { type: "Image", name: "image", label: "Image" },
  //   },
  //   {
  //     type: "ChipsSelector",
  //     label: "Chips Selector",
  //     icon: LayoutGrid,
  //     config: {
  //       type: "ChipsSelector",
  //       name: "chips_selector",
  //       label: "Chips Selector",
  //     },
  //   },
  //    {
  //     type: "Footer",
  //     label: "Footer Button",
  //     icon: ArrowRight,
  //     config: {
  //       type: "Footer",
  //       label: "Continue",
  //     },
  //   },
  // ];

  const palette = [
    {
      type: "TextHeading",
      label: "Heading",
      icon: Type,
      config: {
        type: "TextHeading",
        text: "${data.heading_text}",
        visible: true,
      },
    },
    {
      type: "TextSubheading",
      label: "Subheading",
      icon: AlignLeft,
      config: {
        type: "TextSubheading",
        text: "${data.subheading_text}",
        visible: true,
      },
    },
    {
      type: "TextBody",
      label: "Body",
      icon: FileText,
      config: {
        type: "TextBody",
        text: "${data.body_text}",
        "font-weight": "normal",
        strikethrough: false,
        visible: true,
      },
    },
    {
      type: "TextCaption",
      label: "Caption",
      icon: Quote,
      config: {
        type: "TextCaption",
        text: "${data.caption_text}",
        visible: true,
      },
    },
    // {
    //   type: "RichText",
    //   label: "Rich Text",
    //   icon: Edit3,
    //   config: { type: "RichText", text: "Rich text content", visible: true },
    // },
    {
      type: "TextInput",
      label: "Text Input",
      icon: Edit3,
      config: {
        type: "TextInput",
        name: "text_input",
        label: "Text Input",
        "input-type": "text",
        required: true,
        visible: true,
      },
    },
    {
      type: "TextArea",
      label: "Text Area",
      icon: FileText,
      config: {
        type: "TextArea",
        name: "text_area",
        label: "Text Area",
        required: true,
        visible: true,
      },
    },
    {
      type: "Dropdown",
      label: "Dropdown",
      icon: ChevronDown,
      config: {
        type: "Dropdown",
        name: "dropdown",
        label: "Select Option",
        "data-source": [
          { id: "0_option_1", title: "Option 1" },
          { id: "1_option_2", title: "Option 2" },
        ],
        required: true,
        visible: true,
      },
    },
    {
      type: "RadioButtonsGroup",
      label: "Radio Group",
      icon: Radio,
      config: {
        type: "RadioButtonsGroup",
        name: "radio_group",
        label: "Choose Option",
        "data-source": [
          { id: "0_yes", title: "Yes" },
          { id: "1_no", title: "No" },
        ],
        required: true,
        visible: true,
      },
    },
    {
      type: "CheckboxGroup",
      label: "Checkbox Group",
      icon: CheckSquare,
      config: {
        type: "CheckboxGroup",
        name: "checkbox_group",
        label: "Select Options",
        "data-source": [
          { id: "0_option_a", title: "Option A" },
          { id: "1_option_b", title: "Option B" },
        ],
        required: true,
        visible: true,
      },
    },
    {
      type: "OptIn",
      label: "Opt In",
      icon: ToggleRight,
      config: {
        type: "OptIn",
        name: "optin",
        label: "I agree to terms",
        visible: true,
                        "required": true,

      },
    },
    {
      type: "EmbeddedLink",
      label: "Embedded Link",
      icon: Link2,
      config: {
        type: "EmbeddedLink",
        text: "This is an embedded link",
        "on-click-action": {
          name: "navigate", 
          next: {
            type: "screen",
            name: "FINISH",
          },
        },
        visible: true,
      },
    },
{
  type: "NavigationList",
  label: "Navigation List",
  icon: List, // import from lucide-react or your icons set
  config: {
    type: "NavigationList",
    name: "nav_list",
    "list-items": [
      {
        id: "item_1",
        "main-content": {
          title: "Option 1",
          metadata: "Description of option 1"
        },
        end: {
          title: "$100",
          description: "/ month"
        },
        "on-click-action": {
          name: "navigate",
          next: { name: "NEXT_SCREEN", type: "screen" },
          payload: {}
        }
      }
    ]
  }
}
,
    {
      type: "DatePicker",
      label: "Date Picker",
      icon: Calendar,
      config: {
        type: "DatePicker",
        name: "date_picker",
        label: "Pick a date",
        visible: true,
      },
    },
    {
      type: "CalendarPicker",
      label: "Calendar Picker",
      icon: CalendarDays,
      config: {
        type: "CalendarPicker",
        name: "calendar_picker",
        label: "Select a date",
        visible: true,
      },
    },
    {
      type: "Image",
      label: "Image",
      icon: ImageIcon,
      config: {
        type: "Image",
        src: "cv", // can be base64 or dynamic "${data.src}"
        width: 200,
        height: 200,
        "scale-type": "contain", // or "cover"
        "alt-text": "Sample Image",
        visible: true,
      },
    },
    {
      type: "ChipsSelector",
      label: "Chips Selector",
      icon: LayoutGrid,
      config: {
        type: "ChipsSelector",
        name: "chips_selector",
        label: "Select Chips",
        "data-source": [
          { id: "0_chip_1", title: "Chip 1" },
          { id: "1_chip_2", title: "Chip 2" },
        ],
        required: true,
        visible: true,
      },
    },
     {
    type: "PhotoPicker",
    label: "Photo Picker",
    icon: ImageIcon, // your image icon import
    config: {
      type: "PhotoPicker",
      name: "photo_picker",
      label: "Upload photos",
      description: "Please attach images about the received items",
      "photo-source": "camera_gallery",
      "min-uploaded-photos": 1,
      "max-uploaded-photos": 10,
      "max-file-size-kb": 10240,
      visible: true,
    },
  },
  {
    type: "DocumentPicker",
    label: "Document Picker",
    icon: FileText, // your document icon import
    config: {
      type: "DocumentPicker",
      name: "document_picker",
      label: "Contract",
      description: "Attach the signed copy of the contract",
      "min-uploaded-documents": 1,
      "max-uploaded-documents": 1,
      "max-file-size-kb": 1024,
      "allowed-mime-types": ["image/jpeg", "application/pdf"],
      visible: true,
    },
  },
    {
      type: "Footer",
      label: "Footer Button",
      icon: ArrowRight,
      config: {
        type: "Footer",
        label: "Continue",
        "on-click-action": { name: "complete", payload: {} },
      },
    },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="grid grid-cols-3 gap-4 space-y-1 items-center">
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
                {/* Category Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedcategories}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedCategories(value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowJSONModal(true)}
                  disabled={screens.length === 0}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  View JSON
                </button>
                <Button onClick={handleCreateFlow} size="sm" variant="accent">
                  Submit on meta
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Screens & Components */}
            <div className="col-span-3 space-y-6">
              {/* Screens List */}
              <div className=" sticky top-50">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold mb-3">Screens</h2>
                    <button
                      onClick={addScreen}
                      className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Add Screen
                    </button>
                  </div>
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
              </div>
              {/* Component Palette */}
              <div className=" sticky top-20">
                <div className="bg-white rounded-lg shadow-sm border p-4 h-[400px] overflow-y-auto">
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
                        icon={item.icon} // <-- Pass icon prop here!
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle - Canvas */}
            <div className="col-span-5 space-y-6">
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

            {/* Right - WhatsApp Preview */}
            <div className="col-span-4">
              <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
                <h2 className="text-lg font-semibold mb-4">WhatsApp Preview</h2>
                {/* <p className="text-sm text-gray-600 mb-4">
                  See how your flow will appear to users in WhatsApp
                </p> */}
               {/* Right - WhatsApp Preview & Instructions */}
<div className="col-span-4 space-y-6">
    <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-[px]">
    <h2 className="text-lg font-semibold mb-2">Instructions</h2>
<InstructionPanel
  selectedComponent={selectedComponent}
  screenComponents={
    selectedComponent
      ? screens.find((s) => s.id === selectedComponent.screenId)?.components || []
      : []
  }
/>
  </div>
  {/* WhatsApp Preview */}
  <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
    <h2 className="text-lg font-semibold mb-4">WhatsApp Preview</h2>
    <div className="h-[400px]">
      <WhatsAppPreview screens={screens} flowName={flowName} />
    </div>
  </div>

  {/* Dynamic Instructions */}

</div>

              </div>
            </div>
          </div>
        </div>

        {/* Edit Component Modal */}
        {showEditModal && selectedComponent && (
          <EditComponentModal
            component={selectedComponent}
            onSave={handleUpdateComponent}
            onDelete={handleDeleteComponent}
            onClose={() => setShowEditModal(false)}
          />
        )}
        {showJSONModal && (
          <JSONPreviewModal
            setJsontoSend={setJsontoSend}
            screens={screens}
            flowName={flowName}
            onClose={() => setShowJSONModal(false)}
            flowJSON={generateFlowJSON()}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default CreateMetaFlows;
