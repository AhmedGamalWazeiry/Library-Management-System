const getUsers = "SELECT * FROM Users";

const addUser =
  "INSERT INTO Users (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING *";

const putUser =
  "UPDATE Users SET first_name = $1, last_name = $2, email = $3 WHERE user_id = $4 RETURNING *";

const patchUser = "UPDATE Users SET  WHERE user_id = $1 RETURNING *";

const deleteUser = "DELETE FROM Users WHERE user_id = $1 RETURNING *";

const getUserByEmail = "SELECT * FROM Users WHERE email = $1";

const getUserById = "SELECT * FROM Users WHERE user_id = $1";

module.exports = {
  getUsers,
  getUserById,
  addUser,
  putUser,
  patchUser,
  deleteUser,
  getUserByEmail,
};
