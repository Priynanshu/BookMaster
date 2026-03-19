// controllers/stats.controller.js
const Item = require("../models/item.model");
const Collection = require("../models/collection.model");
const mongoose = require("mongoose");

// ── Get Dashboard Stats ───────────────────────────────
// GET /api/stats
// Returns all stats needed for dashboard
const getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // Run all queries in parallel — saves time
    const [
      totalItems,
      totalCollections,
      itemsByType,
      topTags,
      recentItems,
      itemsThisWeek,
    ] = await Promise.all([

      // Total active items count
      Item.countDocuments({ user: userId, isArchived: false }),

      // Total collections count
      Collection.countDocuments({ user: userId }),

      // Items grouped by type — article, video, pdf, tweet, image
      Item.aggregate([
        { $match: { user: userId, isArchived: false } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Top 10 most used tags
      Item.aggregate([
        { $match: { user: userId, isArchived: false } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Last 5 saved items
      Item.find({ user: userId, isArchived: false })
        .select("-embedding -content")
        .sort({ createdAt: -1 })
        .limit(5),

      // Items saved in last 7 days
      Item.countDocuments({
        user: userId,
        isArchived: false,
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    // Format itemsByType as object — easier for frontend
    // [{ _id: "article", count: 5 }] → { article: 5, video: 2 }
    const typeBreakdown = {};
    itemsByType.forEach((t) => {
      typeBreakdown[t._id] = t.count;
    });

    // Format tags
    const tags = topTags.map((t) => ({ tag: t._id, count: t.count }));

    res.json({
      totalItems,
      totalCollections,
      itemsThisWeek,
      typeBreakdown,
      topTags: tags,
      recentItems,
    });

  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardStats };