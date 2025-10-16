import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    bedName: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    careUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareUnit",
      required: true,
      index: true,
    },
    isOccupied: {
      type: Boolean,
      default: false,
      index: true,
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

// Indexes
bedSchema.index({ careUnit: 1, isActive: 1 });
bedSchema.index(
  { bedName: 1, careUnit: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.model("Bed", bedSchema);
