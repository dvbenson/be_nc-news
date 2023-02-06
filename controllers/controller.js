const { topicData } = require("../db/data/test-data/index.js");
const {
  fetchTopics,
  fetchArticles,
  fetchArticleComments,
  fetchArticleById,
  fetchUsers,
  addNewComment,
  updateArticleVotes,
  deleteComments,
} = require("../models/model.js");
const {
  checkArticleId,
  checkNewComment,
  checkOrder,
  checkVotes,
} = require("../db/seeds/utils.js");
const allEndPoints = require("../endpoints.json");

const getAllEndPoints = (request, response, next) => {
  response.status(200).send({ allEndPoints });
};

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
  const { sort_by, order, topic } = request.query;
  fetchArticles(sort_by, order, topic)
    .then((results) => {
      response.status(200).send(results);
    })
    .catch((error) => {
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
// const postComments = (request, response, next) => {
//   const { article_id: articleId } = request.params;
//   const newComment = request.body;
//   return Promise.all([checkArticleId(articleId), checkNewComment(newComment)])
//     .then((postComment) => {
//       return addNewComment(postComment[0], postComment[1]);
//     })
//     .then((results) => {
//       response.status(201).send(results);
//     })
//     .catch((error) => {
//       next(error);
//     });
// };

const getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleComments(article_id)
    .then((results) => {
      response.status(200).send(results);
    })
    .catch(next);
};

// const patchArticleVotes = (request, response, next) => {
//   const { article_id: articleId } = request.params;
//   const votes = request.body;

//   return Promise.all([checkArticleId(articleId), checkVotes(votes)])
//     .then((checkedVotes) => {
//       return updateArticleVotes(checkedVotes[0], checkedVotes[1]);
//     })
//     .then((results) => {
//       response.status(200).send(results);
//     })
//     .catch(next);
// };

const getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send(users.rows);
    })
    .catch((error) => {
      next(error);
    });
};

const searchComments = (request, response, next) => {
  const { comment_id } = request.params;
  deleteComments(comment_id)
    .then((result) => {
      if (result.rowCount === 1) {
        response.status(204).send({ msg: "Comment Deleted" });
      } else if (result.rowCount === 0) {
        response.status(404).send({
          msg: `No comments exist with that comment ID`,
        });
      }
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getTopics,
  getArticles,
  getArticleComments,
  getArticleById,
  getUsers,
  // postComments,
  getArticleById,
  // patchArticleVotes,
  searchComments,
  getAllEndPoints,
};
