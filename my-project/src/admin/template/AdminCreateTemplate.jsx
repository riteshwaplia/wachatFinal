import React, { useRef, useState, useEffect } from "react";
import Input from "../../components/InputField";
import { languages } from "../../components/languages/Language";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
import CustomSelect from "../../components/CustomSelect";
import RichTextEditor from "../../components/RichTextEditor";
import DynamicButtonsBuilder from "../../components/template/DynamicButtonsBuilder";
import Button from "../../components/Button";
import TemplatePreview from "../../components/template/TemplatePreview";
import { BackButton } from "../../components/BackButton";

const HEADER_TYPES = [
  { label: "None", value: "" },
  { label: "Text", value: "TEXT" },
  { label: "Document", value: "DOCUMENT" },
  { label: "Image", value: "IMAGE" },
  { label: "Video", value: "VIDEO" },
];
const TEMPLATE_CATEGORIES = [
  { label: "Marketing", value: "MARKETING" },
  { label: "Utility", value: "UTILITY" },
];

// Predefined media handle for image headers
const PREDEFINED_IMAGE_HANDLE = "4::aW1hZ2UvcG5n:ARakBZ9Sd4nU3bX9m7u8";

const AdminCreateTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const variableCounter = useRef(1);
  const [variableExamples, setVariableExamples] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [tag, setTag] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [bodyHasContent, setBodyHasContent] = useState(false);

  const { templateId } = useParams();

  const [template, setTemplate] = useState({
    name: "",
    language: "",
    categoryId: "",
    category: "MARKETING",
    components: [
      {
        type: "HEADER",
        format: "",
        text: "",
        mediaHandle: "4::aW1hZ2UvcG5n:ARakBZ9",
      },
      {
        type: "BODY",
        text: "",
        variables: [],
      },
      {
        type: "FOOTER",
        text: "",
      },
      {
        type: "BUTTONS",
        buttons: [],
      },
    ],
  });

  const [characterCount, setCharacterCount] = useState(0);

  const getTemplateData = async (templateId) => {
    try {
      setLoading(true);
      const response = await api.get(`/admintemplate/${templateId}`);
      const templateData = response.data.data;

      setTemplate((prev) => ({
        ...prev,
        name: templateData.name || "",
        language: templateData.language || "",
        category: templateData.category || "MARKETING",
        categoryId: templateData.TemplateCategory || "",
        tag: templateData.tag || "",
        components:
          templateData.components?.map((component) => {
            if (component.type === "HEADER") {
              return {
                type: "HEADER",
                format: component.format || "",
                text: component.text || "",
                mediaHandle: component.mediaHandle || "",
              };
            } else if (component.type === "BODY") {
              const bodyText = component.text || "";
              setBodyText(bodyText);
              setBodyHasContent(!!bodyText.replace(/<[^>]*>/g, "").trim());
              setCharacterCount(bodyText.replace(/<[^>]*>/g, "").length);
              return {
                type: "BODY",
                text: bodyText,
                variables: component.variables || [],
              };
            } else if (component.type === "FOOTER") {
              return {
                type: "FOOTER",
                text: component.text || "",
              };
            } else if (component.type === "BUTTONS") {
              return {
                type: "BUTTONS",
                buttons: component.buttons || [],
              };
            }
            return component;
          }) || prev.components,
      }));

      if (templateData.tag) {
        setTag(templateData.tag);
      }

      if (
        templateData.components?.[0]?.format === "IMAGE" ||
        templateData.components?.[0]?.format === "VIDEO"
      ) {
        setImage(templateData.components[0].mediaHandle);
        setSelectedType(templateData.components[0].format.toLowerCase());
      }
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templateId) {
      getTemplateData(templateId);
    }
  }, [templateId]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/templatecategory");
      setCategories(res.data.data || []);
      if (res.data.data.length > 0 && !templateId) {
        setTemplate((prev) => ({
          ...prev,
          categoryId: res?.data?.data[0]?._id,
        }));
      }
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        headerComponent.text = "";
        headerComponent.mediaHandle = "";
        setImage(null);
        
        // Set predefined media handle for image headers
        if (format === "IMAGE") {
          headerComponent.mediaHandle = PREDEFINED_IMAGE_HANDLE;
          setImage(PREDEFINED_IMAGE_HANDLE);
          setSelectedType("image");
        }
      }
      return {
        ...prev,
        components: updatedComponents,
      };
    });
  };

  const handleHeaderContentChange = async (e) => {
    const value = e.target.value;
    
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
  };

  const handleBodyChange = ({ rawHTML, formattedText, variables }) => {
    const plainText = formattedText.replace(/<[^>]*>/g, "");
    setCharacterCount(plainText.length);
    setBodyHasContent(plainText.trim().length > 0);

    setTemplate((prev) => {
      const updatedComponents = [...prev.components];
      const bodyComponent = updatedComponents.find((c) => c.type === "BODY");
      if (bodyComponent) {
        bodyComponent.text = rawHTML;
        bodyComponent.variables = variables;
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
      alert("Please fix the validation errors before submitting.");
      return;
    }

    const finalComponents = [];
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
        if (header.mediaHandle) {
          headerComponent.mediaHandle = header.mediaHandle;
          headerComponent.example = {
            header_handle: header.mediaHandle,
          };
        } else {
          alert(`Media ID is required for ${header.format} header.`);
          return;
        }
      }
      finalComponents.push(headerComponent);
    }

    const body = template.components.find((c) => c.type === "BODY");
    if (body?.text) {
      const plainText = body.text.replace(/<[^>]*>/g, "");
      const bodyComponent = {
        type: "BODY",
        text: plainText,
      };

      const variablesInText = extractVariables(plainText);

      if (variablesInText?.length > 10) {
        alert("Variables limit exceeds (10)");
        return;
      }

      if (variablesInText.length > 0) {
        const exampleValues = variablesInText.map(
          (varId) => variableExamples[varId] || `Example_${varId}`
        );

        bodyComponent.example = {
          body_text: [exampleValues],
        };
      }

      finalComponents.push(bodyComponent);
    }

    const footer = template.components.find((c) => c.type === "FOOTER");
    if (footer?.text) {
      finalComponents.push({
        type: "FOOTER",
        text: footer.text,
      });
    }

    const buttons = template.components.find((c) => c.type === "BUTTONS");
    if (buttons?.buttons?.length) {
      const cleanedButtons = buttons.buttons.map((btn) => {
        const base = {
          type: btn.type.toUpperCase(),
          text: btn.text,
        };

        if (btn.type === "URL") {
          base.url = btn.url;
          if (btn.exampleUrl) {
            base.example = [btn.exampleUrl];
          }
        } else if (btn.type === "PHONE_NUMBER") {
          base.phone_number = btn.payload;
        }
        return base;
      });
      finalComponents.push({
        type: "BUTTONS",
        buttons: cleanedButtons,
      });
    }

    const payload = {
      name: template.name,
      language: template.language,
      categoryId: template.categoryId,
      category: template.category,
      components: finalComponents,
      tag: tag,
    };

    setCreateLoading(true);
    try {
      let res;
      if (templateId) {
        res = await api.put(`/admintemplate/${templateId}`, payload);
        console.log("Template updated successfully:", res.data);
        alert(res.data.message || "Template updated successfully!");
      } else {
        res = await api.post("/admintemplate", payload);
        console.log("Template created successfully:", res.data);
        alert(res.data.message || "Template created successfully!");
      }
      navigate(-1);
    } catch (error) {
      console.error(
        "Error saving template:",
        error.response?.data || error.message
      );
      alert(
        `Error saving template: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const extractVariables = (text) => {
    const regex = /\{\{(\d+)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return [...new Set(matches)].sort((a, b) => parseInt(a) - parseInt(b));
  };

  const validateTemplate = () => {
    const errors = {};
    const headerComponent = template.components.find(
      (c) => c.type === "HEADER"
    );

    if (!template.name) errors.name = "Template name is required.";
    if (!template.categoryId) errors.category = "Category is required.";
    if (!template.language) errors.language = "Language is required.";

    // Check if body has content (not just HTML tags)
    if (!bodyHasContent) {
      errors.body = "Body is required.";
    } else if (characterCount > 1024) {
      errors.body = "Body exceeds 1024 character limit.";
    }

    if (
      headerComponent?.format === "TEXT" &&
      (!headerComponent.text || headerComponent.text.trim() === "")
    ) {
      errors.headerText = "Header text is required for TEXT header.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const { isValid, errors } = validateTemplate();

  const headerComponentInState = template.components.find(
    (c) => c.type === "HEADER"
  );

  const insertVariable = () => {
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

  return (
    <>
      <BackButton text="back" />
      {loading ? (
        "loading..."
      ) : (
        <div className="md:flex relative w-full gap-4">
          <form
            onSubmit={handleSubmit}
            className="p-2 w-full md:w-3/5 flex flex-col gap-4"
          >
            <CustomSelect
              label="Template Type"
              required
              placeholder="Select Header Type"
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat._id,
              }))}
              onChange={(selected) =>
                handleInputChange("categoryId", selected?.value)
              }
              error={errors.category}
              disabled={loading}
            />
            <Input
              placeholder="Template Name"
              label="Template Name"
              required
              value={template.name}
              onChange={(e) => {
                const modifiedValue = e.target.value.replace(/ /g, "_");
                handleInputChange("name", modifiedValue);
              }}
              error={errors.name}
              disabled={loading}
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
              disabled={loading}
            />
            <CustomSelect
              label="Select Language"
              required
              options={languages}
              placeholder="Select Language"
              value={languages.find((opt) => opt.value === template.language)}
              onChange={(selected) =>
                handleInputChange("language", selected?.value)
              }
              error={errors.language}
              disabled={loading}
            />

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
                    onClick={insertVariable}
                    className="px-2 py-1 rounded text-sm mt-2 bg-blue-600 text-white hover:bg-blue-700"
                    type="button"
                    disabled={loading}
                  >
                    Add Variable
                  </button>
                </div>
              )}

              {headerComponentInState?.format === "IMAGE" && (
                <div className="space-y-2">
                  <div className="text-sm text-green-600 p-2 bg-green-50 rounded border border-green-200">
                    ✓ Image header is ready with predefined media
                  </div>
                </div>
              )}

              {["DOCUMENT", "VIDEO"].includes(
                headerComponentInState?.format || ""
              ) && (
                <div className="space-y-2">
                  <div className="text-sm text-yellow-600 p-2 bg-yellow-50 rounded border border-yellow-200">
                    ⚠️ {headerComponentInState?.format} header type requires manual media handling
                  </div>
                </div>
              )}
            </div>

            <div className="w-full">
              <label className="block font-semibold mb-1">
                Body <span className="text-rose-400">*</span>
              </label>
              <RichTextEditor
                label="Body *"
                onChange={handleBodyChange}
                value={template.components.find((c) => c.type === "BODY")?.text}
                error={errors.body}
                maxLength={1024}
                loading={loading}
              />
              <div
                className={`text-sm mt-1 ${
                  characterCount > 1024 ? "text-red-500" : "text-gray-500"
                }`}
              >
                Characters: {characterCount}/1024
                {characterCount > 1024 && " - Exceeds WhatsApp limit"}
              </div>
              {errors.body && (
                <div className="text-sm text-red-500 mt-1">{errors.body}</div>
              )}
            </div>

            <Input
              placeholder="Footer text (optional)"
              label="Footer"
              value={
                template.components.find((c) => c.type === "FOOTER")?.text || ""
              }
              onChange={handleFooterChange}
              maxLength={60}
            />
            <Input
              placeholder="ex, Holiday Sale, New Arrivals , Treanding Now"
              label="Tag  (ex, Holiday Sale, New Arrivals , Treanding Now)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              maxLength={60}
            />

            <DynamicButtonsBuilder
              button={
                template.components.find((c) => c.type === "BUTTONS")
                  ?.buttons || []
              }
              onChange={handleButtonsChange}
            />

            <Button
              type="submit"
              loading={createLoading}
              disabled={!isValid || loading}
              className={`px-4 py-2 rounded text-white ${
                isValid
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {templateId ? "Update Template" : "Create Template"}
            </Button>
          </form>

          <div className="p-2 sticky top-[130px] mx-auto mt-4 h-full">
            <TemplatePreview
              template={template}
              image={image}
              filetype={selectedType}
              variableExamples={variableExamples}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCreateTemplate;