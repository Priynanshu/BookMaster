import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, TrendingUp, FolderOpen, Tag, Plus, Trash2, Heart, ExternalLink } from "lucide-react";

import { fetchItems, saveItem, deleteItem, updateItem, uploadPDFItem } from "../../features/items/itemsSlice";
import { fetchCollections } from "../../features/collections/collectionsSlice";
import { fetchStats } from "./statsSlice";

const FILTERS = ["All", "Articles", "Videos", "PDFs", "Tweets"];

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("All");
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [selectedCollection, setSelectedCollection] = useState("");

    // PDF States
    const [saveMode, setSaveMode] = useState("url");
    const [pdfFile, setPdfFile] = useState(null);
    const [isUploadingPDF, setIsUploadingPDF] = useState(false);
    const [pdfError, setPdfError] = useState("");

    // Redux State
    const { items = [], isLoading, isSaving, totalItems } = useSelector((state) => state.items);
    const { collections = [] } = useSelector((state) => state.collections);
    const {
        totalItems: statsTotalItems,
        totalCollections,
        itemsThisWeek,
        topTags,
    } = useSelector((state) => state.stats);

    useEffect(() => {
        dispatch(fetchCollections());
        dispatch(fetchStats());
    }, [dispatch]);

    useEffect(() => {
        const filterMap = {
            All: {},
            Articles: { type: "article" },
            Videos: { type: "video" },
            PDFs: { type: "pdf" },
            Tweets: { type: "tweet" },
        };
        dispatch(fetchItems(filterMap[activeFilter]));
    }, [activeFilter, dispatch]);

    const handleCloseModal = () => {
        setShowSaveModal(false);
        setSaveMode("url");
        setUrlInput("");
        setPdfFile(null);
        setPdfError("");
        setSelectedCollection("");
    };

    const handleSave = async () => {
        if (!urlInput.trim()) return;
        const result = await dispatch(saveItem({
            url: urlInput,
            collectionId: selectedCollection || null,
        }));
        if (saveItem.fulfilled.match(result)) {
            handleCloseModal();
            dispatch(fetchStats());
        }
    };

    const handlePDFUpload = async () => {
        try {
            setIsUploadingPDF(true)

            if (!pdfFile) return;
            setPdfError("");

            const formData = new FormData();
            formData.append("pdf", pdfFile);
            if (selectedCollection) {
                formData.append("collectionId", selectedCollection);
            }

            // ✅ Redux thunk use karo — api direct call nahi
            const result = await dispatch(uploadPDFItem(formData));

            if (uploadPDFItem.fulfilled.match(result)) {
                dispatch(fetchStats());
                handleCloseModal();
            } else {
                setPdfError(result.payload || "PDF upload failed");
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsUploadingPDF(false)
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this?")) {
            const result = await dispatch(deleteItem(id));
            if (deleteItem.fulfilled.match(result)) {
                dispatch(fetchStats());
            }
        }
    };

    const handleFavourite = (e, item) => {
        e.stopPropagation();
        dispatch(updateItem({
            id: item._id,
            updates: { isFavourite: !item.isFavourite }
        }));
    };

    const stats = [
        { label: "Total Saved", value: statsTotalItems || totalItems || items.length, icon: BookOpen, color: "text-[#7C3AED]", bg: "bg-[#7C3AED]/10" },
        { label: "This Week", value: itemsThisWeek || 0, icon: TrendingUp, color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10" },
        { label: "Collections", value: totalCollections || collections.length, icon: FolderOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Top Tag", value: topTags?.[0]?.tag || "—", icon: Tag, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">My Library</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and organize your digital knowledge.</p>
                </div>
                <button
                    onClick={() => setShowSaveModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm hover:shadow-lg hover:shadow-[#7C3AED]/20 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    Save New Item
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-[#13131A] border border-[#1F1F2E] p-5 rounded-2xl flex items-center gap-4 hover:border-[#7C3AED]/30 transition-colors"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest truncate">{stat.label}</p>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Top Tags */}
            {topTags?.length > 0 && (
                <div className="bg-[#13131A] border border-[#1F1F2E] rounded-2xl p-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">🏷️ Top Tags</p>
                    <div className="flex flex-wrap gap-2">
                        {topTags.slice(0, 10).map(({ tag, count }) => (
                            <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
                                #{tag} <span className="ml-1.5 opacity-60">{count}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap
                            ${activeFilter === filter
                                ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-lg shadow-[#7C3AED]/20"
                                : "bg-[#13131A] text-gray-500 border-[#1F1F2E] hover:border-[#7C3AED]/50 hover:text-gray-300"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Items Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-[#13131A] border border-[#1F1F2E] rounded-2xl h-64 animate-pulse" />
                    ))}
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                            <motion.div
                                key={item._id}
                                onClick={() => navigate(`/items/${item._id}`)}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-[#13131A] border border-[#1F1F2E] rounded-2xl overflow-hidden group hover:border-[#7C3AED] transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative h-44 bg-[#0A0A0F]">
                                    {item.thumbnail ? (
                                        <img src={item.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

                                <div className="p-5">
                                    <p className="text-[10px] font-bold text-[#7C3AED] uppercase mb-1">{item.siteName || "Web Content"}</p>
                                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-2 group-hover:text-[#7C3AED] transition-colors">{item.title}</h3>
                                    <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">{item.summary || item.description}</p>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {item.tags?.slice(0, 3).map((tag) => (
                                            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-[#7C3AED]/10 text-[#7C3AED]">#{tag}</span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-[#1F1F2E]">
                                        <span className="text-[10px] text-gray-600 font-medium">{new Date(item.createdAt).toDateString()}</span>
                                        <div className="flex gap-1">
                                            <button onClick={(e) => handleFavourite(e, item)} className={`p-2 rounded-lg transition-colors ${item.isFavourite ? "text-red-500 bg-red-500/10" : "text-gray-600 hover:bg-[#1F1F2E]"}`}>
                                                <Heart size={16} fill={item.isFavourite ? "currentColor" : "none"} />
                                            </button>
                                            <button onClick={(e) => handleDelete(e, item._id)} className="p-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-[#13131A] rounded-3xl border border-dashed border-[#1F1F2E]">
                    <div className="w-20 h-20 bg-[#0A0A0F] rounded-full flex items-center justify-center mb-4 text-gray-700">
                        <FolderOpen size={40} />
                    </div>
                    <h3 className="text-white font-bold">No results found</h3>
                    <p className="text-gray-500 text-sm">Try changing filters or save a new link.</p>
                </div>
            )}

            {/* Save Modal */}
            <AnimatePresence>
                {showSaveModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-[#13131A] border border-[#1F1F2E] rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-xl font-black text-white mb-2 text-center">Save to Library</h2>
                            <p className="text-gray-500 text-[10px] mb-5 font-bold uppercase tracking-[0.2em] text-center">AI-powered knowledge scraping</p>

                            <div className="flex gap-2 mb-6 bg-[#0A0A0F] rounded-xl p-1">
                                <button
                                    onClick={() => setSaveMode("url")}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${saveMode === "url" ? "bg-[#7C3AED] text-white" : "text-gray-500 hover:text-white"}`}
                                >🔗 Save URL</button>
                                <button
                                    onClick={() => setSaveMode("pdf")}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${saveMode === "pdf" ? "bg-[#7C3AED] text-white" : "text-gray-500 hover:text-white"}`}
                                >📄 Upload PDF</button>
                            </div>

                            {saveMode === "url" ? (
                                <div className="space-y-4">
                                    <input
                                        type="url"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full bg-[#0A0A0F] border border-[#1F1F2E] text-white rounded-xl px-5 py-4 text-sm focus:border-[#7C3AED] outline-none transition-all"
                                        autoFocus
                                    />
                                    {/* Collection dropdown mapping logic is same as before */}
                                    <select
                                        value={selectedCollection}
                                        onChange={(e) => setSelectedCollection(e.target.value)}
                                        className="w-full bg-[#0A0A0F] border border-[#1F1F2E] text-white rounded-xl px-5 py-4 text-sm focus:border-[#7C3AED] outline-none transition-all"
                                    >
                                        <option value="">No Collection</option>
                                        {collections.map((col) => (
                                            <option key={col._id} value={col._id}>{col.icon} {col.name}</option>
                                        ))}
                                    </select>

                                    <div className="flex gap-3 pt-2">
                                        <button onClick={handleCloseModal} className="flex-1 py-4 text-xs font-bold text-gray-500 hover:text-white transition-colors">CANCEL</button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving || !urlInput}
                                            className="flex-[2] bg-[#7C3AED] text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 hover:bg-[#6D28D9] transition-all"
                                        >
                                            {isSaving ? "SAVING..." : "SAVE TO LIBRARY"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${pdfFile ? "border-[#7C3AED] bg-[#7C3AED]/5" : "border-[#1F1F2E] hover:border-[#7C3AED]/50"}`}>
                                        <input type="file" accept=".pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files[0])} />
                                        {pdfFile ? <p className="text-white text-sm">{pdfFile.name}</p> : <p className="text-gray-400 text-sm">Click to upload PDF</p>}
                                    </label>
                                    {/* PDF Upload Button Logic */}
                                    <button
                                        onClick={handlePDFUpload}
                                        disabled={isUploadingPDF || !pdfFile}
                                        className="w-full bg-[#7C3AED] text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest"
                                    >
                                        {isUploadingPDF ? "UPLOADING..." : "UPLOAD PDF"}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;