import express from "express";
import { login, getCurrentUser } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";
import { validateLogin } from "../validators/authValidator.js";

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, getCurrentUser);

export default router;
