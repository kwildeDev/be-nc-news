const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const apiRouter = require("express").Router();
const endpoints = require("../endpoints.json");
const topicsRouter = require("./topics-router");
const commentsRouter = require("./comments-router");


apiRouter.get("/", (request, response) => {
    response.status(200).send({ endpoints: endpoints })
});

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
