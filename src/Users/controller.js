const { userSchema, userPatchSchema } = require("./validationSchemas");
const { validateRequest, getAndValidateIdParams } = require("./utils");
const { Users } = require("./models");

// Add a new user
const addUser = async (req, res) => {
  const isError = await validateRequest(userSchema, null, req, res);
  if (isError) return;

  const { first_name, last_name, email } = req.body;

  const newUser = await Users.create({
    First_Name: first_name,
    Last_Name: last_name,
    Email: email,
  });

  res.status(200).json(newUser);
};

// Update an existing user
const putUser = async (req, res) => {
  const { userId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const isError = await validateRequest(userSchema, null, req, res);
  if (isError) return;

  const { first_name, last_name, email } = req.body;

  const user = await Users.findByPk(userId);

  user.First_Name = first_name;
  user.Last_Name = last_name;
  user.Email = email;
  await user.save();

  res.status(200).json(user);
};

// Partially update an existing user
const patchUser = async (req, res) => {
  const { userId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const isError = await validateRequest(userPatchSchema, null, req, res);
  if (isError) return;

  const { first_name, last_name, email } = req.body;

  const user = await Users.findByPk(userId);

  if (first_name) user.First_Name = first_name;
  if (last_name) user.Last_Name = last_name;
  if (email) user.Email = email;

  await user.save();

  res.status(200).json(user);
};

// Get all users
const getUsers = async (req, res) => {
  const users = await Users.findAll({});
  res.status(200).json(users);
};

// Get a user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  const user = await Users.findByPk(userId);

  if (user) res.status(200).json(user);

  res.status(400).json("User not found with the specified ID.");
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const { userId, error } = getAndValidateIdParams(req, res);
  if (error) return;

  const user = await Users.findByPk(userId);
  if (user) {
    await user.destroy();
    res.status(200).json(user);
  }
  res.status(400).json("User not found with the specified ID.");
};

module.exports = {
  getUsers,
  addUser,
  getUserById,
  putUser,
  patchUser,
  deleteUser,
};
