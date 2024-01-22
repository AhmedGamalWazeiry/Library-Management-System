const Joi = require("joi");

const userSchema = Joi.object({
  user_id: Joi.number().integer(),
  first_name: Joi.string().max(255).required(),
  last_name: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
});
const userPatchSchema = Joi.object({
  user_id: Joi.number().integer(),
  first_name: Joi.string().max(255),
  last_name: Joi.string().max(255),
  email: Joi.string().email().max(255),
});

module.exports = {
  userSchema,
  userPatchSchema,
};
