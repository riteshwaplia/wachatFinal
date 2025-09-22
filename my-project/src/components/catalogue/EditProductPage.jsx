import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";

const EditProductPage = () => {
  const { catelogueId: categoryId, id: projectId, productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
console.log("products",product);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch existing product details
useEffect(() => {
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/product/${categoryId}`);
      const allProducts = response.data.data;

      // productId se filter karo
      const selected = allProducts.find((p) => p._id === productId);

      if (selected) {
        setProduct(selected);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };
  fetchProduct();
}, [categoryId, productId]);


  const handleChange = (field, value) => {
    setProduct({ ...product, [field]: value });
  };

  // ✅ Update API call
  const handleUpdateProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/product/${productId}`, {
        ...product,
      }).then(()=>
    {
toast.success("product updated successfully");
      navigate(`/project/${projectId}/catalogue/${categoryId}/products`);
    }).catch(()=>
    {
toast.error("unable to update the product details");
    })

    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("unable to update the product details");
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) return <p className="text-center py-10">Loading...</p>;
  if (error && !product) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link
          to={-1}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          &larr; Back to Products
        </Link>
      </div>

      {product && (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Edit Product
          </h1>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={product.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter price"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        value={product.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <select
                        value={product.availability}
                        onChange={(e) => handleChange("availability", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="in stock">In Stock</option>
                        <option value="out of stock">Out of Stock</option>
                        <option value="preorder">Preorder</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition
                      </label>
                      <select
                        value={product.condition}
                        onChange={(e) => handleChange("condition", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="new">New</option>
                        <option value="refurbished">Refurbished</option>
                        <option value="used">Used</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retailer Id
                    </label>
                    <input 
                    disabled
                      type="text"
                      value={product.retailer_id}
                      onChange={(e) => handleChange("retailer_id", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Unique Retailer Id"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={product.image_url}
                      onChange={(e) => handleChange("image_url", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="https://example.com/product.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-6">
                <Link
                  to={`/project/${projectId}/catalogue/${categoryId}/products`}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleUpdateProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditProductPage;
