import mongoose from "mongoose";

const fluidSchema = new mongoose.Schema(
  {
    fluidName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 150,
    },
    careUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareUnit",
      required: true,
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
  { timestamps: true }
);

fluidSchema.index(
  { careUnit: 1, fluidName: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export default mongoose.model("Fluid", fluidSchema);
