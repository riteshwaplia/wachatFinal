import React, { useState, useEffect } from "react";
import CatalogSelector from "./CatalogSelector";
import ProductUploader from "./ProductUploader";
import { getCatalog } from "../../features/catalog/catalogSlice";
import { useDispatch, useSelector } from "react-redux";

export default function CatalogManager() {
    const [selectedCatalogs, setSelectedCatalogs] = useState([]);
    const { catalogs = [], loading, error } = useSelector((state) => state.catalog);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCatalog({ page: 1, pageSize: 10 }));
    }, [dispatch]);

    return (
        <div className="space-y-8 gap-16 ">
            {/* Page Title */}
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3">
                Catalog Manager
            </h2>

            {/* Catalog Selection Section */}
            <div className="bg-white  rounded-xl p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Select a Catalogue
                </h2>
                <CatalogSelector
                    catalogs={catalogs}
                    selectedCatalogs={selectedCatalogs}
                    setSelectedCatalogs={setSelectedCatalogs}
                />
                {error && <p className="text-red-500 mt-3">Error: {error}</p>}
                {loading && <>
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                    </div>
                </>}

                {/* Product Uploader Section */}
                {selectedCatalogs.length !== 0 && (
                    <div className='mt-8' >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Upload Products
                        </h2>
                        <ProductUploader selectedCatalogs={selectedCatalogs} />
                    </div>
                )}
            </div>
        </div >
    );
}
