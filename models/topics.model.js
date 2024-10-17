const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.fetchTopicBySlug = (slug) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1;`,[slug])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Topic Does Not Exist" })
        }
        return rows[0]
    });
}