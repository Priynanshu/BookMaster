const Item = require("../models/item.model");
const { generateSearchEmbedding } = require("../services/embeddings");
const mongoose = require("mongoose");

// ── Semantic Search
const semanticSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const queryEmbedding = await generateSearchEmbedding(q);

    if (!queryEmbedding || queryEmbedding.length === 0) {
      return res.status(500).json({ message: "Failed to generate search embedding" });
    }

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
        $addFields: {
          score: { $meta: "vectorSearchScore" },
        },
      },
      {
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

// ── Search by Tag 
const searchByTag = async (req, res) => {
  try {
    const { tag } = req.query;

    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }

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

// ── Get All Tags
const getAllTags = async (req, res) => {
  try {
    const result = await Item.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.userId),
          isArchived: false,
        },
      },
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
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