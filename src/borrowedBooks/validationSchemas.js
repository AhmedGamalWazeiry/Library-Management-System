const Joi = require("joi");

const borrowedBookSchema = Joi.object({
  BorrowedBooks_ID: Joi.number().integer().required(),
  Book_ID: Joi.number().integer().required(),
  User_ID: Joi.number().integer().required(),
  Checkout_Date: Joi.date().default("now").required(),
  Due_Date: Joi.date().required(),
  Return_Date: Joi.date().allow(null),
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
