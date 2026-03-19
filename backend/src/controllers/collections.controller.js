// controllers/collections.controller.js
const Collection = require("../models/collection.model");
const Item = require("../models/item.model");

// ── Create Collection ─────────────────────────────────
// POST /api/collections
const createCollection = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Collection name is required" });
    }

    // Check duplicate — same user cannot have same collection name
    const existing = await Collection.findOne({ 
      user: req.user.userId, 
      name: name.trim() 
    });
    if (existing) {
      return res.status(400).json({ message: "Collection with this name already exists" });
    }

    const collection = await Collection.create({
      user: req.user.userId,
      name: name.trim(),
      description: description || "",
      icon: icon || "📁",
      color: color || "#6366f1",
    });

    res.status(201).json({ message: "Collection created", collection });

  } catch (error) {
    console.error("createCollection error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Get All Collections ───────────────────────────────
// GET /api/collections
const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    // Each collection ke saath item count bhi bhejo
    const collectionsWithCount = await Promise.all(
      collections.map(async (col) => {
        const count = await Item.countDocuments({ 
          collection: col._id,
          isArchived: false 
        });
        return { ...col.toObject(), itemCount: count };
      })
    );

    res.json({ collections: collectionsWithCount });

  } catch (error) {
    console.error("getAllCollections error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Get Single Collection with Items ─────────────────
// GET /api/collections/:id
const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Collection ke saath uske items bhi fetch karo
    const items = await Item.find({
      collection: collection._id,
      isArchived: false,
    })
      .select("-embedding -content")
      .sort({ createdAt: -1 });

    res.json({ collection, items, total: items.length });

  } catch (error) {
    console.error("getCollectionById error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Update Collection ─────────────────────────────────
// PATCH /api/collections/:id
const updateCollection = async (req, res) => {
  try {
    const allowedFields = ["name", "description", "icon", "color"];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updates,
      { new: true }
    );

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.json({ message: "Collection updated", collection });

  } catch (error) {
    console.error("updateCollection error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Delete Collection ─────────────────────────────────
// DELETE /api/collections/:id
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Collection delete hone par items ko null kar do
    // Items delete mat karo — sirf unlink karo
    await Item.updateMany(
      { collection: collection._id },
      { collection: null }
    );

    res.json({ message: "Collection deleted successfully" });

  } catch (error) {
    console.error("deleteCollection error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
};