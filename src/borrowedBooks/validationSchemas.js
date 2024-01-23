const Joi = require("joi");

const borrowedBookSchema = Joi.object({
  copy_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required(),
});
const getborrowedBookSchema = Joi.object({
  user_id: Joi.number().integer().required(),
});
const userPatchSchema = Joi.object({
  user_id: Joi.number().integer(),
  first_name: Joi.string().max(255),
  last_name: Joi.string().max(255),
  email: Joi.string().email().max(255),
});

module.exports = {
  borrowedBookSchema,
  userPatchSchema,
  getborrowedBookSchema,
};
