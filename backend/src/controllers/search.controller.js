// controllers/search.controller.js
const Item = require("../models/item.model");
const { generateSearchEmbedding } = require("../services/embeddings");
const mongoose = require("mongoose");

// ── Semantic Search ───────────────────────────────────
// GET /api/search?q=react hooks
// Finds similar items using vector similarity
const semanticSearch = async (req, res) => {
  try {
    const { q } = req.query;

    // Validate — query is required
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Step 1: Convert search query to embedding vector
    // "search_query" inputType — optimized for queries not documents
    const queryEmbedding = await generateSearchEmbedding(q);

    if (!queryEmbedding || queryEmbedding.length === 0) {
      return res.status(500).json({ message: "Failed to generate search embedding" });
    }

    // Step 2: MongoDB Atlas Vector Search aggregation
    // $vectorSearch finds documents whose embedding is most similar
    const results = await Item.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",       // index we created in Atlas
          path: "embedding",           // field with stored vectors
          queryVector: queryEmbedding, // our query converted to vector
          numCandidates: 100,          // scan top 100 candidates
          limit: 10,                   // return top 10 matches
          filter: {
            user: new mongoose.Types.ObjectId(req.user.userId),
            isArchived: false,
          },
        },
      },
      {
        // Add similarity score to each result
        // score 1.0 = perfect match, 0.0 = no relation
        $addFields: {
          score: { $meta: "vectorSearchScore" },
        },
      },
      {
        // Remove heavy fields — not needed in frontend
        $project: {
          embedding: 0,
          content: 0,
        },
      },
    ]);

    res.json({
      query: q,
      results,
      total: results.length,
    });

  } catch (error) {
    console.error("semanticSearch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Search by Tag ─────────────────────────────────────
// GET /api/search/tags?tag=javascript
// Returns all items with a specific tag
const searchByTag = async (req, res) => {
  try {
    const { tag } = req.query;

    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }

    // Find items where tags array contains this tag — case insensitive
    const items = await Item.find({
      user: req.user.userId,
      tags: { $regex: tag, $options: "i" },
      isArchived: false,
    })
      .select("-embedding -content")
      .sort({ createdAt: -1 });

    res.json({ tag, items, total: items.length });

  } catch (error) {
    console.error("searchByTag error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Get All Tags ──────────────────────────────────────
// GET /api/search/tags/all
// Returns all unique tags used by the user with count
const getAllTags = async (req, res) => {
  try {
    const result = await Item.aggregate([
      // Filter only this user's active items
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.userId),
          isArchived: false,
        },
      },
      // Unwind — splits array into separate documents
      // item with tags ["react","js"] → 2 separate documents
      {
        $unwind: "$tags",
      },
      // Group by tag name — count occurrences
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      // Sort by count — most used tags first
      {
        $sort: { count: -1 },
      },
    ]);

    const tags = result.map((r) => ({
      tag: r._id,
      count: r.count,
    }));

    res.json({ tags });

  } catch (error) {
    console.error("getAllTags error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  semanticSearch,
  searchByTag,
  getAllTags,
};