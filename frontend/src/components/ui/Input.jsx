import React from 'react';

/**
 * Reusable Input component with label and error support.
 * Styled for dark theme with consistent border and focus states.
 */
const Input = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 bg-[#13131A] border rounded-lg text-white text-sm
          placeholder:text-gray-600 outline-none transition-all duration-200
          ${error ? 'border-red-500/50 focus:border-red-500' : 'border-[#1F1F2E] focus:border-[#7C3AED]'}
          focus:ring-2 focus:ring-[#7C3AED]/20
        `}
        {...props}
      />
      {error && (
        <span className="text-[10px] text-red-500 font-medium mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
