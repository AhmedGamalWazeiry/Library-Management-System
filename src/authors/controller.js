const { authorSchema, authorPatchSchema } = require("./validationSchemas");
const { validateRequest, getAndValidateIdParams } = require("./utils");
const { Authors } = require("./models");

// Add a new author
const addAuthor = async (req, res) => {
  const isError = await validateRequest(authorSchema, null, req, res);
  if (isError) return;

  const { first_name, last_name } = req.body;

  const author = await Authors.create({
    First_Name: first_name,
    Last_Name: last_name,
  });

  res.status(201).json(author);
};

// Update an existing author
const putAuthor = async (req, res) => {
  const { authorId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const isError = await validateRequest(authorSchema, null, req, res);
  if (isError) return;

  const { first_name, last_name } = req.body;

  const author = await Authors.findByPk(authorId);
  author.First_Name = first_name;
  author.Last_Name = last_name;

  await author.save();

  res.status(200).json(author);
};

const patchAuthor = async (req, res) => {
  const { authorId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const isError = await validateRequest(authorPatchSchema, null, req, res);
  if (isError) return;

  const { first_name, last_name } = req.body;

  const author = await Authors.findByPk(authorId);

  if (first_name) author.First_Name = first_name;
  if (last_name) author.Last_Name = last_name;

  await author.save();

  res.status(200).json(author);
};

// Get all authors
const getAuthors = async (req, res) => {
  const authors = await Authors.findAll();
  res.status(200).json(authors);
};

// Get an author by ID
const getAuthorById = async (req, res) => {
  const { authorId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const author = await Authors.findByPk(authorId);

  if (author) res.status(200).json(author);

  res.status(400).json("Author not found with the specified ID.");
};

// Delete an author by ID
const deleteAuthor = async (req, res) => {
  const { authorId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const author = await Authors.findByPk(authorId);
  if (author) {
    await author.destroy();
    res.status(200).json(author);
  }

  res.status(400).json("Author not found with the specified ID.");
};

module.exports = {
  getAuthors,
  addAuthor,
  getAuthorById,
  putAuthor,
  patchAuthor,
  deleteAuthor,
};
