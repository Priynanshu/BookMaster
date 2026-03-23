const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { getDashboardStats } = require("../controllers/stats.controller");

router.get("/", authMiddleware.identifyUser, getDashboardStats);

module.exports = router;