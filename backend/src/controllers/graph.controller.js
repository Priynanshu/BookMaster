// controllers/graph.controller.js
const Item = require("../models/item.model");
const mongoose = require("mongoose");

// ── Get Knowledge Graph Data ──────────────────────────
// GET /api/graph
// Returns nodes (items) + edges (connections) for D3.js
const getGraphData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // Fetch all user items — only fields needed for graph
    const items = await Item.find({
      user: userId,
      isArchived: false,
    }).select("title type tags summary thumbnail createdAt");

    if (items.length === 0) {
      return res.json({ nodes: [], edges: [] });
    }

    // ── Build Nodes ───────────────────────────────────
    // Each item = one node in the graph
    const nodes = items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      type: item.type,
      tags: item.tags,
      thumbnail: item.thumbnail,
      summary: item.summary,
      createdAt: item.createdAt,
    }));

    // ── Build Edges ───────────────────────────────────
    // Two items are connected if they share a common tag
    // Example: item A has ["react", "js"] — item B has ["react", "hooks"]
    // They share "react" → edge between A and B
    const edges = [];
    const addedEdges = new Set(); // duplicate edges avoid karo

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i];
        const itemB = items[j];

        // Find common tags between two items
        const commonTags = itemA.tags.filter((tag) =>
          itemB.tags.includes(tag)
        );

        if (commonTags.length > 0) {
          // Unique edge key — prevent duplicates
          const edgeKey = `${itemA._id}-${itemB._id}`;

          if (!addedEdges.has(edgeKey)) {
            edges.push({
              source: itemA._id.toString(),
              target: itemB._id.toString(),
              commonTags,
              // More common tags = stronger connection
              strength: commonTags.length,
            });
            addedEdges.add(edgeKey);
          }
        }
      }
    }

    res.json({
      nodes,
      edges,
      totalNodes: nodes.length,
      totalEdges: edges.length,
    });

  } catch (error) {
    console.error("getGraphData error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getGraphData };