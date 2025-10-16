import Role from "../models/Role.js";

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private (Admin only)
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true })
      .populate("createdBy", "username")
      .populate("updatedBy", "username")
      .sort({ createdAt: -1 });

    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Private (Admin only)
const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
      .populate("createdBy", "username")
      .populate("updatedBy", "username");

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create role
// @route   POST /api/roles
// @access  Private (Admin only)
const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role with this name already exists" });
    }

    const newRole = new Role({
      name,
      description,
      permissions: permissions || [],
      createdBy: req.user._id,
    });

    const savedRole = await newRole.save();
    await savedRole.populate("createdBy", "username");

    res.status(201).json(savedRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private (Admin only)
const updateRole = async (req, res) => {
  try {
    const { name, description, permissions, isActive } = req.body;

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Prevent updating system roles
    if (role.isSystem) {
      return res.status(400).json({ message: "Cannot update system roles" });
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: "Role with this name already exists" });
      }
    }

    const updateData = {
      name,
      description,
      permissions,
      isActive,
      updatedBy: req.user._id,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy", "username");

    res.json(updatedRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete role (soft delete)
// @route   DELETE /api/roles/:id
// @access  Private (Admin only)
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Prevent deleting system roles
    if (role.isSystem) {
      return res.status(400).json({ message: "Cannot delete system roles" });
    }

    // Check if role is being used by any users
    const User = (await import("../models/User.js")).default;
    const usersWithRole = await User.find({ role: req.params.id });
    
    if (usersWithRole.length > 0) {
      return res.status(400).json({ 
        message: "Cannot delete role that is assigned to users",
        userCount: usersWithRole.length
      });
    }

    const deletedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedBy: req.user._id },
      { new: true }
    );

    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get role permissions
// @route   GET /api/roles/:id/permissions
// @access  Private (Admin only)
const getRolePermissions = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({ permissions: role.permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update role permissions
// @route   PUT /api/roles/:id/permissions
// @access  Private (Admin only)
const updateRolePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Prevent updating system roles
    if (role.isSystem) {
      return res.status(400).json({ message: "Cannot update system roles" });
    }

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { permissions, updatedBy: req.user._id },
      { new: true, runValidators: true }
    ).populate("createdBy", "username");

    res.json(updatedRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions,
}; 