import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export const MobileNumber = ({
  value,
  onChange,
  disabled = false,
  label,
  error,
  autoattribute,
  country,
  className = "",
  isDarkMode
}) => {
  return (
    <div className={`w-full ${className} ${isDarkMode ? "" : ""}}`}>
      {label && (
        <label className="block text-sm font-medium text-text mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <PhoneInput
          country={country}
          countryCodeEditable={false}
          className="dark:text-dark-text-primary dark:bg-dark-surface"
          value={value}
          onChange={(phone, countryData) => {
            onChange(phone, countryData);
          }}
          disableCountryCode={false}
          autoFormat={true}
          disabled={disabled}
          inputProps={{autoFocus:autoattribute}}
          inputStyle={{
            width: "100%",
            height: "44px",
            paddingLeft: "48px",
            fontSize: "16px",
            backgroundColor: "var(--colorbg-input)",
            color: "var(--color-text)",
            // borderColor: error ? "var(--color-error)" : "var(--color-border)",
            borderRadius: "8px",
            transition: "border-color 0.2s",
          }}
          // buttonStyle={{
          //   backgroundColor: "var(--colorbg-input)",
          //   borderColor: error ? "var(--color-error)" : "var(--color-border)",
          //   borderRight: "none",
          //   borderTopLeftRadius: "8px",
          //   borderBottomLeftRadius: "8px",
          // }}
          // dropdownStyle={{
          //   backgroundColor: "var(--colorbg-input)",
          //   color: "var(--color-text)",
          //   borderColor: "var(--colorbg-input)",
          // }}
          // enableSearch
          // searchStyle={{
          //   backgroundColor: "var(--colorbg-input)",
          //   color: "var(--color-text)",
          //   borderColor: "var(--color-border)",
          // }}
          // containerStyle={{
          //   fontFamily: "inherit",
          // }}
        />

        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    </div>
  );
};