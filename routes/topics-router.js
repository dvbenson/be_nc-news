const { getTopics } = require("../controllers/controller");
const topicsRouter = require("express").Router();

topicsRouter.get("/api/topics", getTopics);

module.exports = topicsRouter;
