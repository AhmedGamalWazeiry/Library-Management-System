const borrowedBookQueries = require("./queries"); // Update the import to your borrowed book queries
const bookQueries = require("../books/queries");
const { BookCopies } = require("../books/models");
const { BorrowedBooks } = require("./models");

const isCopyBookExistAndAvaliable = async (copy_Id) => {
  const currentCopyBook = await BookCopies.findByPk(copy_Id);
  let isErrorOccur = false;
  let messageError = "";

  if (!currentCopyBook) {
    isErrorOccur = true;
    messageError = "Book Copy not found with the specified ID.";
  } else if (currentCopyBook.Status === "not available") {
    isErrorOccur = true;
    messageError = "this copy is not avaliable.";
  }

  if (isErrorOccur) {
    return {
      isErrorOccur: isErrorOccur,
      messageError: messageError,
      bookCopy: currentCopyBook,
    };
  }
  return {
    isErrorOccur: false,
    messageError: "none",
    bookCopy: currentCopyBook,
  };
};
// Check if a borrowed book exists by ID
const CheckIfCanReturnBook = async (copy_id, user_id) => {
  // Update the function name
  const currentBorrowedBook = await BorrowedBooks.findOne({
    where: {
      Copy_ID: copy_id,
      User_ID: user_id,
      Return_Date: null,
    },
  });
  if (!currentBorrowedBook) {
    return {
      isErrorOccur: true,
      messageError:
        "Borrowed book not found with the specified data or you dont have this book to return it.", // Update the message
      borrowedBook: currentBorrowedBook,
    };
  }
  return {
    isErrorOccur: false,
    messageError: "none",
    borrowedBook: currentBorrowedBook,
  };
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
const validateRequest = async (schema, req) => {
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
