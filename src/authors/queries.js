const getAuthors = "SELECT * FROM Authors"; // Update the table name

const addAuthor =
  "INSERT INTO Authors (first_name, last_name) VALUES ($1, $2) RETURNING *"; // Update the table name and column names

const putAuthor =
  "UPDATE Authors SET first_name = $1, last_name = $2 WHERE author_id = $3 RETURNING *"; // Update the table name, column names, and id column name

const patchAuthor = "UPDATE Authors SET  WHERE author_id = $1 RETURNING *"; // Update the table name and id column name

const deleteAuthor = "DELETE FROM Authors WHERE author_id = $1 RETURNING *"; // Update the table name and id column name

const getAuthorById = "SELECT * FROM Authors WHERE author_id = $1"; // Update the table name and id column name

const isAuthorWithFullNameExist =
  "SELECT * FROM Authors WHERE first_name = $1 and last_name = $2";

module.exports = {
  getAuthors,
  getAuthorById,
  addAuthor,
  putAuthor,
  patchAuthor,
  deleteAuthor,
  isAuthorWithFullNameExist,
};
