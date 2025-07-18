import React, { useCallback } from 'react';
import { Position } from '@xyflow/react';
import CustomHandle from '../feature/CustomHandle';
import BaseNode from './BaseNode';

const InteractiveListSection = ({ data, id }) => {
  const handleSectionChange = useCallback((value) => {
    data.onChange?.(id, { ...data, sectionTitle: value });
  }, [data, id]);
  const body = (
    <>
      {/* <div className="bg-white text-black border p-4 rounded shadow w-72 relative"> */}
      {/* Delete Node Button */}
      <button
        style={{ position: 'absolute', top: 2, right: 4 }}
        onClick={() => data.onDelete?.(id)}
        className="text-red-600 primary-100 rounded-full w-6 h-6 flex items-center justify-center"
        title="Delete Node"
      >
        ×
      </button>

      {/* Editable Section Title Input */}
      <input
        type="text"
        className="nodrag border border-gray-300 px-2 py-1 rounded-md text-sm w-full mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={data.sectionTitle || ''}
        placeholder="Enter Section Title"
        onChange={(e) => handleSectionChange(e.target.value)}
      />

      <p className="text-xs text-text">List Rows will be connected below.</p>

      {/* Handles */}

      {/* </div> */}
    </>
  )

  return (
    <BaseNode
      title="List Sections"
      body={body}
      footer="Sections"
    />

  );
};

export default InteractiveListSection;
