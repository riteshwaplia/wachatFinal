import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BiShowAlt } from "react-icons/bi";
import { GrFormViewHide } from "react-icons/gr";
 
const InputField = ({
  disable,
  label,
  id,
  children,
  type = 'text',
  placeholder,
  value,
  onChange,
  error = false,
  helperText,
  className = '',
  ...props
  
}) => {
  const [showPassword, setShowPassword] = useState(false);
 
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
 
  const inputBaseStyles =
  'block w-full px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:outline-none transition-all duration-200 ease-in-out';
  const labelStyles = 'block text-gray-700 text-sm font-medium mb-1';
  const errorTextStyles = 'text-error text-xs mt-1';
  const helperTextStyles = 'text-gray-500 text-xs mt-1';
 
  const inputStateStyles = error
    ? 'border-error focus:ring-1 focus:ring-error focus:border-error'
    : 'border-gray-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-100';
 
  const showPasswordToggle = type === 'password';
 
  return (
    <div className={`relative mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className={labelStyles}>
          {label}
        </label>
      )}
 
      {showPasswordToggle && (
        <div
          onClick={togglePassword}
          className="absolute right-3 top-1/2 transform  cursor-pointer text-gray-500"
        >
          {showPassword ? <BiShowAlt size={20} /> : <GrFormViewHide size={20} />}
        </div>
      )}
     <div
        
          className="absolute left-1 ml-1 pr-1 top-9 transform  cursor-pointer text-gray-500"
        >
      {children}
        </div>
      <input
        disabled={disable}
        id={id}
        type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${inputBaseStyles} ${children?"pl-8 ":""} ${inputStateStyles} ${showPasswordToggle ? 'pr-10' : ''}`}
        {...props}
      />
 
      {error && helperText && <p className={errorTextStyles}>{helperText}</p>}
      {!error && helperText && <p className={helperTextStyles}>{helperText}</p>}
    </div>
  );
};
 
InputField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  className: PropTypes.string,
};
 
export default InputField;
 
 