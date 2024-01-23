const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../db"); // Replace with your Sequelize instance

class Authors extends Model {}

Authors.init(
  {
    Author_ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    First_Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Last_Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Authors",
    indexes: [
      {
        unique: true,
        fields: ["First_Name", "Last_Name"],
      },
    ],
  }
);

module.exports = { Authors };
