const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");;
const {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} = require("../controllers/collections.controller");

router.post("/", authMiddleware.identifyUser, createCollection);
router.get("/", authMiddleware.identifyUser, getAllCollections);
router.get("/:id", authMiddleware.identifyUser, getCollectionById);
router.patch("/:id", authMiddleware.identifyUser, updateCollection);
router.delete("/:id", authMiddleware.identifyUser, deleteCollection);

module.exports = router;