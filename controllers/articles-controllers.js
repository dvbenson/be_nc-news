const {
  fetchArticles,
  fetchArticleComments,
  fetchArticleById,
  addNewComment,
  updateArticleVotes,
  addNewArticle,
} = require("../models/articles-models");

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic, limit, p } = request.query;
  fetchArticles(sort_by, order, topic, limit, p)
    .then((results) => {
      response.status(200).send(results);
    })
    .catch((error) => {
      next(error);
    });
};

exports.postArticle = (request, response, next) => {
  const newArticle = request.body;
  addNewArticle(newArticle)
    .then((results) => {
      response.status(201).send(results);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send(article);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  const { limit, p } = request.query;

  fetchArticleComments(article_id, limit, p)
    .then((results) => {
      response.status(200).send(results);
    })
    .catch(next);
};

exports.postComments = (request, response, next) => {
  const { article_id } = request.params;
  const newComment = request.body;

  addNewComment(article_id, newComment)
    .then((results) => {
      response.status(201).send(results);
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const votes = request.body;
  updateArticleVotes(article_id, votes)
    .then((results) => {
      response.status(200).send(results);
    })
    .catch((error) => {
      next(error);
    });
};
