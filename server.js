import dotenv from "dotenv";
import express from "express";

// Import configurations
import connectDB from "./src/config/database.js";
import configureExpress from "./src/config/express.js";

// Import routes
import authRoutes from "./src/routes/auth.js";
import careUnitRoutes from "./src/routes/careUnit.js";
import userRoutes from "./src/routes/user.js";
import roleRoutes from "./src/routes/role.js";
import bedRoutes from "./src/routes/bed.js";
import fluidRoutes from "./src/routes/fluid.js";
import medicationRoutes from "./src/routes/medication.js";
import hospitalLogoRoutes from "./src/routes/hospitalLogo.js";
import patientRoutes from "./src/routes/patient.js";
import staffRoutes from "./src/routes/staff.js";

// Import middleware
import { errorHandler } from "./src/middleware/errorHandler.js";

// Import utilities
import { createDefaultAdmin } from "./src/utils/createDefaultAdmin.js";

dotenv.config();

const app = express();

// Configure Express middleware
configureExpress(app);

// Connect to MongoDB
connectDB().then(() => {
  // Create default admin user after database connection
  createDefaultAdmin();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/care-units", careUnitRoutes);
app.use("/api/care-units/:careUnitId/beds", bedRoutes);
app.use("/api/care-units/:careUnitId/fluids", fluidRoutes);
app.use("/api/care-units/:careUnitId/medications", medicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static("uploads")
);
app.use("/api/hospital-logo", hospitalLogoRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/staff", staffRoutes);
app.get("/", (req, res) => {
  res.status(200).json("Hello Express");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
