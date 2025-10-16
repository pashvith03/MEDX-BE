import express from "express";
import { listBeds, getBed, createBed, updateBed, deleteBed } from "../controllers/bedController.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { validateCreateBed, validateUpdateBed } from "../validators/bedValidator.js";

const router = express.Router({ mergeParams: true });

// All bed routes require authentication
router.use(auth);

// @route   GET /api/care-units/:careUnitId/beds
// @desc    List beds under a care unit
// @access  Private
router.get("/", listBeds);

// @route   GET /api/care-units/:careUnitId/beds/:id
// @desc    Get bed under a care unit
// @access  Private
router.get("/:id", getBed);

// @route   POST /api/care-units/:careUnitId/beds
// @desc    Create bed under a care unit
// @access  Private (Admin only)
router.post("/", adminAuth, validateCreateBed, createBed);

// @route   PUT /api/care-units/:careUnitId/beds/:id
// @desc    Update bed
// @access  Private (Admin only)
router.put("/:id", adminAuth, validateUpdateBed, updateBed);

// @route   DELETE /api/care-units/:careUnitId/beds/:id
// @desc    Delete bed
// @access  Private (Admin only)
router.delete("/:id", adminAuth, deleteBed);

export default router;


