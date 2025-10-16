import HospitalLogo from "../models/HospitalLogo.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get current active logo
const getLogos = async (req, res) => {
  try {
    const logo = await HospitalLogo.findOne({ isActive: true })
      .sort({ createdAt: -1 })
      .select('imageUrl');

    res.json({
      logoUrl: logo ? logo.imageUrl : null
    });
  } catch (error) {
    console.error('Error getting logo:', error);
    res.status(500).json({ message: "Server error" });
  }
};

const getLogo = async (req, res) => {
  try {
    const logo = await HospitalLogo.findById(req.params.id)
      .populate("createdBy", "username")
      .select('imageUrl name isActive createdAt');

    if (!logo) {
      return res.status(404).json({ message: "Logo not found" });
    }

    res.json({
      logoUrl: logo.imageUrl,
      name: logo.name,
      isActive: logo.isActive,
      createdAt: logo.createdAt,
      createdBy: logo.createdBy
    });
  } catch (error) {
    console.error('Error getting logo by ID:', error);
    res.status(500).json({ message: "Server error" });
  }
};

const createLogo = async (req, res) => {
  try {
    console.log('Received file upload request:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check file type
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(415).json({ message: "Invalid file type. Please upload an image file." });
    }

    // Check file size (15MB)
    if (req.file.size > 15 * 1024 * 1024) {
      return res.status(413).json({ message: "File size too large. Maximum size is 15MB." });
    }

    // Create the uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'logos');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Ensure the file was saved successfully
    if (!req.file.path) {
      throw new Error('File was not saved properly');
    }

    console.log('File saved at:', req.file.path);

    // Deactivate all existing logos
    await HospitalLogo.updateMany({}, { isActive: false });

    // Generate relative URL path that matches the static serve path
    const relativePath = `/uploads/logos/${req.file.filename}`;
    console.log('Generated relative path:', relativePath);

    // Create new logo document
    const logo = new HospitalLogo({
      name: req.file.originalname,
      imageUrl: relativePath,
      isActive: true,
      createdBy: req.user._id
    });

    // Save to database
    const saved = await logo.save();
    console.log('Logo saved to database:', saved);

    // Construct full URL for response
    const fullUrl = `${process.env.NODE_ENV === 'production' 
      ? process.env.API_URL 
      : `http://localhost:${process.env.PORT || 3000}`}${relativePath}`;

    res.status(201).json({
      message: "Logo uploaded successfully",
      logoUrl: relativePath, // Send relative path for flexibility
      fullUrl: fullUrl // Send full URL for direct access
    });
  } catch (error) {
    console.error('Error creating logo:', error);
    // Clean up uploaded file if database operation fails
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
        console.log('Cleaned up file after error:', req.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

const updateLogo = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (isActive) {
      // Deactivate all other logos
      await HospitalLogo.updateMany(
        { _id: { $ne: req.params.id } },
        { isActive: false }
      );
    }

    const updated = await HospitalLogo.findByIdAndUpdate(
      req.params.id,
      { 
        isActive,
        updatedBy: req.user._id 
      },
      { new: true }
    ).select('imageUrl isActive');

    if (!updated) {
      return res.status(404).json({ message: "Logo not found" });
    }

    res.json({
      message: "Logo updated successfully",
      logoUrl: updated.imageUrl,
      isActive: updated.isActive
    });
  } catch (error) {
    console.error('Error updating logo:', error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteLogo = async (req, res) => {
  try {
    console.log('Delete logo request received');

    // Find the active logo
    const logo = await HospitalLogo.findOne({ isActive: true });
    console.log('Found logo:', logo);
    
    if (!logo) {
      return res.status(404).json({ message: "No active logo found" });
    }

    // Delete the physical file
    if (logo.imageUrl) {
      try {
        // Remove leading slash and split path
        const relativePath = logo.imageUrl.replace(/^\//, '');
        const filePath = path.join(process.cwd(), relativePath);
        console.log('Attempting to delete file at:', filePath);
        
        // Check if file exists
        await fs.access(filePath);
        // Delete file
        await fs.unlink(filePath);
        console.log('File deleted successfully');
      } catch (err) {
        console.warn('File deletion warning:', err.message);
        // Continue even if file doesn't exist
      }
    }

    // Remove from database
    const deleteResult = await HospitalLogo.deleteOne({ _id: logo._id });
    console.log('Database deletion result:', deleteResult);

    if (deleteResult.deletedCount === 0) {
      throw new Error('Failed to delete logo from database');
    }

    console.log('Logo successfully removed from database');

    // Send success response
    res.json({ 
      message: "Logo deleted successfully",
      logoUrl: null 
    });
  } catch (error) {
    console.error('Error deleting logo:', error);
    res.status(500).json({ 
      message: "Server error",
      details: error.message 
    });
  }
};

export { getLogos, getLogo, createLogo, updateLogo, deleteLogo };


