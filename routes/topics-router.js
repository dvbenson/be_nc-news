const { getTopics } = require("../controllers/topics-controllers");
const topicsRouter = require("express").Router();

topicsRouter.get("/api/topics", getTopics);

module.exports = topicsRouter;
