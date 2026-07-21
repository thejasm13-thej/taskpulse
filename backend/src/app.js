const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/assignments", require("./routes/assignments"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;
