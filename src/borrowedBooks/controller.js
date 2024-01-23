const { borrowedBookSchema } = require("./validationSchemas");
const { Op } = require("sequelize");
const { sequelize } = require("../../db");
require("dotenv").config();
const {
  isCopyBookExistAndAvaliable,
  validateRequest,
  CheckIfCanReturnBook,
  cleanAndExportBorrowingProcess,
  getAndValidateIdParams,
  isUserExist,
} = require("./utils");

const baseURL = process.env.BASE_URL;
const { BorrowedBooks } = require("./models");
const { BookCopies, Books } = require("../books/models");
const { Users } = require("../users/models");
const { Authors } = require("../authors/models");

const borrowBook = async (req, res) => {
  const isError = await validateRequest(borrowedBookSchema, req, res);
  if (isError) return;

  const { copy_id, user_id } = req.body;

  let due_date = new Date();
  due_date.setDate(due_date.getDate() + 7); // let's make the due date 7 days from checkout

  let { currentCopyBook, isErrorOccur } = await isCopyBookExistAndAvaliable(
    copy_id,
    res
  );
  if (isErrorOccur) return;

  let checkError = await isUserExist(user_id, res);
  if (checkError) return;

  sequelize
    .transaction(async (t) => {
      await currentCopyBook.update(
        { Status: "not available" },
        { transaction: t }
      );

      const borrowedBook = await BorrowedBooks.create(
        {
          Copy_ID: copy_id,
          User_ID: user_id,
          Due_Date: due_date,
        },
        { transaction: t }
      );

      return { Book: borrowedBook, BookCopy: currentCopyBook };
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: "The borrow book operation failed" });
    });
};

const returnBook = async (req, res) => {
  const isError = await validateRequest(borrowedBookSchema, req, res);
  if (isError) return;

  const { copy_id, user_id } = req.body;

  let checkError = await isUserExist(user_id, res);
  if (checkError) return;

  const bookCopy = await BookCopies.findByPk(copy_id);
  if (!bookCopy)
    res.status(400).json("Book Copy not found with the specified ID.");

  const { borrowedBook, checkIsError } = await CheckIfCanReturnBook(
    copy_id,
    user_id
  );
  if (checkIsError) return;
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
  const isError = await validateRequest(borrowedBookSchema, req, res);
  if (isError) return;

  const { user_id } = req.body;

  let checkError = await isUserExist(user_id, res);
  if (checkError) return;

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
            { Due_Date: { [Op.lt]: sequelize.col("Return_Date") } },
          ],
        },
      ],
    },
  });
  res.status(200).json(overDueBorrowedBooks);
};

//I use this endpoint only for test the search endpoints like the below endpoints
const putBorrowedBooks = async (req, res) => {
  const { bookId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const { return_date, due_date, checkout_date } = req.body;

  const book = await BorrowedBooks.findByPk(bookId);

  if (book) {
    if (return_date) book.Return_Date = return_date;
    if (due_date) book.Due_Date = due_date;
    if (checkout_date) book.Checkout_Date = checkout_date;
    await book.save();
    res.status(200).json(book);
  }

  res.status(400).json("Book not found with the specified ID.");
};

const libraryBorrowingInsights = async (req, res) => {
  filePath = "/usr/src/app/public/insights.csv";

  const { start_date, end_date } = req.query;

  const borrowedBooks = await BorrowedBooks.findAll({
    where: {
      [Op.or]: [
        {
          Checkout_Date: {
            [Op.between]: [start_date, end_date],
          },
        },
        {
          Return_Date: {
            [Op.between]: [start_date, end_date],
          },
        },
      ],
    },
    include: [
      {
        model: BookCopies,
        attributes: ["Status"],
        include: [
          {
            model: Books,
            attributes: ["Book_ID", "Title", "ISBN", "Shelf_Location"],
            include: [
              {
                model: Authors,
                attributes: [
                  ["First_Name", "Author_First_Name"],
                  ["Last_Name", "Author_Last_Name"],
                ],
              },
            ],
          },
        ],
      },
      {
        model: Users,
        attributes: [
          ["First_Name", "User_First_Name"],
          ["Last_Name", "User_Last_Name"],
        ],
      },
    ],
  });

  let link = await cleanAndExportBorrowingProcess(borrowedBooks, filePath);

  link = baseURL + "/insights.csv";

  res.status(200).json(link);
};

const exportOverDueBorrowedBooksLastMonth = async (req, res) => {
  filePath = "/usr/src/app/public/over-due-books.csv";

  const date = new Date();
  const firstDayOfLastMonth = new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    1
  );
  const firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  const borrowedBooks = await BorrowedBooks.findAll({
    where: {
      [Op.and]: [
        {
          Due_Date: {
            [Op.between]: [firstDayOfLastMonth, firstDayOfThisMonth],
          },
        },
        {
          [Op.or]: [
            {
              Return_Date: { [Op.eq]: null },
            },
            {
              Due_Date: { [Op.lt]: sequelize.col("Return_Date") },
            },
          ],
        },
      ],
    },
    include: [
      {
        model: BookCopies,
        attributes: ["Status"],
        include: [
          {
            model: Books,
            attributes: ["Book_ID", "Title", "ISBN", "Shelf_Location"],
            include: [
              {
                model: Authors,
                attributes: [
                  ["First_Name", "Author_First_Name"],
                  ["Last_Name", "Author_Last_Name"],
                ],
              },
            ],
          },
        ],
      },
      {
        model: Users,
        attributes: [
          ["First_Name", "User_First_Name"],
          ["Last_Name", "User_Last_Name"],
        ],
      },
    ],
  });

  let link = await cleanAndExportBorrowingProcess(borrowedBooks, filePath);

  link = baseURL + "/over-due-books.csv";

  res.status(200).json(link);
};

const exportBorrowBooksProccessLastMonth = async (req, res) => {
  filePath = "/usr/src/app/public/borrow-books-proceses-last-month.csv";

  const date = new Date();
  const firstDayOfLastMonth = new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    1
  );
  const firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  const borrowedBooks = await BorrowedBooks.findAll({
    where: {
      [Op.or]: [
        {
          Checkout_Date: {
            [Op.between]: [firstDayOfLastMonth, firstDayOfThisMonth],
          },
        },
        {
          Return_Date: {
            [Op.between]: [firstDayOfLastMonth, firstDayOfThisMonth],
          },
        },
      ],
    },
    include: [
      {
        model: BookCopies,
        attributes: ["Status"],
        include: [
          {
            model: Books,
            attributes: ["Book_ID", "Title", "ISBN", "Shelf_Location"],
            include: [
              {
                model: Authors,
                attributes: [
                  ["First_Name", "Author_First_Name"],
                  ["Last_Name", "Author_Last_Name"],
                ],
              },
            ],
          },
        ],
      },
      {
        model: Users,
        attributes: [
          ["First_Name", "User_First_Name"],
          ["Last_Name", "User_Last_Name"],
        ],
      },
    ],
  });

  let link = await cleanAndExportBorrowingProcess(borrowedBooks, filePath);
  link = baseURL + "/borrow-books-proceses-last-month.csv";

  res.status(200).json(link);
};
module.exports = {
  borrowBook,
  returnBook,
  userBorrowedBooks,
  putBorrowedBooks,
  overDueBorrowedBooks,
  borrowedBooks,
  libraryBorrowingInsights,
  exportOverDueBorrowedBooksLastMonth,
  exportBorrowBooksProccessLastMonth,
};
