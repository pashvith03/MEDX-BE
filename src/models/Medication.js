import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    medicationName: {
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
    isActive: {
      type: Boolean,
      default: true,
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

medicationSchema.index({ careUnit: 1, medicationName: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

export default mongoose.model("Medication", medicationSchema);


