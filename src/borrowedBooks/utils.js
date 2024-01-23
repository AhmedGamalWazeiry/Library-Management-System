const db = require("../../db");
const borrowedBookQueries = require("./queries"); // Update the import to your borrowed book queries

const bookQueries = require("../books/queries");

const isCopyBookExistAndAvaliable = async (copy_Id) => {
  const currentCopyBook = await db.oneOrNone(bookQueries.getCopy, [copy_Id]);

  if (!currentCopyBook || currentCopyBook.status === "not available") {
    return {
      isErrorOccur: true,
      messageError:
        "Book Copy not found with the specified ID or this copy is not avaliable.",
    };
  }

  return { isErrorOccur: false, messageError: "none" };
};
// Check if a borrowed book exists by ID
const CheckIfCanReturnBook = async (copy_id, user_id) => {
  // Update the function name
  const currentBorrowedBook = await db.oneOrNone(
    borrowedBookQueries.CheckIfCanReturnBook, // Update the query
    [copy_id, user_id]
  );
  if (!currentBorrowedBook) {
    return {
      isErrorOccur: true,
      messageError:
        "Borrowed book not found with the specified data or you dont have this book to return it.", // Update the message
    };
  }
  return { isErrorOccur: false, messageError: "none" };
};

// const isQuantityAvailableForBook = async (bookId) => {
//   const availableQuantity = await db.oneOrNone(
//     borrowedBookQueries.getAvailableQuantity,
//     [bookId]
//   );

//   if (availableQuantity.available_quantity === 0) {
//     return {
//       isNotAvaliableBook: true,
//       errorMessage: "No copies available for this book at the moment.",
//     };
//   }
//   return { isNotAvaliableBook: false, errorMessage: "none" };
// };

// Validate request data based on the schema
const validateRequest = async (schema, borrowedBookId, req, res) => {
  if (Object.keys(req.body).length === 0) {
    return {
      isError: true,
      message: "You haven't entered any keys.", // Update the message
    };
  }

  if (req.body) {
    const { error } = await schema.validate(req.body);
    if (error) {
      return {
        isError: true,
        message: error.details[0].message,
      };
    }
  }

  return { isError: false, message: "none" };
};

module.exports = {
  isCopyBookExistAndAvaliable, // Update the export
  validateRequest,
  CheckIfCanReturnBook,
};
