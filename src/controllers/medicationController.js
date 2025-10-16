import Medication from "../models/Medication.js";
import CareUnit from "../models/CareUnit.js";

const ensureCareUnit = async (careUnitId) => {
  return CareUnit.findOne({ _id: careUnitId });
};

const listMedications = async (req, res) => {
  try {
    const { careUnitId } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const items = await Medication.find({
      careUnit: careUnitId,
      isActive: true,
    })
      .populate("createdBy", "username")
      .populate("updatedBy", "username")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMedication = async (req, res) => {
  try {
    const { careUnitId, id } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const item = await Medication.findOne({ _id: id, careUnit: careUnitId })
      .populate("createdBy", "username")
      .populate("updatedBy", "username");
    if (!item) return res.status(404).json({ message: "Medication not found" });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createMedication = async (req, res) => {
  try {
    const { careUnitId } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const { medicationName } = req.body;
    const doc = new Medication({
      medicationName,
      careUnit: careUnitId,
      createdBy: req.user._id,
    });
    const saved = await doc.save();
    await saved.populate("createdBy", "username");
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Medication already exists in this care unit" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const updateMedication = async (req, res) => {
  try {
    const { careUnitId, id } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const { medicationName, isActive } = req.body;
    const updateData = { medicationName, updatedBy: req.user._id };
    Object.keys(updateData).forEach(
      (k) => updateData[k] === undefined && delete updateData[k]
    );

    const updated = await Medication.findOneAndUpdate(
      { _id: id, careUnit: careUnitId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "username")
      .populate("updatedBy", "username");
    if (!updated)
      return res.status(404).json({ message: "Medication not found" });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMedication = async (req, res) => {
  try {
    const { careUnitId, id } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const deleted = await Medication.findOneAndDelete({
      _id: id,
      careUnit: careUnitId,
    });
    if (!deleted)
      return res.status(404).json({ message: "Medication not found" });
    res.json({ message: "Medication deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  listMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication,
};
