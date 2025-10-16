import Bed from "../models/Bed.js";
import CareUnit from "../models/CareUnit.js";

// Ensure care unit exists and is active
const ensureCareUnit = async (careUnitId) => {
  const careUnit = await CareUnit.findOne({ _id: careUnitId });
  return careUnit;
};

// @desc    List beds under a care unit
// @route   GET /api/care-units/:careUnitId/beds
// @access  Private
const listBeds = async (req, res) => {
  try {
    const { careUnitId } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const beds = await Bed.find({ careUnit: careUnitId })
      .populate("createdBy", "username")
      .populate("updatedBy", "username")
      .sort({ createdAt: -1 });

    res.json(beds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single bed in a care unit
// @route   GET /api/care-units/:careUnitId/beds/:id
// @access  Private
const getBed = async (req, res) => {
  try {
    const { careUnitId, id } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const bed = await Bed.findOne({ _id: id, careUnit: careUnitId })
      .populate("createdBy", "username")
      .populate("updatedBy", "username");

    if (!bed) return res.status(404).json({ message: "Bed not found" });
    res.json(bed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create bed within a care unit
// @route   POST /api/care-units/:careUnitId/beds
// @access  Private (Admin only)
const createBed = async (req, res) => {
  try {
    const { careUnitId } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const { bedName, description } = req.body;

    const newBed = new Bed({
      bedName,
      description,
      careUnit: careUnitId,
      createdBy: req.user._id,
    });

    const saved = await newBed.save();
    await saved.populate("createdBy", "username");
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Bed with this name already exists in this care unit",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update bed
// @route   PUT /api/care-units/:careUnitId/beds/:id
// @access  Private (Admin only)
const updateBed = async (req, res) => {
  try {
    const { careUnitId, id } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const { bedName, description, isActive } = req.body;
    const updateData = {
      bedName,
      description,
      updatedBy: req.user._id,
    };
    Object.keys(updateData).forEach(
      (k) => updateData[k] === undefined && delete updateData[k]
    );

    const updated = await Bed.findOneAndUpdate(
      { _id: id, careUnit: careUnitId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "username")
      .populate("updatedBy", "username");

    if (!updated) return res.status(404).json({ message: "Bed not found" });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Soft delete bed
// @route   DELETE /api/care-units/:careUnitId/beds/:id
// @access  Private (Admin only)
const deleteBed = async (req, res) => {
  try {
    const { careUnitId, id } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const deleted = await Bed.findOneAndDelete(
      { _id: id, careUnit: careUnitId },
      { updatedBy: req.user._id }
    );

    if (!deleted) return res.status(404).json({ message: "Bed not found" });
    res.json({ message: "Bed deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { listBeds, getBed, createBed, updateBed, deleteBed };
