const rateLimit = require("express-rate-limit")
const jwt = require("jsonwebtoken")
const redis = require("../config/cache")

async function identifyUser(req, res, next) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const isTokenBlacklisted = await redis.get(token)
    
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    }catch (error) {
        next(error)
    }
}

// Login Limiter Middleware
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: { message: "Too many attempts" }
});

module.exports = {
    identifyUser,
    loginLimiter
}