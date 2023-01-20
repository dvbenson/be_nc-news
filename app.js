const {
  getTopics,
  getArticles,
  getArticleComments,
  getArticleById,
  patchArticleVotes,
  getUsers,
  postComments,
} = require("./controllers/controller.js");
const db = require("./db/connection");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.post("/api/articles/:article_id/comments", postComments);

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
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
