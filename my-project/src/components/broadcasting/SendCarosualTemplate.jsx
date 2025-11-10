import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/Loader';

const SendCarouselTemplate = () => {
  const { user, token } = useAuth();
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState({
    templates: true,
    sending: false,
    uploading: false
  });
  
  // Form state
  const [templateName, setTemplateName] = useState("");
  const [templateLanguage, setTemplateLanguage] = useState("en_US");
  const [templateComponents, setTemplateComponents] = useState([]);
  const [contactsFile, setContactsFile] = useState(null);
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [cardMediaHandles, setCardMediaHandles] = useState({}); // {cardIndex: mediaHandle}

  const [templates, setTemplates] = useState([]);
  const [jobStatus, setJobStatus] = useState(null);

  const project = JSON.parse(localStorage.getItem("currentProject")) || "";
  const businessProfileId = project?.businessProfileId?._id || null;

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Fetch approved carousel templates
  const fetchTemplates = async () => {
    try {
      const res = await api.get("/templates/allapprovedcarouseltemplates", {
        ...config,
        params: { businessProfileId }
      });
      setTemplates(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load templates");
      console.error("Template fetch error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, templates: false }));
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (businessProfileId) {
      fetchTemplates();
    }
  }, [token, projectId, navigate, businessProfileId]);

  // When template is selected, populate the components
  useEffect(() => {
    if (templateName && templates.length) {
      const selectedTemplate = templates.find(tpl => tpl.name === templateName);
      if (selectedTemplate) {
        setTemplateComponents(selectedTemplate.components || []);
        setTemplateLanguage(selectedTemplate.language || "en_US");
        
        // Initialize empty media handles for each card
        const carousel = selectedTemplate.components?.find(c => c.type === "CAROUSEL");
        if (carousel?.cards) {
          const initialMediaHandles = {};
          carousel.cards.forEach((_, index) => {
            initialMediaHandles[index] = "";
          });
          setCardMediaHandles(initialMediaHandles);
        }
      }
    }
  }, [templateName, templates]);

  // Handle file upload and validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setContactsFile(file);
    setValidationErrors([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const headers = json[0]?.map(h => h.toLowerCase().trim()) || [];

        setExcelHeaders(headers);
        validateExcelHeaders(headers);
      } catch (error) {
        toast.error("Error reading Excel file");
        console.error("File read error:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Validate Excel headers against template requirements
const validateExcelHeaders = (headers) => {
  const errors = [];
  const requiredColumns = new Set(["mobilenumber"]);
  const missingColumns = [];

  // Check for required columns
  if (!headers.includes("mobilenumber")) {
    errors.push("File must contain 'mobilenumber' column");
  }

  // Check for BODY parameters based on example.body_text
  const bodyComponent = templateComponents.find(c => c.type === "BODY");
  if (bodyComponent?.example?.body_text?.[0]) {
    bodyComponent.example.body_text[0].forEach((_, index) => {
      const paramColumn = `body_${index + 1}`;
      requiredColumns.add(paramColumn);
      if (!headers.includes(paramColumn)) {
        missingColumns.push(paramColumn);
      }
    });
  }

  // Check for CAROUSEL card body parameters
  const carouselComponent = templateComponents.find(c => c.type === "CAROUSEL");
  if (carouselComponent?.cards) {
    carouselComponent.cards.forEach((card, cardIndex) => {
      const cardBodyComponent = card.components.find(c => c.type === "BODY");
      if (cardBodyComponent?.example?.body_text?.[0]) {
        cardBodyComponent.example.body_text[0].forEach((_, paramIndex) => {
          const cardParamColumn = `card_${cardIndex}_body_${paramIndex + 1}`;
          requiredColumns.add(cardParamColumn);
          if (!headers.includes(cardParamColumn)) {
            missingColumns.push(cardParamColumn);
          }
        });
      }
    });
  }

  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
  }

  setValidationErrors(errors);
  return errors.length === 0;
};

  // Handle image upload for a specific card
  const handleImageUpload = async (file, cardIndex) => {
    if (!file) return;

    setIsLoading(prev => ({ ...prev, uploading: true }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    try {
      const res = await api.post(
        `/projects/${projectId}/messages/upload-media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const mediaHandle = res.data?.id || res.data?.data.id || "";
      if (!mediaHandle) {
        throw new Error("Media handle not received");
      }

      // Update the media handle for this card
      setCardMediaHandles(prev => ({
        ...prev,
        [cardIndex]: mediaHandle
      }));

      toast.success(`Image for card ${cardIndex + 1} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload image for card ${cardIndex + 1}`);
      console.error("Image upload error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, uploading: false }));
    }
  };

  // Submit the bulk send request
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactsFile) {
      toast.warning("Please select a contacts file");
      return;
    }

    if (validationErrors.length > 0) {
      toast.error("Please fix file validation errors before submitting");
      return;
    }

    // Verify all card images are uploaded
    const carousel = templateComponents.find(c => c.type === "CAROUSEL");
    if (carousel?.cards) {
      const missingImages = [];
      carousel.cards.forEach((_, index) => {
        if (!cardMediaHandles[index]) {
          missingImages.push(index + 1);
        }
      });
      
      if (missingImages.length > 0) {
        toast.error(`Please upload images for cards: ${missingImages.join(", ")}`);
        return;
      }
    }

    setIsLoading(prev => ({ ...prev, sending: true }));

    // Prepare the message payload with uploaded media handles
    const messagePayload = {
      language: { code: templateLanguage },
      components: templateComponents.map(component => {
        if (component.type === "CAROUSEL") {
          return {
            ...component,
            cards: component.cards.map((card, index) => ({
              ...card,
              components: card.components.map(comp => {
                if (comp.type === "HEADER" && comp.format === "IMAGE") {
                  return {
                    ...comp,
                    example: {
                      header_handle: {id: [cardMediaHandles[index]]}
                    }
                  };
                }
                return comp;
              })
            }))
          };
        }
        return component;
      })
    };

    const formData = new FormData();
    formData.append("file", contactsFile);
    formData.append("templateName", templateName);
    formData.append("message", JSON.stringify(messagePayload));

    try {
      const res = await api.post(
        `/projects/${projectId}/messages/bulk-send/carousel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success(res.data.message || "Bulk messages initiated");
      setJobStatus(res.data.data);
      
      // Reset form
      setContactsFile(null);
      setTemplateName("");
      document.getElementById("contactsFile").value = "";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send bulk messages");
      console.error("Bulk send error:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, sending: false }));
    }
  };

  // Render carousel preview
  const renderCarouselPreview = () => {
    const carousel = templateComponents.find(c => c.type === "CAROUSEL");
    if (!carousel?.cards) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Carousel Preview</h3>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {carousel.cards.map((card, index) => (
            <div key={index} className="min-w-[300px] border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow">
              {cardMediaHandles[index] ? (
                <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <img 
                    src={`https://graph.facebook.com/v19.0/${cardMediaHandles[index]}`} 
                    alt={`Card ${index + 1}`}
                    className="h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                  Image Preview (Upload Required)
                </div>
              )}
              <div className="p-4">
                <h4 className="font-medium mb-2">Card {index + 1}</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0], index)}
                  className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isLoading.uploading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  {cardMediaHandles[index] ? "Image uploaded" : "Image required"}
                </p>
                
                {/* Display body parameters with example variables */}
                {card.components?.map((comp, compIndex) => (
                  <div key={compIndex} className="mt-3">
                    {comp.type === "BODY" && comp.example?.body_text?.[0] && (
                      <div>
                        <p className="text-sm font-medium mb-1">Body Parameters:</p>
                        <ul className="space-y-1">
                          {comp.example.body_text[0].map((param, paramIndex) => (
                            <li key={paramIndex} className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Param {paramIndex + 1}:</span> {param}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Excel file requirements
 const renderFileRequirements = () => {
  if (!templateComponents.length) return null;

  const requiredColumns = ["mobilenumber","countrycode"];
  const bodyComponent = templateComponents.find(c => c.type === "BODY");
  const carouselComponent = templateComponents.find(c => c.type === "CAROUSEL");

  // Add main body parameters
  if (bodyComponent?.example?.body_text?.[0]) {
    bodyComponent.example.body_text[0].forEach((_, index) => {
      requiredColumns.push(`body_${index + 1}`);
    });
  }

  // Add card-specific body parameters
  if (carouselComponent?.cards) {
    carouselComponent.cards.forEach((card, cardIndex) => {
      const cardBodyComponent = card.components.find(c => c.type === "BODY");
      if (cardBodyComponent?.example?.body_text?.[0]) {
        cardBodyComponent.example.body_text[0].forEach((_, paramIndex) => {
          requiredColumns.push(`card_${cardIndex}_body_${paramIndex + 1}`);
        });
      }
    });
  }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Excel File Requirements</h3>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
        <p className="font-medium mb-2">Required Columns:</p>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {requiredColumns.map((col, index) => (
            <li key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded text-sm">
              {col}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
          Note: Images are uploaded separately above, not through the Excel file.
        </p>
      </div>
        
        {excelHeaders.length > 0 && (
          <div className="mt-4">
            <p className="font-medium mb-2">Detected Columns:</p>
            <div className="flex flex-wrap gap-2">
              {excelHeaders.map((header, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded text-sm border ${
                    requiredColumns.includes(header) ? 'bg-green-50 border-green-200' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {header}
                </span>
              ))}
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="mt-4 text-red-600">
            <p className="font-medium">Validation Errors:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

<button
  onClick={() => {
    // Generate sample CSV data
    const requiredColumns = ["mobilenumber"];
    const bodyComponent = templateComponents.find(c => c.type === "BODY");
    const carouselComponent = templateComponents.find(c => c.type === "CAROUSEL");

    // Add main body parameters
    if (bodyComponent?.example?.body_text?.[0]) {
      bodyComponent.example.body_text[0].forEach((_, index) => {
        requiredColumns.push(`body_${index + 1}`);
      });
    }

    // Add card-specific body parameters
    if (carouselComponent?.cards) {
      carouselComponent.cards.forEach((card, cardIndex) => {
        const cardBodyComponent = card.components.find(c => c.type === "BODY");
        if (cardBodyComponent?.example?.body_text?.[0]) {
          cardBodyComponent.example.body_text[0].forEach((_, paramIndex) => {
            requiredColumns.push(`card_${cardIndex}_body_${paramIndex + 1}`);
          });
        }
      });
    }

    const sampleData = {};
    requiredColumns.forEach(col => {
      if (col === "mobilenumber") sampleData[col] = "919999999999";
      else if (col.startsWith("card_")) {
        const [_, cardIndex, __, paramIndex] = col.split('_');
        sampleData[col] = `Card${cardIndex}Param${paramIndex}`;
      }
      else sampleData[col] = "VALUE_HERE";
    });

    const csv = [requiredColumns.join(","), requiredColumns.map(c => sampleData[c]).join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "carousel_template_sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  }}
  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
>
  Download Sample CSV
</button>
      </div>
    );
  };

  if (isLoading.templates) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-800 dark:text-gray-100">
        <LoadingSpinner />
        <span className="ml-2">Loading templates...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-8 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Send Carousel Template Messages</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Select Template</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              required
            >
              <option value="">-- Select Template --</option>
              {templates.map(tpl => (
                <option key={tpl._id} value={tpl.name}>
                  {tpl.name} ({tpl.language})
                </option>
              ))}
            </select>
            {templates.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                No approved carousel templates found for your business profile
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Template Language</label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={templateLanguage}
              readOnly
            />
          </div>
        </div>

        {templateName && (
          <>
            {renderCarouselPreview()}
            
            <div>
              <label className="block font-medium mb-1">Upload Contacts File (Excel/CSV)</label>
              <input
                type="file"
                id="contactsFile"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                File should contain phone numbers and body parameters (no images needed)
              </p>
            </div>

            {renderFileRequirements()}

            <button
              type="submit"
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
                isLoading.sending || isLoading.uploading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isLoading.sending || isLoading.uploading || validationErrors.length > 0}
            >
              {isLoading.sending ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Sending Messages...</span>
                </span>
              ) : (
                "Send Bulk Messages"
              )}
            </button>
          </>
        )}
      </form>

      {jobStatus && (
        <div className="mt-8 p-4 border border-blue-200 dark:border-blue-900 rounded-lg bg-blue-50 dark:bg-blue-900/30">
          <h3 className="text-xl font-semibold mb-3">Bulk Send Job Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">Job ID</p>
              <p className="font-medium">{jobStatus.bulkSendJobId}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">Status</p>
              <p className={`font-medium ${
                jobStatus.status === 'completed' ? 'text-green-600' : 
                jobStatus.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {jobStatus.status}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">Progress</p>
              <p className="font-medium">
                {jobStatus.totalSent} / {jobStatus.totalSent + jobStatus.totalFailed} sent
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendCarouselTemplate;