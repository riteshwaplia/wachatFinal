import React from "react";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";

const instructionMap = {
  TextHeading: {
    title: "Heading Component",
    description: "Use a heading to introduce a section or screen title.",
    tips: [
      "Keep it short and informative.",
      "Avoid emojis or promotional text.",
      "Best used at the top of your screen.",
    ],
  },
  TextInput: {
    title: "Text Input Field",
    description: "Captures text input such as name or email.",
    tips: [
      "You can make it required if needed.",
      "Use a clear label and placeholder.",
      "Avoid adding multiple fields for same purpose.",
    ],
  },
  Dropdown: {
    title: "Dropdown Component",
    description: "Allows users to select one option from a predefined list.",
    tips: [
      "Use short, meaningful option names.",
      "Don’t overload with too many options.",
    ],
  },
  PhotoPicker: {
    title: "📸 Photo Picker",
    description:
      "Lets users upload or capture a photo. This component must exist **alone** in a screen.",
    tips: [
      "❗ Only one Photo Picker per screen.",
      "Cannot coexist with any other component.",
      "Best used for ID uploads or selfie capture flows.",
    ],
  },
  DocumentPicker: {
    title: "📄 Document Picker",
    description:
      "Allows users to upload documents (PDF, DOCX, etc.). Must exist alone on a screen.",
    tips: [
      "❗ This component cannot coexist with others.",
      "Use only when document upload is necessary.",
      "Make sure file size limits are clearly mentioned to the user.",
    ],
  },
  Footer: {
    title: "🚫 Footer Restriction",
    description:
      "Footer buttons (like Continue, Submit, etc.) are automatically handled for navigation.",
    tips: [
      "❗ You don’t need to add a Footer in navigation-type screens.",
      "It’s auto-managed in NavigationList flows.",
      "Avoid duplicate footers on the same screen.",
    ],
  },
  NavigationList: {
    title: "🧭 Navigation List Component",
    description:
      "Displays a list of navigable options or menu items linking to other screens.",
    tips: [
      "❗ Footer should not exist on NavigationList screens.",
      "Use short titles and optional icons for each list item.",
      "Max 8 items per screen for best layout.",
    ],
  },
};

const InstructionPanel = ({ selectedComponent, screenComponents }) => {
    console.log("selectedComponent:", selectedComponent);
  if (!selectedComponent)
    return (
      <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
        <Info className="mx-auto mb-2 text-gray-400 dark:text-gray-500" />
        Select a component to view relevant setup instructions.
      </div>
    );
  const warnings = [];

  const info =
    instructionMap[selectedComponent.type] || {
      title: "Component Info",
      description: "No specific instructions available for this component.",
      tips: [],
    };
 const children = screenComponents?.layout?.children?.[0]?.children || [];
  const componentCount = children.length;

  // --- Start Conditional Warning Checks ---

  // 1. Max Component Count Warning
  if (componentCount > 8) {
    warnings.push(`⚠️ A single screen cannot contain more than 8 components. (Current: ${componentCount})`);
  }
  // Validation checks

//   if (screenComponents?.length > 8) {
//     warnings.push("⚠️ A single screen cannot contain more than 8 components.");
//   }

  const exclusiveTypes = ["PhotoPicker", "DocumentPicker"];
  if (
    exclusiveTypes.includes(selectedComponent.type) 
  ) {
    warnings.push(
      `⚠️ ${selectedComponent.type} must be the only component in this screen.`
    );
  }

  if (
    selectedComponent.type === "Footer" &&
    screenComponents.some((c) => c.type === "NavigationList")
  ) {
    warnings.push("⚠️ Footer should not exist in a NavigationList screen.");
  }

  if (
    selectedComponent.type === "NavigationList" &&
    screenComponents.some((c) => c.type === "Footer")
  ) {
    warnings.push("⚠️ NavigationList screen should not contain a Footer.");
  }

  return (
    <div className="p-4 space-y-4 text-gray-900 dark:text-gray-100">
         {warnings.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} />
            <span className="font-semibold">Warnings</span>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center gap-2">
        
        <Lightbulb className="text-yellow-500" size={18} />
        <h2 className="text-lg font-semibold">{info.title}</h2>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">{info.description}</p>

      {info.tips.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
          {info.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      )}

     
    </div>
  );
};

export default InstructionPanel;
