const { request, response } = require("express")
const app = require("../app");
const { fetchArticleById, fetchArticles } = require("../models/articles.models");
const articles = require("../db/data/test-data/articles");

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (request, response, next) => {
    fetchArticles()
    .then((articles) => {
        response.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}