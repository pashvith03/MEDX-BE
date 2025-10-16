import User from "../models/User.js";
import Role from "../models/Role.js";

// @desc    Get all staff users
// @route   GET /api/staff
// @access  Private (Admin only)
const getAllStaff = async (req, res) => {
  try {
    const staffRole = await Role.findOne({ name: { $regex: /^staff$/i } });
    if (!staffRole) {
      return res
        .status(500)
        .json({ message: "Default 'Staff' role not configured" });
    }

    const users = await User.find({ role: staffRole._id })
      .populate("createdBy", "username")
      .populate("role", "name description permissions")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create staff user (defaults role to 'Staff')
// @route   POST /api/staff
// @access  Private (Admin only)
const createStaff = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      username,
      password,
    } = req.body;

    // Check uniqueness
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }
    if (phone) {
      const phoneExists = await User.findOne({ phone: String(phone) });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone already in use" });
      }
    }

    // Resolve Staff role
    const defaultRole = await Role.findOne({ name: { $regex: /^staff$/i } });
    if (!defaultRole) {
      return res
        .status(500)
        .json({ message: "Default 'Staff' role not configured" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone: phone !== undefined && phone !== null ? String(phone) : phone,
      specialization,
      username,
      password,
      role: defaultRole._id,
      createdBy: req.user?._id,
    });

    const savedUser = await newUser.save();
    await savedUser.populate("createdBy", "username");
    await savedUser.populate("role", "name description permissions");

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update staff user
// @route   PUT /api/staff/:id
// @access  Private (Admin only)
const updateStaff = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      username,
      password,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone, specialization, username, password },
      { new: true }
    );
    await updatedUser.populate("createdBy", "username");
    await updatedUser.populate("role", "name description permissions");

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete staff user
// @route   DELETE /api/staff/:id
// @access  Private (Admin only)
const deleteStaff = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getAllStaff, createStaff, updateStaff, deleteStaff };
