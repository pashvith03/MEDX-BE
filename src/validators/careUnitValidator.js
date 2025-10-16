import Joi from "joi";

const careUnitSchema = Joi.object({
  careUnit: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(500).allow("").optional(),
});

const validateCareUnit = (req, res, next) => {
  const { error } = careUnitSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export { validateCareUnit };
