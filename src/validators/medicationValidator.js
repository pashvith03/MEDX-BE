import Joi from "joi";

const createMedicationSchema = Joi.object({
  medicationName: Joi.string().trim().min(1).max(150).required(),
});

const updateMedicationSchema = Joi.object({
  medicationName: Joi.string().trim().min(1).max(150),
  isActive: Joi.boolean(),
});

const validateCreateMedication = (req, res, next) => {
  const { error } = createMedicationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateUpdateMedication = (req, res, next) => {
  const { error } = updateMedicationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

export { validateCreateMedication, validateUpdateMedication };


