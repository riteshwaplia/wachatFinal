import React, { useState } from "react";
import { MobileNumber } from "../MobileNumber";

const DynamicButtonsBuilder = ({ onChange }) => {
  const [buttons, setButtons] = useState([]);
  const [phone, setPhone] = useState("");

  const validButtonTypes = {
    QUICK_REPLY: "QUICK_REPLY",
    URL: "URL",
    PHONE_NUMBER: "PHONE_NUMBER",
    // COPY_CODE: "POSTBACK", // Using POSTBACK for copy code functionality
  };

  const checkIfButtonExists = (type) => {
    return buttons.some((button) => button.type === type);
  };

  const handlePhoneChange = (number) => {
    setPhone(number);
    const updatedButtons = buttons.map((btn) =>
      btn.type === validButtonTypes.PHONE_NUMBER
        ? { ...btn, payload: number }
        : btn
    );
    setButtons(updatedButtons);
    onChange(updatedButtons);
  };

  const handleAddButton = (type) => {
    // if (checkIfButtonExists(type)) {
    //   toast.error("Button already exists");
    //   return;
    // }

    let newButton = { type };

    switch (type) {
      case validButtonTypes.QUICK_REPLY:
        newButton.text = "Quick Reply";
        break;
      case validButtonTypes.URL:
        newButton.text = "Visit Website";
        newButton.url = "";
        break;
      case validButtonTypes.PHONE_NUMBER:
        newButton.text = "Call Us";
        newButton.payload = phone;
        break;
      case validButtonTypes.COPY_CODE:
        newButton.text = "Copy Code";
        newButton.payload = "COPY_CODE";
        break;
      default:
        break;
    }

    const updated = [...buttons, newButton];
    setButtons(updated);
    onChange(updated);
  };

  const handleChange = (index, key, value) => {
    const updatedButtons = [...buttons];
    updatedButtons[index][key] = value;
    setButtons(updatedButtons);
    onChange(updatedButtons);
  };

  const handleRemoveButton = (index) => {
    const updated = [...buttons];
    updated.splice(index, 1);
    setButtons(updated);
    onChange(updated);
  };

  const getButtonDisplayType = (type) => {
    switch (type) {
      case validButtonTypes.QUICK_REPLY:
        return "Quick Reply";
      case validButtonTypes.URL:
        return "Website URL";
      case validButtonTypes.PHONE_NUMBER:
        return "Phone Number";
      case validButtonTypes.COPY_CODE:
        return "Copy Code";
      default:
        return type;
    }
  };

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-lg font-bold">Button Builder</h2>

      <select
        id="buttonType"
        className="bg-white p-3 pr-8 rounded-lg border-2 border-gray-100 text-gray-800 font-medium 
            shadow-sm hover:border-primary-400 focus:border-primary-500 focus:ring-2 
            focus:ring-primary-200 transition-all duration-200 cursor-pointer
            w-full max-w-xs appearance-none"
        onChange={(e) => handleAddButton(e.target.value)}
        value=""
        defaultValue=""
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333436'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1em",
        }}
      >
        <option value="" disabled hidden className="text-gray-400 italic">
          ✨ Add Button ✨
        </option>

        <optgroup
          label="Quick Replies"
          className="text-sm text-gray-500 font-medium border-t border-gray-100"
        >
          <option
            value={validButtonTypes.QUICK_REPLY}
            className="py-2 px-3 hover:bg-primary-50 hover:text-primary-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <span>Quick Reply</span>
            </span>
          </option>
        </optgroup>

        <optgroup
          label="Call-to-action"
          className="text-sm text-gray-500 font-medium border-t border-gray-100"
        >
          <option
            value={validButtonTypes.URL}
            className="py-2 px-3 hover:bg-primary-50 hover:text-primary-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">🌐</span>
              <span>Visit Website</span>
            </span>
          </option>
          <option
            value={validButtonTypes.PHONE_NUMBER}
            className="py-2 px-3 hover:bg-primary-50 hover:text-primary-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <span>Call Phone</span>
            </span>
          </option>
        </optgroup>
      </select>

      {buttons.map((btn, index) => (
        <div key={index} className="p-3 bg-gray-100 rounded space-y-2">
          <div className="flex justify-between items-center">
            <strong>{getButtonDisplayType(btn.type)} Button</strong>
            <button
              onClick={() => handleRemoveButton(index)}
              className="text-red-500 text-sm"
              type="button"
            >
              ✖ remove
            </button>
          </div>

          <input
            type="text"
            placeholder="Button Text"
            value={btn.text || ""}
            onChange={(e) => handleChange(index, "text", e.target.value)}
            className="w-full bg-inputbg text-text p-2 border rounded"
          />

          {btn.type === validButtonTypes.URL && (
            <input
              type="text"
              placeholder="Website URL"
              value={btn.url || ""}
              onChange={(e) => handleChange(index, "url", e.target.value)}
              className="w-full bg-inputbg text-text p-2 border rounded"
            />
          )}

          {btn.type === validButtonTypes.PHONE_NUMBER && (
            <MobileNumber
              value={btn.payload || ""}
              onChange={handlePhoneChange}
              country="in"
              autoattribute={true}
              className="w-full p-2 border rounded"
            />
          )}

          {/* {btn.type === validButtonTypes.COPY_CODE && (
            <input
              type="text"
              placeholder="Offer Code"
              value={btn.payload || ""}
              onChange={(e) => handleChange(index, "payload", e.target.value)}
              className="w-full bg-inputbg text-text p-2 border rounded"
            />
          )} */}
        </div>
      ))}

      {/* <div>
        <h3 className="text-md font-semibold mt-4 mb-1">Generated Buttons:</h3>
        <pre className="bg-gray-800 text-white p-3 rounded text-sm whitespace-pre-wrap">
          {JSON.stringify(buttons, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default DynamicButtonsBuilder;
