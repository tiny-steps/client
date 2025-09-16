import React from "react";
import { Check } from "lucide-react";

export const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = "",
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label
      className={`inline-flex items-center cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      } ${className}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
          w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center
          ${
            checked
              ? "bg-blue-600 border-blue-600"
              : "bg-white border-gray-300 hover:border-blue-400"
          }
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
      {label && (
        <span
          className={`ml-2 text-sm ${
            disabled ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      )}
    </label>
  );
};
