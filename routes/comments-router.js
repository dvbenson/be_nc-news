const {
  searchComments,
  patchCommentVotes,
} = require("../controllers/comments-controllers");

const commentsRouter = require("express").Router();

commentsRouter.patch("/:comment_id", patchCommentVotes);

commentsRouter.delete("/:comment_id", searchComments);

module.exports = commentsRouter;
