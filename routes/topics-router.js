const { getTopics, postTopic } = require("../controllers/topics-controllers");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicsRouter;
