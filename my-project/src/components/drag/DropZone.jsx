import { useDrop } from "react-dnd";

const DropZone = ({ onDrop }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "BOX", // 🔑 same as draggable type
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className={`h-40 border-2 rounded flex items-center justify-center transition ${
        isOver ? "bg-green-100 border-green-500" : "bg-gray-50 border-gray-300"
      }`}
    >
      {isOver ? "Release to drop" : "Drag a box here"}
    </div>
  );
};

export default DropZone;
