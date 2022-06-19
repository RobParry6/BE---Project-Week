const usersRouter = require("express").Router();
const { getUsers } = require("../controllers");

usersRouter.get("/", getUsers);
// usersRouter.get("/:users", getUser);

module.exports = usersRouter;
