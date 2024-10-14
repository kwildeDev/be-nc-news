const express = require("express")
const { getTopics } = require("./controllers/topics.controller")

const app = express()

app.get("/api/topics", getTopics)

// Error handling

app.all("*", (request, response, next) => {
    response.status(404).send({msg: "Endpoint Does Not Exist"})
})
app.use((err, request, response, next) => {
    response.status(500).send({msg: "Internal Server Error"})
})

module.exports = app