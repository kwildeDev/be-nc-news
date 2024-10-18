const express = require("express");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

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

module.exports = app;