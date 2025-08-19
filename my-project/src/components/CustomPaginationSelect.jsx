// import React, { useState, useEffect } from "react";
// import Select, { components } from "react-select";

// const CusLoadMoreSelect = ({
//     options = [],
//     labelKey = "name",
//     valueKey = "id",
//     pageSize = 10,
//     value,
//     onChange,
//     placeholder = "Please Select",


// }) => {
//     const [page, setPage] = useState(1);
//     const [displayOptions, setDisplayOptions] = useState([]);
//     const [isDark, setDark] = useState(false)
//     // Convert options to react-select format
//     const formattedOptions = options.map((opt) => ({
//         label: opt[labelKey],
//         value: opt[valueKey],
//     }));
//     console.log("options>>", formattedOptions)
//     const theme = localStorage.getItem('theme');

//     useEffect(() => {
//         if (theme === 'dark') {
//             setDark(true)
//         }
//     }, [theme])

//     // Slice options based on page
//     useEffect(() => {
//         setDisplayOptions(formattedOptions.slice(0, page * pageSize));
//     }, [options, page]);

//     // Custom MenuList with "Load More"
//     const MenuList = (props) => {
//         const { children } = props;
//         const hasMore = displayOptions.length < formattedOptions.length;

//         return (
//             <components.MenuList {...props}>
//                 {children}
//                 {hasMore && (
//                     <div
//                         className="text-primary-800 dark:text-dark-text-primary bg-primary-50 dark:bg-dark-bg-primary text-center py-2 cursor-pointer "
//                         onClick={() => setPage((prev) => prev + 1)}
//                     >
//                         Load More
//                     </div>
//                 )}
//             </components.MenuList>
//         );
//     };


//     // 🎨 Dynamic Styles for Dark & Light
//     const customStyles = {
//         control: (base, state) => ({
//             ...base,
//             backgroundColor: isDark ? "#0D1117" : "#FFFFFF",
//             borderColor: state.isFocused
//                 ? isDark
//                     ? "#A4D0EB"
//                     : "#3B82F6"
//                 : isDark
//                     ? "#30363D"
//                     : "#D1D5DB",
//             boxShadow: state.isFocused
//                 ? isDark
//                     ? "0 0 0 1px #A4D0EB"
//                     : "0 0 0 1px #3B82F6"
//                 : "none",
//             "&:hover": {
//                 borderColor: isDark ? "#A4D0EB" : "#3B82F6",
//             },
//             minHeight: 40,
//             borderRadius: 6,
//             fontSize: 14,
//             color: isDark ? "#C9D1D9" : "#111827",
//         }),
//         menu: (base) => ({
//             ...base,
//             backgroundColor: isDark ? "#0D1117" : "#FFFFFF",
//             borderRadius: 6,
//             overflow: "hidden",
//             zIndex: 50,
//             border: isDark ? "1px solid #30363D" : "1px solid #E5E7EB",
//         }),
//         option: (base, state) => ({
//             ...base,
//             fontSize: 14,
//             padding: "8px 12px",
//             backgroundColor: state.isSelected
//                 ? isDark
//                     ? "#A4D0EB"
//                     : "#3B82F6"
//                 : state.isFocused
//                     ? isDark
//                         ? "rgba(164, 208, 235, 0.2)"
//                         : "#EFF6FF"
//                     : isDark
//                         ? "#0D1117"
//                         : "#FFFFFF",
//             color: state.isSelected
//                 ? isDark
//                     ? "#0D1117"
//                     : "#FFFFFF"
//                 : isDark
//                     ? "#C9D1D9"
//                     : "#111827",
//             cursor: "pointer",
//         }),
//         placeholder: (base) => ({
//             ...base,
//             color: isDark ? "#8B949E" : "#9CA3AF",
//         }),
//         singleValue: (base) => ({
//             ...base,
//             color: isDark ? "#C9D1D9" : "#111827",
//         }),
//         input: (base) => ({
//             ...base,
//             color: isDark ? "#C9D1D9" : "#111827",
//         }),
//         dropdownIndicator: (base) => ({
//             ...base,
//             color: isDark ? "#C9D1D9" : "#6B7280",
//             "&:hover": { color: isDark ? "#A4D0EB" : "#3B82F6" },
//         }),
//         clearIndicator: (base) => ({
//             ...base,
//             color: isDark ? "#C9D1D9" : "#6B7280",
//             "&:hover": { color: isDark ? "#A4D0EB" : "#EF4444" },
//         }),
//     };





//     return (
//         <Select
//             options={displayOptions}
//             value={value.label}
//             onChange={onChange}
//             placeholder={placeholder}
//             isClearable
//             isSearchable
//             components={{ MenuList }}
//             styles={customStyles}
//         />
//     );
// };

// export default CusLoadMoreSelect;



import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { HiViewGrid } from "react-icons/hi";

const CusLoadMoreSelect = ({
    options = [],
    labelKey = "name",
    valueKey = "id",
    pageSize = 10,
    value,
    onChange,
    placeholder = "Please Select",
}) => {
    const [page, setPage] = useState(1);
    const [displayOptions, setDisplayOptions] = useState([]);
    const [isDark, setDark] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const formattedOptions = options.map((opt) => ({
        label: opt[labelKey],
        value: opt[valueKey],
    }));

    const theme = localStorage.getItem("theme");

    useEffect(() => {
        if (theme === "dark") {
            setDark(true);
        }
    }, [theme]);

    useEffect(() => {
        setDisplayOptions(formattedOptions.slice(0, page * pageSize));
    }, [options, page]);

    const MenuList = (props) => {
        const { children } = props;
        const hasMore = displayOptions.length < formattedOptions.length;
        return (
            <components.MenuList {...props}>
                {children}
                {hasMore && (
                    <div
                        className="text-primary-800 dark:text-dark-text-primary bg-primary-50 dark:bg-dark-bg-primary text-center py-2 cursor-pointer"
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Load More
                    </div>
                )}
            </components.MenuList>
        );
    };

    const customStyles = {
        control: (base, state) => ({
            ...base,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: isDark ? "#0D1117" : "#FFFFFF",
            border: "1px solid",
            borderColor: state.isFocused
                ? isDark
                    ? "#A4D0EB"
                    : "#3B82F6"
                : isDark
                    ? "#30363D"
                    : "#D1D5DB",
            borderRadius: "0.5rem",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
            minHeight: "44px",
            boxShadow: state.isFocused
                ? isDark
                    ? "0 0 0 1px #A4D0EB"
                    : "0 0 0 1px #3B82F6"
                : "none",
            cursor: "pointer",
            "&:hover": {
                borderColor: isDark ? "#A4D0EB" : "#3B82F6",
            },
        }),
        singleValue: (base) => ({
            ...base,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: isDark ? "#C9D1D9" : "#111827",
            fontWeight: 500,
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            padding: 0,
            color: "transparent", // hide default arrow
            ":before": {
                content: '""',
                display: "inline-block",
                width: "16px",
                height: "16px",
                backgroundColor: "#606770",
                maskImage:
                    'url("https://static.xx.fbcdn.net/rsrc.php/v4/yz/r/HoPS7xcIvaw.png")',
                maskSize: "25px 2105px",
                maskPosition: "0px -1730px",
                WebkitMaskImage:
                    'url("https://static.xx.fbcdn.net/rsrc.php/v4/yz/r/HoPS7xcIvaw.png")',
                WebkitMaskSize: "25px 2105px",
                WebkitMaskPosition: "0px -1730px",
                transition: "transform 0.2s ease",
                transform: state.selectProps.menuIsOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: isDark ? "#8B949E" : "#9CA3AF",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 500,
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDark ? "#0D1117" : "#FFFFFF",
            borderRadius: 6,
            overflow: "hidden",
            zIndex: 50,
            border: isDark ? "1px solid #30363D" : "1px solid #E5E7EB",
        }),
    };

    return (


        <Select
            options={displayOptions}
            value={value}
            onChange={onChange}
            placeholder={
                <div className="flex items-center gap-2">
                    {/* <div className="bg-gray-100 p-1 rounded-full">
                        <HiViewGrid className="h-5 w-5 text-gray-600" />
                    </div> */}
                    <span>{placeholder}</span>
                </div>
            }
            isClearable
            isSearchable
            components={{ MenuList }}
            styles={customStyles}
            onMenuOpen={() => setIsOpen(true)}
            onMenuClose={() => setIsOpen(false)}
        />
    );
};

export default CusLoadMoreSelect;
