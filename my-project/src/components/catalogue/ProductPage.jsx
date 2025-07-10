import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";

const ProductPage = () => {
  const { catelogueId, id: projectId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [delLoader, setDeleteLoader] = useState(null);
  const [error, setError] = useState(null);

const fetchProducts = async (page = 1) => {
  try {
    setLoading(true);

    const res = await api.get(`/product/${catelogueId}?page=${page}&limit=10`);
    console.log("Products API response:", res.data);

    if (res.data.success) {
      setProducts(res.data.data || []);
      setPagination({
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        totalRecords: res.data.pagination.totalRecords,
        pageSize: res.data.pagination.pageSize,
      });
    } else {
      // if backend sends 404 or no data
      if (res.data.status === 404) {
        setProducts([]); // empty product list
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          pageSize: 10,
        });
      } else {
        toast.error(res.data.message || "Failed to fetch products");
      }
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    setError("Failed to load products");
    setProducts([]); // make sure UI doesn’t break
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchProducts();
  }, [catelogueId]);

  const handleDelete = async (id) => {
    try {
      setDeleteLoader(id);
      await api.delete(`/product/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts(pagination.currentPage);
    } catch (error) {
      toast.error("Unable to delete product");
    } finally {
      setDeleteLoader(null);
    }
  };

  const syncApi = async () => {
    try {
      setLoading(true);
      await api.get(`/product/sync/${catelogueId}`);
      toast.success("Products Synced Successfully");
      fetchProducts(pagination.currentPage);
    } catch (error) {
      toast.error("Unable to sync the products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-10 dark:text-white">Loading products...</p>;
  // if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to={-1} className="text-blue-600 hover:text-blue-800 font-medium">
          &larr; Back to Catalogue
        </Link>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Products</h1>
          <p className="text-gray-600 mt-1 dark:text-white">Showing all products in this catalogue</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={syncApi}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sync Product
          </button>
          <Link
            to={`/project/${projectId}/catalogue/${catelogueId}/products/add-product`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add single Product
          </Link>
          <Link
            to={`/project/${projectId}/catalogue/${catelogueId}/products/uploadproudct`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Add Bulk Product
          </Link>
        </div>
      </div>

      {/* Product Table */}
      {products.length === 0 ? (
        <p className="text-gray-600 text-center py-10 dark:text-white">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:text-white rounded-lg shadow-md">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Availability</th>
                <th className="px-4 py-2 text-left">Condition</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t   dark:text-white">
                  <td className="px-4 py-2">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 font-semibold ">{product.name}</td>
                  <td className="px-4 py-2 text-sm  max-w-xs truncate">
                    {product.description}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {product.currency} {product.price}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.availability === "in stock"
                          ? "bg-green-100 text-green-700"
                          : product.availability === "out of stock"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.availability}
                    </span>
                  </td>
                  <td className="px-4 py-2 capitalize">{product.condition}</td>
                  <td className="px-4 py-2 flex gap-3 justify-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/project/${projectId}/catalogue/${catelogueId}/products/edit/${product._id}`
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      {delLoader === product._id ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages} —{" "}
              {pagination.totalRecords} products
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => fetchProducts(pagination.currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => fetchProducts(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    pagination.currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => fetchProducts(pagination.currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
