import React, { useCallback } from 'react';
import { Position } from '@xyflow/react';
import CustomHandle from '../feature/CustomHandle';
import BaseNode from './BaseNode';

const InteractiveListRow = ({ data, id }) => {
  const handleChange = useCallback((key, value) => {
    data.onChange?.(id, { ...data, [key]: value });
  }, [data, id]);

  const body = (
    <>
      {/* <div className="bg-white text-black border p-4 rounded shadow w-72 relative"> */}
      <button
        style={{ position: 'absolute', top: 2, right: 4 }}
        onClick={() => data.onDelete?.(id)}
        className="text-red-600 primary-100 rounded-full w-6 h-6 flex items-center justify-center"
        title="Delete Node"
      >
        ×
      </button>


      <input
        className="nodrag border px-2 py-1 rounded w-full mb-2"
        value={data.title || ''}
        placeholder="Row Title"
        onChange={(e) => handleChange('title', e.target.value)}
      />

      <input
        className="nodrag border px-2 py-1 rounded w-full mb-2"
        value={data.description || ''}
        placeholder="Row Description"
        onChange={(e) => handleChange('description', e.target.value)}
      />


      {/* </div> */}
    </>
  )

  return (
    <BaseNode
      title="List Row"
      body={body}
      footer="rows"
    />

  );
};

export default InteractiveListRow;
