const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, getArticles } = require("./controllers/articles.controller");
const { getCommentsByArticleId } = require("./controllers/comments.controller");
const endpoints = require("./endpoints.json");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", (request, response) => {
    response.status(200).send({endpoints: endpoints})
});

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);


// Error Handling

app.all("*", (request, response, next) => {
    response.status(404).send({msg: "Endpoint Does Not Exist"})
});

// PSQL Error Handling

app.use((err, request, response, next) => {
    if (err.code === '22P02') {
        response.status(400).send({msg: "Bad Request"});
    }
    next(err)
});

// Custom Error Handling

app.use((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    }
});

// Server Error Handling

app.use((err, request, response, next) => {
    response.status(500).send({msg: "Internal Server Error"})
});

module.exports = app