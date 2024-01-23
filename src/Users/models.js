const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../db");

class Users extends Model {}

Users.init(
  {
    User_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    First_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Last_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    Registered_Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Users",
    tableName: "Users",
    timestamps: false,
  }
);

// sequelize.sync().then(() => console.log("Users table has been synced"));

module.exports = { Users };
