const db = require("../../db");
const authorQueries = require("./queries"); // Update the import
const { authorSchema, authorPatchSchema } = require("./validationSchemas"); // Update the import
const { isAuthorExist, validateRequest } = require("./utils"); // Update the import

// Add a new author
const addAuthor = async (req, res) => {
  const { isError, message } = await validateRequest(
    authorSchema, // Update the schema
    null,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const { first_name, last_name } = req.body;

  const author = await db.oneOrNone(authorQueries.addAuthor, [
    // Update the query
    first_name,
    last_name,
  ]);
  res.status(200).json(author);
};

// Update an existing author
const putAuthor = async (req, res) => {
  const authorId = parseInt(req.params.id);

  const { isError, message } = await validateRequest(
    authorSchema, // Update the schema
    authorId,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const { first_name, last_name } = req.body;
  const author = await db.oneOrNone(authorQueries.putAuthor, [
    // Update the query
    first_name,
    last_name,
    authorId,
  ]);
  res.status(200).json(author);
};

// Partially update an existing author
const patchAuthor = async (req, res) => {
  const authorId = parseInt(req.params.id);

  const { isError, message } = await validateRequest(
    authorPatchSchema, // Update the schema
    authorId,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  const setString = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");

  const author = await db.oneOrNone(
    authorQueries.patchAuthor.replace(/SET/, "SET " + setString), // Update the query
    [authorId, ...values]
  );
  res.status(200).json(author);
};

// Get all authors
const getAuthors = async (req, res) => {
  const authors = await db.any(authorQueries.getAuthors); // Update the query
  res.status(200).json(authors);
};

// Get an author by ID
const getAuthorById = async (req, res) => {
  const authorId = parseInt(req.params.id);

  const { isError, message } = await isAuthorExist(authorId); // Update the function
  if (isError) return res.status(400).json(message);

  const author = await db.oneOrNone(authorQueries.getAuthorById, [
    // Update the query
    authorId,
  ]);
  res.status(200).json(author);
};

// Delete an author by ID
const deleteAuthor = async (req, res) => {
  const authorId = parseInt(req.params.id);

  const { isError, message } = await isAuthorExist(authorId); // Update the function
  if (isError) return res.status(400).json(message);

  const author = await db.oneOrNone(authorQueries.deleteAuthor, [
    // Update the query
    authorId,
  ]);
  res.status(200).json(author);
};

module.exports = {
  getAuthors,
  addAuthor,
  getAuthorById,
  putAuthor,
  patchAuthor,
  deleteAuthor,
};
