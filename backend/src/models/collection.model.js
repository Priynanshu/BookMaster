// models/Collection.model.js
const mongoose = require("mongoose");

// ── Collection Schema ─────────────────────────────────
// Collections are like folders — user groups items inside them
const collectionSchema = new mongoose.Schema(
  {
    // Which user owns this collection
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Collection name — e.g. "React Articles", "Design Inspiration"
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional description
    description: {
      type: String,
      default: "",
    },

    // Emoji icon for visual identification — e.g. "📚", "🎨"
    icon: {
      type: String,
      default: "📁",
    },

    // Color for UI — e.g. "#FF5733"
    color: {
      type: String,
      default: "#6366f1",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Collection", collectionSchema);