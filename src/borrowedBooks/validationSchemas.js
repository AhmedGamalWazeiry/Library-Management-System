const Joi = require("joi");

const borrowedBookSchema = Joi.object({
  BorrowedBook_ID: Joi.number().integer(),
  Book_ID: Joi.number().integer().required(),
  User_ID: Joi.number().integer().required(),
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
};
