const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { getGraphData } = require("../controllers/graph.controller");

router.get("/", authMiddleware.identifyUser, getGraphData);

module.exports = router;