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
  const article_id = request.params.article_id;
  const newCommentData = request.body;
  addNewComment(article_id, newCommentData)
    .then((comment) => {
      response.status(201).send(comment);
    })
    .catch(next);
};

module.exports = { getTopics, getArticles, getArticleById, postComments };
