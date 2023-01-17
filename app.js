const {
  getTopics,
  getArticles,
  getArticleComments,
} = require("./controllers/controller.js");
const express = require("express");
const app = express();
const db = require("./db/connection");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.use((error, request, response, next) => {
  if (error.status) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  console.log(error, "<------ error in internal error handling!");

  response.status(500).send({ msg: "bad code" });
});

module.exports = { app };
