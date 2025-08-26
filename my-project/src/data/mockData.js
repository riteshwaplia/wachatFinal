// mockData.js

// ---- PRODUCTS ----
export const initialProducts = [
  {
    id: 1,
    name: "iPhone 16 Pro",
    description: "Latest Apple flagship smartphone",
    price: 1299,
    stock: 25,
    categoryId: 1, // belongs to Smartphones
  },
  {
    id: 2,
    name: "Samsung Galaxy S25",
    description: "High-performance Android phone",
    price: 1099,
    stock: 30,
    categoryId: 1,
  },
  {
    id: 3,
    name: "MacBook Pro 16",
    description: "Apple M4 powered professional laptop",
    price: 2999,
    stock: 12,
    categoryId: 2, // belongs to Laptops
  },
  {
    id: 4,
    name: "Dell XPS 15",
    description: "Powerful Windows laptop",
    price: 1899,
    stock: 20,
    categoryId: 2,
  },
  {
    id: 5,
    name: "Sony WH-1000XM6",
    description: "Noise-cancelling wireless headphones",
    price: 399,
    stock: 40,
    categoryId: 3, // belongs to Accessories
  },
];

// ---- CATEGORIES ----
export const initialCategories = [
  {
    id: 1,
    name: "Smartphones",
    description: "Latest flagship smartphones",
    catalogueId: 1, // belongs to Electronics Catalogue
    productCount: 2,
    lastUpdated: "2025-08-01",
  },
  {
    id: 2,
    name: "Laptops",
    description: "High-performance laptops",
    catalogueId: 1,
    productCount: 2,
    lastUpdated: "2025-08-01",
  },
  {
    id: 3,
    name: "Accessories",
    description: "Must-have tech accessories",
    catalogueId: 1,
    productCount: 1,
    lastUpdated: "2025-08-02",
  },
  {
    id: 4,
    name: "Men’s Wear",
    description: "Casual and formal clothing",
    catalogueId: 2, // belongs to Fashion Catalogue
    productCount: 0,
    lastUpdated: "2025-07-29",
  },
];

// ---- CATALOGUES ----
export const initialCatalogues = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest electronic gadgets",
    categoryCount: 3,
    lastUpdated: "2025-08-02",
  },
  {
    id: 2,
    name: "Fashion",
    description: "Trendy clothing & accessories",
    categoryCount: 1,
    lastUpdated: "2025-07-29",
  },
];
