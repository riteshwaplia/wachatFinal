import React, { useState } from "react";
import { ChevronDown, ChevronUp, Layers3, SquareStack, Rows } from "lucide-react";

const DraggableNode = ({ type, label, icon: Icon, color }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const onDragStart = (event, dragType) => {
    event.dataTransfer.setData("application/reactflow", dragType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Render Interactive node with subtypes
  if (type === "interactive") {
    return (
      <div className="w-full">
        <div
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center justify-between p-3 bg-primary border-2 border-border rounded-lg cursor-pointer hover:bg-primary transition"
        >
          <div className="flex items-center gap-2">
            <div className="bg-primary flex justify-end rounded-full p-2">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-sm text-text">
              {label} Options
            </span>
          </div>
          {openDropdown ? (
            <ChevronUp className="w-4 h-4 text-primary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary" />
          )}
        </div>

        {openDropdown && (
          <div className="ml-6 mt-2 space-y-2 transition-all">
            <div
              draggable
              onDragStart={(e) => onDragStart(e, "interactive")}
              className="flex items-center gap-2 px-3 py-2 bg-bg hover:bg-gray-50 border border-border rounded cursor-grab shadow-sm"
            >
              <SquareStack className="w-4 h-4 text-white  " />
              <span className="text-sm text-text">Button</span>
            </div>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, "interactive_list_messages_section")}
              className="flex items-center gap-2 px-3 py-2 bg-bg hover:bg-gray-50 border border-border rounded cursor-grab shadow-sm"
            >
              <Layers3 className="w-4 h-4 text-text" />
              <span className="text-sm text-text">List - Section</span>
            </div>
            <div
              draggable
              onDragStart={(e) => onDragStart(e, "interactive_list_messages_row")}
              className="flex items-center gap-2 px-3 py-2 bg-bg hover:bg-gray-50 border border-border rounded cursor-grab shadow-sm"
            >
              <Rows className="w-4 h-4 text-white" />
              <span className="text-sm text-text">List - Row</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default draggable node
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className="flex flex-col items-center p-4 cursor-grab active:cursor-grabbing
                 transition-all duration-200 hover:shadow-md hover:scale-105
                 bg-bg border border-border rounded-lg hover:border-border"
    >
      <div className={`bg-primary-700 rounded-full p-3 mb-2`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="font-medium  text-sm text-text text-center leading-tight">
        {label}
      </span>
    </div>
  );
};

export default DraggableNode;
