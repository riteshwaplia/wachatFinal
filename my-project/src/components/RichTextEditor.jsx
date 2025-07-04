import React, { useEffect, useRef, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import EmojiPicker from "emoji-picker-react";
import { FiBold, FiItalic } from "react-icons/fi";
import { FaCode, FaStrikethrough } from "react-icons/fa";
import Input from "../components/InputField";

const RichTextEditor = ({ onChange, value }) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: null,
    },
    placeholder: "Start writing here...",
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [variables, setVariables] = useState({});
  const variableCounter = useRef(1);
  const isInitialized = useRef(false);

  // Initialize editor with content
  useEffect(() => {
    if (quill && value && !isInitialized.current) {
      quill.clipboard.dangerouslyPasteHTML(value || "");
      isInitialized.current = true;
    }

  }, [quill, value]);

  // Handle text changes
  useEffect(() => {
    if (quill) {
      const handler = () => {
        const rawHTML = quill.root.innerHTML;
        const plainText = quill.getText();
        const formatted = replaceVariables(plainText, variables);

        onChange?.({
          rawHTML,
          formattedText: formatted,
          variables,
        });
      };

      quill.on("text-change", handler);
      return () => quill.off("text-change", handler);
    }
  }, [quill, onChange, variables]);

  const replaceVariables = (text, vars) => {
    return Object.entries(vars).reduce((result, [key, value]) => {
      return result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || "");
    }, text);
  };

  const insertVariable = () => {
    if (quill) {
      // Ensure the editor has focus
      quill.focus();

      // Get current selection or use the end of document
      const range = quill.getSelection() || {
        index: quill.getLength(),
        length: 0,
      };

      const varName = variableCounter.current.toString();
      const variable = `{{${varName}}}`;

      // Insert at current position or end
      quill.insertText(range.index, variable);

      // Move cursor after the variable
      quill.setSelection(range.index + variable.length, 0);

      // Update variables state
      setVariables((prev) => ({ ...prev, [varName]: "" }));
      variableCounter.current += 1;
    }
  };

  const handleVariableChange = (varName, value) => {
    setVariables((prev) => {
      const updatedVars = { ...prev, [varName]: value };

      if (quill) {
        const rawText = quill.getText();
        const formattedText = replaceVariables(rawText, updatedVars);

        onChange?.({
          rawText,
          formattedText,
          variables: updatedVars,
        });
      }

      return updatedVars;
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
    <div className="border border-none rounded text-text bg-bg p-2" dir="">
      <div className=" rounded">
        {/* Quill Editor */}
        <div>
          <div
            style={{
              width: "full",
              height: "200Px",
              direction: "ltr", // Explicitly set direction
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
          >
            <FiBold />
          </button>
          <button
            onClick={handleItalic}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
            type="button"
          >
            <FiItalic />
          </button>
          <button
            onClick={handleStrike}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
            type="button"
          >
            <FaStrikethrough />
          </button>
          <button
            onClick={handleCodeBlock}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
            type="button"
          >
            <FaCode />
          </button>
          <button
            onClick={insertVariable}
            className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
            type="button"
          >
            Add Variable
          </button>
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
            type="button"
          >
            😊 Emoji
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mt-2 z-10">
            <EmojiPicker onEmojiClick={insertEmoji} />
          </div>
        )}
      </div>
      {Object.keys(variables).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(variables).map(([varName, value]) => (
            <div key={varName} className="flex items-center gap-2">
              <span className="text-sm">{`{{${varName}}}`}:</span>
              <Input
                value={value}
                onChange={(e) => handleVariableChange(varName, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
