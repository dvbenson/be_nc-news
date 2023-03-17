const {
  removeCommentById,
  updateCommentVotes,
} = require('../models/comments-models');

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.status(204).send({});
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchCommentVotes = (request, response, next) => {
  const { comment_id } = request.params;
  const votes = request.body;
  updateCommentVotes(comment_id, votes)
    .then((results) => {
      response.status(200).send(results);
    })
    .catch((error) => {
      next(error);
    });
};
