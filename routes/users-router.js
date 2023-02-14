const { getUsers, getUserName } = require("../controllers/users-controllers");
const usersRouter = require("express").Router();

usersRouter.get("/api/users", getUsers);
// usersRouter.get("/api/users/:username", getUserName);

module.exports = usersRouter;
