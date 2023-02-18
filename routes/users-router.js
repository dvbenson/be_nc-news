const { getUsers, getUserName } = require("../controllers/users-controllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);
usersRouter.route("/:username").get(getUserName);

module.exports = usersRouter;
