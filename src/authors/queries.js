const getAuthors = "SELECT * FROM Authors";

const addAuthor =
  "INSERT INTO Authors (first_name, last_name) VALUES ($1, $2) RETURNING *";

const putAuthor =
  "UPDATE Authors SET first_name = $1, last_name = $2 WHERE author_id = $3 RETURNING *";

const patchAuthor = "UPDATE Authors SET  WHERE author_id = $1 RETURNING *";

const deleteAuthor = "DELETE FROM Authors WHERE author_id = $1 RETURNING *";

const getAuthorById = "SELECT * FROM Authors WHERE author_id = $1";

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
