import React, { useState } from 'react';

const WhatsAppPreview = ({ screens, flowName }) => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});

  const currentScreen = screens[currentScreenIndex];

  if (!currentScreen) {
    return (
      <div className="bg-[#efeae2] rounded-2xl p-4 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">💬</div>
          <p>No screens to preview</p>
          <p className="text-sm mt-2">Add screens to see WhatsApp preview</p>
        </div>
      </div>
    );
  }

  const handleCheckboxChange = (componentName, option) => {
    setSelectedOptions((prev) => {
      const current = prev[componentName] || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];

      setFormData((prevData) => ({
        ...prevData,
        [componentName]: updated,
      }));

      return {
        ...prev,
        [componentName]: updated,
      };
    });
  };

  const handleInputChange = (componentName, value) => {
    setFormData((prev) => ({
      ...prev,
      [componentName]: value,
    }));
  };
const renderComponent = (component, index) => {
  switch (component.type) {
    // Text Components
    case "TextHeading":
      return (
        <div key={index} className="mb-1">
          <div className="bg-white rounded-lg   max-w-[95%] rounded-tl-none">
            <div className="text-2xl font-bold text-gray-800 whitespace-pre-wrap leading-relaxed">
              {component.text}
            </div>
          </div>
        </div>
      );

    case "TextSubheading":
      return (
        <div key={index} className="mb-1">
          <div className="bg-white   max-w-[95%] rounded-tl-none">
            <div className="text-lg font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed">
              {component.text}
            </div>
          </div>
        </div>
      );

    case "TextBody":
      return (
        <div key={index} className="mb-1">
          <div className="bg-white   max-w-[95%] rounded-tl-none">
            <div className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
              {component.text}
            </div>
          </div>
        </div>
      );

    case "TextCaption":
      return (
        <div key={index} className="mb-1">
          <div className="bg-white  max-w-[95%] rounded-tl-none">
            <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              {component.text}
            </div>
          </div>
        </div>
      );

    case "RichText":
      return (
        <div key={index} className="mb-4">
          <div className="bg-white  max-w-[95%] rounded-tl-none">
            <div className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
              {component.text}
            </div>
          </div>
        </div>
      );

    // Input Components
    case "TextInput":
      return (
        <div key={index} className="mb-6">
          <label className="block text-[14px] text-gray-600 mb-2 px-1">
            {component.label}
            {component.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={component["input-type"] || "text"}
            value={formData[component.name] || ""}
            onChange={(e) => handleInputChange(component.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px]"
            placeholder={component.helperText || `Enter ${component.label.toLowerCase()}...`}
          />
          {component.helperText && (
            <div className="text-[12px] text-gray-500 mt-1 px-1">
              {component.helperText}
            </div>
          )}
        </div>
      );

    case "TextArea":
      return (
        <div key={index} className="mb-6">
          <label className="block text-[14px] text-gray-600 mb-2 px-1">
            {component.label}
            {component.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="relative">
            <textarea
              value={formData[component.name] || ""}
              onChange={(e) => handleInputChange(component.name, e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px]"
              placeholder={component.helperText || "Type your message..."}
            />
            <div className="absolute bottom-2 right-2 text-[12px] text-gray-400">
              {formData[component.name]?.length || 0} / 600
            </div>
          </div>
        </div>
      );

    // Selection Components
    case "Dropdown":
      return (
        <div key={index} className="mb-6">
          <label className="block text-[14px] text-gray-600 mb-2 px-1">
            {component.label}
            {component.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={formData[component.name] || ""}
            onChange={(e) => handleInputChange(component.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px] bg-white"
          >
            <option value="">Select an option</option>
            {component.options && component.options.map((option, optIndex) => (
              <option key={optIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "RadioButtonsGroup":
      return (
        <div key={index} className="mb-6">
          <div className="text-[14px] text-gray-600 mb-3 px-1">
            {component.label}
            {component.required && <span className="text-red-500 ml-1">*</span>}
          </div>
          <div className="space-y-2">
            {component.options && component.options.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={component.name}
                  checked={formData[component.name] === option}
                  onChange={() => handleInputChange(component.name, option)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-[14px] text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case "CheckboxGroup":
      return (
        <div key={index} className="mb-6">
          <div className="text-[14px] text-gray-600 mb-3 px-1">
            {component.label}
            {component.required && <span className="text-red-500 ml-1">*</span>}
          </div>
          <div className="space-y-2">
            {component.options && component.options.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedOptions[component.name]?.includes(option) || false}
                  onChange={() => handleCheckboxChange(component.name, option)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-[14px] text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case "ChipsSelector":
      return (
        <div key={index} className="mb-6">
          <div className="text-[14px] text-gray-600 mb-3 px-1">
            {component.label}
            {component.required && <span className="text-red-500 ml-1">*</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {component.options && component.options.map((option, optIndex) => (
              <button
                key={optIndex}
                type="button"
                onClick={() => handleChipSelection(component.name, option)}
                className={`px-4 py-2 rounded-full border text-[14px] transition-colors ${
                  selectedOptions[component.name]?.includes(option)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );

    // Special Components
    case "OptIn":
      return (
        <div key={index} className="mb-6">
          <label className="flex items-start gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData[component.name] || false}
              onChange={(e) => handleInputChange(component.name, e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-[14px] text-gray-800 mb-1">
                {component.label}
                {component.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              <div className="text-[12px] text-gray-500">
                {component.helperText || "Managed by the business. Learn more"}
              </div>
            </div>
          </label>
        </div>
      );

    case "EmbeddedLink":
      return (
        <div key={index} className="mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm max-w-[95%] rounded-tl-none">
            <div className="text-[14px] text-gray-800 mb-2">
              {component.label}
            </div>
            <a
              href={component.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-[14px] break-all"
            >
              {component.url || "https://example.com"}
            </a>
          </div>
        </div>
      );

    case "DatePicker":
    case "CalendarPicker":
      return (
        <div key={index} className="mb-6">
          <label className="block text-[14px] text-gray-600 mb-2 px-1">
            {component.label}
            {component.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="date"
            value={formData[component.name] || ""}
            onChange={(e) => handleInputChange(component.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[14px]"
          />
          {component.format && (
            <div className="text-[12px] text-gray-500 mt-1 px-1">
              Format: {component.format}
            </div>
          )}
        </div>
      );

    case "Image":
      return (
        <div key={index} className="mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm max-w-[95%] rounded-tl-none">
            <div className="text-[14px] text-gray-800 mb-2">
              {component.label}
            </div>
            <div className="bg-gray-100 rounded p-4 text-center">
              {component.src ? (
                // <img 
                //   src={component.src} 
                //   alt={component.label} 
                //   className="max-w-full h-auto rounded mx-auto"
                //   onError={(e) => {
                //     e.target.style.display = 'none';
                //     e.target.nextSibling.style.display = 'block';
                //   }}
                // />
                 <img
          src={
           
              `data:image/png;base64,${component.src}`
          }
                            className="max-w-full h-auto rounded mx-auto"

        />
              ) : null}
              <div className={`text-gray-500 text-sm ${component.src ? 'hidden' : 'block'}`}>
                🖼️ Image: {component.src || "No image URL provided"}
              </div>
            </div>
          </div>
        </div>
      );

    case "Footer":
      return (
        <div key={index} className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (currentScreenIndex < screens.length - 1) {
                setTimeout(() => {
                  setCurrentScreenIndex(currentScreenIndex + 1);
                }, 500);
              } else {
                setTimeout(() => {
                  alert("Flow completed successfully!");
                }, 500);
              }
            }}
            className="w-full bg-[#0086cc] text-white py-3 rounded-lg font-medium hover:bg-[#0077b3] transition-colors text-[14px]"
          >
            {component.label || "Continue"}
          </button>
        </div>
      );

    default:
      return (
        <div key={index} className="mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm max-w-[85%] rounded-tl-none">
            <div className="text-[14px] text-gray-800">
              {component.type}: {component.label}
            </div>
          </div>
        </div>
      );
  }
};
  const formChildren = currentScreen?.layout?.children?.[0]?.children || [];

  return (
    <div className="bg-[#fff] rounded-2xl overflow-hidden h-full flex flex-col max-w-md mx-auto shadow-lg">
      {/* WhatsApp Header */}
      <div className="bg-[#008069] text-white p-4">
        <div className="flex items-center gap-3">
          <button className="text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </button>
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-lg">💼</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[16px]">Business Name</div>
            <div className="text-[12px] opacity-90">WhatsApp Business</div>
          </div>
          <div className="flex gap-3">
            <button className="text-white opacity-90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z" />
              </svg>
            </button>
            <button className="text-white opacity-90">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#fff] bg-opacity-50">
        {/* Date */}
        <div className="text-center text-gray-500 text-[12px] mb-6">
          Today, 10:24 AM
        </div>

        {/* Welcome Message */}
        {/* <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm max-w-[85%] rounded-tl-none">
            <div className="text-[14px] text-gray-800 leading-relaxed">
              Hello! Welcome to our service. Please fill out the form below to
              continue.
            </div>
            <div className="text-[11px] text-gray-500 text-right mt-2">
              10:24 AM
            </div>
          </div>
        </div> */}

        {/* Current Screen Content */}
        {formChildren
          .filter((comp) => !["Footer"].includes(comp.type))
          .map((component, index) => renderComponent(component, index))}

        {/* Footer Button */}
        {formChildren
          .filter((comp) => comp.type === "Footer")
          .map((component, index) => renderComponent(component, index))}
      </div>

      {/* Navigation Controls */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-600 text-[13px]">
            Screen {currentScreenIndex + 1} of {screens.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentScreenIndex(Math.max(0, currentScreenIndex - 1))
              }
              disabled={currentScreenIndex === 0}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-[12px] disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() =>
                setCurrentScreenIndex(
                  Math.min(screens.length - 1, currentScreenIndex + 1)
                )
              }
              disabled={currentScreenIndex === screens.length - 1}
              className="px-3 py-1.5 bg-[#008069] text-white rounded text-[12px] disabled:opacity-50 hover:bg-[#006e58] transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentScreenIndex(0);
            setFormData({});
            setSelectedOptions({});
          }}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded text-[12px] hover:bg-gray-200 transition-colors"
        >
          Reset Preview
        </button>
      </div>
    </div>
  );
};

export default WhatsAppPreview;