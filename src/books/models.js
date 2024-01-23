const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../db");
const { Authors } = require("../authors/models");

class Books extends Model {}

Books.init(
  {
    Book_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ISBN: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    Shelf_Location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Author_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Authors,
        key: "Author_ID",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Books",
  }
);

class BookCopies extends Model {}

BookCopies.init(
  {
    Copy_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Book_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Books,
        key: "Book_ID",
      },
      onDelete: "CASCADE",
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "available",
      validate: {
        isIn: [["available", "not available"]],
      },
    },
  },
  {
    sequelize,
    modelName: "BookCopies",
  }
);
Books.belongsTo(Authors, { foreignKey: "Author_ID" });
BookCopies.belongsTo(Books, { foreignKey: "Book_ID" });

// Sync all defined models to the DB
// sequelize.sync();
module.exports = { Books, BookCopies };
