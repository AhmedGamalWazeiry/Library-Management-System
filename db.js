const { Sequelize } = require("sequelize");

// Create a Sequelize instance and connect to the database
const sequelize = new Sequelize("library_db", "postgres", "password", {
  host: "db",
  port: 5432,
  dialect: "postgres",
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Define your models and their associations here, e.g., User model
sequelize.sync().then(() => console.log("Database & tables created!"));
module.exports = { sequelize };
