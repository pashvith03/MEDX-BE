import Joi from "joi";

const createUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().email().optional(),
  phone: Joi.string().trim().max(20).optional(),
  specialization: Joi.string().trim().max(100).optional(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100),
  lastName: Joi.string().trim().min(1).max(100),
  email: Joi.string().trim().email(),
  phone: Joi.string().trim().max(20),
  specialization: Joi.string().trim().max(100),
  username: Joi.string().alphanum().min(3).max(30),
  role: Joi.string(),
  isActive: Joi.boolean(),
});

const validateCreateUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUpdateUser = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export {
  validateCreateUser,
  validateUpdateUser,
}; 