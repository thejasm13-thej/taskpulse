const app = require("./src/app");
const sequelize = require("./src/config/database");
require("./src/scheduler/reminderJob");
require("dotenv").config();

// Railway assigns PORT automatically — always use process.env.PORT
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log("✅ Server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
