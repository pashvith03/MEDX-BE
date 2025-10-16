import Joi from "joi";

const createLogoSchema = Joi.object({
  name: Joi.string().trim().max(150).optional(),
  imageUrl: Joi.string().uri().required(),
});

const updateLogoSchema = Joi.object({
  name: Joi.string().trim().max(150),
  imageUrl: Joi.string().uri(),
  isActive: Joi.boolean(),
});

const validateCreateLogo = (req, res, next) => {
  const { error } = createLogoSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateUpdateLogo = (req, res, next) => {
  const { error } = updateLogoSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

export { validateCreateLogo, validateUpdateLogo };


