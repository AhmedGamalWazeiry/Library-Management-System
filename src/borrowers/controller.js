const db = require("../../db");
const bookQueries = require("./queries");
const { borrowerSchema } = require("./validationSchemas");
const { isBorrowerExist, validateRequest } = require("./utils");

// Add a new book
const addBorrower = async (req, res) => {
  const { isError, message } = await validateRequest(
    borrowerSchema,
    null,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const { first_name, last_name, email } = req.body;

  const borrower = await db.oneOrNone(borrowerQueries.addBorrower, [
    first_name,
    last_name,
    email,
  ]);
  res.status(200).json(borrower);
};

// Update an existing book
const putBorrower = async (req, res) => {
  const bookId = parseInt(req.params.id);

  const { isError, message } = await validateRequest(
    bookSchema,
    bookId,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const { title, isbn, availableQuantity, shelfLocation, authorId } = req.body;

  const book = await db.oneOrNone(bookQueries.putBook, [
    title,
    isbn,
    availableQuantity,
    shelfLocation,
    authorId,
    bookId,
  ]);
  res.status(200).json(book);
};

// Partially update an existing book
const patchBorrower = async (req, res) => {
  const bookId = parseInt(req.params.id);

  const { isError, message } = await validateRequest(
    bookPatchSchema,
    bookId,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  const setString = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");

  const book = await db.oneOrNone(
    bookQueries.patchBook.replace(/SET/, "SET " + setString),
    [bookId, ...values]
  );
  res.status(200).json(book);
};

// Get all books
const getBorrowers = async (req, res) => {
  const books = await db.any(bookQueries.getBooks);
  res.status(200).json(books);
};

// Get a book by ID
const getBorrowerById = async (req, res) => {
  const bookId = parseInt(req.params.id);

  const { isError, message } = await isBookExist(bookId);
  if (isError) return res.status(400).json(message);

  const book = await db.oneOrNone(bookQueries.getBookById, [bookId]);
  res.status(200).json(book);
};

// Delete a book by ID
const deleteBorrower = async (req, res) => {
  const bookId = parseInt(req.params.id);

  const { isError, message } = await isBookExist(bookId);
  if (isError) return res.status(400).json(message);

  const book = await db.oneOrNone(bookQueries.deleteBook, [bookId]);
  res.status(200).json(book);
};

module.exports = {
  getBorrowers,
  addBorrower,
  getBorrowerById,
  putBorrower,
  patchBorrower,
  deleteBorrower,
};
