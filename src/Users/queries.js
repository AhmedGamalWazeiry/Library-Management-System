const getUsers = "SELECT * FROM Users"; // Update the table name

const addUser =
  "INSERT INTO Users (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *"; // Update the table name and column names

const putUser =
  "UPDATE Users SET first_name = $1, last_name = $2, email = $3 WHERE user_id = $4 RETURNING *"; // Update the table name, column names, and id column name

const patchUser = "UPDATE Users SET  WHERE user_id = $1 RETURNING *"; // Update the table name and id column name

const deleteUser = "DELETE FROM Users WHERE user_id = $1 RETURNING *"; // Update the table name and id column name

const getUserByEmail = "SELECT * FROM Users WHERE email = $1"; // Update the table name

const getUserById = "SELECT * FROM Users WHERE user_id = $1"; // Update the table name and id column name

module.exports = {
  getUsers,
  getUserById,
  addUser,
  putUser,
  patchUser,
  deleteUser,
  getUserByEmail,
};
