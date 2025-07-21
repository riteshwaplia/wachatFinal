import React from 'react';
import { CgAdd } from 'react-icons/cg';
import { FaAddressBook } from 'react-icons/fa';

export default function ConditionEditor({ conditions, onChange }) {
  const handleChange = (index, field, value) => {
    const updated = [...conditions];
    updated[index][field] = value;
    onChange(updated);
  };

  const handleAddCondition = () => {
    onChange([...conditions, { key: '', operator: 'equals', value: '' }]);
  };

  const handleRemoveCondition = (index) => {
    const updated = [...conditions];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="p-4 space-y-4 bg-bg rounded border border-border">
      <h3 className="font-semibold text-lg text-text">🎯 Node Trigger Conditions</h3>
      <p className="text-sm text-text ">
        Define rules that decide when this node should be triggered. Example: if <code>user.selected_option</code> equals <code>Internship</code>.
      </p>

      {conditions.map((condition, index) => (
        <div
          key={index}
          className="p-4 border  border-border rounded-md bg-bg shadow-sm space-y-2 relative"
        >
          <button
            onClick={() => handleRemoveCondition(index)}
            className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700"
            title="Remove this condition"
          >
            ×
          </button>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-text mb-1">
              🧠 Condition Key (Path)
            </label>
            <input
              type="text"
              value={condition.key}
              onChange={(e) => handleChange(index, 'key', e.target.value)}
              placeholder="e.g. user.selected_option"
              className="border bg-secondary-50  px-3 py-1 rounded text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-text mb-1">⚖️ Operator</label>
            <select
              value={condition.operator}
              onChange={(e) => handleChange(index, 'operator', e.target.value)}
              className="border bg-secondary-50 px-3 py-1 rounded text-sm"
            >
              <option value="equals">equals</option>
              <option value="includes">includes</option>
              <option value="startsWith">starts with</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-text mb-1">🎯 Expected Value</label>
            <input
              type="text"
              value={condition.value}
              onChange={(e) => handleChange(index, 'value', e.target.value)}
              placeholder='e.g. "Internship", "India"'
              className="border bg-secondary-50 px-3 py-1 rounded text-sm"
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleAddCondition}
        className="bg-primary-700 text-white px-4 py-2 rounded hover:bg-primary-600 transition"
      >
        Add New Condition
      </button>
    </div>
  );
}
