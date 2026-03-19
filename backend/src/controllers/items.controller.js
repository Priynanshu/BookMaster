const Item = require("../models/item.model");
  const mongoose = require("mongoose"); 
const { scrapeURL } = require("../services/scraper");
const { uploadPDF, deleteFromCloudinary, getPublicIdFromUrl } = require("../services/cloudinaryService");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const {
  generateEmbedding,
  generateTags,
  generateSummary,
  generateSearchEmbedding 
} = require("../services/embeddings");
const { getResurfacedItems } = require("../services/resurfacing");

// ── Save Item ─────────────────────────────────────────
// POST /api/items/save
// User sends URL → scrape → AI process → save to MongoDB
const saveItem = async (req, res) => {
  try {
    const { url, collectionId } = req.body;

    // Validate — URL is required
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // Check duplicate — same user cannot save same URL twice
    const existing = await Item.findOne({ user: req.user.userId, url });
    if (existing) {
      return res.status(400).json({ message: "You have already saved this URL" });
    }

    // Step 1: Scrape URL — extract title, content, thumbnail
    const scraped = await scrapeURL(url);

    // Step 2: Combine title + content for better AI context
    const textForAI = `${scraped.title} ${scraped.content}`.trim();

    // Step 3: Run all AI tasks in parallel — saves time
    // Promise.all runs all 3 simultaneously instead of one by one
    const [tags, summary, embedding] = await Promise.all([
      generateTags(scraped.title, scraped.content),
      generateSummary(scraped.content),
      generateEmbedding(textForAI),
    ]);

    // Step 4: Save everything to MongoDB
    const item = await Item.create({
      user: req.user.userId,
      url,
      type: scraped.type,
      title: scraped.title,
      description: scraped.description,
      content: scraped.content,
      thumbnail: scraped.thumbnail,
      siteName: scraped.siteName,
      tags,
      summary,
      embedding,
      collection: collectionId || null,
    });

    // Step 5: Remove embedding before sending response
    // 1024 numbers — no need to send to frontend
    const itemToReturn = item.toObject();
    delete itemToReturn.embedding;

    res.status(201).json({
      message: "Item saved successfully",
      item: itemToReturn,
    });

  } catch (error) {
    console.error("saveItem error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Get All Items ─────────────────────────────────────
// GET /api/items
// Returns all saved items of logged in user with optional filters
const getAllItems = async (req, res) => {
  try {
    const { type, tag, collection, archived } = req.query;

    // Build filter dynamically based on query params
    const filter = { user: req.user.userId };

    if (type) filter.type = type;
    if (tag) filter.tags = tag;
    if (collection) filter.collection = collection;

    // Default: show active items — archived=true shows archived
    filter.isArchived = archived === "true" ? true : false;

    const items = await Item.find(filter)
      .select("-embedding -content") // exclude heavy fields
      .sort({ createdAt: -1 })       // newest first
      .populate("collection", "name icon color");

    res.json({ items, total: items.length });

  } catch (error) {
    console.error("getAllItems error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Get Single Item ───────────────────────────────────
// GET /api/items/:id
// Returns one item by ID — only owner can access
const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      user: req.user.userId, // security — only owner can access
    })
      .select("-embedding")
      .populate("collection", "name icon color");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ item });

  } catch (error) {
    console.error("getItemById error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Update Item ───────────────────────────────────────
// PATCH /api/items/:id
// Update notes, highlights, collection, favourite, archived
const updateItem = async (req, res) => {
  try {
    // Whitelist — only these fields can be updated
    const allowedFields = [
      "notes",
      "highlights",
      "collection",
      "isFavourite",
      "isArchived",
      "tags",
    ];

    // Build update object — only include allowed fields
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updates,
      { returnDocument: "after" } // return updated document
    ).select("-embedding");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item updated successfully", item });

  } catch (error) {
    console.error("updateItem error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Delete Item ───────────────────────────────────────
// DELETE /api/items/:id
// Permanently delete an item — only owner can delete
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId, // security — only owner can delete
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });

  } catch (error) {
    console.error("deleteItem error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Get Related Items ─────────────────────────────────
// GET /api/items/:id/related
// Finds items similar to the given item using vector search
const getRelatedItems = async (req, res) => {
  try {
    // Step 1: Current item fetch karo — embedding ke saath
    const currentItem = await Item.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!currentItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!currentItem.embedding || currentItem.embedding.length === 0) {
      return res.status(400).json({ message: "Item has no embedding" });
    }

    // Step 2: Current item ka embedding use karke similar items dhundo
    const related = await Item.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: currentItem.embedding, // current item ka vector
          numCandidates: 50,
          limit: 6, // top 6 related items
        },
      },
      {
        $addFields: {
          score: { $meta: "vectorSearchScore" },
        },
      },
      {
        // Current item ko results se hatao
        // Aur sirf is user ke items dikhao
        $match: {
          _id: { $ne: currentItem._id },
          user: new mongoose.Types.ObjectId(req.user.userId),
          isArchived: false,
        },
      },
      {
        $project: {
          embedding: 0,
          content: 0,
        },
      },
      {
        $limit: 5, // final 5 related items
      },
    ]);

    res.json({ related, total: related.length });

  } catch (error) {
    console.error("getRelatedItems error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getResurfaced = async (req, res) => {
  try {
    const items = await getResurfacedItems(req.user._id);
    res.json({ items, total: items.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// / ── Add Highlight ─────────────────────────────────────
// POST /api/items/:id/highlights
// Add a highlighted text to an item
const addHighlight = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Highlight text is required" });
    }

    // $addToSet — duplicate highlights add nahi hoga
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { $addToSet: { highlights: text.trim() } },
      {returnDocument: "after" }
    ).select("-embedding -content");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Highlight added", highlights: item.highlights });

  } catch (error) {
    console.error("addHighlight error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Delete Highlight ──────────────────────────────────
// DELETE /api/items/:id/highlights
// Remove a specific highlight from an item
const deleteHighlight = async (req, res) => {
  try {
    const { text } = req.body;

    // $pull — array se specific value remove karo
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { $pull: { highlights: text } },
      { returnDocument: "after" }
    ).select("-embedding -content");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Highlight removed", highlights: item.highlights });

  } catch (error) {
    console.error("deleteHighlight error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ── Upload PDF ────────────────────────────────────────
// POST /api/items/upload-pdf
const uploadPDFItem = async (req, res) => {
  try {
    console.log("PDF Upload hit!");
    console.log("req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const cloudinaryUrl = req.file.path;
    const title = req.file.originalname.replace(".pdf", "");

    let pdfText = "";
    try {
      const response = await axios.get(cloudinaryUrl, {
        responseType: "arraybuffer",
      });

      // ✅ Fix — pdf-parse sahi tarike se call karo
      const pdfData = await pdfParse(Buffer.from(response.data));
      pdfText = pdfData.text.slice(0, 5000);
    } catch (parseError) {
      console.error("PDF parse error:", parseError.message);
      // Parse fail ho to bhi continue karo
    }

    const [tags, summary, embedding] = await Promise.all([
      generateTags(title, pdfText),
      generateSummary(pdfText),
      generateEmbedding(`${title} ${pdfText}`),
    ]);

    const item = await Item.create({
      user: req.user.userId,
      url: cloudinaryUrl,
      type: "pdf",
      title,
      content: pdfText,
      description: `PDF — uploaded to cloud storage`,
      thumbnail: "",
      tags,
      summary,
      embedding,
      collection: req.body.collectionId || null,
    });

    const itemToReturn = item.toObject();
    delete itemToReturn.embedding;

    res.status(201).json({
      message: "PDF uploaded successfully",
      item: itemToReturn,
    });

  } catch (error) {
    console.error("uploadPDFItem error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Delete Item — Cloudinary bhi clean karo ───────────
const deleteItemCloude = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Agar PDF hai — Cloudinary se bhi delete karo
    if (item.type === "pdf" && item.url.includes("cloudinary")) {
      const publicId = getPublicIdFromUrl(item.url);
      if (publicId) {
        await deleteFromCloudinary(publicId, "raw");
      }
    }

    res.json({ message: "Item deleted successfully" });

  } catch (error) {
    console.error("deleteItem error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  saveItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getRelatedItems,
  getResurfaced,
  addHighlight,
  deleteHighlight,
  uploadPDFItem,
  deleteItemCloude
};