

import React, { useEffect, useRef, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import EmojiPicker from "emoji-picker-react";
import { FiBold, FiItalic } from "react-icons/fi";
import { FaCode, FaStrikethrough } from "react-icons/fa";
import InputField from "../components/InputField"; // Changed from Input to InputField for consistency
import Quill from 'quill';

// Then override global require if needed
if (typeof window !== 'undefined') {
  window.require = (name) => {
    if (name === 'quill') return { default: Quill };
    throw new Error(`Cannot require module: ${name}`);
  };
}
const RichTextEditor = ({ onChange, value, loading ,carosual=true}) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: null,
    },
    placeholder: "Start writing here...",
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [_variableExamples, set_VariableExamples] = useState({}); // Renamed internal state for clarity
  const variableCounter = useRef(1); // For unique variable numbering for insertion
  const isInitialized = useRef(false);

  // Helper to extract variable names/indices from text (e.g., {{1}}, {{2}})
  const extractVariables = (text) => {
    const regex = /\{\{(\d+)\}\}/g; // Matches {{number}}
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return [...new Set(matches)].sort((a, b) => parseInt(a) - parseInt(b)); // Return unique, sorted numbers
  };

  // Helper to replace variables with their examples
  const replaceVariables = (text, examples) => {
    return Object.entries(examples).reduce((result, [key, value]) => {
      return result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
    }, text);
  };

  // Initialize editor with content
  useEffect(() => {
    if (quill && value !== undefined && !isInitialized.current) { // Check for undefined value
      quill.clipboard.dangerouslyPasteHTML(value || ""); // Ensure value is a string
      isInitialized.current = true;
      // Also extract existing variables and initialize examples if value is provided
      const initialPlainText = quill.getText();
      const initialVars = extractVariables(initialPlainText);
      const initialExamples = {};
      initialVars.forEach(v => {
        initialExamples[v] = `Example_${v}`; // Default example
      });
      set_VariableExamples(initialExamples);
    }
  }, [quill, value]);

  // Handle text changes
  useEffect(() => {
    if (quill) {
      const handler = () => {
        const rawHTML = quill.root.innerHTML;
        const plainText = quill.getText();
        const extractedVars = extractVariables(plainText); // Get current list of variables
        const formattedText = replaceVariables(plainText, _variableExamples); // Use internal examples

        // Ensure _variableExamples is updated for new variables
        set_VariableExamples(prev => {
          const newExamples = { ...prev };
          extractedVars.forEach(v => {
            if (newExamples[v] === undefined) {
              newExamples[v] = `Example_${v}`;
            }
          });
          return newExamples;
        });

        // Pass extracted variable names (array) and their examples (object)
        onChange?.({
          rawHTML,
          formattedText,
          variables: extractedVars, // <--- Pass the array of variable names/indices
          variableExamples: _variableExamples, // <--- Pass the object of example values
        });
      };

      quill.on("text-change", handler);
      return () => quill.off("text-change", handler);
    }
  }, [quill, onChange, _variableExamples]); // Dependency on _variableExamples

  const insertVariable = () => {
    if (quill) {
      quill.focus();
      const range = quill.getSelection() || {
        index: quill.getLength(),
        length: 0,
      };

      const varName = variableCounter.current.toString();
      const variable = `{{${varName}}}`;

      quill.insertText(range.index, variable);
      quill.setSelection(range.index + variable.length, 0);

      // Initialize example for the new variable
      set_VariableExamples((prev) => ({ ...prev, [varName]: `Example_${varName}` }));
      variableCounter.current += 1;
    }
  };

  const handleVariableExampleChange = (varName, value) => { // Renamed for clarity
    set_VariableExamples((prev) => {
      const updatedExamples = { ...prev, [varName]: value };

      if (quill) {
        const rawText = quill.getText();
        const formattedText = replaceVariables(rawText, updatedExamples);

        // Pass updated examples to parent immediately
        const extractedVars = extractVariables(rawText);
        onChange?.({
          rawHTML: quill.root.innerHTML, // Get current HTML
          formattedText,
          variables: extractedVars,
          variableExamples: updatedExamples,
        });
      }
      return updatedExamples;
    });
  };

  const insertEmoji = (emojiData) => {
    if (!quill) return;
    const index = quill.getSelection(true)?.index || 0;
    quill.insertText(index, emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Custom button handlers for formatting
  const handleBold = () => {
    if (!quill) return;
    const range = quill.getSelection();
    if (!range) return;

    const text = quill.getText(range.index, range.length);
    quill.deleteText(range.index, range.length);
    quill.insertText(range.index, `*${text}*`);
    quill.setSelection(range.index + 1 + text.length + 1);
  };

  const handleItalic = () => {
    if (!quill) return;
    const range = quill.getSelection();
    if (!range) return;

    const text = quill.getText(range.index, range.length);
    quill.deleteText(range.index, range.length);
    quill.insertText(range.index, `_${text}_`);
    quill.setSelection(range.index + 1 + text.length + 1);
  };

  const handleStrike = () => {
    if (!quill) return;
    const range = quill.getSelection();
    if (!range) return;

    const text = quill.getText(range.index, range.length);
    quill.deleteText(range.index, range.length);
    quill.insertText(range.index, `~${text}~`);
    quill.setSelection(range.index + 1 + text.length + 1);
  };

  const handleCodeBlock = () => {
    if (!quill) return;
    const range = quill.getSelection();
    if (!range) return;

    const text = quill.getText(range.index, range.length);
    quill.deleteText(range.index, range.length);
    quill.insertText(range.index, `\`\`\`\n${text}\n\`\`\``);
    quill.setSelection(range.index + 4 + text.length + 4);
  };

  return (
    <div className="border border-none dark:text-dark-text-primary dark:bg-dark-surface rounded text-text bg-bg p-2" dir="ltr"> {/* Ensure consistent direction */}
      <div className="rounded">
        {/* Quill Editor */}
        <div>
          <div
            style={{
              width: "full",
              height: "200Px",
            }}
            ref={quillRef}
          />
        </div>
        {/* Controls */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={handleBold}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
            type="button"
            disabled={loading}
          >
            <FiBold />
          </button>
          <button
            onClick={handleItalic}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
            type="button"
            disabled={loading}
          >
            <FiItalic />
          </button>
          <button
            onClick={handleStrike}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
            type="button"
            disabled={loading}
          >
            <FaStrikethrough />
          </button>
          <button
            onClick={handleCodeBlock}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
            type="button"
            disabled={loading}
          >
            <FaCode />
          </button>
          <button
            onClick={insertVariable}
            className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
            type="button"
            disabled={loading}
          >
            Add Variable
          </button>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
            type="button"
            disabled={loading}
          >
            😊
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute z-10 mt-2">
            <EmojiPicker onEmojiClick={insertEmoji} />
          </div>
        )}
      </div>
 {carosual &&      extractVariables(quill?.getText() || '').length > 0 && (
        <div className="mt-4 p-2 border rounded bg-white">
          <p className="font-semibold text-sm mb-1">Variable Examples:</p>
          {extractVariables(quill?.getText() || '').map((varId) => (
            <div key={`rte-var-${varId}`} className="mb-2">
              <InputField
              className="dark:bg-dark-surface dark:text-dark-text-primary"
                label={`Example for {{${varId}}}`}
                value={_variableExamples[varId] || ''}
                onChange={(e) => handleVariableExampleChange(varId, e.target.value)}
                placeholder={`e.g., Example for {{${varId}}}`}
              />
            </div>
          ))}
        </div>
      )}
      {/* Internal Variable Example Inputs */}
      {/* {extractVariables(quill?.getText() || '').length > 0 && (
        <div className="mt-4 p-2 border rounded bg-white">
          <p className="font-semibold text-sm mb-1">Variable Examples:</p>
          {extractVariables(quill?.getText() || '').map((varId) => (
            <div key={`rte-var-${varId}`} className="mb-2">
              <InputField
                label={`Example for {{${varId}}}`}
                value={_variableExamples[varId] || ''}
                onChange={(e) => handleVariableExampleChange(varId, e.target.value)}
                placeholder={`e.g., Example for {{${varId}}}`}
              />
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default RichTextEditor;
