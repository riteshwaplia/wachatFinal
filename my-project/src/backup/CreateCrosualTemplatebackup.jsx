// client/src/components/Template/CreateCarouselTemplate.js
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputField from "../InputField"; // Renamed from Input to InputField for consistency
import RichTextEditor from "../RichTextEditor";
import CustomSelect from "../CustomSelect";
import DynamicButtonsBuilder from "./DynamicButtonsBuilder"; // Re-use existing
import { languages } from "../../components/languages/Language";
import {
  createCarouselTemplateApi, // NEW: Import carousel specific API
  uploadMedaiData,
} from "../../apis/TemplateApi";
import { BackButton } from "../BackButton";
import Button from "../Button";
import Modal from "../Modal";
import { FiUploadCloud, FiTrash2, FiPlusCircle } from "react-icons/fi"; // Icons for UI
import { FaImage } from "react-icons/fa"; // Icon for image placeholder

const TEMPLATE_CATEGORIES = [
  { label: "Marketing", value: "MARKETING" },
  { label: "Utility", value: "UTILITY" },
];

// Carousel cards ONLY support IMAGE headers and URL/Phone Number buttons
const CAROUSEL_CARD_BUTTON_TYPES = [
  { label: "URL", value: "URL" },
  { label: "Phone Number", value: "PHONE_NUMBER" },
];

const CreateCarouselTemplate = () => {
  const { id: projectId } = useParams(); // Get projectId from URL
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [businessProfileId, setBusinessProfileId] = useState(null);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [mainBodyCharacterCount, setMainBodyCharacterCount] = useState(0);

  // State for the main template fields
  const [templateData, setTemplateData] = useState({
    name: "",
    language: "",
    category: "MARKETING",
    mainBodyText: "", // Optional main body text for the carousel
  });

  // State for carousel cards
  const [cards, setCards] = useState([
    {
      id: "card_1", // Unique ID for React key and internal tracking
      headerImageFile: null,
      headerMediaHandle: "", // Meta Media ID
      headerImageUrl: "", // For local preview
      bodyText: "",
      footerText: "",
      buttons: [],
    },
    {
      id: "card_2", // Start with at least two cards as per Meta's requirement
      headerImageFile: null,
      headerMediaHandle: "",
      headerImageUrl: "",
      bodyText: "",
      footerText: "",
      buttons: [],
    },
  ]);

  const cardIdCounter = useRef(cards.length + 1); // Counter for new card IDs

  useEffect(() => {
    const project = localStorage.getItem("currentProject")
      ? JSON.parse(localStorage.getItem("currentProject"))
      : null;
    if (project?.businessProfileId?._id) {
      setBusinessProfileId(project.businessProfileId._id);
    } else {
      alert("Please select a project with a linked Business Profile.");
      navigate("/projects"); // Redirect if no business profile is found
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setTemplateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMainBodyChange = ({ rawHTML, formattedText }) => {
    const plainText = formattedText.replace(/<[^>]*>/g, "");
    setMainBodyCharacterCount(plainText.length);
    setTemplateData((prev) => ({
      ...prev,
      mainBodyText: rawHTML,
    }));
  };

  const handleAddCard = () => {
    if (cards.length >= 10) {
      alert("You can add a maximum of 10 carousel cards.");
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
      },
    ]);
  };

  const handleRemoveCard = (cardId) => {
    if (cards.length <= 2) {
      alert("A carousel template must have at least 2 cards.");
      return;
    }
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const handleCardFieldChange = (cardId, field, value) => {
    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, [field]: value } : card))
    );
  };

  const handleCardHeaderImageUpload = async (cardId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/jpeg')) {
      alert("Only JPG images are supported for carousel card headers. Please upload a .jpg or .jpeg file.");
      e.target.value = ''; // Clear the input field
      return;
    }

    if (!businessProfileId || !projectId) {
      alert("Missing businessProfileId or projectId for media upload.");
      return;
    }

    setLoading(true);
    handleCardFieldChange(cardId, "headerImageFile", file);
    handleCardFieldChange(cardId, "headerImageUrl", URL.createObjectURL(file)); // For local preview

    try {
      const uploadResponse = await uploadMedaiData(file, businessProfileId, projectId);
      setLoading(false);
      if (uploadResponse.success) {
        handleCardFieldChange(cardId, "headerMediaHandle", uploadResponse.data.id);
        alert("Image uploaded successfully for card header!");
      } else {
        alert(`Image upload failed: ${uploadResponse.message}`);
        handleCardFieldChange(cardId, "headerMediaHandle", ""); // Clear handle on failure
        handleCardFieldChange(cardId, "headerImageUrl", ""); // Clear preview on failure
      }
    } catch (error) {
      setLoading(false);
      alert(`Error during image upload: ${error.message}`);
      handleCardFieldChange(cardId, "headerMediaHandle", "");
      handleCardFieldChange(cardId, "headerImageUrl", "");
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

    cards.forEach((card, index) => {
      const cardErrors = {};
      if (!card.headerMediaHandle) {
        cardErrors.header = "Image is required for card header.";
      }
      if (!card.bodyText || card.bodyText.replace(/<[^>]*>/g, "").trim() === "") {
        cardErrors.body = "Body text is required for card.";
      } else if (card.bodyText.replace(/<[^>]*>/g, "").length > 80) { // Meta's limit for card body
        cardErrors.body = "Card body text exceeds 80 character limit.";
      }
      if (card.footerText && card.footerText.length > 60) { // Meta's limit for card footer
        cardErrors.footer = "Card footer text exceeds 60 character limit.";
      }

      if (card.buttons.length === 0 || card.buttons.length > 2) {
        cardErrors.buttonsCount = "Each card must have 1 or 2 buttons.";
      } else {
        card.buttons.forEach((btn, btnIndex) => {
          if (!btn.text || btn.text.trim() === "") {
            cardErrors[`buttonText_${btnIndex}`] = "Button text is required.";
          } else if (btn.text.length > 25) { // Meta's limit for button text
            cardErrors[`buttonText_${btnIndex}`] = "Button text exceeds 25 character limit.";
          }
          if (btn.type === "URL" && (!btn.url || btn.url.trim() === "")) {
            cardErrors[`buttonUrl_${btnIndex}`] = "URL is required for URL buttons.";
          } else if (btn.type === "URL" && btn.url.length > 2000) { // Meta's limit for URL
            cardErrors[`buttonUrl_${btnIndex}`] = "URL exceeds 2000 character limit.";
          }
          if (btn.type === "PHONE_NUMBER" && (!btn.payload || btn.payload.trim() === "")) {
            cardErrors[`buttonPhone_${btnIndex}`] = "Phone number is required for Phone Number buttons.";
          } else if (btn.type === "PHONE_NUMBER" && btn.payload.length > 20) { // Meta's limit for phone number
            cardErrors[`buttonPhone_${btnIndex}`] = "Phone number exceeds 20 character limit.";
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

  const { isValid, errors } = validateCarouselTemplate(); // Re-run validation on render

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateCarouselTemplate();
    if (!validation.isValid) {
      console.error("Validation errors:", validation.errors);
      alert("Please fix the validation errors before submitting.");
      return;
    }

    const carouselCardsPayload = cards.map((card) => {
      const cardComponents = [];

      // Card Header (Image only)
      if (card.headerMediaHandle) {
        cardComponents.push({
          type: "HEADER",
          format: "IMAGE",
          example: {
            header_handle: [card.headerMediaHandle], // Meta expects an array of handles
          },
        });
      }

      // Card Body
      const plainBodyText = card.bodyText.replace(/<[^>]*>/g, "");
      if (plainBodyText) {
        cardComponents.push({
          type: "BODY",
          text: plainBodyText,
        });
      }

      // Card Footer
      if (card.footerText) {
        cardComponents.push({
          type: "FOOTER",
          text: card.footerText,
        });
      }

      // Card Buttons
      if (card.buttons.length > 0) {
        const cleanedButtons = card.buttons.map((btn) => {
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

    // Optional main body for the carousel
    const plainMainBodyText = templateData.mainBodyText.replace(/<[^>]*>/g, "");
    if (plainMainBodyText) {
      finalComponents.push({
        type: "BODY",
        text: plainMainBodyText,
      });
    }

    // The main CAROUSEL component
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
      console.log("Carousel Template Create Payload:", JSON.stringify(payload, null, 2));
      const res = await createCarouselTemplateApi(payload);
      setLoading(false);
      if (res.success) {
        alert(res.message || "Carousel template created successfully!");
        navigate(-1); // Go back to previous page
      } else {
        alert(`Error creating carousel template: ${res.message}`);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error creating carousel template:", error);
      alert(`Error creating carousel template: ${error.message}`);
    }
  };

  return (
    <>
      <BackButton text="Back" />
      <div className="md:flex w-full gap-4">
        <form onSubmit={handleSubmit} className="p-2 w-full md:w-3/5 flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-4">Create Carousel Template</h1>

          <InputField
            placeholder="Template Name (e.g., product_showcase)"
            label="Template Name"
            required
            value={templateData.name}
            onChange={(e) => handleInputChange("name", e.target.value.replace(/ /g, "_"))}
            error={errors.name}
            disabled={loading}
          />

          <CustomSelect
            label="Template Category"
            required
            options={TEMPLATE_CATEGORIES}
            placeholder="Select Template Category"
            value={TEMPLATE_CATEGORIES.find((opt) => opt.value === templateData.category)}
            onChange={(selected) => handleInputChange("category", selected?.value)}
            error={errors.category}
            disabled={loading}
          />
          <CustomSelect
            label="Select Language"
            required
            options={languages}
            placeholder="Select Language"
            value={languages.find((opt) => opt.value === templateData.language)}
            onChange={(selected) => handleInputChange("language", selected?.value)}
            error={errors.language}
            disabled={loading}
          />

          {/* Optional Main Body Text for Carousel */}
          <div className="w-full">
            <label className="block font-semibold mb-1">
              Main Carousel Body Text (Optional)
            </label>
            <RichTextEditor
              onChange={handleMainBodyChange}
              value={templateData.mainBodyText}
              maxLength={1024}
              loading={loading}
            />
            <div className={`text-sm mt-1 ${mainBodyCharacterCount > 1024 ? "text-red-500" : "text-gray-500"}`}>
              Characters: {mainBodyCharacterCount}/1024
              {mainBodyCharacterCount > 1024 && " - Exceeds WhatsApp limit"}
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-2 flex items-center justify-between">
            Carousel Cards ({cards.length}/10)
            <Button
              type="button"
              onClick={handleAddCard}
              disabled={loading || cards.length >= 10}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
            >
              <FiPlusCircle className="mr-1" /> Add Card
            </Button>
          </h2>
          {errors.cardsCount && (
            <div className="text-sm text-red-500 mt-1">{errors.cardsCount}</div>
          )}

          {cards.map((card, index) => (
            <div key={card.id} className="border p-4 rounded-lg shadow-sm bg-gray-50 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Card {index + 1}</h3>
                {cards.length > 2 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveCard(card.id)}
                    disabled={loading || cards.length <= 2}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                  >
                    <FiTrash2 className="mr-1" /> Remove
                  </Button>
                )}
              </div>

              {/* Card Header (Image Only) */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">
                  Card Header Image (JPG only) <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/jpeg"
                    onChange={(e) => handleCardHeaderImageUpload(card.id, e)}
                    className="w-full border p-2 rounded"
                    disabled={loading || card.headerMediaHandle}
                  />
                  {card.headerImageUrl && (
                    <div className="w-16 h-16 border rounded-md overflow-hidden flex items-center justify-center bg-gray-200">
                      <img src={card.headerImageUrl} alt={`Card ${index + 1} Header`} className="object-cover w-full h-full" />
                    </div>
                  )}
                  {!card.headerImageUrl && (
                     <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-gray-200 text-gray-400">
                        <FaImage size={24} />
                     </div>
                  )}
                </div>
                {card.headerMediaHandle && (
                  <div className="text-sm text-green-600 mt-1">✓ Image uploaded</div>
                )}
                {errors[`card_${index}`]?.header && (
                  <div className="text-sm text-red-500 mt-1">
                    {errors[`card_${index}`].header}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="mb-4">
                <label className="block font-semibold mb-1">
                  Card Body Text <span className="text-rose-400">*</span>
                </label>
                <RichTextEditor
                  onChange={({ rawHTML }) => handleCardFieldChange(card.id, "bodyText", rawHTML)}
                  value={card.bodyText}
                  maxLength={80} // Meta's limit for card body
                  loading={loading}
                />
                <div className={`text-sm mt-1 ${card.bodyText.replace(/<[^>]*>/g, "").length > 80 ? "text-red-500" : "text-gray-500"}`}>
                  Characters: {card.bodyText.replace(/<[^>]*>/g, "").length}/80
                  {card.bodyText.replace(/<[^>]*>/g, "").length > 80 && " - Exceeds WhatsApp limit"}
                </div>
                {errors[`card_${index}`]?.body && (
                  <div className="text-sm text-red-500 mt-1">
                    {errors[`card_${index}`].body}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mb-4">
                <InputField
                  placeholder="Card Footer text (optional)"
                  label="Card Footer"
                  value={card.footerText}
                  onChange={(e) => handleCardFieldChange(card.id, "footerText", e.target.value)}
                  maxLength={60} // Meta's limit for card footer
                />
                {errors[`card_${index}`]?.footer && (
                  <div className="text-sm text-red-500 mt-1">
                    {errors[`card_${index}`].footer}
                  </div>
                )}
              </div>

              {/* Card Buttons */}
              <DynamicButtonsBuilder
                buttons={card.buttons}
                onChange={(newButtons) => handleCardFieldChange(card.id, "buttons", newButtons)}
                allowedButtonTypes={CAROUSEL_CARD_BUTTON_TYPES} // Only URL and Phone Number
                maxButtons={2} // Max 2 buttons per card
                error={errors[`card_${index}`]?.buttonsCount || errors[`card_${index}`]?.buttonText_0 || errors[`card_${index}`]?.buttonUrl_0 || errors[`card_${index}`]?.buttonPhone_0}
              />
              {errors[`card_${index}`]?.buttonsCount && (
                <div className="text-sm text-red-500 mt-1">
                  {errors[`card_${index}`].buttonsCount}
                </div>
              )}
              {Object.keys(errors).some(key => key.startsWith(`card_${index}` ) && key.includes('button')) && (
                 <div className="text-sm text-red-500 mt-1">
                   Please check button details for Card {index + 1}.
                 </div>
              )}
            </div>
          ))}

          <Button
            type="submit"
            disabled={!isValid || !businessProfileId || loading}
            className={`px-4 py-2 rounded text-white ${
              isValid && businessProfileId && !loading
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating..." : "Create Carousel Template"}
          </Button>
        </form>

        {/* Preview Section - Placeholder for now, full carousel preview is complex */}
        <div className="p-2 md:w-2/5 mt-4">
          <h2 className="text-xl font-semibold mb-4">Carousel Preview (Conceptual)</h2>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <p className="text-gray-600 text-sm mb-2">
              A full interactive preview of carousel templates is complex and often requires Meta's own tools.
              This section provides a conceptual layout.
            </p>
            {templateData.mainBodyText && (
              <div className="mb-4 p-2 border-b">
                <h3 className="font-semibold">Main Body Text:</h3>
                <div dangerouslySetInnerHTML={{ __html: templateData.mainBodyText }} />
              </div>
            )}
            <div className="space-y-4">
              {cards.map((card, index) => (
                <div key={card.id} className="border rounded-md p-3 bg-white shadow-sm">
                  <h4 className="font-bold text-sm mb-2">Card {index + 1}</h4>
                  {card.headerImageUrl && (
                    <img src={card.headerImageUrl} alt={`Card ${index + 1} Header`} className="w-full h-24 object-cover rounded-md mb-2" />
                  )}
                  {!card.headerImageUrl && (
                    <div className="w-full h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 mb-2">
                      <FaImage size={32} />
                    </div>
                  )}
                  <p className="text-sm font-medium mb-1">Body:</p>
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: card.bodyText }} />
                  {card.footerText && (
                    <p className="text-xs text-gray-500 mt-1">Footer: {card.footerText}</p>
                  )}
                  {card.buttons.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {card.buttons.map((btn, btnIdx) => (
                        <div key={btnIdx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {btn.text} ({btn.type})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
          Meta, it’s recommended to provide example text for variables. This helps
          Meta understand your use case and reduces the risk of rejection.
          <br />
          <br />
          For carousel templates, example values for dynamic URLs are crucial.
          <br />
          <br />
          <strong>Example:</strong>
          <br />
          If your button URL is: <em>"https://example.com/product"</em>
          <br />
          Then provide an example like: <code>https://example.com/product/123</code>
          <br />
          <br />
          This makes your message more personalized and improves approval
          likelihood.
        </p>
      </Modal>
    </>
  );
};

export default CreateCarouselTemplate;
