// src/pages/CollectionPage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, Plus, Trash2, ArrowLeft,
  BookOpen, X
} from "lucide-react";
import {
  fetchCollections,
  fetchCollectionById,
  createCollection,
  deleteCollection,
  clearCurrentCollection,
} from "../collections/collectionsSlice";

// ── Emoji Options ─────────────────────────────────────
const EMOJIS = ["📁", "📚", "🎨", "⚙️", "🎯", "💡", "🔬", "🎵", "🏆", "🚀"];
const COLORS = ["#7C3AED", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

const CollectionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // /collections/:id

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "📁",
    color: "#7C3AED",
  });

  // ── Redux State ───────────────────────────────────
  const { collections, currentCollection, isLoading, isCreating, error } =
    useSelector((state) => state.collections);

  // ── Fetch on Mount ────────────────────────────────
  useEffect(() => {
    if (id) {
      // Single collection page
      dispatch(fetchCollectionById(id));
    } else {
      // All collections page
      dispatch(fetchCollections());
    }

    return () => dispatch(clearCurrentCollection());
  }, [id, dispatch]);

  // ── Create Collection ─────────────────────────────
  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    const result = await dispatch(createCollection(formData));
    if (createCollection.fulfilled.match(result)) {
      setFormData({ name: "", description: "", icon: "📁", color: "#7C3AED" });
      setShowCreateModal(false);
    }
  };

  // ── Delete Collection ─────────────────────────────
  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this collection?")) {
      dispatch(deleteCollection(id));
    }
  };

  // ── Single Collection View ────────────────────────
  if (id && currentCollection) {
    const { collection, items } = currentCollection;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/collections")}
          className="flex items-center gap-2 text-gray-400 
            hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          All Collections
        </button>

        {/* Collection Header */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center 
              justify-center text-2xl"
            style={{ backgroundColor: `${collection.color}20` }}
          >
            {collection.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-gray-500 text-sm mt-0.5">
                {collection.description}
              </p>
            )}
            <p className="text-xs text-gray-600 mt-1">
              {items?.length || 0} items
            </p>
          </div>
        </div>

        {/* Items Grid */}
        {items?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#13131A] border border-[#1F1F2E] rounded-2xl 
                  overflow-hidden hover:border-[#7C3AED]/50 transition-all cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="h-36 bg-[#1F1F2E] overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={24} className="text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <p className="text-xs text-gray-500">{item.siteName}</p>
                  <h3 className="text-sm font-semibold text-white line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] 
                          bg-[#7C3AED]/10 text-[#7C3AED]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-[#13131A] rounded-2xl flex items-center justify-center mb-4">
              <FolderOpen size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400">No items in this collection</p>
            <p className="text-gray-600 text-sm mt-1">
              Save items and assign them to this collection
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── All Collections View ──────────────────────────
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Collections</h1>
          <p className="text-gray-500 text-sm mt-1">
            Organize your saved items
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]
            text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Collection
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#13131A] border border-[#1F1F2E] 
                rounded-2xl p-6 h-36 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Collections Grid */}
      {!isLoading && collections.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col, idx) => (
            <motion.div
              key={col._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => navigate(`/collections/${col._id}`)}
              className="bg-[#13131A] border border-[#1F1F2E] rounded-2xl 
                p-6 cursor-pointer hover:border-[#7C3AED]/50 
                hover:scale-[1.02] transition-all duration-200 group relative"
              style={{ borderLeftColor: col.color, borderLeftWidth: "3px" }}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(e, col._id)}
                className="absolute top-4 right-4 p-1.5 rounded-lg
                  text-gray-600 hover:text-red-400 hover:bg-red-400/10
                  opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>

              {/* Icon + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center 
                    justify-center text-xl"
                  style={{ backgroundColor: `${col.color}20` }}
                >
                  {col.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{col.name}</h3>
                  {col.description && (
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                      {col.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Item Count */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {col.itemCount || 0} items
                </span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${col.color}20`,
                    color: col.color,
                  }}
                >
                  View →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && collections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-[#13131A] rounded-2xl flex items-center justify-center mb-4">
            <FolderOpen size={28} className="text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium">No collections yet</p>
          <p className="text-gray-600 text-sm mt-1">
            Create your first collection to organize items
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#7C3AED]/20
              text-[#7C3AED] text-sm font-medium hover:bg-[#7C3AED]/30 transition-colors"
          >
            Create Collection
          </button>
        </div>
      )}

      {/* ── Create Collection Modal ── */}
      <AnimatePresence>
        {showCreateModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm 
              flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#13131A] border border-[#1F1F2E] 
                rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">
                  New Collection
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. React Resources"
                    className="w-full bg-[#0A0A0F] border border-[#1F1F2E]
                      text-white placeholder-gray-600 rounded-xl px-4 py-2.5
                      text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="What's this collection about?"
                    className="w-full bg-[#0A0A0F] border border-[#1F1F2E]
                      text-white placeholder-gray-600 rounded-xl px-4 py-2.5
                      text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                </div>

                {/* Emoji Picker */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() =>
                          setFormData({ ...formData, icon: emoji })
                        }
                        className={`w-9 h-9 rounded-xl text-lg transition-all
                          ${formData.icon === emoji
                            ? "bg-[#7C3AED]/20 ring-1 ring-[#7C3AED]"
                            : "bg-[#0A0A0F] hover:bg-[#1F1F2E]"
                          }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setFormData({ ...formData, color })
                        }
                        className={`w-8 h-8 rounded-full transition-all
                          ${formData.color === color
                            ? "ring-2 ring-white ring-offset-2 ring-offset-[#13131A]"
                            : ""
                          }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 text-xs bg-red-500/10 
                    px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#1F1F2E]
                      text-gray-400 text-sm hover:border-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={isCreating || !formData.name.trim()}
                    className="flex-1 py-2.5 rounded-xl
                      bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]
                      text-white text-sm font-bold hover:opacity-90
                      disabled:opacity-50 transition-opacity"
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionPage;