// models/Item.model.js
const mongoose = require("mongoose");

// ── Item Schema ───────────────────────────────────────
// Every saved bookmark/article/video will follow this structure
const itemSchema = new mongoose.Schema(
  {
    // Which user saved this item
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Original URL of the saved content
    url: {
      type: String,
      required: true,
    },

    // Type of content — detected automatically by scraper
    type: {
      type: String,
      enum: ["article", "video", "image", "pdf", "tweet"],
      default: "article",
    },

    // Title extracted from the webpage
    title: {
      type: String,
      default: "Untitled",
    },

    // Short description from og:description or AI summary
    description: {
      type: String,
      default: "",
    },

    // Full text content extracted from page — used for embedding
    content: {
      type: String,
      default: "",
    },

    // Thumbnail image URL from og:image
    thumbnail: {
      type: String,
      default: "",
    },

    // Website name — e.g. "YouTube", "Dev.to"
    siteName: {
      type: String,
      default: "",
    },

    // AI generated tags — e.g. ["javascript", "react"]
    tags: {
      type: [String],
      default: [],
    },

    // AI generated summary — 2-3 lines
    summary: {
      type: String,
      default: "",
    },

    // Embedding vector — 1024 numbers from Cohere
    // Used for semantic search — finding similar items
    embedding: {
      type: [Number],
      default: [],
    },

    // User's personal notes on this item
    notes: {
      type: String,
      default: "",
    },

    // Text highlights — parts user marked as important
    highlights: {
      type: [String],
      default: [],
    },

    // Which collection this item belongs to
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },

    // Is this item marked as favourite
    isFavourite: {
      type: Boolean,
      default: false,
    },

    // Is this item archived — hidden from main feed
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    // createdAt and updatedAt auto managed by mongoose
    timestamps: true,
  }
);

// ── Index for faster queries ──────────────────────────
// When fetching user's items, MongoDB will use this index
// Instead of scanning all documents — much faster
itemSchema.index({ user: 1, createdAt: -1 });

// ── Index for tag search ──────────────────────────────
itemSchema.index({ tags: 1 });

module.exports = mongoose.model("Item", itemSchema);