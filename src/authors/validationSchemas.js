const Joi = require("joi");

const authorSchema = Joi.object({
  first_name: Joi.string().max(255).required(),
  last_name: Joi.string().max(255).required(),
});
const authorPatchSchema = Joi.object({
  first_name: Joi.string().max(255),
  last_name: Joi.string().max(255),
});

module.exports = {
  authorSchema,
  authorPatchSchema,
};
