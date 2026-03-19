const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// ── Cloudinary Config ─────────────────────────────────
// Credentials .env se lo
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── PDF Storage ───────────────────────────────────────
// PDF files Cloudinary pe store hongi
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bookmaster/pdfs",      // Cloudinary folder
    resource_type: "raw",           // PDF ke liye raw type
    allowed_formats: ["pdf"],
    public_id: (req, file) => {
      // Unique filename — timestamp + original name
      const name = file.originalname.replace(".pdf", "");
      return `${Date.now()}-${name}`;
    },
  },
});

// ── Image Storage ─────────────────────────────────────
// Agar future mein image upload karna ho
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bookmaster/images",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [
      { width: 800, height: 600, crop: "limit" }, // resize karo
      { quality: "auto" },                          // auto compress
    ],
    public_id: (req, file) => {
      const name = file.originalname.replace(/\.[^/.]+$/, "");
      return `${Date.now()}-${name}`;
    },
  },
});

// ── Multer Instances ──────────────────────────────────
const uploadPDF = multer({
  storage: pdfStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"), false);
    }
  },
});

// ── Delete File from Cloudinary ───────────────────────
// Item delete hone par Cloudinary se bhi hatao
const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log("Deleted from Cloudinary:", publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

// ── Get Public ID from URL ────────────────────────────
// Cloudinary URL se public_id nikalo — delete ke liye
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    const parentFolder = parts[parts.length - 3];
    return `${parentFolder}/${folder}/${filename.split(".")[0]}`;
  } catch {
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadPDF,
  uploadImage,
  deleteFromCloudinary,
  getPublicIdFromUrl,
};