const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Assignment = sequelize.define(
  "Assignment",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    batch_id: { type: DataTypes.INTEGER, allowNull: false },
    faculty_id: { type: DataTypes.INTEGER, allowNull: false },
    due_date: { type: DataTypes.DATE, allowNull: false },
    file_name: { type: DataTypes.STRING, allowNull: true },
    file_path: { type: DataTypes.STRING, allowNull: true },
    file_original: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "assignments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

const Batch = require("./Batch");
Assignment.belongsTo(Batch, { foreignKey: "batch_id", as: "batch" });

module.exports = Assignment;
