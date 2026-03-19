import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Hash, 
  MoreVertical, 
  Share2, 
  Plus, 
  Library 
} from 'lucide-react';
import ItemCard from '../../components/common/ItemCard';

/**
 * CollectionDetail Component
 * Shows details of a specific collection and its items.
 */
const CollectionDetail = ({ collection, onBack }) => {
  // Agar prop se collection nahi aaya toh dummy handle karein
  const currentCollection = collection || {
    title: "Productivity Gems",
    description: "A curated list of articles, videos, and books to master deep work and habits.",
    itemCount: 12,
    createdAt: "March 2026",
    tags: ["Productivity", "Self-help", "Deep Work"],
    items: [
      { id: 2, title: 'Atomic Habits', author: 'James Clear', rating: 4.9, status: 'Completed', tags: ['self-help', 'productivity'], cover: 'https://picsum.photos/seed/habits/400/600' },
      { id: 5, title: 'Deep Work', author: 'Cal Newport', rating: 4.5, status: 'To Read', tags: ['productivity', 'focus'], cover: 'https://picsum.photos/seed/deep/400/600' },
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-lg bg-[#13131A] border border-[#1F1F2E] group-hover:border-[#7C3AED]">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-medium">Back to Collections</span>
        </button>

        <div className="flex gap-3">
          <button className="p-2.5 rounded-xl bg-[#13131A] border border-[#1F1F2E] text-gray-400 hover:text-white transition-colors">
            <Share2 size={18} />
          </button>
          <button className="p-2.5 rounded-xl bg-[#13131A] border border-[#1F1F2E] text-gray-400 hover:text-white transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#13131A] to-[#0A0A0F] border border-[#1F1F2E] overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#7C3AED] opacity-10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#7C3AED]/10 rounded-2xl text-[#7C3AED]">
                <Library size={28} />
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                {currentCollection.title}
              </h1>
            </div>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              {currentCollection.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-[#1F1F2E]/50 px-3 py-1.5 rounded-full">
                <Calendar size={14} />
                Created {currentCollection.createdAt}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-[#1F1F2E]/50 px-3 py-1.5 rounded-full">
                <Hash size={14} />
                {currentCollection.itemCount} Items
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#7C3AED]/20 transition-all active:scale-95">
            <Plus size={20} />
            Add New Item
          </button>
        </div>
      </div>

      {/* Filter/Tabs Section */}
      <div className="flex border-b border-[#1F1F2E]">
        <button className="px-6 py-4 text-sm font-bold text-white border-b-2 border-[#7C3AED]">
          All Items
        </button>
        <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-white transition-colors">
          Recently Added
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentCollection.items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <ItemCard {...item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CollectionDetail;