const {
  searchComments,
  patchCommentVotes,
} = require("../controllers/comments-controllers");
const commentsRouter = require("express").Router();

commentsRouter.patch("/api/comments/:comment_id", patchCommentVotes);

commentsRouter.delete("/api/comments/:comment_id", searchComments);

module.exports = commentsRouter;
