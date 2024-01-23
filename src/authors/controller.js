const db = require("../../db");
const { authorSchema, authorPatchSchema } = require("./validationSchemas"); // Update the import
const { validateRequest } = require("./utils"); // Update the import
const { Authors } = require("./models");

// Add a new author
const addAuthor = async (req, res) => {
  try {
    // Validate request
    const { isError, message } = await validateRequest(
      authorSchema,
      null,
      req,
      res
    );
    if (isError) return res.status(400).json(message);

    // Extract data from request body
    const { first_name, last_name } = req.body;

    // Create author using Sequelize model
    const author = await Authors.create({
      First_Name: first_name,
      Last_Name: last_name,
    });

    // Respond with the created author
    res.status(201).json(author);
  } catch (error) {
    console.error("Error adding author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
  const author = await Authors.findByPk(authorId);
  // Update the author's properties
  author.first_name = first_name;
  author.last_name = last_name;
  // Save the changes to the database
  await author.save();

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
  const { first_name, last_name } = req.body;
  const author = await Authors.findByPk(authorId);
  // Update the author's properties
  if (first_name) author.first_name = first_name;
  if (last_name) author.last_name = last_name;
  // Save the changes to the database
  await author.save();
  res.status(200).json(author);
};

// Get all authors
const getAuthors = async (req, res) => {
  const authors = await Authors.findAll(); // Update the query
  res.status(200).json(authors);
};

// Get an author by ID
const getAuthorById = async (req, res) => {
  const authorId = parseInt(req.params.id);
  const author = await Authors.findByPk(authorId);
  if (author) {
    res.status(200).json(author);
  }

  res.status(400).json("Author not found with the specified ID.");
};

// Delete an author by ID
const deleteAuthor = async (req, res) => {
  const authorId = parseInt(req.params.id);
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
