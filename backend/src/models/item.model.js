const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["article", "video", "image", "pdf", "tweet"],
      default: "article",
    },

    title: {
      type: String,
      default: "Untitled",
    },

    description: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    siteName: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    summary: {
      type: String,
      default: "",
    },

    embedding: {
      type: [Number],
      default: [],
    },

    notes: {
      type: String,
      default: "",
    },

    highlights: {
      type: [String],
      default: [],
    },

    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },

    isFavourite: {
      type: Boolean,
      default: false,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ── Index for faster queries
itemSchema.index({ user: 1, createdAt: -1 });

// ── Index for tag search 
itemSchema.index({ tags: 1 });

module.exports = mongoose.model("Item", itemSchema);