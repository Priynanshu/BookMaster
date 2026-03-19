import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Sparkles, Clock } from 'lucide-react';
import ItemCard from '../../components/common/ItemCard';

const ItemFeed = () => {
  const [viewType, setViewType] = useState('grid');

  // Mix of different content types for BookMaster
  const feedItems = [
    { id: 1, type: 'article', title: 'The Future of AI in Web Dev', author: 'Medium', tags: ['tech', 'ai'], cover: 'https://picsum.photos/seed/tech/400/300' },
    { id: 2, type: 'video', title: 'Clean Code in React 2026', author: 'YouTube', tags: ['coding', 'react'], cover: 'https://picsum.photos/seed/code/400/300' },
    { id: 3, type: 'book', title: 'Atomic Habits', author: 'James Clear', tags: ['habits', 'growth'], cover: 'https://picsum.photos/seed/habits/400/600' },
    { id: 4, type: 'tweet', title: 'Thread on Redis Caching', author: 'Twitter', tags: ['backend', 'redis'], cover: 'https://picsum.photos/seed/tweet/400/300' },
  ];

  return (
    <div className="space-y-8">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#7C3AED]/10 rounded-2xl text-[#7C3AED]">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Your Feed</h2>
            <p className="text-gray-500 text-sm">Organized by your system's intelligence.</p>
          </div>
        </div>

        <div className="flex bg-[#13131A] border border-[#1F1F2E] p-1 rounded-xl">
          <button 
            onClick={() => setViewType('grid')}
            className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-[#1F1F2E] text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setViewType('list')}
            className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-[#1F1F2E] text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Dynamic Feed Grid */}
      <div className={`grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
        {feedItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ItemCard {...item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ItemFeed;