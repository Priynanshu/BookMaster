import { useEffect, useState } from "react"; // Added useState
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import {
  ArrowLeft, ExternalLink, Heart, Trash2,
  Tag, Calendar, Globe, BookOpen, Network
} from "lucide-react";
import {
  fetchItemById,
  fetchRelatedItems,
  updateItem,
  deleteItem,
  clearCurrentItem,
} from "../items/itemsSlice";

// ── Type Colors ───────────────────────────────────────
const TYPE_COLORS = {
  article: "#7C3AED",
  video: "#06B6D4",
  pdf: "#F59E0B",
  tweet: "#10B981",
  image: "#EC4899",
};

const ItemDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [newHighlight, setNewHighlight] = useState("");
  const [isAddingHighlight, setIsAddingHighlight] = useState(false);

  const { currentItem, relatedItems, isLoading } = useSelector(
    (state) => state.items
  );

  // ── Fetch Item + Related ──────────────────────────
  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
      dispatch(fetchRelatedItems(id));
    }
    // Cleanup on unmount or id change
    return () => {
      dispatch(clearCurrentItem());
    };
  }, [id, dispatch]);

  // ── Handlers ─────────────────────────────────────
  const handleFavourite = () => {
    if (!currentItem) return;
    dispatch(updateItem({
      id: currentItem._id,
      updates: { isFavourite: !currentItem.isFavourite },
    }));
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const result = await dispatch(deleteItem(currentItem._id));
      if (result.meta.requestStatus === 'fulfilled') {
        navigate("/dashboard");
      }
    }
  };

  const handleAddHighlight = async () => {
    if (!newHighlight.trim() || !currentItem) return;
    setIsAddingHighlight(true);

    await dispatch(updateItem({
      id: currentItem._id,
      updates: {
        highlights: [...(currentItem.highlights || []), newHighlight.trim()]
      }
    }));

    setNewHighlight("");
    setIsAddingHighlight(false);
  };

  const handleDeleteHighlight = async (highlightToDelete) => {
    if (!currentItem) return;
    await dispatch(updateItem({
      id: currentItem._id,
      updates: {
        highlights: currentItem.highlights.filter((h) => h !== highlightToDelete)
      }
    }));
  };

  // ── Loading Skeleton ──────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse p-4">
        <div className="h-8 bg-[#13131A] rounded-xl w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-[#13131A] rounded-2xl" />
            <div className="h-8 bg-[#13131A] rounded-xl w-3/4" />
            <div className="h-4 bg-[#13131A] rounded w-full" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-[#13131A] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── Not Found ─────────────────────────────────────
  if (!currentItem && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <BookOpen size={40} className="text-gray-600 mb-4" />
        <p className="text-gray-400">Item not found</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-[#7C3AED] text-sm hover:underline"
        >
          Go back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 
          hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left Panel (Content) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail */}
          {currentItem.thumbnail && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-80 bg-[#13131A] rounded-2xl overflow-hidden border border-[#1F1F2E]"
            >
              <img
                src={currentItem.thumbnail}
                alt={currentItem.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Title + Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <span
              className="px-3 py-1 rounded-full text-xs font-medium capitalize"
              style={{
                backgroundColor: `${TYPE_COLORS[currentItem.type] || '#7C3AED'}20`,
                color: TYPE_COLORS[currentItem.type] || '#7C3AED',
              }}
            >
              {currentItem.type}
            </span>

            <h1 className="text-3xl font-bold text-white leading-tight">
              {currentItem.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {currentItem.siteName && (
                <div className="flex items-center gap-1.5">
                  <Globe size={14} />
                  {currentItem.siteName}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(currentItem.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={currentItem.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]
                  text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={14} />
                Open Source
              </a>

              <button
                onClick={handleFavourite}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl
                  border text-sm font-medium transition-all
                  ${currentItem.isFavourite
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-[#1F1F2E] text-gray-400 hover:border-red-500/30 hover:text-red-400"
                  }`}
              >
                <Heart
                  size={14}
                  fill={currentItem.isFavourite ? "currentColor" : "none"}
                />
                {currentItem.isFavourite ? "Favourited" : "Favourite"}
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl
                  border border-[#1F1F2E] text-gray-400 text-sm
                  hover:border-red-500/30 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </motion.div>

          {/* AI Summary */}
          {currentItem.summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#7C3AED]/5 border border-[#7C3AED]/20 rounded-2xl p-6 space-y-3"
            >
              <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest">
                ✨ AI Insights & Summary
              </p>
              <p className="text-gray-300 text-base leading-relaxed">
                {currentItem.summary}
              </p>
            </motion.div>
          )}

          {/* Tags */}
          {currentItem.tags?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Tag size={12} /> Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {currentItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-medium
                      bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Highlights Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              💡 Highlights
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddHighlight()}
                placeholder="Add an important quote or note..."
                className="flex-1 bg-[#0A0A0F] border border-[#1F1F2E]
                  text-white placeholder-gray-600 rounded-xl px-4 py-2.5
                  text-xs focus:outline-none focus:border-amber-500/50 
                  transition-colors"
              />
              <button
                onClick={handleAddHighlight}
                disabled={isAddingHighlight || !newHighlight.trim()}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20
                  text-amber-400 text-xs font-bold
                  hover:bg-amber-500/30 disabled:opacity-50 
                  transition-all whitespace-nowrap"
              >
                {isAddingHighlight ? "Adding..." : "+ Add"}
              </button>
            </div>

            {currentItem.highlights?.length > 0 ? (
              <div className="space-y-2">
                <AnimatePresence>
                  {currentItem.highlights.map((highlight, idx) => (
                    <motion.div
                      key={`${highlight}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-start gap-3 px-4 py-3 rounded-xl
                        bg-amber-500/5 border border-amber-500/20 
                        border-l-2 border-l-amber-500 group"
                    >
                      <span className="text-amber-500/60 text-lg leading-none flex-shrink-0">
                        "
                      </span>
                      <p className="text-gray-300 text-sm flex-1 leading-relaxed">
                        {highlight}
                      </p>
                      <button
                        onClick={() => handleDeleteHighlight(highlight)}
                        className="text-gray-600 hover:text-red-400
                          opacity-0 group-hover:opacity-100 
                          transition-all flex-shrink-0 mt-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center 
                py-8 rounded-2xl border border-dashed border-[#1F1F2E]">
                <p className="text-2xl mb-2">💡</p>
                <p className="text-gray-500 text-xs text-center">
                  No highlights yet
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Right Panel (Related & Info) ── */}
        <div className="space-y-6">
          {/* Memory Banner */}
          <div className="bg-[#06B6D4]/5 border border-[#06B6D4]/20 rounded-2xl p-5">
            <p className="text-[#06B6D4] text-xs font-bold mb-1 flex items-center gap-2">
              🧠 Memory Resurface
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              You discovered this knowledge{" "}
              <span className="text-white font-medium">
                {Math.floor((Date.now() - new Date(currentItem.createdAt)) / (1000 * 60 * 60 * 24))}
              </span>{" "}
              days ago.
            </p>
          </div>

          {/* Related Items */}
          <div className="bg-[#13131A] border border-[#1F1F2E] rounded-2xl p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Network size={12} /> Related Knowledge
            </p>
            {relatedItems && relatedItems.length > 0 ? (
              <div className="space-y-4">
                {relatedItems.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/items/${item._id}`)}
                    className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-[#1F1F2E] transition-all"
                  >
                    <div className="w-12 h-10 bg-[#0A0A0F] rounded-lg overflow-hidden flex-shrink-0 border border-[#1F1F2E]">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                          <BookOpen size={14} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-xs font-medium line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-tighter mt-0.5">
                        {item.siteName || item.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-xs text-center py-4">
                No connections found yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;