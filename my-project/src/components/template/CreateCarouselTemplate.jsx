import React, { useRef, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputField from "../InputField";
import RichTextEditor from "../RichTextEditor";
import CustomSelect from "../CustomSelect";
import DynamicButtonsBuilder from "./DynamicButtonsBuilder";
import { languages } from "../../components/languages/Language";
import {
  createCarouselTemplateApi,
  uploadMedaiData,
} from "../../apis/TemplateApi";
import { BackButton } from "../BackButton";
import Button from "../Button";
import Modal from "../Modal";
import { FiUploadCloud, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { FaImage } from "react-icons/fa";
import CarouselPreview from "./CarosoulPreview";
import { ErrorToast, SuccessToast } from "../../utils/Toast";

const TEMPLATE_CATEGORIES = [
  { label: "Marketing", value: "MARKETING" },
  { label: "Utility", value: "UTILITY" },
];

const CAROUSEL_CARD_BUTTON_TYPES = [
  { label: "URL", value: "URL" },
  { label: "Phone Number", value: "PHONE_NUMBER" },
];

const CreateCarouselTemplate = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [businessProfileId, setBusinessProfileId] = useState(null);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [mainBodyCharacterCount, setMainBodyCharacterCount] = useState(0);
  const [uploadStatus, setUploadStatus] = useState({});

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // State for the main template fields
  const [templateData, setTemplateData] = useState({
    name: "",
    language: "",
    category: "MARKETING",
    mainBodyText: "Hello ", // Optional main body text for the carousel
    mainBodyVariables: [], // Variables for the main body
    mainBodyVariableExamples: {}, // Examples for main body variables
  });

  // State for carousel cards
  const [cards, setCards] = useState([
    {
      id: "card_1",
      headerImageFile: null,
      headerMediaHandle: "",
      headerImageUrl: "",
      bodyText: "",
      footerText: "",
      buttons: [],
      bodyVariables: [],
      bodyVariableExamples: {},
    },
    {
      id: "card_2",
      headerImageFile: null,
      headerMediaHandle: "",
      headerImageUrl: "",
      bodyText: "",
      footerText: "",
      buttons: [],
      bodyVariables: [],
      bodyVariableExamples: {},
    },
  ]);

  const cardIdCounter = useRef(cards.length + 1);

  useEffect(() => {
    const project = localStorage.getItem("currentProject")
      ? JSON.parse(localStorage.getItem("currentProject"))
      : null;
    if (project?.businessProfileId?._id) {
      setBusinessProfileId(project.businessProfileId._id);
    } else {
      ErrorToast("Please select a project with a linked Business Profile.");
      navigate("/projects");
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setTemplateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMainBodyChange = ({
    rawHTML,
    formattedText,
    variables,
    variableExamples,
  }) => {
    const plainText = (formattedText || "").replace(/<[^>]*>/g, "");
    setMainBodyCharacterCount(plainText.length);

    setTemplateData((prev) => ({
      ...prev,
      mainBodyText: rawHTML || "",
      mainBodyVariables: variables,
      mainBodyVariableExamples: variableExamples,
    }));
  };

  const handleAddCard = () => {
    if (cards.length >= 10) {
      ErrorToast("You can add a maximum of 10 carousel cards.");
      return;
    }
    setCards((prev) => [
      ...prev,
      {
        id: `card_${cardIdCounter.current++}`,
        headerImageFile: null,
        headerMediaHandle: "",
        headerImageUrl: "",
        bodyText: "",
        footerText: "",
        buttons: [],
        bodyVariables: [],
        bodyVariableExamples: {},
      },
    ]);
  };

  const handleRemoveCard = (cardId) => {
    if (cards.length <= 2) {
      ErrorToast("A carousel template must have at least 2 cards.");
      return;
    }
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const handleCardRichTextChange =
    (cardId) =>
      ({ rawHTML, formattedText, variables, variableExamples }) => {
        setCards((prev) =>
          prev.map((card) => {
            if (card.id === cardId) {
              return {
                ...card,
                bodyText: rawHTML,
                bodyVariables: variables,
                bodyVariableExamples: variableExamples,
              };
            }
            return card;
          })
        );
      };

  const handleCardFieldChange = (cardId, field, value) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          return { ...card, [field]: value };
        }
        return card;
      })
    );
  };

  const handleCardHeaderImageUpload = async (cardId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/jpeg")) {
      ErrorToast(
        "Only JPG images are supported for carousel card headers. Please upload a .jpg or .jpeg file."
      );
      e.target.value = "";
      return;
    }

    if (!businessProfileId || !projectId) {
      ErrorToast("Missing businessProfileId or projectId for media upload.");
      return;
    }

    // setLoading(true);
    setUploadStatus((prev) => ({
      ...prev,
      [cardId]: { loading: true, success: false },
    }));
    handleCardFieldChange(cardId, "headerImageFile", file);
    handleCardFieldChange(cardId, "headerImageUrl", URL.createObjectURL(file));

    try {
      const uploadResponse = await uploadMedaiData(
        file,
        businessProfileId,
        projectId
      );
      setLoading(false);
      if (uploadResponse.success) {
        handleCardFieldChange(
          cardId,
          "headerMediaHandle",
          uploadResponse.data.id
        );
        setUploadStatus((prev) => ({
          ...prev,
          [cardId]: { loading: false, success: true },
        }));
        SuccessToast("Image uploaded successfully for card header!");
      } else {
        ErrorToast(`Image upload failed: ${uploadResponse.message}`);

        handleCardFieldChange(cardId, "headerMediaHandle", "");
        handleCardFieldChange(cardId, "headerImageUrl", "");
      }
    } catch (error) {
      setLoading(false);
      ErrorToast(`Error during image upload: ${error.message}`);
      handleCardFieldChange(cardId, "headerMediaHandle", "");
      handleCardFieldChange(cardId, "headerImageUrl", "");
    } finally {
      setUploadStatus((prev) => ({
        ...prev,
        [cardId]: { loading: false, success: false },
      }));
    }
  };

  const validateCarouselTemplate = useCallback(() => {
    const errors = {};

    if (!templateData.name) errors.name = "Template name is required.";
    if (!templateData.category) errors.category = "Category is required.";
    if (!templateData.language) errors.language = "Language is required.";

    if (cards.length < 2 || cards.length > 10) {
      errors.cardsCount = "Carousel must have between 2 and 10 cards.";
    }

    const plainMainBodyText = (templateData.mainBodyText || "").replace(
      /<[^>]*>/g,
      ""
    );
    if (plainMainBodyText.length > 1024) {
      errors.mainBodyText = "Main body text exceeds 1024 character limit.";
    }
    if (
      templateData.mainBodyVariables &&
      templateData.mainBodyVariables.length > 0
    ) {
      templateData.mainBodyVariables.forEach((varId) => {
        if (
          !templateData.mainBodyVariableExamples[varId] ||
          templateData.mainBodyVariableExamples[varId].trim() === ""
        ) {
          errors[
            `mainBodyVarExample_${varId}`
          ] = `Example for variable {{${varId}}} in main body is required.`;
        }
      });
    }

    cards.forEach((card, index) => {
      const cardErrors = {};
      if (!card.headerMediaHandle) {
        cardErrors.header = "Image is required for card header.";
      }

      const plainCardBodyText = (card.bodyText || "")
        .replace(/<[^>]*>/g, "")
        .trim();
      if (!plainCardBodyText) {
        cardErrors.body = "Body text is required for card.";
      } else if (plainCardBodyText.length > 80) {
        cardErrors.body = "Card body text exceeds 80 character limit.";
      }

      if (card.bodyVariables && card.bodyVariables.length > 0) {
        card.bodyVariables.forEach((varId) => {
          if (
            !card.bodyVariableExamples[varId] ||
            card.bodyVariableExamples[varId].trim() === ""
          ) {
            cardErrors[
              `bodyVarExample_${varId}`
            ] = `Example for variable {{${varId}}} in card body is required.`;
          }
        });
      }

      if (card.footerText && card.footerText.length > 60) {
        cardErrors.footer = "Card footer text exceeds 60 character limit.";
      }

      if (card.buttons.length === 0 || card.buttons.length > 2) {
        cardErrors.buttonsCount = "Each card must have 1 or 2 buttons.";
      } else {
        card.buttons.forEach((btn, btnIndex) => {
          if (!btn.text || btn.text.trim() === "") {
            cardErrors[`buttonText_${btnIndex}`] = "Button text is required.";
          } else if (btn.text.length > 25) {
            cardErrors[`buttonText_${btnIndex}`] =
              "Button text exceeds 25 character limit.";
          }
          if (btn.type === "URL" && (!btn.url || btn.url.trim() === "")) {
            cardErrors[`buttonUrl_${btnIndex}`] =
              "URL is required for URL buttons.";
          } else if (btn.type === "URL" && btn.url.length > 2000) {
            cardErrors[`buttonUrl_${btnIndex}`] =
              "URL exceeds 2000 character limit.";
          }
          if (
            btn.type === "URL" &&
            btn.url.includes("{{") &&
            (!btn.exampleUrl || btn.exampleUrl.trim() === "")
          ) {
            cardErrors[`buttonUrlExample_${btnIndex}`] =
              "Example URL is required for dynamic URL buttons.";
          }
          if (
            btn.type === "PHONE_NUMBER" &&
            (!btn.payload || btn.payload.trim() === "")
          ) {
            cardErrors[`buttonPhone_${btnIndex}`] =
              "Phone number is required for Phone Number buttons.";
          } else if (btn.type === "PHONE_NUMBER" && btn.payload.length > 20) {
            cardErrors[`buttonPhone_${btnIndex}`] =
              "Phone number exceeds 20 character limit.";
          }
        });
      }

      if (Object.keys(cardErrors).length > 0) {
        errors[`card_${index}`] = cardErrors;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [cards, templateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateCarouselTemplate();
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      ErrorToast("Please fix the validation errors before submitting.");
      return;
    } else {
      setValidationErrors({});
    }

    const carouselCardsPayload = cards.map((card) => {
      const cardComponents = [];

      if (card.headerMediaHandle) {
        cardComponents.push({
          type: "HEADER",
          format: "IMAGE",
          example: {
            header_handle: [card.headerMediaHandle],
          },
        });
      }

      const plainBodyText = (card.bodyText || "").replace(/<[^>]*>/g, "");
      if (plainBodyText) {
        const bodyComponent = {
          type: "BODY",
          text: plainBodyText,
        };
        if (card.bodyVariables && card.bodyVariables.length > 0) {
          const exampleValues = card.bodyVariables.map(
            (varId) => card.bodyVariableExamples[varId] || `Example_${varId}`
          );
          bodyComponent.example = {
            body_text: [exampleValues],
          };
        }
        cardComponents.push(bodyComponent);
      }

      if (card.footerText) {
        cardComponents.push({
          type: "FOOTER",
          text: card.footerText,
        });
      }

      if (card.buttons.length > 0) {
        const cleanedButtons = card.buttons.map((btn) => {
          const base = {
            type: btn.type.toUpperCase(),
            text: btn.text,
          };
          if (btn.type === "URL") {
            base.url = btn.url;
            if (btn.url.includes("{{")) {
              base.example = [btn.exampleUrl || "https://example.com/example"];
            }
          } else if (btn.type === "PHONE_NUMBER") {
            base.phone_number = btn.payload;
          }
          return base;
        });
        cardComponents.push({
          type: "BUTTONS",
          buttons: cleanedButtons,
        });
      }

      return {
        components: cardComponents,
      };
    });

    const finalComponents = [];
    const plainMainBodyText = (templateData.mainBodyText || "").replace(
      /<[^>]*>/g,
      ""
    );
    if (plainMainBodyText) {
      const mainBodyComponent = {
        type: "BODY",
        text: plainMainBodyText,
      };
      if (
        templateData.mainBodyVariables &&
        templateData.mainBodyVariables.length > 0
      ) {
        const exampleValues = templateData.mainBodyVariables.map(
          (varId) =>
            templateData.mainBodyVariableExamples[varId] || `Example_${varId}`
        );
        mainBodyComponent.example = {
          body_text: [exampleValues],
        };
      }
      finalComponents.push(mainBodyComponent);
    }

    finalComponents.push({
      type: "CAROUSEL",
      cards: carouselCardsPayload,
    });

    const payload = {
      name: templateData.name,
      language: templateData.language,
      category: templateData.category,
      components: finalComponents,
      businessProfileId,
      projectId,
    };

    setLoading(true);
    try {
      console.log(
        "Carousel Template Create Payload:",
        JSON.stringify(payload, null, 2)
      );
      const res = await createCarouselTemplateApi(payload);
      setLoading(false);
      if (res.success) {
        SuccessToast(res.message || "Carousel template created successfully!");
        navigate(-1);
      } else {
        ErrorToast(`Error creating carousel template: ${res.message}`);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating carousel template:", error);
      ErrorToast(`Error creating carousel template: ${error.message}`);
    }
  };

  const { isValid, errors } = validateCarouselTemplate();

  return (
    <>
      <BackButton text="Back" />
      <div className="md:flex lg:gap-16  gap-4 relative w-full">
        <form
          onSubmit={handleSubmit}
          className="p-2 w-full md:w-4/6 flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold mb-4">Create Carousel Template</h1>

          <InputField
            placeholder="Template Name (e.g., product_showcase)"
            label="Template Name"
            required
            value={templateData.name}
            onChange={(e) =>
              handleInputChange("name", e.target.value.replace(/ /g, "_"))
            }
            error={errors.name}
            disabled={loading}
          />

          <CustomSelect
            label="Template Category"
            required
            options={TEMPLATE_CATEGORIES}
            placeholder="Select Template Category"
            value={TEMPLATE_CATEGORIES.find(
              (opt) => opt.value === templateData.category
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
            value={languages.find((opt) => opt.value === templateData.language)}
            onChange={(selected) =>
              handleInputChange("language", selected?.value)
            }
            error={errors.language}
            disabled={loading}
          />

          <div className="w-full">
            <label className="block font-semibold mb-1">
              Main Carousel Body Text (Optional)
            </label>
            <RichTextEditor
              onChange={handleMainBodyChange}
              value={templateData.mainBodyText || ""}
              loading={loading}
            // carousel={false}
            />
            <div
              className={`text-sm mt-1 ${mainBodyCharacterCount > 1024 ? "text-red-500" : "text-gray-500"
                }`}
            >
              Characters: {mainBodyCharacterCount}/1024
              {mainBodyCharacterCount > 1024 && " - Exceeds WhatsApp limit"}
            </div>
            {errors.mainBodyText && (
              <div className="text-sm text-red-500 mt-1">
                {errors.mainBodyText}
              </div>
            )}
          </div>
          <hr className="my-4" />

          <div className="w-full">
            <h2 className="text-xl font-bold mb-2 flex justify-between items-center">
              Carousel Cards
              <Button
                onClick={handleAddCard}
                type="button"
                disabled={loading || cards.length >= 10}
              >
                <FiPlusCircle className="mr-2" /> Add Card
              </Button>
            </h2>
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Card {index + 1}</h3>
                  <Button
                    onClick={() => handleRemoveCard(card.id)}
                    type="button"
                    variant="danger"
                    disabled={loading || cards.length <= 2}
                  >
                    <FiTrash2 />
                  </Button>
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-1">
                    Header Image (JPG only)
                  </label>

                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/jpeg"
                      onChange={(e) => handleCardHeaderImageUpload(card.id, e)}
                      className="hidden"
                      id={`header-image-input-${card.id}`}
                      disabled={uploadStatus[card.id]?.loading}
                    />

                    <label
                      htmlFor={`header-image-input-${card.id}`}
                      className={`cursor-pointer font-bold py-2 px-4 rounded-md inline-flex items-center
      ${uploadStatus[card.id]?.loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                    >
                      <FiUploadCloud className="mr-2" />
                      {uploadStatus[card.id]?.loading ? 'Uploading...' : 'Upload Image'}
                    </label>

                    {card.headerImageUrl && (
                      <div className="w-20 h-20 overflow-hidden rounded-md border border-gray-300 flex-shrink-0">
                        <img
                          src={card.headerImageUrl}
                          alt="Card Header"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {uploadStatus[card.id]?.success && (
                      <span className="text-green-600 text-sm ml-2">✓ Uploaded successfully</span>
                    )}
                  </div>


                  {/* Upload Status Messages */}
                  {loading && (
                    <div className="text-sm text-blue-500 mt-1">Uploading image...</div>
                  )}
                  {!loading && card.headerImageUrl && (
                    <div className="text-sm text-green-600 mt-1">✓ Image uploaded successfully</div>
                  )}

                  {/* Field Error */}
                  {errors[`card_${index}`]?.header && (
                    <div className="text-sm text-red-500 mt-1">
                      {errors[`card_${index}`].header}
                    </div>
                  )}
                </div>


                <div className="mb-4">
                  <label className="block font-semibold mb-1">
                    Card Body Text
                  </label>
                  <RichTextEditor
                    onChange={handleCardRichTextChange(card.id)}
                    value={card.bodyText || ""}
                    loading={loading}
                  />
                  {errors[`card_${index}`]?.body && (
                    <div className="text-sm text-red-500 mt-1">
                      {errors[`card_${index}`].body}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <InputField
                    label="Card Footer Text (Optional)"
                    value={card.footerText}
                    onChange={(e) =>
                      handleCardFieldChange(
                        card.id,
                        "footerText",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Offer valid until..."
                    maxLength={60}
                    error={errors[`card_${index}`]?.footer}
                    disabled={loading}
                  />
                </div>

                <DynamicButtonsBuilder
                  buttons={card.buttons}
                  onChange={(newButtons) =>
                    handleCardFieldChange(card.id, "buttons", newButtons)
                  }
                  buttonTypes={CAROUSEL_CARD_BUTTON_TYPES}
                  maxButtons={2}
                  error={errors[`card_${index}`]?.buttonsCount}
                  disabled={loading}
                  buttonErrors={errors[`card_${index}`]}
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !isValid}
              className="w-full"
            >
              {loading ? "Creating..." : "Create Carousel Template"}
            </Button>
          </div>
        </form> {/* <div className="p-2 w-full md:w-2/5 md:block hidden">
 
            <h2 className="text-xl font-semibold mb-4">
              Carousel Preview (Conceptual)
            </h2>

            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <p className="text-gray-600 text-sm mb-2">
                A full interactive preview of carousel templates is complex and
                often requires Meta's own tools. This section provides a
                conceptual layout.
              </p>

              {templateData.mainBodyText && (
                <div className="mb-4 p-2 border-b">
                  <h3 className="font-semibold">Main Body Text:</h3>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: templateData.mainBodyText,
                    }}
                  />
                </div>
              )}

              <div className="space-y-4">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className="border rounded-md p-3 bg-white shadow-sm"
                  >
                    <h4 className="font-bold text-sm mb-2">Card {index + 1}</h4>

                    {card.headerImageUrl && (
                      <img
                        src={card.headerImageUrl}
                        alt={`Card ${index + 1} Header`}
                        className="w-full h-24 object-cover rounded-md mb-2"
                      />
                    )}

                    {!card.headerImageUrl && (
                      <div className="w-full h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 mb-2">
                        <FaImage size={32} />
                      </div>
                    )}

                    <p className="text-sm font-medium mb-1">Body:</p>

                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: card.bodyText }}
                    />

                    {card.footerText && (
                      <p className="text-xs text-gray-500 mt-1">
                        Footer: {card.footerText}
                      </p>
                    )}

                    {card.buttons.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {card.buttons.map((btn, btnIdx) => (
                          <div
                            key={btnIdx}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {btn.text} ({btn.type})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        <div className=" md:w-2/6 h-screen sticky top-12 ">
          <CarouselPreview templateData={templateData} cards={cards} />
        </div>
      </div>
      <Modal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        title="Why does this template need a business profile?"
      >
        <p>
          Carousel templates on WhatsApp require a linked Business Profile to
          function correctly. This is because the media (images) and buttons are
          tied to your specific business account on the platform.
        </p>
      </Modal>
    </>
  );
};

export default CreateCarouselTemplate;
