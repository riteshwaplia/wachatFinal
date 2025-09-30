import { useDrag } from "react-dnd";

const DraggableBox = ({ id, text }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "BOX", // 🔑 Must match Drop target type
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className={`p-3 m-2 border rounded cursor-move ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {text}
    </div>
  );
};

export default DraggableBox;
