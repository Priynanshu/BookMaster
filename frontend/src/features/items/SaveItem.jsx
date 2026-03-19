import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, X, Plus, Sparkles, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';

const SaveItem = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Simulate AI extraction logic
    setTimeout(() => {
      setLoading(false);
      setUrl('');
      onClose();
    }, 2000);
  };

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
            className="relative w-full max-w-xl bg-[#0A0A0F] border border-[#1F1F2E] rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#7C3AED] rounded-xl text-white">
                  <Plus size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Save New Item</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Paste URL (Article, Video, PDF...)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#7C3AED] transition-colors">
                    <Link2 size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/useful-article"
                    className="w-full bg-[#13131A] border border-[#1F1F2E] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#7C3AED]/5 border border-[#7C3AED]/20 rounded-2xl">
                <div className="flex items-center gap-2 text-[#7C3AED] mb-1 text-sm font-bold">
                  <Sparkles size={16} />
                  <span>AI Magic Enabled</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  System will automatically extract title, summary, and suggest relevant tags from this link.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button 
                  variant="primary" 
                  className="flex-[2] py-4 rounded-2xl font-bold shadow-lg shadow-[#7C3AED]/20"
                  onClick={handleSave}
                  disabled={!url || loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </div>
                  ) : "Save & Organize"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SaveItem;