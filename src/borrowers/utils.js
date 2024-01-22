const db = require("../../db");
const borrowerQueries = require("./queries");

// Check if a book exists by ID
const isBorrowerExist = async (borrowerId) => {
  if (borrowerId) {
    const currentBorrower = await db.oneOrNone(bookQueries.getBorrowerById, [
      borrowerId,
    ]);
    if (!currentBorrower) {
      return {
        isError: true,
        message: "Book not found with the specified ID.",
      };
    }
  }
  return { isError: false, message: "none" };
};

// Validate request data based on the schema
const validateRequest = async (schema, borrowerId, req, res) => {
  if (borrowerId) {
    const currentBorrower = await db.oneOrNone(
      borrowerQueries.getBorrowerById,
      [borrowerId]
    );
    if (!currentBorrower) {
      return {
        isError: true,
        message: "Book not found with the specified ID.",
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
  }
  return { isError: false, message: "none" };
};

module.exports = {
  isBorrowerExist,
  validateRequest,
};
