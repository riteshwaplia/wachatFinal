import React from 'react';
import { Position } from '@xyflow/react';
import CustomHandle from '../feature/CustomHandle';
import { Trash2 } from 'lucide-react';

const ButtonNode = ({ index, button, onChange, onDelete }) => {
  return (
    <div key={button.id} className="flex items-center gap-2 mb-2 relative">
      <input
        className="nodrag border px-2 py-1 rounded w-full"
        value={button.title}
        placeholder={`Button ${index + 1}`}
        onChange={(e) => onChange(index, e.target.value)}
      />
      <button
        className="text-red-600 hover:text-red-800"
        onClick={() => onDelete(index)}
        title="Remove button"
      >
        <Trash2 size={16} />
      </button>

      {/* Custom source handle */}
      <CustomHandle
        type="source"
        position={Position.Right}
        id={`btn-${index}`}
        isConnectable={true}
        connectionCount={3}
        style={{
          background: '#555',
          width: 10,
          height: 10,
          position: 'absolute',
          top: '50%',
          right: -12,
          transform: 'translateY(-50%)',
          zIndex: 10
        }}
      />
    </div>
  );
};

export default ButtonNode;
