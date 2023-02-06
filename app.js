const {
  getTopics,
  getArticles,
  getArticleComments,
  getArticleById,
  // patchArticleVotes,
  getUsers,
  // postComments,
  searchComments,
  getAllEndPoints,
} = require("./controllers/controller.js");
const db = require("./db/connection");
const express = require("express");
const app = express();
const cors = require("cors"); // <-------CORS

app.use(cors()); // <--------CORS

app.use(express.json());

app.get("/api", getAllEndPoints); //good
app.get("/api/topics", getTopics); //good
app.get("/api/articles", getArticles); //good
app.get("/api/articles/:article_id", getArticleById); //good
app.get("/api/users", getUsers); //good
app.get("/api/articles/:article_id/comments", getArticleComments); //good
// app.patch("/api/articles/:article_id", patchArticleVotes); // "msg": "The request body must be structured as follows: { inc_votes: number_of_votes }"
// app.post("/api/articles/:article_id/comments", postComments); // msg: invalid comment format
app.delete("/api/comments/:comment_id", searchComments); //good

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
