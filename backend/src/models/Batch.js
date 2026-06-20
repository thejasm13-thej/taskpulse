const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Batch = sequelize.define(
  "Batch",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "batches", timestamps: false },
);

module.exports = Batch;
