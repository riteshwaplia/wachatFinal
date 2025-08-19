// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { HiViewGrid } from "react-icons/hi"; // grid icon
// import { ChevronDownIcon } from "@heroicons/react/24/solid";

// export default function CatalogSelector({ catalogs, selectedCatalogs, setSelectedCatalogs }) {
//     const { loading } = useSelector((state) => state.catalog);
//     const [isOpen, setIsOpen] = useState(false);

//     useEffect(() => {
//         // Set default selection if available
//         if (catalogs?.length && !selectedCatalogs) {
//             setSelectedCatalogs(null);
//         }
//     }, [catalogs, selectedCatalogs, setSelectedCatalogs]);

//     return (
//         <div className="relative inline-block w-64">
//             {/* Dropdown Button */}
//             <button
//                 onClick={() => setIsOpen((prev) => !prev)}
//                 className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//                 <div className="flex items-center gap-2">
//                     <div className="bg-gray-100 p-1 rounded-full">
//                         <HiViewGrid className="h-5 w-5 text-gray-600" />
//                     </div>
//                     <span className="font-medium truncate">
//                         {selectedCatalogs?.name || "Select Catalogue"}
//                     </span>
//                 </div>

//                 {/* Facebook-style dropdown arrow */}
//                 <span
//                     style={{
//                         width: "16px",
//                         height: "16px",
//                         maskImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v4/yz/r/HoPS7xcIvaw.png")',
//                         maskSize: "25px 2105px",
//                         maskPosition: "0px -1730px",
//                         WebkitMaskImage: 'url("https://static.xx.fbcdn.net/rsrc.php/v4/yz/r/HoPS7xcIvaw.png")',
//                         WebkitMaskSize: "25px 2105px",
//                         WebkitMaskPosition: "0px -1730px",
//                         backgroundColor: "#606770",
//                         display: "inline-block",
//                         transition: "transform 0.2s ease",
//                         transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
//                     }}
//                 ></span>
//             </button>


//             {/* Dropdown Menu */}
//             {isOpen && (
//                 <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//                     {loading && (
//                         <li className="px-4 py-2 text-gray-500">Loading...</li>
//                     )}
//                     {!loading && catalogs.length === 0 && (
//                         <li className="px-4 py-2 text-gray-500">No catalogs available</li>
//                     )}
//                     {!loading &&
//                         catalogs.map((catalog) => (
//                             <li
//                                 key={catalog._id}
//                                 onClick={() => {
//                                     setSelectedCatalogs(catalog);
//                                     setIsOpen(false);
//                                 }}
//                                 className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${selectedCatalogs?._id === catalog._id ? "bg-blue-100" : ""
//                                     }`}
//                             >
//                                 {catalog.name}
//                             </li>
//                         ))}
//                 </ul>
//             )}
//         </div>
//     );
// }




import React, { useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import CusLoadMoreSelect from "../CustomPaginationSelect";

export default function CatalogSelector({ catalogs, selectedCatalogs, setSelectedCatalogs }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block w-64">
            {/* Button */}
            <div className=" z-10 mt-1 w-full">
                <CusLoadMoreSelect
                    options={catalogs}
                    labelKey="name"
                    valueKey="_id"
                    pageSize={10}
                    value={selectedCatalogs}
                    onChange={(val) => {
                        setSelectedCatalogs(val);
                        setIsOpen(false);
                    }}
                    placeholder="Select Catalogue"
                />
            </div>
        </div>
    );
}

