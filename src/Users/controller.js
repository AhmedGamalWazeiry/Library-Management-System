const db = require("../../db");
const userQueries = require("./queries"); // Update the import
const { userSchema, userPatchSchema } = require("./validationSchemas"); // Update the import
const { isUserExist, validateRequest } = require("./utils"); // Update the import

// Add a new user
const addUser = async (req, res) => {
  const { isError, message } = await validateRequest(
    userSchema, // Update the schema
    null,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const { first_name, last_name, email } = req.body;

  const user = await db.oneOrNone(userQueries.addUser, [
    // Update the query
    first_name,
    last_name,
    email,
  ]);
  res.status(200).json(user);
};

// Update an existing user
const putUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  const { isError, message } = await validateRequest(
    userSchema, // Update the schema
    userId,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const { first_name, last_name, email } = req.body;

  const user = await db.oneOrNone(userQueries.putUser, [
    // Update the query
    first_name,
    last_name,
    email,
    userId,
  ]);
  res.status(200).json(user);
};

// Partially update an existing user
const patchUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  const { isError, message } = await validateRequest(
    userPatchSchema, // Update the schema
    userId,
    req,
    res
  );
  if (isError) return res.status(400).json(message);
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  const setString = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");

  const user = await db.oneOrNone(
    userQueries.patchUser.replace(/SET/, "SET " + setString), // Update the query
    [userId, ...values]
  );
  res.status(200).json(user);
};

// Get all users
const getUsers = async (req, res) => {
  const users = await db.any(userQueries.getUsers); // Update the query
  res.status(200).json(users);
};

// Get a user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  const { isError, message } = await isUserExist(userId); // Update the function
  if (isError) return res.status(400).json(message);

  const user = await db.oneOrNone(userQueries.getUserById, [
    // Update the query
    userId,
  ]);
  res.status(200).json(user);
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  const { isError, message } = await isUserExist(userId); // Update the function
  if (isError) return res.status(400).json(message);

  const user = await db.oneOrNone(userQueries.deleteUser, [
    // Update the query
    userId,
  ]);
  res.status(200).json(user);
};

module.exports = {
  getUsers,
  addUser,
  getUserById,
  putUser,
  patchUser,
  deleteUser,
};
