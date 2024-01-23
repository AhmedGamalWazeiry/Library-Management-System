const bookQueries = require("./queries");
const { Books } = require("./models");
const { Authors } = require("../authors/models");

// Validate request data based on the schema
const validateRequest = async (schema, bookId, req, res) => {
  if (Object.keys(req.body).length === 0) {
    return {
      isError: true,
      message: "You haven't entered any keys.", // Update the message
    };
  }
  if (bookId) {
    const currentBook = await Books.findByPk(bookId);

    if (!currentBook) {
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

    const { isbn, author_id: authorId } = req.body; // Use camelCase for variable names
    if (isbn) {
      const book = await Books.findOne({
        where: {
          ISBN: isbn,
        },
      });

      if (book && book.book_id !== bookId) {
        return { isError: true, message: "This ISBN already exists!" };
      }
    }
    if (authorId) {
      const author = await Authors.findByPk(authorId);
      if (!author) {
        return {
          isError: true,
          message: "The author with this ID does not exist.",
        };
      }
    }
  }
  return { isError: false, message: "none" };
};

module.exports = {
  validateRequest,
};
