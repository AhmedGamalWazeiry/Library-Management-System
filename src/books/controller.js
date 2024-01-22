const db = require("../../db");
const bookQueries = require("./queries");
const { bookSchema, bookPatchSchema } = require("./validationSchemas");
const { isBookExist, validateRequest } = require("./utils");

// Add a new book
const addBook = async (req, res) => {
  const { isError, message } = await validateRequest(
    bookSchema,
    null,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const {
    title,
    isbn,
    available_quantity: availableQuantity,
    shelf_location: shelfLocation,
    author_id: authorId,
  } = req.body;

  const book = await db.oneOrNone(bookQueries.addBook, [
    title,
    isbn,
    availableQuantity,
    shelfLocation,
    authorId,
  ]);
  res.status(200).json(book);
};

// Update an existing book
const putBook = async (req, res) => {
  const bookId = parseInt(req.params.id);

  const { isError, message } = await validateRequest(
    bookSchema,
    bookId,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const {
    title,
    isbn,
    available_quantity: availableQuantity,
    shelf_location: shelfLocation,
    author_id: authorId,
  } = req.body;

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
const patchBook = async (req, res) => {
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
const getBooks = async (req, res) => {
  const books = await db.any(bookQueries.getBooks);
  res.status(200).json(books);
};

// Get a book by ID
const getBookById = async (req, res) => {
  const bookId = parseInt(req.params.id);

  const { isError, message } = await isBookExist(bookId);
  if (isError) return res.status(400).json(message);

  const book = await db.oneOrNone(bookQueries.getBookById, [bookId]);
  res.status(200).json(book);
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  const bookId = parseInt(req.params.id);

  const { isError, message } = await isBookExist(bookId);
  if (isError) return res.status(400).json(message);

  const book = await db.oneOrNone(bookQueries.deleteBook, [bookId]);
  res.status(200).json(book);
};

// Search for books based on title, ISBN, and author
const search = async (req, res) => {
  const { title, isbn, author } = req.query;

  const books = await db.any(bookQueries.search, [
    title ? title : "none",
    isbn ? isbn : "none",
    author ? author : "none",
  ]);

  res.status(200).json(books);
};

module.exports = {
  getBooks,
  addBook,
  getBookById,
  putBook,
  patchBook,
  deleteBook,
  search,
};
