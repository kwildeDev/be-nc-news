const { request, response } = require("express")
const { fetchCommentsByArticleId, createComment } = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.models");

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    const promises = [fetchArticleById(article_id), fetchCommentsByArticleId(article_id)]
    Promise.all(promises)
        .then((results) => {
            const comments = results[1]
            response.status(200).send({comments: comments})
        })
    .catch((err) => {
        next(err)
    })
}

exports.postComment = (request, response, next) => {
    const { article_id } = request.params;
    const newComment = request.body;
    createComment(article_id, newComment)
    .then((comment) => {
        response.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}