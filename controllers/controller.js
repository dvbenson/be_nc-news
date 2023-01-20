const { topicData } = require("../db/data/test-data/index.js");
const {
  fetchTopics,
  fetchArticles,
  fetchArticleComments,
  fetchArticleById,
  addNewComment,
} = require("../models/model.js");
const { checkArticleId, checkNewComment } = require("../db/seeds/utils.js");

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
  const { topic, sort_by, order } = request.query;
  console.log(request.query);

  return fetchArticles(topic, sort_by, order)
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
    .catch((error) => {
      next(error);
    });
};
// move checkId and checkNewComment to model
const postComments = (request, response, next) => {
  const { article_id: articleId } = request.params;
  const newComment = request.body;
  return Promise.all([checkArticleId(articleId), checkNewComment(newComment)])
    .then((postComment) => {
      return addNewComment(postComment[0], postComment[1]);
    })
    .then((results) => {
      response.status(201).send(results);
    })
    .catch((error) => {
      next(error);
    });
};
const getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleComments(article_id)
    .then((results) => {
      response.status(200).send(results);
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getArticles,
  getArticleComments,
  postComments,
  getArticleById,
};
