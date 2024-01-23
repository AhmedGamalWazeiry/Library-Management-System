const { borrowedBookSchema, userPatchSchema } = require("./validationSchemas");
const { Op } = require("sequelize");
const { sequelize } = require("../../db");
const {
  isCopyBookExistAndAvaliable,
  validateRequest,
  CheckIfCanReturnBook,
} = require("./utils");

const { BorrowedBooks } = require("./models");
const { BookCopies } = require("../books/models");

const borrowBook = async (req, res) => {
  const { isError, message } = await validateRequest(borrowedBookSchema, req);

  if (isError) return res.status(400).json(message);

  const { copy_id, user_id } = req.body;

  let due_date = new Date();
  due_date.setDate(due_date.getDate() + 7);

  const { isErrorOccur, messageError, bookCopy } =
    await isCopyBookExistAndAvaliable(copy_id);
  if (isErrorOccur) return res.status(400).json(messageError);

  sequelize
    .transaction(async (t) => {
      await bookCopy.update({ Status: "not available" }, { transaction: t });

      const borrowedBook = await BorrowedBooks.create(
        {
          Copy_ID: copy_id,
          User_ID: user_id,
          Due_Date: due_date,
        },
        { transaction: t }
      );

      return { Book: borrowedBook, BookCopy: bookCopy };
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "The borrow book operation failed" });
    });
};

const returnBook = async (req, res) => {
  const { isError, message } = await validateRequest(borrowedBookSchema, req);

  if (isError) return res.status(400).json(message);

  const { copy_id, user_id } = req.body;

  const { isErrorOccur, messageError, borrowedBook } =
    await CheckIfCanReturnBook(copy_id, user_id);
  if (isErrorOccur) return res.status(400).json(messageError);

  const bookCopy = await BookCopies.findByPk(copy_id);

  if (!bookCopy) {
    res.status(400).json("Book Copy not found with the specified ID.");
  }

  const return_date = new Date();

  sequelize
    .transaction(async (t) => {
      await bookCopy.update({ Status: "available" }, { transaction: t });

      await borrowedBook.update(
        { Return_Date: return_date, User_ID: user_id, Copy_ID: copy_id },
        { transaction: t }
      );

      return { RetunedBook: borrowedBook, BookCopy: bookCopy };
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: "the return book opertaion failed" });
    });
};

const userBorrowedBooks = async (req, res) => {
  const { isError, message } = await validateRequest(borrowedBookSchema, req);
  if (isError) return res.status(400).json(message);

  const { user_id } = req.body;

  const books = await BorrowedBooks.findAll({
    where: {
      User_ID: user_id,
      Return_Date: null,
    },
  });
  res.status(200).json(books);
};
const borrowedBooks = async (req, res) => {
  const books = await BorrowedBooks.findAll();
  res.status(200).json(books);
};

const overDueBorrowedBooks = async (req, res) => {
  const currentDate = new Date();
  const overDueBorrowedBooks = await BorrowedBooks.findAll({
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            { Due_Date: { [Op.lt]: currentDate } },
            { Return_Date: { [Op.eq]: null } },
          ],
        },
        {
          [Op.and]: [
            { Return_Date: { [Op.ne]: null } },
            { Due_Date: { [Op.lt]: sequelize.col("Return_Date") } }, // Use Op.ne for "not equal to"
          ],
        },
      ],
    },
  });
  res.status(200).json(overDueBorrowedBooks);
};

// Update an existing user
const putBorrowedBooks = async (req, res) => {
  const bookId = parseInt(req.params.id);
  const { return_date, due_date } = req.body;

  const book = await BorrowedBooks.findByPk(bookId);
  if (book) await book.update({ Return_Date: return_date, Due_Date: due_date });
  res.status(200).json(book);
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
  userBorrowedBooks,
  putBorrowedBooks,
  overDueBorrowedBooks,
  borrowedBooks,
};
