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

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
    const validSortBys = ["author", "title", "topic", "created_at", "votes", "comment_count"];
    const validOrders = ["asc", "desc"]
    if (!validSortBys.includes(sort_by) || (!validOrders.includes(order))) {
        return Promise.reject({ status: 400, msg: "Bad Request"})
    }
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
            ${sort_by} ${order};
        `)
    .then(({rows}) => {
        return rows
    })
}

exports.updateArticle = (article_id, currentVotes, inc_votes) => {
    if (isNaN(inc_votes)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }
    const updatedVotes = currentVotes += inc_votes
    return db
    .query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;`, [updatedVotes, article_id])
    .then((result) => {
        return result.rows[0]
    });
}