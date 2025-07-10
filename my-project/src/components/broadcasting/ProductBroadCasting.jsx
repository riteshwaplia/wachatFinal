import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CusLoadMoreSelect from "../CustomPaginationSelect";
import { useMemo } from "react";
import * as XLSX from "xlsx";
import { BackButton } from "../BackButton";
const ProductBroadCasting = () => {
  const { user, token } = useAuth();
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [sendMode, setSendMode] = useState("send-now");
  const [scheduledDateTime, setScheduledDateTime] = useState(null);
  const [bulkContactsFile, setBulkContactsFile] = useState(null);

  const [templates, setTemplates] = useState({ spm: [], mpm: [], simple: [] });
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [bulkTemplateComponents, setBulkTemplateComponents] = useState("");
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [expectedColumns, setExpectedColumns] = useState([]);
  const [mismatchedHeaders, setMismatchedHeaders] = useState([]);

  const [messageType, setMessageType] = useState(""); // catalog | spm | mpm
  const [catalogs, setCatalogs] = useState([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState("");
  const [catelogiobjectid, setCatalogObjectId] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(""); // for SPM - retailer_id
  const [thumbnailProductId, setThumbnailProductId] = useState(""); // for MPM - retailer_id
  const [sections, setSections] = useState([
    { title: "Section 1", product_items: [{ product_retailer_id: "" }] },
  ]);

  const project = JSON.parse(localStorage.getItem("currentProject")) || "";
  const businessProfileId = project?.businessProfileId?._id || null;
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    fetchTemplates();
    fetchCatalogs();
  }, [user]);

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      const res = await api.get(
        `/templates/allapprovedcatalogtemplates?businessProfileId=${businessProfileId}`,
        config
      );
      setTemplates(res.data.data || { spm: [], mpm: [], simple: [] });
    } catch (err) {
      toast.error("Failed to load templates");
    }
  };

  // Fetch catalogs with pagination
  const fetchCatalogs = async (page = 1, limit = 10) => {
    try {
      const res = await api.get(
        `/catalog/${businessProfileId}?page=${page}&limit=${limit}`,
        config
      );
      if (page === 1) {
        setCatalogs(res.data.data || []);
      } else {
        setCatalogs((prev) => [...prev, ...(res.data.data || [])]);
      }
      return res.data;
    } catch (err) {
      toast.error("Failed to load catalogs");
      return null;
    }
  };

  // Fetch products for selected catalog
  const fetchProducts = async (catalogId, page = 1, limit = 10) => {
    try {
      const res = await api.get(
        `/product/${catelogiobjectid}/name?page=${page}&limit=${limit}`,
        config
      );
      if (page === 1) {
        setProducts(res.data.data || []);
      } else {
        setProducts((prev) => [...prev, ...(res.data.data || [])]);
      }
      return res.data;
    } catch (err) {
      toast.error("Failed to load products");
      return null;
    }
  };

  // Handle catalog selection
  const handleCatalogChange = async (selectedOption) => {
    setSelectedCatalogId(selectedOption?.value || "");
    setSelectedProductId("");
    setThumbnailProductId("");
    setCatalogObjectId(selectedOption?.original.object_id || "");
    setSections([
      { title: "Section 1", product_items: [{ product_retailer_id: "" }] },
    ]);
    console.log("selected catalog", selectedOption);
    // Fetch products for the selected catalog
    if (selectedOption?.original.object_id) {
      await fetchProducts(selectedOption.object_id);
    }
  };
  console.log("nbvc", catelogiobjectid);

  // Handle message type change
  const handleMessageTypeChange = (e) => {
    const newType = e.target.value;
    setMessageType(newType);
    setSelectedTemplate(""); // Reset template when message type changes

    // Reset related states when message type changes
    setSelectedCatalogId("");
    setSelectedProductId("");
    setThumbnailProductId("");
    setProducts([]);
    setSections([
      { title: "Section 1", product_items: [{ product_retailer_id: "" }] },
    ]);
  };

  // Get templates based on message type
  const getFilteredTemplates = () => {
    switch (messageType) {
      case "spm":
        return templates.spm || [];
      case "mpm":
        return templates.mpm || [];
      case "catalog":
        return templates.simple || [];
      default:
        return [];
    }
  };

  console.log("templates", templates);

  const handleSectionChange = (sectionIndex, field, value) => {
    const updated = [...sections];
    updated[sectionIndex][field] = value;
    setSections(updated);
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      { title: "", product_items: [{ product_retailer_id: "" }] },
    ]);
  };

  const handleAddProductToSection = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].product_items.push({ product_retailer_id: "" });
    setSections(updated);
  };

  const handleProductChange = (sectionIndex, productIndex, value) => {
    const updated = [...sections];
    updated[sectionIndex].product_items[productIndex].product_retailer_id =
      value;
    setSections(updated);
  };

  const handleBulkFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkContactsFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const headers = json[0]?.map((h) => h.toLowerCase().trim()) || [];
      setExcelHeaders(headers);

      try {
        const parsed =
          typeof bulkTemplateComponents === "string"
            ? JSON.parse(bulkTemplateComponents)
            : bulkTemplateComponents;

        let expected = ["mobilenumber"];
        parsed.forEach((comp) => {
          if (comp.type === "HEADER" && comp.example?.header_text) {
            comp.example.header_text.forEach((v) =>
              expected.push(`header_${v.toLowerCase()}`)
            );
          }
          if (comp.type === "BODY" && comp.example?.body_text) {
            comp.example.body_text[0]?.forEach((v) =>
              expected.push(`body_${v.toLowerCase()}`)
            );
          }
        });

        setExpectedColumns(expected);
        setMismatchedHeaders(expected.filter((col) => !headers.includes(col)));
      } catch (err) {
        console.error("Template parsing error:", err);
        setExpectedColumns([]);
        setMismatchedHeaders([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const validateForm = () => {
    if (!bulkContactsFile) {
      toast.error("Please upload a contacts file");
      return false;
    }

    if (!selectedTemplate) {
      toast.error("Please select a template");
      return false;
    }

    if (!messageType) {
      toast.error("Please select message type");
      return false;
    }

    // Validate catalog selection for all message types
    if (!selectedCatalogId) {
      toast.error("Please select a catalog");
      return false;
    }

    // Validate specific message types
    if (messageType === "spm" && !selectedProductId) {
      toast.error("Please select a product for Single Product Message");
      return false;
    }

    if (messageType === "mpm") {
      if (!thumbnailProductId) {
        toast.error(
          "Please select a thumbnail product for Multi Product Message"
        );
        return false;
      }

      // Validate sections
      for (const section of sections) {
        if (!section.title.trim()) {
          toast.error("All sections must have a title");
          return false;
        }
        for (const item of section.product_items) {
          if (!item.product_retailer_id) {
            toast.error("All products in sections must be selected");
            return false;
          }
        }
      }
    }

    if (sendMode === "schedule" && !scheduledDateTime) {
      toast.error("Please select schedule date and time");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", bulkContactsFile);
      formData.append("templateName", selectedTemplate);
      formData.append("typeofmessage", messageType);

      // Add catalog ID
      if (selectedCatalogId) {
        formData.append("metaCatalogId", selectedCatalogId);
      }

      // Add scheduling if applicable
      if (sendMode === "schedule" && scheduledDateTime) {
        formData.append("scheduledTime", scheduledDateTime.toISOString());
      }

      // Add message type specific data
      if (messageType === "spm") {
        formData.append("productId", selectedProductId); // retailer_id
      }

      if (messageType === "mpm") {
        formData.append("thumbnail_product_retailer_id", thumbnailProductId); // retailer_id
        formData.append("sections", JSON.stringify(sections));
      }

      const res = await api.post(
        `/projects/${projectId}/messages/bulk-catalog-messages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Message request sent successfully");

      // Reset form after successful submission
      setSelectedTemplate("");
      setMessageType("");
      setSelectedCatalogId("");
      setSelectedProductId("");
      setThumbnailProductId("");
      setSections([
        { title: "Section 1", product_items: [{ product_retailer_id: "" }] },
      ]);
      setScheduledDateTime(null);
      setBulkContactsFile(null);
      setProducts([]);

      // Clear file input
      const fileInput = document.getElementById("bulkContactsFile");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // Memoized options
  const catalogOptions = useMemo(() => {
    return catalogs.map((catalog) => ({
      name: `${catalog.name} (${catalog.catalogId})`,
      id: catalog.catalogId,
      object_id: catalog._id,

      // Use catalogId instead of _id
    }));
  }, [catalogs]);

  const productOptions = useMemo(() => {
    return products.map((product) => ({
      name: `${product.name} - ₹${product.price}`,
      id: product.retailer_id,
    }));
  }, [products]);

  const templateOptions = useMemo(() => {
    return getFilteredTemplates();
  }, [templates, messageType]);

  const selectedCatalogValue = useMemo(() => {
    if (!selectedCatalogId) return null;
    const catalog = catalogs.find((cat) => cat.catalogId === selectedCatalogId);
    return catalog
      ? {
          label: `${catalog.name} (${catalog.catalogId})`,
          value: catalog.catalogId,
        }
      : null;
  }, [selectedCatalogId, catalogs]);

  const selectedProductValue = useMemo(() => {
    if (!selectedProductId) return null;
    const product = products.find((p) => p.retailer_id === selectedProductId);
    return product
      ? {
          label: `${product.name} - ₹${product.price}`,
          value: product.retailer_id,
        }
      : null;
  }, [selectedProductId, products]);

  const selectedTemplateValue = useMemo(() => {
    if (!selectedTemplate) return null;
    return {
      label: selectedTemplate,
      value: selectedTemplate,
    };
  }, [selectedTemplate]);

  const thumbnailProductValue = useMemo(() => {
    if (!thumbnailProductId) return null;
    const product = products.find((p) => p.retailer_id === thumbnailProductId);
    return product
      ? {
          label: `${product.name} - ₹${product.price}`,
          value: product.retailer_id,
        }
      : null;
  }, [thumbnailProductId, products]);

  console.log("op tempate ", bulkTemplateComponents);
const renderTemplatePreview = () => {
  try {
    const parsed =
      typeof bulkTemplateComponents === "string"
        ? JSON.parse(bulkTemplateComponents)
        : bulkTemplateComponents;

    if (!parsed || !Array.isArray(parsed)) return null;

    let totalVars = [];

    parsed.forEach((comp) => {
      if (comp.type === "HEADER" && comp.example?.header_text) {
        totalVars.push(...comp.example.header_text);
      }
      if (comp.type === "BODY" && comp.example?.body_text) {
        totalVars.push(...(comp.example.body_text[0] || []));
      }
    });

    // if no variables found, skip rendering
    if (totalVars.length === 0) return null;

    // sequential variable names
    const columns = [
      "mobilenumber",
      "countrycode",
      ...totalVars.map((_, i) => `variable_${i + 1}`),
    ];

    // two sample rows
    const sampleRows = [
      {
        mobilenumber: "9166833189",
        countrycode: "91",
        ...Object.fromEntries(
          totalVars.map((_, i) => [`variable_${i + 1}`, i === 0 ? "Pra" : "10"])
        ),
      },
      {
        mobilenumber: "9588829249",
        countrycode: "91",
        ...Object.fromEntries(
          totalVars.map((_, i) => [`variable_${i + 1}`, i === 0 ? "Ishm" : "18"])
        ),
      },
    ];

    return (
      <div className="mt-6">
        <h4 className="text-lg font-semibold dark:text-white text-gray-700 mb-2">
          Required Excel Format
        </h4>

        <div className="overflow-auto border rounded-md bg-white mb-3">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 dark:text-white">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="border px-3 py-2 text-sm font-medium text-gray-700"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col} className="border px-3 py-2 text-sm">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => {
            const csv = [
              columns.join(","),
              ...sampleRows.map((r) =>
                columns.map((c) => r[c] ?? "").join(",")
              ),
            ].join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "template_sample.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Download Sample CSV
        </button>

        {mismatchedHeaders.length > 0 && (
          <p className="text-sm text-red-500 mt-2">
            Missing columns in uploaded file: {mismatchedHeaders.join(", ")}
          </p>
        )}
      </div>
    );
  } catch (e) {
    console.error("Template preview error:", e);
    return null;
  }
};

  console.log("catelog options", catalogOptions);
  return (
    <div className="p-6 space-y-6">
      <BackButton />
      <h2 className="text-xl font-semibold dark:text-white">Bulk Catalog Messaging</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Message Type */}
        <div>
          <label className="block font-medium mb-2 dark:text-white">Message Type</label>
          <select
            className="w-full border rounded-md p-2 dark:text-white dark:bg-dark-surface"
            value={messageType}
            onChange={handleMessageTypeChange}
            required
          >
            <option value="">Select Type</option>
            <option value="catalog">Catalog</option>
            <option value="spm">Single Product (SPM)</option>
            <option value="mpm">Multi Product (MPM)</option>
          </select>
        </div>
        {/* Catalog Selection - Show for all message types */}
        {(messageType === "catalog" ||
          messageType === "spm" ||
          messageType === "mpm") && (
          <div>
            <label className="block font-medium mb-2">Select Catalog</label>
            <CusLoadMoreSelect
              options={catalogOptions}
              labelKey="name"
              valueKey="id"
              isDark={isDark}
              pageSize={10}
              value={selectedCatalogValue}
              onChange={handleCatalogChange}
              onLoadMore={(page) => fetchCatalogs(page)}
              placeholder="Select a Catalog"
            />
          </div>
        )}
        {/* Template Selection - Show only when catalog is selected and message type is chosen */}
        {messageType && selectedCatalogId && (
          <div>
            <label className="block font-medium mb-2">Template</label>
            <CusLoadMoreSelect
              options={templateOptions}
              labelKey="name"
              valueKey="name"
              isDark={isDark}
              pageSize={10}
              value={selectedTemplateValue}
              onChange={(val) => {
                console.log("val", val);
                setSelectedTemplate(val?.value || "");
                setBulkTemplateComponents(val?.original.components || "");
              }}
              placeholder={`Select ${messageType.toUpperCase()} Template`}
            />
            <p className="text-sm text-gray-500 mt-1 dark:text-white">
              Available templates for {messageType.toUpperCase()}:{" "}
              <span className="font-semibold">{templateOptions.length}</span>
            </p>
          </div>
        )}
        {/* SPM - Single Product Message */}
        {messageType === "spm" && selectedCatalogId && (
          <div>
            <label className="block font-medium mb-2 dark:text-white">Select Product</label>
            <CusLoadMoreSelect
              options={productOptions}
              labelKey="name"
              valueKey="id"
              isDark={isDark}
              pageSize={10}
              value={selectedProductValue}
              onChange={(val) => setSelectedProductId(val?.value || "")}
              onLoadMore={(page) => fetchProducts(selectedCatalogId, page)}
              placeholder="Select Product"
            />
          </div>
        )}
        {/* MPM - Multi Product Message */}
        {messageType === "mpm" && selectedCatalogId && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 dark:text-white">
                Thumbnail Product
              </label>
              <CusLoadMoreSelect
                options={productOptions}
                labelKey="name"
                valueKey="id"
                isDark={isDark}
                pageSize={10}
                value={thumbnailProductValue}
                onChange={(val) => setThumbnailProductId(val?.value || "")}
                onLoadMore={(page) => fetchProducts(selectedCatalogId, page)}
                placeholder="Select Thumbnail Product"
              />
              <p className="text-sm text-gray-500 mt-1">
                This product will be shown as the thumbnail in the message
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium dark:text-white">Sections</h4>
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                  onClick={handleAddSection}
                >
                  + Add Section
                </button>
              </div>

              {sections.map((section, sIndex) => (
                <div key={sIndex} className="border p-3 rounded-md mb-3">
                  <input
                    type="text"
                    placeholder="Section Title"
                    value={section.title}
                    onChange={(e) =>
                      handleSectionChange(sIndex, "title", e.target.value)
                    }
                    className="w-full border rounded-md p-2 mb-2 dark:text-white"
                    required
                  />
                  {section.product_items.map((item, pIndex) => (
                    <div key={pIndex} className="flex gap-2 mb-2">
                      <CusLoadMoreSelect
                        options={productOptions}
                        labelKey="name"
                        valueKey="id"
                        isDark={isDark}
                        pageSize={10}
                        value={
                          item.product_retailer_id
                            ? {
                                label: `${
                                  products.find(
                                    (p) =>
                                      p.retailer_id === item.product_retailer_id
                                  )?.name
                                } - ₹${
                                  products.find(
                                    (p) =>
                                      p.retailer_id === item.product_retailer_id
                                  )?.price
                                }`,
                                value: item.product_retailer_id,
                              }
                            : null
                        }
                        onChange={(val) =>
                          handleProductChange(sIndex, pIndex, val?.value || "")
                        }
                        onLoadMore={(page) =>
                          fetchProducts(selectedCatalogId, page)
                        }
                        placeholder="Select Product"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="px-3 py-1 bg-gray-200 rounded-md text-sm dark:text-white"
                    onClick={() => handleAddProductToSection(sIndex)}
                  >
                    + Add Product
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {renderTemplatePreview()} {/* File Upload */}
        <div>
          <label className="block font-medium mb-2 dark:text-white">Upload Contacts File</label>
          <input
            type="file"
            id="bulkContactsFile"
            className="w-full border rounded-md p-2 dark:text-white"
            onChange={handleBulkFileChange}
            accept=".csv,.xlsx,.xls"
            required
          />
          <p className="text-sm text-gray-500 mt-1 dark:text-white">
            Supported formats: CSV, XLSX, XLS
          </p>
        </div>
        {/* Scheduling */}
        <div>
          <label className="block font-medium mb-2 dark:text-white">Send Mode</label>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                sendMode === "send-now"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSendMode("send-now")}
            >
              Send Now
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                sendMode === "schedule"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSendMode("schedule")}
            >
              Schedule
            </button>
          </div>
          {sendMode === "schedule" && (
            <div className="mt-3">
              <label className="block font-medium mb-2 dark:text-white">
                Schedule Date & Time
              </label>
              <DatePicker
                selected={scheduledDateTime}
                onChange={(date) => setScheduledDateTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                className="w-full border rounded-md p-2"
                placeholderText="Select date and time"
                required
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 dark:text-white"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : sendMode === "schedule"
            ? "Schedule Message"
            : "Send Now"}
        </button>
      </form>
    </div>
  );
};

export default ProductBroadCasting;
