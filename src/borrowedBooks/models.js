const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../db");
const { BookCopies } = require("../books/models");
const { Users } = require("../users/models");

class BorrowedBooks extends Model {}

BorrowedBooks.init(
  {
    BorrowedBook_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Copy_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BookCopies,
        key: "Copy_ID",
      },
      onDelete: "CASCADE",
    },
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: "User_ID",
      },
      onDelete: "CASCADE",
    },
    Checkout_Date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    Due_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Return_Date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "BorrowedBooks",
  }
);

BorrowedBooks.belongsTo(BookCopies, { foreignKey: "Copy_ID" });
BorrowedBooks.belongsTo(Users, { foreignKey: "User_ID" });

// sequelize.sync();

module.exports = { BorrowedBooks };
