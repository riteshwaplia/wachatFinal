import React, { useState } from "react";
import DraggableBox from "../drag/DraggableBox";
import DropZone from "../drag/DropZone";

const DragDropDemo = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const handleDrop = (item) => {
    setDroppedItems((prev) => [...prev, item.id]);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">React DnD Example</h1>

      <div className="flex space-x-4">
        {/* Left: Draggable items */}
        <div className="w-1/2">
          <DraggableBox id="1" text="Drag Me 1" />
          <DraggableBox id="2" text="Drag Me 2" />
        </div>

        {/* Right: Drop zone */}
        <div className="w-1/2">
          <DropZone onDrop={handleDrop} />
          <div className="mt-4">
            <h2 className="font-semibold">Dropped Items:</h2>
            <ul>
              {droppedItems.map((id, idx) => (
                <li key={idx}>Box {id}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropDemo;
