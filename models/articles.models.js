const db = require("../db/connection")

exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Article Does Not Exist"})
        }
        return result.rows[0]
    });
}

exports.fetchArticles = () => {
    return db
    .query(`
        SELECT
            articles.author, title, articles.article_id, topic,
            articles.created_at, articles.votes, article_img_url,
            CAST(COUNT(comments.article_id) AS INT) AS comment_count
        FROM
            articles
        LEFT JOIN
            comments
        ON
            articles.article_id = comments.article_id
        GROUP BY
            articles.article_id
        ORDER BY
            articles.created_at DESC;
        `)
    .then(({rows}) => {
        return rows
    })
}