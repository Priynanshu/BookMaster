import { motion } from "framer-motion";
import { BookOpen, ExternalLink, Heart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ItemCard = ({ item, handleFavourite, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(`/items/${item._id}`)}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-[#13131A] border border-[#1F1F2E] rounded-2xl overflow-hidden group hover:border-[#7C3AED] transition-all duration-300 cursor-pointer h-full flex flex-col"
    >
      {/* Thumbnail Section */}
      <div className="relative h-44 bg-[#0A0A0F] flex-shrink-0">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            {item.type === "pdf" ? <span className="text-4xl">📄</span> : <BookOpen size={40} />}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-tighter">
            {item.type}
          </span>
        </div>

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-[10px] font-bold text-[#7C3AED] uppercase mb-1">
          {item.siteName || "Web Content"}
        </p>
        <h3 className="text-white font-bold text-sm line-clamp-2 mb-2 group-hover:text-[#7C3AED] transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
          {item.summary || item.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4 mt-auto">
          {item.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-[#7C3AED]/10 text-[#7C3AED]">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#1F1F2E]">
          <span className="text-[10px] text-gray-600 font-medium">
            {new Date(item.createdAt).toDateString()}
          </span>
          <div className="flex gap-1">
            <button
              onClick={(e) => handleFavourite(e, item)}
              className={`p-2 rounded-lg transition-colors ${
                item.isFavourite ? "text-red-500 bg-red-500/10" : "text-gray-600 hover:bg-[#1F1F2E]"
              }`}
            >
              <Heart size={16} fill={item.isFavourite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => handleDelete(e, item._id)}
              className="p-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;