import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    // new admit-patient fields
    pan: {
      type: String,
      trim: true,
      maxlength: 100,
      unique: true,
      sparse: true,
    },
    name: { type: String, trim: true, maxlength: 200 },
    age: { type: Number, min: 0, max: 130 },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      trim: true,
    },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    phone: { type: String, trim: true, maxlength: 20 },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true, maxlength: 500 },
    severity: { type: String, enum: ["normal", "severe"], default: "normal" },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    symptoms: { type: String, trim: true, maxlength: 500 },

    careUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareUnit",
      required: true,
      index: true,
    },
    bed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bed",
      required: true,
      index: true,
    },
    admittedAt: { type: Date, default: Date.now },
    dischargedAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// simple guard to ensure discharge occurs after admit
patientSchema.pre("save", function (next) {
  if (this.dischargedAt && this.dischargedAt < this.admittedAt) {
    return next(new Error("dischargedAt cannot be before admittedAt"));
  }
  next();
});

export default mongoose.model("Patient", patientSchema);
