import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

/**
 * Reusable Modal component with backdrop and animations.
 * Props: isOpen, onClose, title, children
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-md' 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`
              relative w-full ${maxWidth} bg-[#13131A] border border-[#1F1F2E] 
              rounded-2xl shadow-2xl overflow-hidden
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1F1F2E]">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button 
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
