import Joi from "joi";

const createRoleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  description: Joi.string().trim().max(200).allow("").optional(),
  permissions: Joi.array().items(
    Joi.string().valid(
      'user:read',
      'user:create',
      'user:update',
      'user:delete',
      'care-unit:read',
      'care-unit:create',
      'care-unit:update',
      'care-unit:delete',
      'role:read',
      'role:create',
      'role:update',
      'role:delete',
      'admin:all'
    )
  ).optional(),
});

const updateRoleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  description: Joi.string().trim().max(200).allow(""),
  permissions: Joi.array().items(
    Joi.string().valid(
      'user:read',
      'user:create',
      'user:update',
      'user:delete',
      'care-unit:read',
      'care-unit:create',
      'care-unit:update',
      'care-unit:delete',
      'role:read',
      'role:create',
      'role:update',
      'role:delete',
      'admin:all'
    )
  ),
  isActive: Joi.boolean(),
});

const updatePermissionsSchema = Joi.object({
  permissions: Joi.array().items(
    Joi.string().valid(
      'user:read',
      'user:create',
      'user:update',
      'user:delete',
      'care-unit:read',
      'care-unit:create',
      'care-unit:update',
      'care-unit:delete',
      'role:read',
      'role:create',
      'role:update',
      'role:delete',
      'admin:all'
    )
  ).required(),
});

const validateCreateRole = (req, res, next) => {
  const { error } = createRoleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUpdateRole = (req, res, next) => {
  const { error } = updateRoleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateUpdatePermissions = (req, res, next) => {
  const { error } = updatePermissionsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export {
  validateCreateRole,
  validateUpdateRole,
  validateUpdatePermissions,
}; 