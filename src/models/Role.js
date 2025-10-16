import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    permissions: [{
      type: String,
      enum: [
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
      ]
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });

export default mongoose.model("Role", roleSchema); 