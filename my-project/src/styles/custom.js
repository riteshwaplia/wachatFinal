// export const customSelectStyles = {
//   // Base control (container)
//   control: (base, state) => ({
//     ...base,
//     backgroundColor: "var(--color-bg, #F9FAFB)", // Fallback to gray-50
//     color: "var(--color-text, #1A202C)", // Fallback to gray-900
//     border: state.isFocused 
//       ? "2px solid var(--color-primary-500, #2980B9)" 
//       : "1px solid var(--color-gray-300, #D1D6DE)",
//     borderRadius: "0.3rem", // Tailwind's 'xl'
//     padding: "0", // Tailwind's 'p-1.5'
//     boxShadow: state.isFocused 
//       ? "0 0 0 3px rgba(41, 128, 185, 0.2)" // primary-500 with opacity
//       : "none",
//     "&:hover": {
//       borderColor: state.isFocused 
//         ? "var(--color-primary-600, #246D9B)" 
//         : "var(--color-gray-400, #A6B0BD)",
//     },
//     minHeight: "22px", // Better touch target
//   }),

//   // Input field
//   input: (base) => ({
//     ...base,
//     color: "var(--color-text, #1A202C)",
//     caretColor: "var(--color-primary-500, #2980B9)",
//   }),

//   // Single selected value
//   singleValue: (base) => ({
//     ...base,
//     color: "var(--color-text, #1A202C)",
//     fontWeight: "500", // Medium weight for better readability
//   }),

//   // Multi-value container
//   multiValue: (base) => ({
//     ...base,
//     backgroundColor: "var(--color-primary-100, #D1E6F5)",
//     borderRadius: "0.375rem", // Tailwind's 'md'
//   }),

//   // Multi-value label
//   multiValueLabel: (base) => ({
//     ...base,
//     color: "var(--color-primary-800, #1A475F)",
//     padding: "",
//     fontSize: "0.875rem", // text-sm
//   }),

//   // Multi-value remove button
//   multiValueRemove: (base) => ({
//     ...base,
//     color: "var(--color-primary-700, #1F5A7D)",
//     borderRadius: "0 0.375rem 0.375rem 0",
//     "&:hover": {
//       backgroundColor: "var(--color-primary-200, #A4D0EB)",
//       color: "var(--color-primary-900, #153441)",
//     },
//   }),

//   // Dropdown menu
//   menu: (base) => ({
//     ...base,
//     borderRadius: "0.75rem", // Tailwind's 'xl'
//     boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", // Tailwind's 'lg'
//     border: "1px solid var(--color-gray-200, #E5E8ED)",
//     zIndex: 9999,
//     marginTop: "0.5rem",
//   }),

//   // Menu options
//   option: (base, state) => ({
//     ...base,
//     fontSize: "0.875rem", // text-sm
//     padding: "0.55rem 1rem", // Larger click area
//     backgroundColor: state.isSelected
//       ? "var(--color-primary-500, #2980B9)"
//       : state.isFocused
//       ? "var(--color-primary-50, #E8F2FA)"
//       : "white",
//     color: state.isSelected 
//       ? "white" 
//       : "var(--color-text, #1A202C)",
//     "&:active": {
//       backgroundColor: "var(--color-primary-100, #D1E6F5)",
//     },
//   }),

//   // Dropdown indicator (chevron)
//   dropdownIndicator: (base, state) => ({
//     ...base,
//     color: "var(--color-gray-500, #7B8798)",
//     transition: "transform 200ms ease",
//     transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null,
//     "&:hover": {
//       color: "var(--color-primary-500, #2980B9)",
//     },
//   }),

//   // Clear indicator
//   clearIndicator: (base) => ({
//     ...base,
//     color: "var(--color-gray-500, #7B8798)",
//     "&:hover": {
//       color: "var(--color-error, #DC3545)",
//     },
//   }),

//   // Placeholder text
//   placeholder: (base) => ({
//     ...base,
//     color: "var(--color-gray-400, #A6B0BD)",
//     fontSize: "0.875rem", // text-sm
//   }),

//   // Loading indicator
//   loadingIndicator: (base) => ({
//     ...base,
//     color: "var(--color-primary-500, #2980B9)",
//   }),
// };

// customSelectStyles.js

const isDarkMode = () => {
  if (typeof window !== "undefined") {
    return document.documentElement.classList.contains("dark");
  }
  return false;
};

export const customSelectStyles = {
  control: (base, state) => {
    const dark = isDarkMode();
    return {
      ...base,
      backgroundColor: dark ? "#21262D" : "#F9FAFB",
      color: dark ? "#C9D1D9" : "#1A202C",
      border: state.isFocused
        ? `2px solid #2980B9`
        : `1px solid ${dark ? "#30363D" : "#D1D6DE"}`,
      borderRadius: "0.3rem",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(41, 128, 185, 0.2)"
        : "none",
      minHeight: "22px",
      "&:hover": {
        borderColor: state.isFocused
          ? "#246D9B"
          : dark
          ? "#8B949E"
          : "#A6B0BD",
      },
    };
  },

  input: (base) => {
    const dark = isDarkMode();
    return {
      ...base,
      color: dark ? "#C9D1D9" : "#1A202C",
      caretColor: "#2980B9",
    };
  },

  singleValue: (base) => {
    const dark = isDarkMode();
    return {
      ...base,
      color: dark ? "#C9D1D9" : "#1A202C",
      fontWeight: "500",
    };
  },

  multiValue: (base) => {
    const dark = isDarkMode();
    return {
      ...base,
      backgroundColor: dark ? "#1F5A7D" : "#D1E6F5",
      borderRadius: "0.375rem",
    };
  },

  multiValueLabel: (base) => {
    const dark = isDarkMode();
    return {
      ...base,
      color: dark ? "#C9D1D9" : "#1A475F",
      fontSize: "0.875rem",
    };
  },

  multiValueRemove: (base) => {
    const dark = isDarkMode();
    return {
      ...base,
      color: dark ? "#C9D1D9" : "#1F5A7D",
      borderRadius: "0 0.375rem 0.375rem 0",
      "&:hover": {
        backgroundColor: dark ? "#30363D" : "#A4D0EB",
        color: dark ? "#C9D1D9" : "#153441",
      },
    };
  },

  menu: (base) => {
    const dark = isDarkMode();
    return {
      ...base,
      backgroundColor: dark ? "#21262D" : "#FFFFFF",
      borderRadius: "0.75rem",
      border: `1px solid ${dark ? "#30363D" : "#E5E8ED"}`,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
      marginTop: "0.5rem",
    };
  },

  option: (base, state) => {
    const dark = isDarkMode();
    return {
      ...base,
      fontSize: "0.875rem",
      padding: "0.55rem 1rem",
      backgroundColor: state.isSelected
        ? "#2980B9"
        : state.isFocused
        ? dark
          ? "#161B22"
          : "#E8F2FA"
        : dark
        ? "#21262D"
        : "#FFFFFF",
      color: state.isSelected
        ? "#FFFFFF"
        : dark
        ? "#C9D1D9"
        : "#1A202C",
      "&:active": {
        backgroundColor: dark ? "#1F5A7D" : "#D1E6F5",
      },
    };
  },

  dropdownIndicator: (base, state) => {
    const dark = isDarkMode();
    return {
      ...base,
      color: dark ? "#6E7681" : "#7B8798",
      transition: "transform 200ms ease",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null,
      "&:hover": {
        color: "#2980B9",
      },
    };
  },

  clearIndicator: (base) => {
    const dark = isDarkMode();
    return {
      ...base,
      color: dark ? "#6E7681" : "#7B8798",
      "&:hover": {
        color: "#DC3545",
      },
    };
  },

  placeholder: (base) => {
    const dark = isDarkMode();
    return {
      ...base,
      color: dark ? "#8B949E" : "#A6B0BD",
      fontSize: "0.875rem",
    };
  },

  loadingIndicator: (base) => {
    return {
      ...base,
      color: "#2980B9",
    };
  },
};
