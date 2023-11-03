const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.use((err, req, res, next) => {
  console.log(err.code);
  console.log(err.message);
  const { status = 500, message = "SERVER ERROR ❌‼‼‼" } = err;

  res.status(status).json({ message });
});

module.exports = app;
