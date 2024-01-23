const db = require("../../db");
const borrowedBooksQueries = require("./queries"); // Update the import
const bookQueries = require("../books/queries");
const {
  borrowedBookSchema,
  userPatchSchema,
  getborrowedBookSchema,
} = require("./validationSchemas"); // Update the import
const {
  isCopyBookExistAndAvaliable,
  validateRequest,
  CheckIfCanReturnBook,
} = require("./utils"); // Update the import

// Add a new user
const borrowBook = async (req, res) => {
  const { isError, message } = await validateRequest(
    borrowedBookSchema, // Update the schema
    null,
    req,
    res
  );

  if (isError) return res.status(400).json(message);

  const { copy_id, user_id } = req.body;

  const { isErrorOccur, messageError } = await isCopyBookExistAndAvaliable(
    copy_id
  );

  if (isErrorOccur) return res.status(400).json(messageError);

  let due_date = new Date();
  due_date.setDate(due_date.getDate() + 7);

  // Start a new transaction
  db.tx(async (t) => {
    bookCopy = await t.oneOrNone(bookQueries.UpdateBookCopyStatus, [
      copy_id,
      "not available",
    ]);
    user = await t.oneOrNone(borrowedBooksQueries.borrowBook, [
      user_id,
      copy_id,
      due_date,
    ]);

    return { User: user, BookCopy: bookCopy };
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "the borrow book opertaion failed" });
    });
};

const returnBook = async (req, res) => {
  const { isError, message } = await validateRequest(
    borrowedBookSchema, // Update the schema
    null,
    req,
    res
  );

  if (isError) return res.status(400).json(message);

  const { copy_id, user_id } = req.body;

  const { isErrorOccur, messageError } = await CheckIfCanReturnBook(copy_id);
  if (isErrorOccur) return res.status(400).json(messageError);

  const return_date = new Date();

  db.tx(async (t) => {
    bookCopy = await t.oneOrNone(bookQueries.UpdateBookCopyStatus, [
      copy_id,
      "available",
    ]);
    const user = await db.oneOrNone(
      borrowedBooksQueries.UpdateBorrowedBookReturnDate,
      [
        // Update the query
        return_date,
        user_id,
        copy_id,
      ]
    );

    return { User: user, BookCopy: bookCopy };
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "the return book opertaion failed" });
    });
};

const borrowedBooks = async (req, res) => {
  const { isError, message } = await validateRequest(
    getborrowedBookSchema, // Update the schema
    null,
    req,
    res
  );
  const { user_id } = req.body;

  if (isError) return res.status(400).json(message);
  const books = await db.any(borrowedBooksQueries.getBorrowedBooks, [user_id]); // Update the query
  res.status(200).json(books);
};

// Update an existing user
const putUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  const { isError, message } = await validateRequest(
    userSchema, // Update the schema
    userId,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const { first_name, last_name, email } = req.body;

  const user = await db.oneOrNone(userQueries.putUser, [
    // Update the query
    first_name,
    last_name,
    email,
    userId,
  ]);
  res.status(200).json(user);
};

// Partially update an existing user
const patchUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  const { isError, message } = await validateRequest(
    userPatchSchema, // Update the schema
    userId,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  const setString = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");

  const user = await db.oneOrNone(
    userQueries.patchUser.replace(/SET/, "SET " + setString), // Update the query
    [userId, ...values]
  );
  res.status(200).json(user);
};

// Get all users
const getUsers = async (req, res) => {
  const users = await db.any(userQueries.getUsers); // Update the query
  res.status(200).json(users);
};

// Get a user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  const { isError, message } = await isUserExist(userId); // Update the function
  if (isError) return res.status(400).json(message);

  const user = await db.oneOrNone(userQueries.getUserById, [
    // Update the query
    userId,
  ]);
  res.status(200).json(user);
};

module.exports = {
  borrowBook,
  returnBook,
  borrowedBooks,
};
