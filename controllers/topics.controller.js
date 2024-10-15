const { request, response } = require("express")
const { fetchTopics } = require("../models/topics.model")
const app = require("../app")

exports.getTopics = (request, response, next) => {
    fetchTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
    })
}