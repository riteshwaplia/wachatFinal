import React, { useRef, useState, useEffect } from "react"; // Added useEffect
import Input from "../InputField";
import RichTextEditor from "..//RichTextEditor";
import CustomSelect from "../CustomSelect";
import DynamicButtonsBuilder from "./DynamicButtonsBuilder";
import { languages } from "../../components/languages/Language";
import {
  createTemplateApi,
  uploadMedaiData, // Assuming this is defined and imported correctly
} from "../../apis/TemplateApi"; // Adjust path if needed
import { useNavigate, useParams } from "react-router-dom";
import TemplatePreview from "./TemplatePreview";
import api from "../../utils/api"; // Assuming this is your configured axios instance
import { BackButton } from "../BackButton";
import Badge from "../Badge";
import Modal from "../Modal";
import Button from "../Button";
import { ErrorToast } from "../../utils/Toast";

const TEMPLATE_CATEGORIES = [
  { label: "Marketing", value: "MARKETING" },
  { label: "Utility", value: "UTILITY" },
  // { label: "Authentication", value: "AUTHENTICATION" },
];

const HEADER_TYPES = [
  { label: "None", value: "" },
  { label: "Text", value: "TEXT" },
  { label: "Document", value: "DOCUMENT" },
  { label: "Image", value: "IMAGE" },
  { label: "Video", value: "VIDEO" },
];

// NOTE: PROJECTS array is hardcoded, typically these would be fetched dynamically.
// const PROJECTS = [
//   { label: "Project A", value: "project_a" },
//   { label: "Project B", value: "project_b" },
// ];

const CreateTemplate = () => {
  const params = useParams();
  const id = params.id; // This 'id' is likely the projectId from the URL
  const projectId = id; // Renaming for clarity
  const [loading, setLoading] = useState(false); // For loading state
  const variableCounter = useRef(1); // For unique variable numbering
  const [variableExamples, setVariableExamples] = useState({}); // For text header variable examples
  const [selectedType,setSelectedType] = useState(null);
  const navigate = useNavigate(); // Assuming you have react-router's useNavigate for navigation  
  // Logic to get businessProfileId from local storage (or context)
  const [businessProfileId, setBusinessProfileId] = useState(null);
  useEffect(() => {
    const project = localStorage.getItem("currentProject")
      ? JSON.parse(localStorage.getItem("currentProject"))
      : null;
    if (project?.businessProfileId?._id) {
      setBusinessProfileId(project.businessProfileId._id);
    }
  }, []);

  const [image, setImage] = useState(null); // For previewing uploaded image

  const [template, setTemplate] = useState({
    name: "",
    language: "",
    category: "MARKETING", // Default category
    components: [
      {
        type: "HEADER",
        format: "", // TEXT, IMAGE, DOCUMENT, VIDEO
        text: "", // For TEXT header
        mediaHandle: "", // For IMAGE/DOCUMENT/VIDEO header - Meta Media ID from upload
      },
      {
        type: "BODY",
        text: "Hello", // Rich text / plain text body
        variables: [], // Array of variable names/indices extracted from text
      },
      {
        type: "FOOTER",
        text: "", // Footer text
      },
      {
        type: "BUTTONS",
        buttons: [], // Array of button objects
      },
    ],
  });

  const [characterCount, setCharacterCount] = useState(0); // For body text character count

  const handleInputChange = (field, value) => {
    setTemplate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHeaderTypeChange = (selected) => {
    const format = selected?.value || "";
    setTemplate((prev) => {
      const updatedComponents = [...prev.components];
      const headerComponent = updatedComponents.find(
        (c) => c.type === "HEADER"
      );
      if (headerComponent) {
        headerComponent.format = format;
        headerComponent.text = ""; // Reset text content
        headerComponent.mediaHandle = ""; // Reset media handle
        setImage(null); // Clear preview image
      }
      return {
        ...prev,
        components: updatedComponents,
      };
    });
  };

  const handleHeaderContentChange = async (e) => {
    setLoading(true)
    const file = e.target.files?.[0]; // For file inputs
    const value = e.target.value; // For text inputs

    if (file) {
      setLoading(true); 
      setSelectedType(file.type);
      // Set loading state while uploading
      setImage(URL.createObjectURL(file)); // Set preview image
      try {
        // Ensure businessProfileId and projectId are available before upload
        if (!businessProfileId || !projectId) {
          console.error(
            "Missing businessProfileId or projectId for media upload."
          );
          setLoading(false);
          // You might want to show a user-facing error here
          return;
        }
        // Call the upload media API
        const uploadResponse = await uploadMedaiData(
          file,
          businessProfileId,
          projectId
        );
        console.log("Media Upload Response:", uploadResponse);
        setLoading(false); // Reset loading state after upload
        if (uploadResponse.success) {
          setTemplate((prev) => {
            const updatedComponents = [...prev.components];
            const headerComponent = updatedComponents.find(
              (c) => c.type === "HEADER"
            );
            if (headerComponent) {
              // Store the Meta Media ID directly on the header component
              headerComponent.mediaHandle = uploadResponse.data.id;
              // For text field, you might store the MIME type or a success message
              headerComponent.text = uploadResponse.data.mimeType;
            }
            return {
              ...prev,
              components: updatedComponents,
            };
          });
        } else {
          console.error("Media upload failed:", uploadResponse.message);
          // Handle specific upload errors (e.g., show to user)
        }
      } catch (error) {
        console.error("Error during media upload process:", error);
        // Handle general upload errors
      }
    } else if (value !== undefined) {
      // Handle text header content change
      setTemplate((prev) => {
        const updatedComponents = [...prev.components];
        const headerComponent = updatedComponents.find(
          (c) => c.type === "HEADER"
        );
        if (headerComponent) {
          headerComponent.text = value;
        }
        return {
          ...prev,
          components: updatedComponents,
        };
      });
    }
  };

  const handleBodyChange = ({ rawHTML, formattedText, variables }) => {
    const plainText = formattedText.replace(/<[^>]*>/g, ""); // Remove HTML tags for counting
    setCharacterCount(plainText.length);

    setTemplate((prev) => {
      const updatedComponents = [...prev.components];
      const bodyComponent = updatedComponents.find((c) => c.type === "BODY");
      if (bodyComponent) {
        bodyComponent.text = rawHTML; // Storing raw HTML from editor
        // Note: For Meta API, text should be plain text, will be cleaned in handleSubmit
        bodyComponent.variables = variables; // Store variables for reference/example generation
      }
      return {
        ...prev,
        components: updatedComponents,
      };
    });
  };

  const handleFooterChange = (e) => {
    const value = e.target.value;
    setTemplate((prev) => {
      const updatedComponents = [...prev.components];
      const footerComponent = updatedComponents.find(
        (c) => c.type === "FOOTER"
      );
      if (footerComponent) {
        footerComponent.text = value;
      }
      return {
        ...prev,
        components: updatedComponents,
      };
    });
  };

  const handleButtonsChange = (buttons) => {
    setTemplate((prev) => {
      const updatedComponents = [...prev.components];
      const buttonsComponent = updatedComponents.find(
        (c) => c.type === "BUTTONS"
      );
      if (buttonsComponent) {
        buttonsComponent.buttons = buttons;
      }
      return {
        ...prev,
        components: updatedComponents,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateTemplate();
    if (!validation.isValid) {
      console.error("Validation errors:", validation.errors);
      alert("Please fix the validation errors before submitting."); // Simple alert for user
      return;
    }

    const finalComponents = [];

    // HEADER component
    const header = template.components.find((c) => c.type === "HEADER");
    if (header?.format) {
      const headerComponent = {
        type: "HEADER",
        format: header.format.toUpperCase(),
      };

      if (header.format === "TEXT") {
        headerComponent.text = header.text;
        const headerVars = extractVariables(header.text);
        if (headerVars.length > 0) {
          headerComponent.example = {
            header_text: headerVars.map(
              (varId) => variableExamples[varId] || `Example ${varId}`
            ),
          };
        }
      } else {
        // IMAGE, VIDEO, DOCUMENT header
        if (header.mediaHandle) {
          // This `mediaHandle` is for our local DB storage/validation
          // Meta API expects the `example` field for template creation
          headerComponent.mediaHandle = header.mediaHandle; // IMPORTANT: Include this for our backend validation

          // Meta API example structure for media headers in template creation
          headerComponent.example = {
            header_handle: header.mediaHandle, // Meta expects string ID directly
          };
        } else {
          console.warn(
            `Attempted to create a ${header.format} header without a mediaHandle.`
          );
          // Frontend validation should ideally prevent reaching here, but as a safeguard.
          alert(`Media ID is required for ${header.format} header.`);
          return;
        }
      }
      finalComponents.push(headerComponent);
    }

    // BODY component
    const body = template.components.find((c) => c.type === "BODY");
    if (body?.text) {
      const plainText = body.text.replace(/<[^>]*>/g, ""); // Remove HTML tags
      const bodyComponent = {
        type: "BODY",
        text: plainText,
      };

      // Extract all variables like {{1}}, {{user_name}}, etc.
      const variablesInText = extractVariables(plainText);
      
      if (variablesInText?.length > 10) {
        ErrorToast("variables limit exceeds(10)")
        return
      }

      if (variablesInText.length > 0) {
        // Create example values only for each variable
        const exampleValues = variablesInText.map(
          (varId) => variableExamples[varId] || `Example_${varId}`
        );

        bodyComponent.example = {
          body_text: [exampleValues], // Must be an array of arrays
        };
      }

      finalComponents.push(bodyComponent);
    }

    // FOOTER component
    const footer = template.components.find((c) => c.type === "FOOTER");
    if (footer?.text) {
      finalComponents.push({
        type: "FOOTER",
        text: footer.text,
      });
    }

    // BUTTONS component
    const buttons = template.components.find((c) => c.type === "BUTTONS");
    if (buttons?.buttons?.length) {
      const cleanedButtons = buttons.buttons.map((btn) => {
        const base = {
          type: btn.type.toUpperCase(), // Ensure type is uppercase
          text: btn.text,
        };

        if (btn.type === "URL") {
          base.url = btn.url;
          if (btn.exampleUrl) {
            // Add example URL if provided
            base.example = [btn.exampleUrl];
          }
        } else if (btn.type === "PHONE_NUMBER") {
          // Renamed from POSTBACK in source
          base.phone_number = btn.payload; // Payload typically holds the phone number
        } else if (btn.type === "QUICK_REPLY") {
          // Quick reply buttons don't have extra fields beyond type and text
          // Meta API for templates doesn't usually take a 'payload' for quick replies in template definition
        }
        return base;
      });
      finalComponents.push({
        type: "BUTTONS",
        buttons: cleanedButtons,
      });
    }

    // Final payload to send to backend
    const payload = {
      name: template.name,
      language: template.language,
      category: template.category,
      components: finalComponents, // Use the dynamically built components array
      // id: id, // ID is for update, not create. Remove this for create.
      businessProfileId, // Required for template creation
    };
    setLoading(true); // Set loading state while creating template
    try {
      console.log("Template Create Payload:", JSON.stringify(payload, null, 2));
      const res = await api.post("/templates", payload); // Assuming api.post is configured for /api/templates
      console.log("Template created successfully:", res.data);
      setLoading(false); // Reset loading state after creation
      alert(res.data.message || "Template created successfully!");
      navigate(-1)
      // Optionally reset form or navigate
    } catch (error) {
      console.error(
        "Error creating template:",
        error.response?.data || error.message
      );
      alert(
        `Error creating template: ${error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Helper function to extract variables from text (e.g., {{1}}, {{2}})
  const extractVariables = (text) => {
    const regex = /\{\{(\d+)\}\}/g; // Matches {{number}}
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return [...new Set(matches)].sort((a, b) => parseInt(a) - parseInt(b)); // Return unique, sorted numbers
  };

  const validateTemplate = () => {
    const errors = {};
    const headerComponent = template.components.find(
      (c) => c.type === "HEADER"
    );
    const bodyComponent = template.components.find((c) => c.type === "BODY");
    const footerComponent = template.components.find(
      (c) => c.type === "FOOTER"
    );
    const buttonsComponent = template.components.find(
      (c) => c.type === "BUTTONS"
    );

    if (!template.name) errors.name = "Template name is required.";
    if (!template.category) errors.category = "Category is required.";
    if (!template.language) errors.language = "Language is required.";

    // Body validation


    if (
      !bodyComponent?.text ||
      bodyComponent.text.replace(/<[^>]*>/g, "").trim() === ""
    ) {
      errors.body = "Body is required. / add space( ) after varible";
    } else if (characterCount > 1024) {
      errors.body = "Body exceeds 1024 character limit.";
    }

    // Header validation (if format is selected)
    if (headerComponent?.format) {
      if (
        headerComponent.format === "TEXT" &&
        (!headerComponent.text || headerComponent.text.trim() === "")
      ) {
        errors.headerText = "Header text is required for TEXT header.";
      } else if (
        ["IMAGE", "VIDEO", "DOCUMENT"].includes(headerComponent.format)
      ) {
        if (!headerComponent.mediaHandle) {
          errors.headerMedia = `Media file must be uploaded for ${headerComponent.format} header.`;
        }
      }
    }

    // Buttons validation
    if (buttonsComponent?.buttons?.length) {
      for (const btn of buttonsComponent.buttons) {
        if (!btn.text || btn.text.trim() === "") {
          errors.buttons = "Button text is required for all buttons.";
          break;
        }
        if (btn.type === "URL" && (!btn.url || btn.url.trim() === "")) {
          errors.buttons = "URL is required for URL buttons.";
          break;
        }
        if (
          btn.type === "PHONE_NUMBER" &&
          (!btn.payload || btn.payload.trim() === "")
        ) {
          errors.buttons = "Phone number is required for PHONE_NUMBER buttons.";
          break;
        }
        // Add other button type validations as needed
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const { isValid, errors } = validateTemplate(); // Re-run validation on render for up-to-date errors

  const headerComponentInState = template.components.find(
    (c) => c.type === "HEADER"
  );
  const footerComponentInState = template.components.find(
    (c) => c.type === "FOOTER"
  );
  const buttonsComponentInState = template.components.find(
    (c) => c.type === "BUTTONS"
  );

  const insertVariable = () => {
    // Only insert into text header
    if (headerComponentInState?.format === "TEXT") {
      const variableName = `{{${variableCounter.current++}}}`;
      const newText = `${headerComponentInState.text} ${variableName}`;

      setTemplate((prev) => {
        const updatedComponents = [...prev.components];
        const header = updatedComponents.find((c) => c.type === "HEADER");
        if (header) {
          header.text = newText;
        }
        return {
          ...prev,
          components: updatedComponents,
        };
      });
    }
  };

  const [showWhyModal, setShowWhyModal] = useState(false);

  return (
    <>
      {" "}
      <BackButton text="back" />
      <div className="md:flex relative  w-full gap-4">
        <form onSubmit={handleSubmit} className="p-2 w-full md:w-3/5 flex flex-col gap-4">
          <Input
            placeholder="Template Name"
            label="Template Name "
            required
            value={template.name}
            onChange={(e) => {
              const modifiedValue = e.target.value.replace(/ /g, "_"); // space to underscore
              handleInputChange("name", modifiedValue);
            }}
            error={errors.name}
            disabled={loading} // Disable input while loading
          />

          <CustomSelect
            label="Template Category "
            required
            options={TEMPLATE_CATEGORIES}
            placeholder="Select Template Category"
            value={TEMPLATE_CATEGORIES.find(
              (opt) => opt.value === template.category
            )}
            onChange={(selected) =>
              handleInputChange("category", selected?.value)
            }
            error={errors.category}
            disabled={loading} // Disable input while loading
          />
          <CustomSelect
            label="Select Language "
            required
            options={languages}
            placeholder="Select Language"
            value={languages.find((opt) => opt.value === template.language)}
            onChange={(selected) =>
              handleInputChange("language", selected?.value)
            }
            error={errors.language}
            disabled={loading} // Disable input while loading
          />

          {/* Header Section */}
          <div className="space-y-4">
            <CustomSelect
              label="Select Header Type"
              options={HEADER_TYPES}
              placeholder="Select Header Type"
              value={HEADER_TYPES.find(
                (opt) => opt.value === headerComponentInState?.format
              )}
              onChange={handleHeaderTypeChange}
              disabled={loading}
            />

            {headerComponentInState?.format === "TEXT" && (
              <div>
                <Input
                  type="text"
                  placeholder="Enter header text"
                  value={headerComponentInState.text}
                  onChange={handleHeaderContentChange}
                  maxLength={60}
                  error={errors.headerText}
                />
                <button
                  onClick={
                    extractVariables(headerComponentInState.text).length === 0
                      ? insertVariable
                      : undefined
                  }
                  className={`px-2 py-1 rounded text-sm mt-2 ${extractVariables(headerComponentInState.text).length === 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  type="button"
                  disabled={
                    loading ||
                    extractVariables(headerComponentInState.text).length > 0
                  }
                >
                  Add Variable
                </button>

                {extractVariables(headerComponentInState.text)
                  .slice(0, 1)
                  .map((varId) => (
                    <div key={varId} className="mt-2">
                      <label className="text-sm font-medium">
                        Example for <code>{`{{${varId}}}`}</code>
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={`Example${varId}`}
                          placeholder={`Enter example for {{${varId}}}`}
                          className="mt-1"
                          readOnly
                          disabled
                        />
                        <button
                          type="button"
                          onClick={() => setShowWhyModal(true)}
                          className="text-sm text-blue-600 underline hover:text-blue-800"
                        >
                          Why?
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {["DOCUMENT", "IMAGE", "VIDEO"].includes(
              headerComponentInState?.format || ""
            ) && (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept={
                      headerComponentInState?.format === "IMAGE"
                        ? "image/*"
                        : headerComponentInState?.format === "VIDEO"
                          ? "video/*"
                          : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    }
                    onChange={handleHeaderContentChange}
                    className="w-full border p-2 rounded"
                    disabled={loading || headerComponentInState?.mediaHandle}
                  />
                  {
                    loading && (<div className=" inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>)
                  }
                  {headerComponentInState?.mediaHandle && (
                    <div className="text-sm text-green-600">
                      ✓ Media uploaded successfully
                      {/* {headerComponentInState.mediaHandle}) */}
                    </div>
                  )}
                  {errors.headerMedia && (
                    <div className="text-sm text-red-500 mt-1">
                      {errors.headerMedia}
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Body Section */}
          <div className="w-full">
            {" "}
            {/* Changed w-96 to w-full for better responsiveness */}
            <label className="block font-semibold mb-1">
              Body <span className="text-rose-400">* </span>
            </label>
            <RichTextEditor
              label="Body *"
              onChange={handleBodyChange}
              value={template.components.find((c) => c.type === "BODY")?.text}
              error={errors.body}
              maxLength={1024} // Enforce max length visually
              loading={loading}
            />
            <div
              className={`text-sm mt-1 ${characterCount > 1024 ? "text-red-500" : "text-gray-500"
                }`}
            >
              Characters: {characterCount}/1024
              {characterCount > 1024 && " - Exceeds WhatsApp limit"}
            </div>
            {errors.body && (
              <div className="text-sm text-red-500 mt-1">{errors.body}</div>
            )}
          </div>

          {/* Footer Section */}
          <Input
            placeholder="Footer text (optional)"
            label="Footer"
            value={footerComponentInState?.text || ""}
            onChange={handleFooterChange}
            maxLength={60}
          />

          {/* Buttons Section */}
          <DynamicButtonsBuilder
            buttons={buttonsComponentInState?.buttons || []}
            onChange={handleButtonsChange}
            error={errors.buttons}
          />
          {errors.buttons && (
            <div className="text-sm text-red-500 mt-1">{errors.buttons}</div>
          )}

          <Button
            type="submit"
            disabled={!isValid || !businessProfileId || loading} // Disable if not valid or no business profile selected
            className={`px-4 py-2 rounded text-white ${
              // Changed text-text to text-white
              isValid && businessProfileId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Create Template
          </Button>
        </form>

        {/* Preview Section */}
        <div className="p-2  sticky top-[130px]  mx-auto  mt-4 h-full">
          <TemplatePreview
            template={template}
            image={image}
            filetype={selectedType}
            variableExamples={variableExamples}
          />
        </div>
      </div>
      <Modal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        title="Why example text is important?"
        size="lg"
      >
        <p className="text-sm text-gray-700 leading-relaxed">
          💡 To improve the chances of your WhatsApp template being approved by
          Meta, it’s recommended to provide example text for the header variable
          during template creation. This helps Meta understand your use case and
          reduces the risk of rejection.
          <br />
          <br />
          When sending bulk messages, if your template uses a header variable
          (of type <strong>TEXT</strong>), you can include dynamic content using
          a <strong>header_text</strong> column in your Excel file.
          <br />
          <br />
          <strong>Example:</strong>
          <br />
          If your header says: <em>"Your order is confirmed"</em>
          <br />
          Then in Excel, use: <code>header_text: Order #12345</code>
          <br />
          <br />
          This makes your message more personalized and improves approval
          likelihood.
        </p>
      </Modal>
    </>
  );
};

export default CreateTemplate;
