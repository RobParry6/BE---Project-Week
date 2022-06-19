const apiRouter = require("express").Router();
const reviewRouter = require("./reviews-router");
const categoriesRouter = require("./categories-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");
const endpointObject = require("../../endpoints.json");

apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get("/", (request, response, next) => {
  response.status(200).send(endpointObject);
});

module.exports = apiRouter;
