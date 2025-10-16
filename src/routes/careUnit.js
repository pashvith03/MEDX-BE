import express from "express";
import {
  getAllCareUnits,
  getCareUnit,
  createCareUnit,
  updateCareUnit,
  deleteCareUnit,
  addCareUnit
} from "../controllers/careUnitController.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { validateCareUnit } from "../validators/careUnitValidator.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/care-units
// @desc    Get all care units
// @access  Private
router.get("/", getAllCareUnits);

// @route   GET /api/care-units/:id
// @desc    Get single care unit
// @access  Private
router.get("/:id", getCareUnit);

// @route   POST /api/care-units
// @desc    Create care unit
// @access  Private (Admin only)
router.post("/", createCareUnit);
router.post("/", addCareUnit);

// @route   PUT /api/care-units/:id
// @desc    Update care unit
// @access  Private (Admin only)
router.put("/:id", adminAuth, validateCareUnit, updateCareUnit);

// @route   DELETE /api/care-units/:id
// @desc    Delete care unit
// @access  Private (Admin only)
router.delete("/:id", adminAuth, deleteCareUnit);

export default router;
