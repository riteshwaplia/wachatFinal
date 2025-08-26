import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data for demonstration
const initialCatalogues = [
  {
    id: 1,
    name: "Augmented Reality",
    description: "AR experiences and filters for social media",
    itemCount: 24,
    lastUpdated: "2023-10-15"
  },
  {
    id: 2,
    name: "Virtual Reality",
    description: "Immersive VR environments and applications",
    itemCount: 18,
    lastUpdated: "2023-09-28"
  },
  {
    id: 3,
    name: "Digital Avatars",
    description: "Customizable digital personas for metaverse",
    itemCount: 32,
    lastUpdated: "2023-11-05"
  }
];

const initialProducts = [
  { id: 1, catalogueId: 1, name: "AR City Explorer", description: "Interactive city guide with AR overlays", status: "Active" },
  { id: 2, catalogueId: 1, name: "Social Media Filters", description: "Custom filters for Instagram and Facebook", status: "Active" },
  { id: 3, catalogueId: 2, name: "VR Meeting Space", description: "Virtual conference rooms for remote teams", status: "Development" },
  { id: 4, catalogueId: 2, name: "VR Training Simulator", description: "Immersive training for hazardous environments", status: "Active" },
  { id: 5, catalogueId: 3, name: "Business Avatar", description: "Professional avatar for work meetings", status: "Active" },
  { id: 6, catalogueId: 3, name: "Gaming Avatar", description: "Customizable avatar for gaming platforms", status: "Beta" }
];

const Catalogue = () => {
  const [catalogues, setCatalogues] = useState(initialCatalogues);
  const [showAddCatalogue, setShowAddCatalogue] = useState(false);
  const [newCatalogue, setNewCatalogue] = useState({ name: '', description: '' });

  const handleAddCatalogue = () => {
    if (newCatalogue.name.trim() === '') return;
    
    const newCat = {
      id: Math.max(...catalogues.map(c => c.id)) + 1,
      name: newCatalogue.name,
      description: newCatalogue.description,
      itemCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setCatalogues([...catalogues, newCat]);
    setNewCatalogue({ name: '', description: '' });
    setShowAddCatalogue(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Meta Catalogues</h1>
        <button 
          onClick={() => setShowAddCatalogue(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Add New Catalogue
        </button>
      </div>

      {showAddCatalogue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Catalogue</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catalogue Name</label>
                <input
                  type="text"
                  value={newCatalogue.name}
                  onChange={(e) => setNewCatalogue({...newCatalogue, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter catalogue name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCatalogue.description}
                  onChange={(e) => setNewCatalogue({...newCatalogue, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowAddCatalogue(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCatalogue}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Catalogue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogues.map(catalogue => (
          <CatalogueCard key={catalogue.id} catalogue={catalogue} />
        ))}
      </div>
    </div>
  );
};

const CatalogueCard = ({ catalogue }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{catalogue.name}</h2>
        <p className="text-gray-600 mb-4">{catalogue.description}</p>
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <span>{catalogue.itemCount} products</span>
          <span>Updated: {catalogue.lastUpdated}</span>
        </div>
        <div className="flex space-x-3">
          <Link 
            to={`/catalogue/${catalogue.id}/products`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center transition-colors"
          >
            View Details
          </Link>
          <Link 
            to={`/catalogue/${catalogue.id}/add-product`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
          >
            Add Product
          </Link>
        </div>
      </div>
    </div>
  );
};

// This would typically be in a separate file, but included here for completeness
const ProductList = ({ match }) => {
  const catalogueId = parseInt(match.params.catalogueId);
  const catalogue = initialCatalogues.find(c => c.id === catalogueId);
  const products = initialProducts.filter(p => p.catalogueId === catalogueId);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', status: 'Active' });

  const handleAddProduct = () => {
    // In a real app, this would be an API call
    alert(`Product ${newProduct.name} would be added to catalogue ${catalogueId}`);
    setShowAddProduct(false);
    setNewProduct({ name: '', description: '', status: 'Active' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
          &larr; Back to Catalogues
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{catalogue.name} Products</h1>
          <p className="text-gray-600 mt-1">{catalogue.description}</p>
        </div>
        <button 
          onClick={() => setShowAddProduct(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Add Product
        </button>
      </div>

      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newProduct.status}
                  onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Development">Development</option>
                  <option value="Beta">Beta</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{product.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      product.status === 'Development' ? 'bg-yellow-100 text-yellow-800' :
                      product.status === 'Beta' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

export default Catalogue;
