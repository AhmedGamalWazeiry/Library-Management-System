const addAuthor =
  "INSERT INTO Authors (first_name,last_name) VALUES ($1,$2) RETURNING *";

const getAuthorById = "SELECT * FROM Authors WHERE Author_ID = $1";

module.exports = {
  addAuthor,
  getAuthorById,
};
