const { getUsers, getUserName } = require("../controllers/users-controllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserName);

module.exports = usersRouter;
