import { Link, useParams } from "react-router-dom";
import { initialCategories, initialProducts } from "../../data/mockData";

const ProductPage = () => {
    console.log("params:", useParams());
  const { catelogueId:categoryId } = useParams();
  const category = initialCategories.find(c => c.id === parseInt(categoryId));
  const products = initialProducts.filter(p => p.categoryId === parseInt(categoryId));
    const {id : projectId}=useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={-1} className="text-blue-600 hover:text-blue-800 font-medium">
          &larr; Back to Catelogue
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{category.name} Products</h1>
          <p className="text-gray-600 mt-1">{category.description}</p>
        </div>
        {/* /project/:id/catalogue/:catelogueId/products */}
        <Link 
          to={`/project/${projectId}/catalogue/${categoryId}/products/add-product`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Add Product
        </Link>
      </div>

      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.description}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      product.status === 'Development' ? 'bg-yellow-100 text-yellow-800' :
                      product.status === 'Beta' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductPage;
