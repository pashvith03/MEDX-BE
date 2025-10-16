import User from "../models/User.js";
import Role from "../models/Role.js";

const createDefaultAdmin = async () => {
  try {
    // Create default roles if they don't exist
    const adminRole = await Role.findOneAndUpdate(
      { name: "Admin" },
      {
        name: "Admin",
        description: "Full system administrator with all permissions",
        permissions: [
          'user:read',
          'user:create',
          'user:update',
          'user:delete',
          'care-unit:read',
          'care-unit:create',
          'care-unit:update',
          'care-unit:delete',
          'role:read',
          'role:create',
          'role:update',
          'role:delete',
          'admin:all'
        ],
        isSystem: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    const staffRole = await Role.findOneAndUpdate(
      { name: "Staff" },
      {
        name: "Staff",
        description: "Regular staff member with limited permissions",
        permissions: [
          'care-unit:read',
          'user:read'
        ],
        isSystem: true,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    // Check if admin user already exists
    const adminExists = await User.findOne({ username: "admin" });
    
    if (!adminExists) {
      const defaultAdmin = new User({
        username: "admin",
        password: "admin123",
        role: adminRole._id,
      });
      
      await defaultAdmin.save();
      console.log("Default admin user created with Admin role");
    }

    console.log("Default roles and admin user setup completed");
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

export { createDefaultAdmin };
