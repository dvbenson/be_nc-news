const {
  getTopics,
  getArticles,
  getArticleById,
  getUsers,
} = require("./controllers/controller.js");
const express = require("express");
const app = express();
const db = require("./db/connection");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);

app.use((error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  }
});

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Internal Serve Error" });
});

module.exports = { app };
