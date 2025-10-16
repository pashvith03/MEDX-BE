import express from "express";
import { listMedications, getMedication, createMedication, updateMedication, deleteMedication } from "../controllers/medicationController.js";
import { auth, adminAuth } from "../middleware/auth.js";
import { validateCreateMedication, validateUpdateMedication } from "../validators/medicationValidator.js";

const router = express.Router({ mergeParams: true });

router.use(auth);

router.get("/", listMedications);
router.get("/:id", getMedication);
router.post("/", adminAuth, validateCreateMedication, createMedication);
router.put("/:id", adminAuth, validateUpdateMedication, updateMedication);
router.delete("/:id", adminAuth, deleteMedication);

export default router;


