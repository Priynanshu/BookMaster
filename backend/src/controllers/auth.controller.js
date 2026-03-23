const userModel = require("../models/user.model")
const ApiError = require("../utils/ApiError")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const bcrypt = require("bcrypt")
const redis = require("../config/cache")

async function register(req, res, next) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            throw new ApiError(400, "All fields are required")
        }

        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        })
        if (existingUser) {
            throw new ApiError(400, "User already exists")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({
            userId: newUser._id,
            username: newUser.username
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
            token
        })
    } catch (error) {
        next(error)
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required")
        }

        const user = await userModel.findOne({ email }).select("+password")

        if (!user) {
            throw new ApiError(400, "Invalid credentials")
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new ApiError(400, "Invalid credentials")
        }

        const token = jwt.sign({
            userId: user._id,
            username: user.username
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // ← fix
            maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        })
    } catch (error) {
        next(error)
    }
}

async function logout(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (token) {
            //1 Hour
            await redis.set(token, "blacklisted", "EX", 3600);
        }

        // Clearning Cookies From Browser
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
}

async function getMe(req, res, next) {
    try {
        const userId = req.user.userId
        const user = await userModel.findById(userId).select("-password")
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    logout,
    getMe
}