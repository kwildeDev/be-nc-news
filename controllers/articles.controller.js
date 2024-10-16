const { request, response } = require("express")
const { fetchArticleById, fetchArticles, updateArticle } = require("../models/articles.models");

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

exports.patchArticle = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;
    fetchArticleById(article_id)
    .then((article) => {
        const currentVotes = article.votes
        return currentVotes
    })
    .then((currentVotes) => {
        updateArticle(article_id, currentVotes, inc_votes)
        .then((article) => {
            response.status(200).send({article})
        }).catch((err) => {
            next(err)
        })
    })
    .catch((err) => {
        next(err)
    })
}




exports.patchArticle1 = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;
    const promises = [fetchArticleById(article_id), updateArticle(article_id, inc_votes)]
    Promise.all(promises)
        .then((results) => {
            console.log(results)
            const article = results[1]
            response.status(200).send({article})
        })
    .catch((err) => {
        next(err)
    })
}