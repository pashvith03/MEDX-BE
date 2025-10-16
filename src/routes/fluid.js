import express from "express";
import {
  listFluids,
  getFluid,
  createFluid,
  updateFluid,
  deleteFluid,
} from "../controllers/fluidController.js";
import { auth, adminAuth } from "../middleware/auth.js";
import {
  validateCreateFluid,
  validateUpdateFluid,
} from "../validators/fluidValidator.js";

const router = express.Router({ mergeParams: true });

router.use(auth);

router.get("/", listFluids);
router.get("/:id", getFluid);
router.post("/", adminAuth, createFluid);
router.put("/:id", adminAuth, validateUpdateFluid, updateFluid);
router.delete("/:id", adminAuth, deleteFluid);

export default router;
