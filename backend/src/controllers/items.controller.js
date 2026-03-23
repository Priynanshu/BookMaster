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

// ── Save Item
const saveItem = async (req, res) => {
  try {
    const { url, collectionId } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const existing = await Item.findOne({ user: req.user.userId, url });
    if (existing) {
      return res.status(400).json({ message: "You have already saved this URL" });
    }

    //  Scrape URL — extract title, content, thumbnail
    const scraped = await scrapeURL(url);

    //  Combine title + content for better AI context
    const textForAI = `${scraped.title} ${scraped.content}`.trim();

    //  Run all AI tasks in parallel — saves time
    // Promise.all runs all 3 simultaneously instead of one by one
    const [tags, summary, embedding] = await Promise.all([
      generateTags(scraped.title, scraped.content),
      generateSummary(scraped.content),
      generateEmbedding(textForAI),
    ]);

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

    // Remove embedding before sending response
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

// ── Get All Items
const getAllItems = async (req, res) => {
  try {
    const { type, tag, collection, archived } = req.query;

    // Build filter dynamically based on query params
    const filter = { user: req.user.userId };

    if (type) filter.type = type;
    if (tag) filter.tags = tag;
    if (collection) filter.collection = collection;

    filter.isArchived = archived === "true" ? true : false;

    const items = await Item.find(filter)
      .select("-embedding -content") 
      .sort({ createdAt: -1 })       
      .populate("collection", "name icon color");

    res.json({ items, total: items.length });

  } catch (error) {
    console.error("getAllItems error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── Get Single Item 
const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      user: req.user.userId, 
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

// ── Update Item 
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

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      updates,
      { returnDocument: "after" } 
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

// ── Delete Item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId, 
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

// ── Get Related Item
const getRelatedItems = async (req, res) => {
  try {
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

// / ── Add Highlight 
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

// ── Delete Highlight
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


// ── Upload PDF
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

      const pdfData = await pdfParse(Buffer.from(response.data));
      pdfText = pdfData.text.slice(0, 5000);
    } catch (parseError) {
      console.error("PDF parse error:", parseError.message);
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

// ── Delete Item and also clean Cloudinary 
const deleteItemCloude = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

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