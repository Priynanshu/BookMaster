// routes/search.routes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const searchController = require("../controllers/search.controller")

router.get("/", authMiddleware.identifyUser, searchController.semanticSearch);
router.get("/tags", authMiddleware.identifyUser, searchController.searchByTag);
router.get("/tags/all", authMiddleware.identifyUser, searchController.getAllTags);

module.exports = router;