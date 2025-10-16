import Joi from "joi";

const createFluidSchema = Joi.object({
  fluidName: Joi.string().trim().min(1).max(150).required(),
});

const updateFluidSchema = Joi.object({
  fluidName: Joi.string().trim().min(1).max(150),
  isActive: Joi.boolean(),
});

const validateCreateFluid = (req, res, next) => {
  const { error } = createFluidSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateUpdateFluid = (req, res, next) => {
  const { error } = updateFluidSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

export { validateCreateFluid, validateUpdateFluid };


