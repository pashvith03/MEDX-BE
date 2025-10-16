import Joi from "joi";

const createStaffSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().email().optional(),
  phone: Joi.alternatives()
    .try(Joi.string().trim().max(20), Joi.number())
    .optional(),
  specialization: Joi.string().trim().max(100).optional(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

const validateCreateStaff = (req, res, next) => {
  const { error } = createStaffSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export { validateCreateStaff };
