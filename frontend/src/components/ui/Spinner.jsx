import React from 'react';

/**
 * Reusable Spinner component for loading states.
 * Sizes: sm, md, lg
 */
const Spinner = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };

  return (
    <div 
      className={`
        ${sizes[size]} 
        border-[#1F1F2E] 
        border-t-[#7C3AED] 
        rounded-full 
        animate-spin 
        ${className}
      `}
    />
  );
};

export default Spinner;
