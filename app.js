const { postgresErrors, customErrors, internalErrors } = require("./errors");

const apiRouter = require("./routes/api-router");

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.get("/", function (req, res) {
  res.redirect("/api");
});

app.use(customErrors);
app.use(postgresErrors);
app.use(internalErrors);

module.exports = app;
