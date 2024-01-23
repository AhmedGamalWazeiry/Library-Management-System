const db = require("../../db");
const userQueries = require("./queries");
const { Users } = require("./models");

const getAndValidateIdParams = (req, res) => {
  let error = false;
  const userId = parseInt(req.params.id);
  if (isNaN(userId) || !Number.isInteger(userId)) {
    error = true;
    res
      .status(400)
      .json({ error: "Invalid user ID. Please provide a valid integer." });
  }
  return { userId, error };
};

// Validate request data based on the schema
const validateRequest = async (schema, userId, req, res) => {
  let isError = false;
  if (Object.keys(req.body).length === 0) {
    isError = true;
    res.status(400).json("You haven't entered any keys.");
  }

  if (userId) {
    const currentUser = await Users.findByPk(userId);
    if (!currentUser) {
      isError = true;
      res.status(400).json("User not found with the specified ID.");
    }
  }

  if (req.body) {
    const { error } = await schema.validate(req.body);

    if (error) {
      isError = true;
      res.status(400).json(error.details[0].message);
    }

    const { email } = req.body;

    if (email) {
      const user = await Users.findOne({
        where: {
          Email: email,
        },
      });

      if (user && user.User_ID !== userId) {
        isError = true;
        res.status(400).json("This email already exists!");
      }
    }
  }

  return isError;
};

module.exports = {
  validateRequest,
  getAndValidateIdParams,
};
