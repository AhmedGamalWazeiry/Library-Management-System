const db = require("../../db");
const authorQueries = require("./queries"); // Update the import

// Check if an author exists by ID
const isAuthorExist = async (authorId) => {
  // Update the function name
  let currentAuthor = null;
  if (authorId) {
    const currentAuthor = await db.oneOrNone(
      authorQueries.getAuthorById, // Update the query
      [authorId]
    );
    if (!currentAuthor) {
      return {
        isError: true,
        message: "Author not found with the specified ID.", // Update the message
      };
    }
  }
  return { isError: false, message: "none" };
};

// Validate request data based on the schema
const validateRequest = async (schema, authorId, req, res) => {
  if (Object.keys(req.body).length === 0) {
    return {
      isError: true,
      message: "You haven't entered any keys.", // Update the message
    };
  }
  let currentAuthor = null;
  // Update the function name
  if (authorId) {
    currentAuthor = await db.oneOrNone(
      authorQueries.getAuthorById, // Update the query
      [authorId]
    );
    if (!currentAuthor) {
      return {
        isError: true,
        message: "Author not found with the specified ID.", // Update the message
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
    let { first_name, last_name } = req.body;
    if (!first_name) first_name = currentAuthor.first_name;
    if (!last_name) last_name = currentAuthor.last_name;

    const author = await db.oneOrNone(authorQueries.isAuthorWithFullNameExist, [
      // Update the query
      first_name,
      last_name,
    ]);
    if (author && author.author_id !== authorId) {
      // Update the condition
      return {
        isError: true,
        message:
          "The entered first name or last name is already in use. Please choose a unique name.",
      };
    }
  }

  return { isError: false, message: "none" };
};

module.exports = {
  isAuthorExist, // Update the export
  validateRequest,
};
