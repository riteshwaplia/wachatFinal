export const customSelectStyles = {
  // Base control (container)
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--color-bg, #F9FAFB)", // Fallback to gray-50
    color: "var(--color-text, #1A202C)", // Fallback to gray-900
    border: state.isFocused 
      ? "2px solid var(--color-primary-500, #2980B9)" 
      : "1px solid var(--color-gray-300, #D1D6DE)",
    borderRadius: "0.3rem", // Tailwind's 'xl'
    padding: "0.375rem", // Tailwind's 'p-1.5'
    boxShadow: state.isFocused 
      ? "0 0 0 3px rgba(41, 128, 185, 0.2)" // primary-500 with opacity
      : "none",
    "&:hover": {
      borderColor: state.isFocused 
        ? "var(--color-primary-600, #246D9B)" 
        : "var(--color-gray-400, #A6B0BD)",
    },
    minHeight: "42px", // Better touch target
  }),

  // Input field
  input: (base) => ({
    ...base,
    color: "var(--color-text, #1A202C)",
    caretColor: "var(--color-primary-500, #2980B9)",
  }),

  // Single selected value
  singleValue: (base) => ({
    ...base,
    color: "var(--color-text, #1A202C)",
    fontWeight: "500", // Medium weight for better readability
  }),

  // Multi-value container
  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--color-primary-100, #D1E6F5)",
    borderRadius: "0.375rem", // Tailwind's 'md'
  }),

  // Multi-value label
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-primary-800, #1A475F)",
    padding: "0.25rem 0.5rem",
    fontSize: "0.875rem", // text-sm
  }),

  // Multi-value remove button
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--color-primary-700, #1F5A7D)",
    borderRadius: "0 0.375rem 0.375rem 0",
    "&:hover": {
      backgroundColor: "var(--color-primary-200, #A4D0EB)",
      color: "var(--color-primary-900, #153441)",
    },
  }),

  // Dropdown menu
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem", // Tailwind's 'xl'
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", // Tailwind's 'lg'
    border: "1px solid var(--color-gray-200, #E5E8ED)",
    zIndex: 9999,
    marginTop: "0.5rem",
  }),

  // Menu options
  option: (base, state) => ({
    ...base,
    fontSize: "0.875rem", // text-sm
    padding: "0.75rem 1rem", // Larger click area
    backgroundColor: state.isSelected
      ? "var(--color-primary-500, #2980B9)"
      : state.isFocused
      ? "var(--color-primary-50, #E8F2FA)"
      : "white",
    color: state.isSelected 
      ? "white" 
      : "var(--color-text, #1A202C)",
    "&:active": {
      backgroundColor: "var(--color-primary-100, #D1E6F5)",
    },
  }),

  // Dropdown indicator (chevron)
  dropdownIndicator: (base, state) => ({
    ...base,
    color: "var(--color-gray-500, #7B8798)",
    transition: "transform 200ms ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null,
    "&:hover": {
      color: "var(--color-primary-500, #2980B9)",
    },
  }),

  // Clear indicator
  clearIndicator: (base) => ({
    ...base,
    color: "var(--color-gray-500, #7B8798)",
    "&:hover": {
      color: "var(--color-error, #DC3545)",
    },
  }),

  // Placeholder text
  placeholder: (base) => ({
    ...base,
    color: "var(--color-gray-400, #A6B0BD)",
    fontSize: "0.875rem", // text-sm
  }),

  // Loading indicator
  loadingIndicator: (base) => ({
    ...base,
    color: "var(--color-primary-500, #2980B9)",
  }),
};