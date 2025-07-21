import React, { useCallback } from 'react';
import BaseNode from './BaseNode';

const MessageNode = ({ data, id }) => {


  const onChange = useCallback(
    (e) => {
      data.onChange?.(id, { ...data, message: e.target.value });
    },
    [data, id]
  );

  const body = (
    <>
      <button
        style={{ position: 'absolute', top: 2, right: 2, zIndex: 10 }}
        onClick={() => data.onDelete?.(id)}
        className="text-red-600 hover:text-red-800 primary-100 hover:primary-200 rounded-full w-4 h-4 flex items-center justify-center text-sm font-bold opacity-80 hover:opacity-100 transition-opacity duration-200"
        title="Delete Node"
      >
        &#x2715; {/* Unicode 'X' for a consistent look */}
      </button>
      <textarea
        id="text"
        rows={3}
        name="text"
        placeholder="Enter message"
        defaultValue={data?.message || ''}
        onChange={onChange}
        className="nodrag bg-secondary-50 w-full px-2 py-1 border border-border rounded"
      />
    </>
  );

  return (
    <BaseNode
      title="WhatsApp Message"
      body={body}
      footer="Sends text to user"
    />
  );
};

export default MessageNode;
