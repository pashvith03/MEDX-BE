import express from "express";
import {
  getAllRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions,
} from "../controllers/roleController.js";
import { auth, adminAuth } from "../middleware/auth.js";
import {
  validateCreateRole,
  validateUpdateRole,
  validateUpdatePermissions,
} from "../validators/roleValidator.js";

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// @route   GET /api/roles
// @desc    Get all roles
// @access  Private (Admin only)
router.get("/", getAllRoles);

// @route   GET /api/roles/:id
// @desc    Get single role
// @access  Private (Admin only)
router.get("/:id", getRole);

// @route   POST /api/roles
// @desc    Create role
// @access  Private (Admin only)
router.post("/", validateCreateRole, createRole);

// @route   PUT /api/roles/:id
// @desc    Update role
// @access  Private (Admin only)
router.put("/:id", validateUpdateRole, updateRole);

// @route   DELETE /api/roles/:id
// @desc    Delete role
// @access  Private (Admin only)
router.delete("/:id", deleteRole);

// @route   GET /api/roles/:id/permissions
// @desc    Get role permissions
// @access  Private (Admin only)
router.get("/:id/permissions", getRolePermissions);

// @route   PUT /api/roles/:id/permissions
// @desc    Update role permissions
// @access  Private (Admin only)
router.put("/:id/permissions", validateUpdatePermissions, updateRolePermissions);

export default router; 