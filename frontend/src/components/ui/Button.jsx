import React from 'react';

/**
 * Reusable Button component with multiple variants and sizes.
 * Variants: primary (gradient), secondary (outlined), ghost (transparent)
 * Sizes: sm, md, lg
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-lg";
  
  // Variant styles
  const variants = {
    primary: "bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-lg shadow-purple-900/20 hover:brightness-110",
    secondary: "border border-[#1F1F2E] bg-transparent text-white hover:bg-[#1F1F2E]",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-[#13131A]"
  };
  
  // Size styles
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };
  
  const widthStyle = fullWidth ? "w-full" : "";
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
