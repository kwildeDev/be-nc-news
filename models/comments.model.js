const db = require("../db/connection")

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

exports.createComment = (article_id, { author, body }) => {
    return db
    .query(`INSERT INTO comments (body, author, article_id)
            VALUES ($1, $2, $3)
            RETURNING *;`, [body, author, article_id]
        )
        .then((result) => {
            return result.rows[0];
        });
}

exports.removeComment = (comment_id) => {
    return db
    .query('DELETE FROM comments WHERE comment_id = $1', [comment_id])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Comment Does Not Exist"})
        }
    });
}