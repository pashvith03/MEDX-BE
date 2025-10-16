import mongoose from "mongoose";

const hospitalLogoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "Hospital Logo",
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
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

export default mongoose.model("HospitalLogo", hospitalLogoSchema);


