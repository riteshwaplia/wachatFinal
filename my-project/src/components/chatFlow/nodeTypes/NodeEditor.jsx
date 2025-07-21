import React from 'react';
import ConditionEditor from './ConditionEditor';

export function NodeEditorPanel({ selectedNode, updateNode, allNodes }) {
  if (!selectedNode || !selectedNode.data) {
    return <div className="p-4 text-text">No node selected</div>;
  }

  const { type, data, meta } = selectedNode;

  const handleConditionsChange = (newConditions) => {
    updateNode({
      ...selectedNode,
      meta: {
        ...meta,
        conditions: newConditions,
      }
    });
  };

  const handleMessageChange = (e) => {
    updateNode({
      ...selectedNode,
      data: {
        ...data,
        message: e.target.value
      }
    });
  };

  return (
    <div className="bg-bg p-4 border-l mt-10">

      {/* ✅ Preview Block */}
      {['interactive_buttons', 'Interactive_List_Section', 'Interactive_List_Row'].includes(type) && (
        <div className="mt-4 p-4 bg-white rounded shadow border space-y-4">
          {/* 🟢 Message */}
          {/* <p className="text-sm text-gray-800 font-medium">
            {data.message || 'Choose an option:'}
          </p> */}

          {/* 🔘 Button List (for interactive_buttons) */}
          {type === 'interactive_buttons' && (
            <div className="mt-6 flex justify-start">
              <div className="bg-[#dcf8c6] text-black rounded-xl shadow w-[300px] p-3 text-sm leading-tight relative">

                {/* Header */}
                {data.header && (
                  <div className="text-xs font-semibold text-[#075E54] mb-2">
                    {data.header}
                  </div>
                )}

                {/* Body / Message */}
                <div className="mb-2">
                  {data.message || 'Choose an option:'}
                </div>

                {/* Footer */}
                {data.footer && (
                  <div className="text-[11px] text-text mt-2">
                    {data.footer}
                  </div>
                )}

                {/* CTA Label */}
                {/* {data.actionButtonText && (
                  <div className="mt-3 mb-1 text-xs font-medium text-[#128C7E]">
                    {data.actionButtonText}
                  </div>
                )} */}

                {/* Buttons */}
                {(data.buttons || []).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {data.buttons.map((btn) => (
                      <button
                        key={btn.id}
                        className="w-full text-left bg-white hover:bg-bg text-sm py-1 px-2 rounded border border-border"
                      >
                        {btn.title || 'Untitled Button'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}


          {/* 📋 List Sections (for Interactive_List_Section) */}
          {type === 'Interactive_List_Section' && (() => {
            const sectionId = selectedNode.id;
            const rows = allNodes.filter(
              (row) =>
                row.type === 'Interactive_List_Row' &&
                row.data.sectionId === sectionId
            );

            return (
              <div className="mt-4">
                <p className="text-sm font-semibold text-text">
                  🔘 {data.sectionTitle || 'Untitled Section'}
                </p>

                {rows.length > 0 ? (
                  rows.map((row) => (
                    <div
                      key={row.id}
                      className="mt-1 px-3 py-1 border rounded bg-bg text-sm"
                    >
                      <div className="font-semibold">
                        {row.data.title || 'Row Title'}
                      </div>
                      <div className="text-text text-xs">
                        {row.data.description || 'Row description'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-text text-xs ml-2">No rows linked</p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* 🔁 Conditions Editor */}
      <ConditionEditor
        conditions={meta?.conditions || []}
        onChange={handleConditionsChange}
      />
    </div>
  );
}
