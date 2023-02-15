const {
  deleteComments,
  updateCommentVotes,
} = require("../models/comments-models");

exports.searchComments = (request, response, next) => {
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
