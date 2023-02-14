const { postgresErrors, customErrors, internalErrors } = require("./errors");

const apiRouter = require("./routes/api-router");
const articlesRouter = require("./routes/articles-router");
const usersRouter = require("./routes/users-router");
const topicsRouter = require("./routes/topics-router");
const commentsRouter = require("./routes/comments-router");

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use(articlesRouter);
app.use(topicsRouter);
app.use(usersRouter);
app.use(commentsRouter);

app.use(customErrors);
app.use(postgresErrors);
app.use(internalErrors);

module.exports = app;
