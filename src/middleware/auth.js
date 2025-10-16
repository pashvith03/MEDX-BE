import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .select("-password")
      .populate("role", "name description permissions");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      // Check if user has admin permissions
      const hasAdminPermission = req.user.role?.permissions?.includes('admin:all');
      const hasRolePermissions = req.user.role?.permissions?.some(permission => 
        permission.startsWith('role:') || permission.startsWith('user:')
      );
      
      if (!hasAdminPermission && !hasRolePermissions) {
        return res
          .status(403)
          .json({ message: "Access denied. Admin role required." });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Permission-based middleware
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      await auth(req, res, () => {
        const hasPermission = req.user.role?.permissions?.includes(permission) ||
                            req.user.role?.permissions?.includes('admin:all');
        
        if (!hasPermission) {
          return res
            .status(403)
            .json({ message: `Access denied. ${permission} permission required.` });
        }
        next();
      });
    } catch (error) {
      res.status(401).json({ message: "Authentication failed" });
    }
  };
};

export { auth, adminAuth, requirePermission };
