const db = require("../db/connection")
const { fetchArticles } = require("./articles.models")

exports.fetchCommentsByArticleId = (article_id) => {
    let queryStr = "SELECT comments.comment_id, votes, created_at, author, body, article_id FROM comments";
    queryStr += " WHERE comments.article_id = $1";
    queryStr += " ORDER BY created_at DESC";
    
    let queryVals = []
    queryVals.push(article_id)

    return db
    .query(queryStr, queryVals)
    .then(({rows}) => {
        return rows
    })
}