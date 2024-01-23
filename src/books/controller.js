const { Op } = require("sequelize");
const { sequelize } = require("../../db");
const { validateRequest, getAndValidateIdParams } = require("./utils");
const { Books, BookCopies } = require("./models");
const { Authors } = require("../authors/models");
const {
  bookSchema,
  bookPatchSchema,
  bookCopySchema,
} = require("./validationSchemas");

// Add a new book
const addBook = async (req, res) => {
  const isError = await validateRequest(bookSchema, null, req, res);
  if (isError) return;

  const { title, isbn, shelf_location, author_id } = req.body;

  const book = await Books.create({
    Title: title,
    ISBN: isbn,
    Shelf_Location: shelf_location,
    Author_ID: author_id,
  });
  res.status(200).json(book);
};

// Update an existing book
const putBook = async (req, res) => {
  const { bookId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const isError = await validateRequest(bookSchema, null, req, res);
  if (isError) return;

  const { title, isbn, shelf_location, author_id } = req.body;

  const updatedBook = await Books.findByPk(bookId);
  updatedBook.Title = title;
  updatedBook.ISBN = isbn;
  updatedBook.Shelf_Location = shelf_location;
  updatedBook.Author_ID = author_id;

  await updatedBook.save();

  res.status(200).json(updatedBook);
};

// Partially update an existing book
const patchBook = async (req, res) => {
  const { bookId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const isError = await validateRequest(bookPatchSchema, null, req, res);
  if (isError) return;

  const { title, isbn, shelf_location, author_id } = req.body;

  const book = await Books.findByPk(bookId);

  if (title) book.Title = title;
  if (isbn) book.ISBN = isbn;
  if (shelf_location) book.Shelf_Location = shelf_location;
  if (author_id) book.Author_ID = author_id;

  await book.save();

  res.status(200).json(book);
};

// Get all books
const getBooks = async (req, res) => {
  const booksWithAuthors = await Books.findAll({
    include: [
      {
        model: Authors,
        attributes: ["First_Name", "Last_Name"],
        as: "Author",
      },
    ],
  });

  res.status(200).json(booksWithAuthors);
};

// Get all book Copies
const getBooksCopies = async (req, res) => {
  const bookCopies = await BookCopies.findAll();
  res.status(200).json(bookCopies);
};

// Get a book by ID
const getBookById = async (req, res) => {
  const { bookId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const book = await Books.findByPk(bookId);

  if (book) res.status(200).json(book);

  res.status(400).json("Book not found with the specified ID.");
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  const { bookId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const book = await Books.findByPk(bookId);

  if (book) {
    await book.destroy();
    res.status(200).json(book);
  }

  res.status(400).json("book not found with the specified ID.");
};

// Delete a book Copy by ID
const addBookCopy = async (req, res) => {
  const isError = await validateRequest(bookCopySchema, null, req, res);
  if (isError) return;

  const { book_id } = req.body;

  const book = await Books.findByPk(book_id);
  if (book) {
    const bookCopy = await BookCopies.create({
      Book_ID: book_id,
      Status: "available", // default status is 'available'
    });

    res.status(200).json(bookCopy);
  }

  res.status(400).json("book not found with the specified ID.");
};

const deleteBookCopy = async (req, res) => {
  const { bookId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const bookCopy = await BookCopies.findByPk(bookId);

  if (bookCopy) {
    await bookCopy.destroy();
    res.status(200).json(bookCopy);
  }

  res.status(400).json("book Copy not found with the specified ID.");
};

// Search for books based on title, ISBN, and author
const search = async (req, res) => {
  const { title, isbn, author } = req.query;

  let whereClause = {
    [Op.or]: [],
  };

  if (title) {
    whereClause[Op.or].push({ Title: { [Op.iLike]: `%${title}%` } });
  }

  if (isbn) {
    whereClause[Op.or].push({ ISBN: { [Op.iLike]: `%${isbn}%` } });
  }

  if (author) {
    const authorSearchTerm = `%${author}%`;

    whereClause[Op.or].push({
      [Op.or]: [
        sequelize.literal(
          `CONCAT("Author"."First_Name", ' ', "Author"."Last_Name") ILIKE '${authorSearchTerm}'`
        ),
      ],
    });
  }

  const books = await Books.findAll({
    where: whereClause,
    include: [
      {
        model: Authors,
        attributes: ["First_Name", "Last_Name"],
        as: "Author",
      },
    ],
  });

  res.status(200).json(books);
};

module.exports = {
  getBooks,
  getBooksCopies,
  addBook,
  addBookCopy,
  getBookById,
  putBook,
  patchBook,
  deleteBook,
  deleteBookCopy,
  search,
};
