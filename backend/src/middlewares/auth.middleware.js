const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");

async function identifyUser(req, res, next) {
  try {
    let token = null;

    // ── 1. Cookie se try karo ─────────────────────
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // ── 2. Authorization header se try karo ──────
    // Production mein Bearer token use hoga
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // ── Token nahi mila ───────────────────────────
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ── Redis blacklist check karo ────────────────
    const isTokenBlacklisted = await redis.get(token);
    if (isTokenBlacklisted) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ── Token verify karo ─────────────────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();

  } catch (error) {
    next(error);
  }
}

// Login Limiter Middleware
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts" },
});

module.exports = {
  identifyUser,
  loginLimiter,
};