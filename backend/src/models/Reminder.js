const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Assignment = require("./Assignment");

const Reminder = sequelize.define(
  "Reminder",
  {
    assignment_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("48_hour", "morning"), allowNull: false },
    sent: { type: DataTypes.BOOLEAN, defaultValue: false },
    scheduled_at: { type: DataTypes.DATE, allowNull: false },
    sent_at: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "reminders", timestamps: false },
);

Reminder.belongsTo(Assignment, { foreignKey: "assignment_id" });

module.exports = Reminder;
