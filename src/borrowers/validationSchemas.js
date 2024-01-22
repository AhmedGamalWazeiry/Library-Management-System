const Joi = require("joi");

const borrowerSchema = Joi.object({
  Borrower_ID: Joi.number().integer(),
  First_Name: Joi.string().max(255).required(),
  Last_Name: Joi.string().max(255).required(),
  Email: Joi.string().email().max(255).required(),
});

module.exports = {
  borrowerSchema,
};
