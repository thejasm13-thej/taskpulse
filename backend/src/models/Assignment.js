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
  },
  {
    tableName: "assignments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

// Association
const Batch = require("./Batch");
Assignment.belongsTo(Batch, { foreignKey: "batch_id", as: "batch" });

module.exports = Assignment;
