const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
} = require("../models/model.js");
const {
  checkArticleId,
  checkRequestBody,
  checkVotes,
} = require("../db/seeds/utils.js");

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

const patchArticleVotes = (request, response, next) => {
  const { articleId } = request.params;
  const votes = request.body;
  return Promise.all([
    checkArticleId(articleId),
    checkRequestBody(votes),
    checkVotes(votes),
  ])
    .then((checkedVotes) => {
      return updateArticleVotes(checkedVotes[0], checkedVotes[1]);
    })
    .then((results) => {
      response.status(200).send(results);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getTopics, getArticles, getArticleById, patchArticleVotes };
