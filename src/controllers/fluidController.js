import Fluid from "../models/Fluid.js";
import CareUnit from "../models/CareUnit.js";

const ensureCareUnit = async (careUnitId) => {
  return CareUnit.findOne({ _id: careUnitId });
};

const listFluids = async (req, res) => {
  try {
    const { careUnitId } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const items = await Fluid.find({ careUnit: careUnitId })
      .populate("createdBy", "username")
      .populate("updatedBy", "username")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFluid = async (req, res) => {
  try {
    const { careUnitId, id } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const item = await Fluid.findOne({ _id: id, careUnit: careUnitId })
      .populate("createdBy", "username")
      .populate("updatedBy", "username");
    if (!item) return res.status(404).json({ message: "Fluid not found" });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createFluid = async (req, res) => {
  try {
    const { careUnitId } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const { fluidName } = req.body;
    const doc = new Fluid({
      fluidName,
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
        .json({ message: "Fluid already exists in this care unit" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const updateFluid = async (req, res) => {
  try {
    const { careUnitId, id } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const { fluidName, isActive } = req.body;
    const updateData = { fluidName, updatedBy: req.user._id };
    Object.keys(updateData).forEach(
      (k) => updateData[k] === undefined && delete updateData[k]
    );

    const updated = await Fluid.findOneAndUpdate(
      { _id: id, careUnit: careUnitId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("createdBy", "username")
      .populate("updatedBy", "username");
    if (!updated) return res.status(404).json({ message: "Fluid not found" });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFluid = async (req, res) => {
  try {
    const { careUnitId, id } = req.params;
    const cu = await ensureCareUnit(careUnitId);
    if (!cu) return res.status(404).json({ message: "Care unit not found" });

    const deleted = await Fluid.findOneAndDelete(
      { _id: id, careUnit: careUnitId },
      { updatedBy: req.user._id }
    );
    if (!deleted) return res.status(404).json({ message: "Fluid not found" });
    res.json({ message: "Fluid deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { listFluids, getFluid, createFluid, updateFluid, deleteFluid };
