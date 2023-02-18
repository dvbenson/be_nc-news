const { getTopics } = require("../controllers/topics-controllers");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
