import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable SearchBar component with icon and clear button.
 * Styled for the dark theme.
 */
const SearchBar = ({ 
  value, 
  onChange, 
  onClear, 
  placeholder = "Search books, authors, tags...", 
  className = "" 
}) => {
  return (
    <div className={`relative w-full group ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7C3AED] transition-colors">
        <Search size={18} />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full pl-12 pr-12 py-3 bg-[#13131A] border border-[#1F1F2E] 
          rounded-xl text-white text-sm placeholder:text-gray-600 
          outline-none transition-all duration-200 
          focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10
        `}
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
