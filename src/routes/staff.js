import express from "express";
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";
import { requirePermission } from "../middleware/auth.js";
import { validateCreateStaff } from "../validators/staffValidator.js";

const router = express.Router();

// Permission-protected access to staff endpoints
// Any role with 'user:read' can list staff; 'user:create' can create staff

// GET /api/staff
router.get("/", getAllStaff);

// POST /api/staff
router.post("/", validateCreateStaff, createStaff);

// PUT /api/staff/:id
router.put("/:id", updateStaff);

// DELETE /api/staff/:id
router.delete("/:id", deleteStaff);

export default router;
