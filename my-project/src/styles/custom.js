export const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--color-bg)",
    color: "var(--color-text)",
    border: state.isFocused ? "3px solid var(--color-primary)" : "",
    borderRadius: "8px",
    padding: "2px",
    boxShadow: "none",
    "&:hover": {
      border: state.isFocused
        ? "3px solid var(--color-primary)"
        : "1px solid #E3E2E4",
    },

  }),

  input: (base) => ({
    ...base,
    backgroundColor: "var(--color-bg)",
    color: "var(--color-text)", // or use any hex like "#000000"
  }),

  singleValue: (base) => ({
    ...base,
    backgroundColor: "var(--color-bg)",
    color: "var(--color-text)", // or "#000000"
  }),
  multiValue: (base) => ({
    ...base,
    color: "var(--color-text)",
    backgroundColor: "var(--color-bg)",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "var(--color-text)",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "#0f5132",
    ":hover": {
      backgroundColor: "var(--color-bg)",
      color: "#0f5132",
    },
  }),

  menu: (base) => ({
    ...base,
    zIndex: 9999,
    maxHeight: "300px",
    overflowY: "auto",
    scrollBehavior: "smooth",
    color: "var(--color-selectBox)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? ("var(--color-primary)") // 🌟 selected background color
      : state.isFocused
        ? "#dbeafe" // hover/focus background
        : "white",
    color: state.isSelected ? "white" : "black", // text color
    cursor: "pointer",
  }),

};