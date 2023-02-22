const { getAllEndPoints } = require("../controllers/api-controllers");

const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router");
const commentsRouter = require("./comments-router");

apiRouter.get("/", getAllEndPoints);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
