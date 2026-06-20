const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("faculty", "student"), allowNull: false },
    batch_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "users", timestamps: false },
);

module.exports = User;
