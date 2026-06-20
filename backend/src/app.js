const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/assignments", require("./routes/assignments"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;
