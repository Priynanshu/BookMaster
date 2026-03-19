// routes/items.routes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
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
  // deleteItemCloude
} = require("../controllers/items.controller");
const { uploadPDF } = require("../services/cloudinaryService");

router.post("/upload-pdf", authMiddleware.identifyUser, uploadPDF.single("pdf"), uploadPDFItem);
 
// All routes are protected — login required
router.post("/save", authMiddleware.identifyUser, saveItem);
router.get("/", authMiddleware.identifyUser, getAllItems);
router.get("/resurfaced", authMiddleware.identifyUser, getResurfaced);
router.get("/:id", authMiddleware.identifyUser, getItemById);
router.patch("/:id", authMiddleware.identifyUser, updateItem);
router.delete("/:id", authMiddleware.identifyUser, deleteItem);
router.get("/:id/related", authMiddleware.identifyUser, getRelatedItems);
router.post("/:id/highlights", authMiddleware.identifyUser, addHighlight);
router.delete("/:id/highlights", authMiddleware.identifyUser, deleteHighlight);

module.exports = router;