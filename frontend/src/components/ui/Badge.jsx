import React from 'react';

/**
 * Reusable Badge component for status indicators and tags.
 * Variants: default, success, warning, error, info
 */
const Badge = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center";
  
  const variants = {
    default: "bg-[#1F1F2E] text-gray-400 border border-[#2D2D3F]",
    success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    error: "bg-red-500/10 text-red-500 border border-red-500/20",
    info: "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20",
    primary: "bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20"
  };

  return (
    <span 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
