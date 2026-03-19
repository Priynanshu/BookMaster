import React from 'react';
import { Star, Clock, BookOpen } from 'lucide-react';
import Badge from '../ui/Badge';
import TagBadge from './TagBadge';

/**
 * Card component for displaying book information.
 * Features: cover image, title, author, rating, status, and tags.
 */
const ItemCard = ({ 
  title, 
  author, 
  cover, 
  rating, 
  status, 
  tags = [], 
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        group relative bg-[#13131A] border border-[#1F1F2E] rounded-2xl 
        overflow-hidden hover:border-[#7C3AED]/50 transition-all duration-300 
        cursor-pointer hover:shadow-2xl hover:shadow-purple-900/10
      `}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={cover || "https://picsum.photos/seed/book/400/600"} 
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-60" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={status === 'Reading' ? 'info' : status === 'Completed' ? 'success' : 'default'}>
            {status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1 text-amber-500 mb-1">
          <Star size={12} fill="currentColor" />
          <span className="text-xs font-bold">{rating}</span>
        </div>
        
        <h3 className="text-sm font-bold text-white truncate group-hover:text-[#7C3AED] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mb-3">{author}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 2).map((tag, idx) => (
            <TagBadge key={idx} label={tag} />
          ))}
          {tags.length > 2 && (
            <span className="text-[10px] text-gray-500 font-medium">
              +{tags.length - 2} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
