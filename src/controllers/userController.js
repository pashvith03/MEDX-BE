import User from "../models/User.js";
import Role from "../models/Role.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("createdBy", "username")
      .populate("role", "name description permissions")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin only)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("createdBy", "username")
      .populate("role", "name description permissions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin only)
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, specialization, username, password, role } = req.body;

    // Check if user already exists
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
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone already in use" });
      }
    }

    // Validate role exists
    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      specialization,
      username,
      password,
      role,
      createdBy: req.user._id,
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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, specialization, username, role, isActive } = req.body;

    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      username,
      role,
      isActive,
      updatedBy: req.user._id,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    // Validate role if being updated
    if (role) {
      const roleExists = await Role.findById(role);
      if (!roleExists) {
        return res.status(400).json({ message: "Invalid role ID" });
      }
    }

    // Ensure unique email/phone if being changed
    if (email) {
      const emailOwner = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (emailOwner) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }
    if (phone) {
      const phoneOwner = await User.findOne({ phone, _id: { $ne: req.params.id } });
      if (phoneOwner) {
        return res.status(400).json({ message: "Phone already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "username")
      .populate("role", "name description permissions");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedBy: req.user._id },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}; 