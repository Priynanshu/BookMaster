import React from 'react';
import { Hash } from 'lucide-react';

/**
 * Specialized badge for book tags.
 * Displays a hash icon and the tag name.
 */
const TagBadge = ({ 
  label, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold 
        bg-[#1F1F2E] text-gray-400 border border-[#2D2D3F] hover:text-[#06B6D4] 
        hover:border-[#06B6D4]/30 transition-all duration-200 ${className}
      `}
    >
      <Hash size={10} className="opacity-60" />
      {label}
    </button>
  );
};

export default TagBadge;
