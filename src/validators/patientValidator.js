import Joi from "joi";

const admitSchema = Joi.object({
  pan: Joi.string().trim().max(100).required(),
  name: Joi.string().trim().max(200).required(),
  age: Joi.number().integer().min(0).max(130).required(),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  admittedAt: Joi.date().required(),
  phone: Joi.string().trim().max(20).required(),
  address: Joi.string().trim().max(500).required(),
  careUnit: Joi.string().required(),
  assignedDoctor: Joi.string().required(),
  bed: Joi.string().required(),
  severity: Joi.string().valid("normal", "severe", "critical").required(),
  symptoms: Joi.string().trim().max(500).optional(),
  email: Joi.string().trim().email().optional(),
});

const updateSchema = Joi.object({
  pan: Joi.string().trim().max(100),
  name: Joi.string().trim().max(200),
  age: Joi.number().integer().min(0).max(130),
  bloodGroup: Joi.string().valid(
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
  ),
  gender: Joi.string().valid("male", "female", "other"),
  phone: Joi.string().trim().max(20),
  email: Joi.string().trim().email(),
  address: Joi.string().trim().max(500),
  severity: Joi.string().valid("normal", "severe"),
  assignedDoctor: Joi.string(),
  careUnit: Joi.string(),
  bed: Joi.string(),
  symptoms: Joi.string().trim().max(500),
  admittedAt: Joi.date(),
  dischargedAt: Joi.date(),
  isActive: Joi.boolean(),
});

const validateAdmitPatient = (req, res, next) => {
  const { error } = admitSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateUpdatePatient = (req, res, next) => {
  const { error } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

export { validateAdmitPatient, validateUpdatePatient };
