import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";

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
    const [isDark, setDark] = useState(false)
    // Convert options to react-select format
    const formattedOptions = options.map((opt) => ({
        label: opt[labelKey],
        value: opt[valueKey],
    }));
    console.log("options>>", formattedOptions)
    const theme = localStorage.getItem('theme');

    useEffect(() => {
        if (theme === 'dark') {
            setDark(true)
        }
    }, [theme])

    // Slice options based on page
    useEffect(() => {
        setDisplayOptions(formattedOptions.slice(0, page * pageSize));
    }, [options, page]);

    // Custom MenuList with "Load More"
    const MenuList = (props) => {
        const { children } = props;
        const hasMore = displayOptions.length < formattedOptions.length;

        return (
            <components.MenuList {...props}>
                {children}
                {hasMore && (
                    <div
                        className="text-primary-800 dark:text-dark-text-primary bg-primary-50 dark:bg-dark-bg-primary text-center py-2 cursor-pointer "
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Load More
                    </div>
                )}
            </components.MenuList>
        );
    };


    // 🎨 Dynamic Styles for Dark & Light
    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: isDark ? "#0D1117" : "#FFFFFF",
            borderColor: state.isFocused
                ? isDark
                    ? "#A4D0EB"
                    : "#3B82F6"
                : isDark
                    ? "#30363D"
                    : "#D1D5DB",
            boxShadow: state.isFocused
                ? isDark
                    ? "0 0 0 1px #A4D0EB"
                    : "0 0 0 1px #3B82F6"
                : "none",
            "&:hover": {
                borderColor: isDark ? "#A4D0EB" : "#3B82F6",
            },
            minHeight: 40,
            borderRadius: 6,
            fontSize: 14,
            color: isDark ? "#C9D1D9" : "#111827",
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDark ? "#0D1117" : "#FFFFFF",
            borderRadius: 6,
            overflow: "hidden",
            zIndex: 50,
            border: isDark ? "1px solid #30363D" : "1px solid #E5E7EB",
        }),
        option: (base, state) => ({
            ...base,
            fontSize: 14,
            padding: "8px 12px",
            backgroundColor: state.isSelected
                ? isDark
                    ? "#A4D0EB"
                    : "#3B82F6"
                : state.isFocused
                    ? isDark
                        ? "rgba(164, 208, 235, 0.2)"
                        : "#EFF6FF"
                    : isDark
                        ? "#0D1117"
                        : "#FFFFFF",
            color: state.isSelected
                ? isDark
                    ? "#0D1117"
                    : "#FFFFFF"
                : isDark
                    ? "#C9D1D9"
                    : "#111827",
            cursor: "pointer",
        }),
        placeholder: (base) => ({
            ...base,
            color: isDark ? "#8B949E" : "#9CA3AF",
        }),
        singleValue: (base) => ({
            ...base,
            color: isDark ? "#C9D1D9" : "#111827",
        }),
        input: (base) => ({
            ...base,
            color: isDark ? "#C9D1D9" : "#111827",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: isDark ? "#C9D1D9" : "#6B7280",
            "&:hover": { color: isDark ? "#A4D0EB" : "#3B82F6" },
        }),
        clearIndicator: (base) => ({
            ...base,
            color: isDark ? "#C9D1D9" : "#6B7280",
            "&:hover": { color: isDark ? "#A4D0EB" : "#EF4444" },
        }),
    };





    return (
        <Select
            options={displayOptions}
            value={value.label}
            onChange={onChange}
            placeholder={placeholder}
            isClearable
            isSearchable
            components={{ MenuList }}
            styles={customStyles}
        />
    );
};

export default CusLoadMoreSelect;
