const {
  bookSchema,
  bookPatchSchema,
  bookCopySchema,
} = require("./validationSchemas");
const { Op } = require("sequelize");
const { validateRequest } = require("./utils");
const { Books, BookCopies } = require("./models");
const { Authors } = require("../authors/models");

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

  const book = await Books.create({
    Title: title,
    ISBN: isbn,
    Available_Quantity: availableQuantity,
    Shelf_Location: shelfLocation,
    Author_ID: authorId,
  });
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

  const updatedBook = await Books.update(
    {
      Title: title,
      ISBN: isbn,
      Available_Quantity: availableQuantity,
      Shelf_Location: shelfLocation,
      Author_ID: authorId,
    },
    {
      where: {
        Book_ID: bookId,
      },
    }
  );
  res.status(200).json(updatedBook);
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
  const { title, isbn, available_quantity, shelf_location, author_id } =
    req.body;
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
const getBooksCopies = async (req, res) => {
  const bookCopies = await BookCopies.findAll();
  res.status(200).json(bookCopies);
};

// Get a book by ID
const getBookById = async (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = await Books.findByPk(bookId);
  if (book) res.status(200).json(book);
  res.status(400).json("Book not found with the specified ID.");
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  const bookId = parseInt(req.params.id);

  const book = await Books.findByPk(bookId);
  if (book) {
    await book.destroy();

    res.status(200).json(book);
  }

  res.status(400).json("book not found with the specified ID.");
};

const addBookCopy = async (req, res) => {
  const { isError, message } = await validateRequest(
    bookCopySchema,
    null,
    req,
    res
  );

  if (isError) return res.status(400).json(message);
  const { book_id } = req.body;

  const bookCopy = await BookCopies.create({
    Book_ID: book_id,
    Status: "available", // Assuming the default status is 'available'
  });
  res.status(200).json(bookCopy);
};

const deleteBookCopy = async (req, res) => {
  const bookCopyId = parseInt(req.params.id);

  const bookCopy = await BookCopies.findByPk(bookCopyId);
  if (bookCopy) {
    await bookCopy.destroy();

    res.status(200).json(bookCopy);
  }

  res.status(400).json("book Copy not found with the specified ID.");
};

// Search for books based on title, ISBN, and author
const search = async (req, res) => {
  const { title, isbn, author } = req.query;

  let whereClause = {};

  if (title) {
    whereClause.Title = { [Op.iLike]: `%${title}%` };
  }

  if (isbn) {
    whereClause.ISBN = { [Op.iLike]: `%${isbn}%` };
  }

  if (author) {
    whereClause["$Author.First_Name$"] = { [Op.iLike]: `%${author}%` };
  }

  const books = await Books.findAll({
    where: whereClause,
    include: [
      {
        model: Authors,
        attributes: ["First_Name", "Last_Name"],
        as: "Author", // assuming you've aliased your association
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
