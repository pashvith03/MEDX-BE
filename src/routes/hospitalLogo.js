import express from "express";
import multer from "multer";
import path from "path";
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getLogos, getLogo, createLogo, updateLogo, deleteLogo } from "../controllers/hospitalLogoController.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { validateCreateLogo, validateUpdateLogo } from "../validators/hospitalLogoValidator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for storing uploaded files
// Ensure uploads directory exists
const createUploadsDir = async () => {
  const uploadPath = path.join(process.cwd(), 'uploads', 'logos');
  try {
    await fs.access(uploadPath);
  } catch {
    await fs.mkdir(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: async function(req, file, cb) {
    try {
      const uploadPath = await createUploadsDir();
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    cb(null, 'logo-' + uniqueSuffix + path.extname(safeFilename));
  }
});

// Enhanced file filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
    files: 1 // Only allow 1 file per request
  }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 15MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${error.message}` });
  } else if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

const router = express.Router();

// Public routes
router.get("/", getLogos);
router.get("/:id", getLogo);

// Protected routes
router.post("/", auth, upload.single('logo'), handleMulterError, createLogo);
router.put("/:id", auth, validateUpdateLogo, updateLogo); // Changed from adminAuth to auth
router.delete("/active", auth, deleteLogo); // Specific endpoint for deleting active logo

export default router;


