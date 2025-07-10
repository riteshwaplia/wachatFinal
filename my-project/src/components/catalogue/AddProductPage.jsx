import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
// import { initialCategories } from "../../data/mockData";
import Input from "./../InputField.jsx";
import Button from "../Button.jsx";
const AddProductPage = () => {
  const { catelogueId: categoryId ,id: projectId } = useParams();


  const navigate = useNavigate();
  // const category = initialCategories.find(c => c.id === parseInt(categoryId));

  // Meta-specific product fields
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    // brand: "",
    availability: "in stock",
    condition: "new",
    retailer_id: "",
    // gtin: "",
    // mpn: "",
    image_url: "",
    // status: "Active",
    // Meta-specific fields
    // metaTitle: "",
    // metaDescription: "",
    // metaKeywords: "",
    // ogTitle: "",
    // ogDescription: "",
    // ogImage: "",
    // twitterCard: "summary",
    // twitterTitle: "",
    // twitterDescription: "",
    // canonicalUrl: "",
    // structuredData: "",
  });

  // State for adding new category
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

  // const [newCategory, setNewCategory] = useState({
  //   name: "",
  //   description: "",
  //   slug: "",
  //   metaTitle: "",
  //   metaDescription: "",
  //   parentCategory: "",
  // });

  const handleProductChange = (field, value) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  // const handleCategoryChange = (field, value) => {
  //   setNewCategory({ ...newCategory, [field]: value });
  // };

const handleAddProduct = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await api.post(`/product/${categoryId}`, {
      ...newProduct,
       // category link karne ke liye
    });

    alert(`✅ Product "${response.data.name}" added successfully!`);
    navigate(`/project/${projectId}/catalogue/${categoryId}/products`);
  } catch (err) {
    console.error("Error adding product:", err);
    setError(err.response?.data?.message || "Failed to add product");
  } finally {
    setLoading(false);
  }
};



  // const handleAddCategory = () => {
  //   if (!newCategory.name || !newCategory.slug) {
  //     alert("Category name and slug are required");
  //     return;
  //   }

  //   alert(`New category "${newCategory.name}" created successfully`);
  //   console.log("New Category:", newCategory);
    
  //   // Reset category form
  //   setNewCategory({
  //     name: "",
  //     description: "",
  //     slug: "",
  //     metaTitle: "",
  //     metaDescription: "",
  //     parentCategory: "",
  //   });
    
  //   setShowAddCategory(false);
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link to={-1} className="text-blue-600 hover:text-blue-800 font-medium">
          &larr; Back to Products
        </Link>
        {/* <button
          onClick={() => setShowAddCategory(!showAddCategory)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {showAddCategory && "Cancel Add Category" }
        </button> */}
      </div>

      {showAddCategory ? (
        /* Add Category Form */
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Category</h2> */}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <Input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => handleCategoryChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <Input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => handleCategoryChange("slug", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="URL-friendly slug"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) => handleCategoryChange("description", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="2"
                placeholder="Enter category description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                value={newCategory.parentCategory}
                onChange={(e) => handleCategoryChange("parentCategory", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">None (Top-level Category)</option>
                {/* {initialCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))} */}
              </select>
            </div>

            {/* <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Meta Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={newCategory.metaTitle}
                  onChange={(e) => handleCategoryChange("metaTitle", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Meta title for SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={newCategory.metaDescription}
                  onChange={(e) => handleCategoryChange("metaDescription", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="2"
                  placeholder="Meta description for SEO"
                />
              </div>
            </div> */}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowAddCategory(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Add Product Form */
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {/* Add Product to {category.name} */}
          </h1>

          <div className=" rounded-lg p-6 shadow-md">
            <div className="space-y-4">
              {/* Basic Product Information */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 dark:text-white">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <Input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => handleProductChange("name", e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      value={newProduct.description}
                      onChange={(e) => handleProductChange("description", e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm dark:text-white font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => handleProductChange("price", e.target.value)}
                        placeholder="Enter price"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        value={newProduct.currency}
                        onChange={(e) => handleProductChange("currency", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-gray-200 dark:bg-gray-900"
                      >
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={newProduct.brand}
                      onChange={(e) => handleProductChange("brand", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter brand name"
                    />
                  </div> */}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                        Availability
                      </label>
                      <select
                        value={newProduct.availability}
                        onChange={(e) => handleProductChange("availability", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-gray-200 dark:bg-gray-900"
                      >
                        <option value="in stock">In Stock</option>
                        <option value="out of stock">Out of Stock</option>
                        <option value="preorder">Preorder</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm dark:text-white font-medium text-gray-700 mb-1">
                        Condition
                      </label>
                      <select
                        value={newProduct.condition}
                        onChange={(e) => handleProductChange("condition", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:text-gray-200 dark:bg-gray-900"
                      >
                        <option value="new">New</option>
                        <option value="refurbished">Refurbished</option>
                        <option value="used">Used</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm dark:text-white font-medium text-gray-700 mb-1">
                        Retailer Id
                      </label>
                      <Input
                        type="text"
                        value={newProduct.retailer_id}
                        onChange={(e) => handleProductChange("retailer_id", e.target.value)}
                        placeholder="Unique Retailer Id"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GTIN
                      </label>
                      <input
                        type="text"
                        value={newProduct.gtin}
                        onChange={(e) => handleProductChange("gtin", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="GTIN / Barcode"
                      />
                    </div> */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MPN
                      </label>
                      <input
                        type="text"
                        value={newProduct.mpn}
                        onChange={(e) => handleProductChange("mpn", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Manufacturer Part Number"
                      />
                    </div> */}
                  </div>

                  <div>
                    <label className="block text-sm dark:text-white font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <Input
                      type="text"
                      value={newProduct.image_url}
                      onChange={(e) => handleProductChange("image_url", e.target.value)}
                      placeholder="https://example.com/product.jpg"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newProduct.status}
                      onChange={(e) => handleProductChange("status", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Active">Active</option>
                      <option value="Development">Development</option>
                      <option value="Beta">Beta</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div> */}
                </div>
              </div>

              {/* Meta Information Section */}
              {/* <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Meta Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title *
                    </label>
                    <input
                      type="text"
                      value={newProduct.metaTitle}
                      onChange={(e) => handleProductChange("metaTitle", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Meta title for SEO"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={newProduct.metaDescription}
                      onChange={(e) => handleProductChange("metaDescription", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="2"
                      placeholder="Meta description for SEO"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={newProduct.metaKeywords}
                      onChange={(e) => handleProductChange("metaKeywords", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Comma-separated keywords"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      value={newProduct.canonicalUrl}
                      onChange={(e) => handleProductChange("canonicalUrl", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Canonical URL for duplicate content"
                    />
                  </div>
                </div>
              </div> */}

              {/* Open Graph Information */}
              {/* <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Open Graph (Social Media)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OG Title
                    </label>
                    <input
                      type="text"
                      value={newProduct.ogTitle}
                      onChange={(e) => handleProductChange("ogTitle", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Open Graph title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OG Description
                    </label>
                    <textarea
                      value={newProduct.ogDescription}
                      onChange={(e) => handleProductChange("ogDescription", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="2"
                      placeholder="Open Graph description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OG Image URL
                    </label>
                    <input
                      type="text"
                      value={newProduct.ogImage}
                      onChange={(e) => handleProductChange("ogImage", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Open Graph image URL"
                    />
                  </div>
                </div>
              </div> */}

              {/* Twitter Card Information */}
              {/* <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Twitter Card</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter Card Type
                    </label>
                    <select
                      value={newProduct.twitterCard}
                      onChange={(e) => handleProductChange("twitterCard", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter Title
                    </label>
                    <input
                      type="text"
                      value={newProduct.twitterTitle}
                      onChange={(e) => handleProductChange("twitterTitle", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Twitter title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter Description
                    </label>
                    <textarea
                      value={newProduct.twitterDescription}
                      onChange={(e) => handleProductChange("twitterDescription", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="2"
                      placeholder="Twitter description"
                    />
                  </div>
                </div>
              </div> */}

              {/* Structured Data */}
              {/* <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Structured Data (Schema.org)</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JSON-LD Structured Data
                  </label>
                  <textarea
                    value={newProduct.structuredData}
                    onChange={(e) => handleProductChange("structuredData", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder='Paste JSON-LD code here, e.g., {"@context":"https://schema.org", ...}'
                  />
                </div>
              </div> */}

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-6">
                <Link
                  to={`/project/${projectId}/catalogue/${categoryId}/products`}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </Link>
                <Button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddProductPage;