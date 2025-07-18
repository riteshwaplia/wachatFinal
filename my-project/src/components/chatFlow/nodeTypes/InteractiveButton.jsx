import React, { useCallback } from 'react';
import { Position } from '@xyflow/react';
import CustomHandle from '../feature/CustomHandle';
import { Plus } from 'lucide-react';
import ButtonNode from './ButtonNode';

const IntractiveMessage = ({ data, id }) => {
  const handleFieldChange = useCallback((field, value) => {
    data.onChange?.(id, {
      ...data,
      [field]: value,
    });
  }, [data, id]);

  const handleButtonChange = useCallback((index, value) => {
    const updatedButtons = data.buttons.map((btn, i) =>
      i === index ? { ...btn, title: value } : btn
    );
    data.onChange?.(id, {
      ...data,
      buttons: updatedButtons,
    });
  }, [data, id]);

  const handleDeleteButton = (index) => {
    const updatedButtons = [...data.buttons];
    updatedButtons.splice(index, 1);
    data.onChange?.(id, {
      ...data,
      buttons: updatedButtons,
    });
  };

  const handleAddButton = () => {
    if ((data.buttons || []).length >= 3) return;
    const newBtn = {
      id: `btn-${data.buttons.length}`,
      title: `Button ${data.buttons.length + 1}`,
    };
    data.onChange?.(id, {
      ...data,
      buttons: [...(data.buttons || []), newBtn],
    });
  };

  return (
    <div className="bg-white text-black border p-4 rounded shadow w-80 relative">
      <button
        onClick={() => data.onDelete?.(id)}
        className="absolute top-2 right-2 text-red-600 bg-bg rounded-full w-6 h-6 flex items-center justify-center"
        title="Delete Node"
      >
        ×
      </button>

      <label className="text-xs font-semibold">Header</label>
      <input
        className="nodrag border px-2 py-1 rounded w-full mb-2"
        value={data.header || ''}
        placeholder="Header text"
        onChange={(e) => handleFieldChange('header', e.target.value)}
      />

      <label className="text-xs font-semibold">Body</label>
      <textarea
        className="nodrag border px-2 py-1 rounded w-full mb-2"
        rows={2}
        value={data.message || ''}
        placeholder="Body content"
        onChange={(e) => handleFieldChange('message', e.target.value)}
      />

      <label className="text-xs font-semibold">Footer</label>
      <input
        className="nodrag border px-2 py-1 rounded w-full mb-2"
        value={data.footer || ''}
        placeholder="Footer"
        onChange={(e) => handleFieldChange('footer', e.target.value)}
      />

      <label className="text-xs font-semibold">Buttons</label>
      {(data.buttons || []).map((button, index) => (
        <ButtonNode
          key={button.id}
          index={index}
          button={button}
          onChange={handleButtonChange}
          onDelete={handleDeleteButton}
        />
      ))}

      {(data.buttons?.length || 0) < 3 && (
        <button
          onClick={handleAddButton}
          className="text-sm flex items-center gap-1 text-black hover:text-primary-300 mt-2"
        >
          <Plus size={14} /> Add Button
        </button>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: -0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CustomHandle
          type="target"
          position={Position.Bottom}
          id="next"
          label="Next"
          style={{
            background: '#555',
            width: 10,
            height: 10,
          }}
          connectionCount={3}
        />
      </div>
    </div>
  );
};

export default IntractiveMessage;
