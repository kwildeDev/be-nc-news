const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, getArticles, patchArticle } = require("./controllers/articles.controller");
const { getCommentsByArticleId, postComment, deleteComment } = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller")
const endpoints = require("./endpoints.json");

const app = express();

app.use(express.json());

// /api

app.get("/api", (request, response) => {
    response.status(200).send({endpoints: endpoints})
});

// /api/topics

app.get("/api/topics", getTopics);

// /api/articles/:article_id

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticle);

// /api/articles

app.get("/api/articles", getArticles);

// /api/articles/:article_id/comments

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

// /api/comments/:comment_id

app.delete("/api/comments/:comment_id", deleteComment);

// /api/users

app.get("/api/users", getUsers);

// Error Handling

app.all("*", (request, response, next) => {
    response.status(404).send({msg: "Endpoint Does Not Exist"})
});

// PSQL Error Handling

app.use((err, request, response, next) => {
    switch(err.code) {
        case '22P02' :
        case '23502' :
            response.status(400).send({msg: "Bad Request"});
            break;
        case '23503' :
            const columnName = err.constraint.split("_")[1]
            let message = "Not found"
            if (columnName === "author") {
                message = "User Does Not Exist"
            }
            if (columnName === "article") {
                message = "Article Does Not Exist"
            }
            response.status(404).send({msg: message});
            break;
        default :
            break;
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