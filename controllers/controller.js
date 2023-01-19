const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  addNewComment,
} = require("../models/model.js");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send(topics.rows);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};

const getArticles = (request, response, next) => {
  fetchArticles()
    .then((articles) => {
      response.status(200).send(articles.rows);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};

const getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send(article);
    })
    .catch(next);
};

const postComments = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;
  Promise.all([addNewComment(article_id, newComment)])
    .then((postComment) => {
      response.status(201).send(postComment);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getTopics, getArticles, getArticleById, postComments };
