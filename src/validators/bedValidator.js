import Joi from "joi";

const createBedSchema = Joi.object({
  bedName: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(500).allow("").optional(),
});

const updateBedSchema = Joi.object({
  bedName: Joi.string().trim().min(1).max(100),
  description: Joi.string().trim().max(500).allow(""),
  isActive: Joi.boolean(),
});

const validateCreateBed = (req, res, next) => {
  const { error } = createBedSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUpdateBed = (req, res, next) => {
  const { error } = updateBedSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export { validateCreateBed, validateUpdateBed };
