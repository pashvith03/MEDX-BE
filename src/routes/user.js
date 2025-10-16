import express from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { validateCreateUser, validateUpdateUser } from "../validators/userValidator.js";

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get("/", getAllUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private (Admin only)
router.get("/:id", getUser);

// @route   POST /api/users
// @desc    Create user
// @access  Private (Admin only)
router.post("/", validateCreateUser, createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put("/:id", validateUpdateUser, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete("/:id", deleteUser);

export default router;
