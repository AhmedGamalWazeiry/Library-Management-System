const db = require("../../db");
const borrowedBookQueries = require("./queries"); // Update the import to your borrowed book queries

// Check if a borrowed book exists by ID
const isBorrowedBookExist = async (borrowedBookId) => {
  // Update the function name
  if (borrowedBookId) {
    const currentBorrowedBook = await db.oneOrNone(
      borrowedBookQueries.getBorrowedBookById, // Update the query
      [borrowedBookId]
    );
    if (!currentBorrowedBook) {
      return {
        isError: true,
        message: "Borrowed book not found with the specified ID.", // Update the message
      };
    }
  }
  return { isError: false, message: "none" };
};

// Validate request data based on the schema
const validateRequest = async (schema, borrowedBookId, req, res) => {
  if (Object.keys(req.body).length === 0) {
    return {
      isError: true,
      message: "You haven't entered any keys.", // Update the message
    };
  }
  // Update the function name
  if (borrowedBookId) {
    const currentBorrowedBook = await db.oneOrNone(
      borrowedBookQueries.getBorrowedBookById, // Update the query
      [borrowedBookId]
    );
    if (!currentBorrowedBook) {
      return {
        isError: true,
        message: "Borrowed book not found with the specified ID.", // Update the message
      };
    }
  }

  if (req.body) {
    const { error } = await schema.validate(req.body);
    if (error) {
      return {
        isError: true,
        message: error.details[0].message,
      };
    }
    // Update the conditions related to borrowed book properties
    const { bookId } = req.body;
    if (bookId) {
      const borrowedBook = await db.oneOrNone(
        borrowedBookQueries.getBorrowedBookByBookId,
        [bookId]
      );
      if (borrowedBook && borrowedBook.borrowedBookId !== borrowedBookId) {
        return {
          isError: true,
          message: "This book is already borrowed!",
        };
      }
    }
  }

  return { isError: false, message: "none" };
};

module.exports = {
  isBorrowedBookExist, // Update the export
  validateRequest,
};
