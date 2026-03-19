const express = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/register", authController.register)
router.post("/login", authMiddleware.loginLimiter, authController.login)
router.post("/logout", authMiddleware.identifyUser, authController.logout)
router.get("/me", authMiddleware.identifyUser, authController.getMe)

module.exports = router