
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../Button";


const ProductPage = () => {
  const { catelogueId, id: projectId } = useParams();
const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  console.log("products",products);
  const [loading, setLoading] = useState(true);
  const [delLoader,setDeleteLoader] = useState(null);
  const [error, setError] = useState(null);
 const fetchProducts = async () => {
      try {
        const res = await api.get(`/product/${catelogueId}`);
        console.log("Products API response:", res.data);

        // Agar API ek hi product return kare to array banaye
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
  // Fetch products
  useEffect(() => {
   

    fetchProducts();
  }, [catelogueId]);


  const handleDelete=async(id)=>
  {
    console.log("idddd",id);
try {
 setDeleteLoader(id);
  const res = await api.delete(`/product/${id}`).then(()=>
  {
toast.success("catalouge product deleted successfully");
fetchProducts();
  }).catch(()=>
  {
toast.error("unable to delete the catalouge product");
  })
} catch (error) {
  toast.error("something went wrong");
}finally{
setDeleteLoader(null);
}
  }

  const syncApi=async()=>
  {
    try {
      setLoading(true);
      const res = await api.get(`/product/sync/${catelogueId}`).then(()=>
      {
toast.success("Products Synced Successfully");
      }).catch(()=>
      {
toast.error("Unable to Synced the products");
      })
    } catch (error) {
      toast.error("unable to sync the products, something went wrong");
    }finally{
setLoading(false);
    }
  }
  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

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
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-1">Showing all products in this catalogue</p>
        </div>
      <div className="flex items-center gap-2">
          <button onClick={syncApi}
        
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Sync Product
        </button>
        <Link
          to={`/project/${projectId}/catalogue/${catelogueId}/products/add-product`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Add Product
        </Link>
      </div>
      </div>

      {/* Product Cards */}
      {products.length === 0 ? (
        <p className="text-gray-600 text-center py-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products[0].data.map((product, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    {product.currency} {product.price}
                  </span>
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
                </div>

                <div className="mt-4 flex justify-between">
         <button
  onClick={() =>
    navigate(`/project/${projectId}/catalogue/${catelogueId}/products/edit/${product._id}`)
  }
  className="text-blue-600 hover:text-blue-800 font-medium"
>
  Edit
</button>
                  <button onClick={()=>handleDelete(product._id)} className="text-red-600 hover:text-red-800 font-medium">
                      {delLoader === product._id ? (
    <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Deleting...
    </>
  ) : (
    "Delete"
  )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
