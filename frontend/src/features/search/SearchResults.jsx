// src/pages/SearchPage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Tag, X, BookOpen, Sparkles } from "lucide-react";
import {
  semanticSearch,
  searchByTag,
  fetchAllTags,
  clearResults,
} from "../../features/search/searchSlice";
import useDebounce from "../../hooks/useDebounce";

const SearchResults = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  // ── Redux State ───────────────────────────────────
  const { results, allTags, isLoading, error, lastQuery } = useSelector(
    (state) => state.search
  );

  // ── Debounce — 600ms wait karo ────────────────────
  const debouncedQuery = useDebounce(query, 600);

  // ── Fetch All Tags on Mount ───────────────────────
  useEffect(() => {
    dispatch(fetchAllTags());
    return () => dispatch(clearResults());
  }, [dispatch]);

  // ── Semantic Search — debounced query pe ─────────
  useEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      setActiveTag(null); // tag filter clear karo
      dispatch(semanticSearch(debouncedQuery));
    } else if (debouncedQuery.trim() === "") {
      dispatch(clearResults());
    }
  }, [debouncedQuery, dispatch]);

  // ── Tag Click ─────────────────────────────────────
  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      // Same tag click → clear
      setActiveTag(null);
      dispatch(clearResults());
      return;
    }
    setActiveTag(tag);
    setQuery(""); // search input clear karo
    dispatch(searchByTag(tag));
  };

  // ── Clear All ─────────────────────────────────────
  const handleClear = () => {
    setQuery("");
    setActiveTag(null);
    dispatch(clearResults());
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Search</h1>
        <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
          <Sparkles size={14} className="text-[#7C3AED]" />
          AI-powered semantic search
        </p>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "react hooks tutorial" or "machine learning"...'
          className="w-full bg-[#13131A] border border-[#1F1F2E] 
            text-white placeholder-gray-600 rounded-2xl 
            pl-11 pr-12 py-4 text-sm
            focus:outline-none focus:border-[#7C3AED] 
            focus:ring-1 focus:ring-[#7C3AED]/30
            transition-all"
        />
        {/* Clear button */}
        {(query || activeTag) && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 
              text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Tags ── */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Tag size={12} />
            Browse by Tag
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium 
                  transition-all
                  ${activeTag === tag
                    ? "bg-[#7C3AED] text-white"
                    : "bg-[#13131A] border border-[#1F1F2E] text-gray-400 hover:border-[#7C3AED] hover:text-white"
                  }`}
              >
                #{tag}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      <div className="space-y-4">

        {/* Results Header */}
        {lastQuery && !isLoading && (
          <p className="text-sm text-gray-500">
            {results.length} results for{" "}
            <span className="text-white font-medium">"{lastQuery}"</span>
          </p>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#13131A] border border-[#1F1F2E] 
                  rounded-2xl p-4 flex gap-4 animate-pulse"
              >
                <div className="w-20 h-16 bg-[#1F1F2E] rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#1F1F2E] rounded w-3/4" />
                  <div className="h-3 bg-[#1F1F2E] rounded w-full" />
                  <div className="h-3 bg-[#1F1F2E] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 
            border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Results List */}
        <AnimatePresence>
          {!isLoading && results.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#13131A] border border-[#1F1F2E] rounded-2xl 
                p-4 flex gap-4 hover:border-[#7C3AED]/50 
                transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="w-24 h-16 bg-[#1F1F2E] rounded-xl 
                flex-shrink-0 overflow-hidden">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={20} className="text-gray-600" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Site + Type */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{item.siteName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] 
                    bg-[#7C3AED]/10 text-[#7C3AED] capitalize">
                    {item.type}
                  </span>
                  {/* Similarity Score */}
                  {item.score && (
                    <span className="ml-auto text-xs text-gray-500">
                      {Math.round(item.score * 100)}% match
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-white 
                  line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-gray-400 line-clamp-1">
                  {item.summary || item.description}
                </p>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap">
                  {item.tags?.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] 
                        bg-[#1F1F2E] text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State — searched but no results */}
        {!isLoading && lastQuery && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-[#13131A] rounded-2xl 
              flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No results found</p>
            <p className="text-gray-600 text-sm mt-1">
              Try different keywords or browse by tags
            </p>
          </div>
        )}

        {/* Initial State — nothing searched yet */}
        {!isLoading && !lastQuery && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-[#13131A] rounded-2xl 
              flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-[#7C3AED]" />
            </div>
            <p className="text-gray-400 font-medium">
              Start typing to search
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Semantic search finds related content even with different words
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;