import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCatalog, deleteCatalog } from "../../features/catalog/catalogSlice";
import { ErrorToast, SuccessToast } from "../../utils/Toast";
import { GrFolderOpen } from "react-icons/gr";
import { debounce } from "../../utils/debounce";
import { Link, useParams } from "react-router-dom";

export default function CatalogList() {
    const dispatch = useDispatch();
    const { catalogs = [], loading } = useSelector((state) => state.catalog);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // How many items per page
    const { id } = useParams(); // Get project ID from URL
    // Debounce search input
    const debounceSearch = useCallback(
        debounce((val) => setDebouncedSearch(val), 500),
        []
    );

    useEffect(() => {
        debounceSearch(searchTerm);
    }, [searchTerm, debounceSearch]);

    // Fetch all catalogs ONCE
    useEffect(() => {
        dispatch(getCatalog())
            .unwrap()
            .catch((err) => console.error(err));
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteCatalog(id)).unwrap();
            SuccessToast("Catalog deleted successfully");
        } catch (error) {
            ErrorToast(error || "Error deleting catalog");
        }
    };

    // Filter catalogs by search term
    const filteredCatalogs = catalogs.filter(
        (item) =>
            item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            item.catalogId.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredCatalogs.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedCatalogs = filteredCatalogs.slice(
        startIndex,
        startIndex + pageSize
    );

    return (
        <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
                📦 Catalogue List
            </h2>

            {/* Search Bar */}
            <div className="mb-4 flex">
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>

            {/* Loader */}
            {loading && (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                </div>
            )}

            {/* Catalog Grid */}
            {!loading && (
                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                    {[
                        { _id: "cat123", name: "Electronics Store", catalogId: "CAT-001", projectId: "proj101" },
                        { _id: "cat124", name: "Fashion Hub", catalogId: "CAT-002", projectId: "proj101" },
                        { _id: "cat125", name: "Home Decor", catalogId: "CAT-003", projectId: "proj102" }
                    ].map((item) => (
                        <div
                            key={item._id}
                            className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <GrFolderOpen className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        ID: {item.catalogId}
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 mt-auto">
                                <Link
                                    to={`/project/${id}/catalogues/${item.catalogId}`}
                                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                                >
                                    Manage
                                </Link>
                                <Link
                                    to={`/project/${id}/catalogues/${item._id}/settings`}
                                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
                                >
                                    Settings
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* {paginatedCatalogs.length === 0 && !loading && (
                        <p className="col-span-full text-center text-gray-500">
                            No catalogs available
                        </p>
                    )} */}
                </div>
            )}


            {/* Pagination */}
            {totalPages > 1 && !loading && (
                <div className="flex justify-center mt-6 space-x-2">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 rounded border ${currentPage === index + 1
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
