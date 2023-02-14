const { searchComments } = require("../controllers/controller");
const topicsRouter = require("express").Router();

topicsRouter.delete("/api/comments/:comment_id", searchComments);

module.exports = topicsRouter;
