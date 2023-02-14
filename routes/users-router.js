const { getUsers } = require("../controllers/controller");
const usersRouter = require("express").Router();

usersRouter.get("/api/users", getUsers);

module.exports = usersRouter;
