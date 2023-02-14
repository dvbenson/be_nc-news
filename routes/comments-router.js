const { searchComments } = require("../controllers/comments-controllers");
const topicsRouter = require("express").Router();

topicsRouter.delete("/api/comments/:comment_id", searchComments);

module.exports = topicsRouter;
