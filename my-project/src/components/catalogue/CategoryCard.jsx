import { Link } from "react-router-dom";

const CatalogueCard = ({ catalogue }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{catalogue.name}</h2>
        <p className="text-gray-600 mb-4">{catalogue.description}</p>
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <span>{catalogue.categoryCount} categories</span>
          <span>Updated: {catalogue.lastUpdated}</span>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/catalogue/${catalogue.id}/categories`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center transition-colors"
          >
            View Categories
          </Link>
          <Link
            to={`/catalogue/${catalogue.id}/add-category`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
          >
            Add Category
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CatalogueCard;
