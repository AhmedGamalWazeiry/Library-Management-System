const db = require("../../db");
const userQueries = require("./queries"); // Update the import
const { Users } = require("./models");

// Check if a user exists by ID
const isUserExist = async (userId) => {
  // Update the function name
  if (userId) {
    const currentUser = await db.oneOrNone(
      userQueries.getUserById, // Update the query
      [userId]
    );
    if (!currentUser) {
      return {
        isError: true,
        message: "User not found with the specified ID.", // Update the message
      };
    }
  }
  return { isError: false, message: "none" };
};

// Validate request data based on the schema
const validateRequest = async (schema, userId, req, res) => {
  if (Object.keys(req.body).length === 0) {
    return {
      isError: true,
      message: "You haven't entered any keys.", // Update the message
    };
  }
  // Update the function name
  if (userId) {
    const currentUser = await Users.findByPk(userId);
    if (!currentUser) {
      return {
        isError: true,
        message: "User not found with the specified ID.", // Update the message
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
    const { email } = req.body;
    if (email) {
      const user = await Users.findOne({
        where: {
          Email: email,
        },
      });

      if (user && user.user_id !== userId) {
        // Update the condition
        return {
          isError: true,
          message: "This email already exists!",
        };
      }
    }
  }

  return { isError: false, message: "none" };
};

module.exports = {
  isUserExist, // Update the export
  validateRequest,
};
