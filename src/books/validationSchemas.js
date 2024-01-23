const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().max(255).required(),
  isbn: Joi.string().length(13).required(),
  available_quantity: Joi.number().integer().required(),
  shelf_location: Joi.string().max(255).required(),
  author_id: Joi.number().integer().required(),
});
const bookCopySchema = Joi.object({
  book_id: Joi.number().integer().required(),
});
const bookPatchSchema = Joi.object({
  title: Joi.string().max(255),
  isbn: Joi.string().length(13),
  available_quantity: Joi.number().integer(),
  shelf_location: Joi.string().max(255),
  author_id: Joi.number().integer(),
});

module.exports = {
  bookSchema,
  bookPatchSchema,
  bookCopySchema,
};
