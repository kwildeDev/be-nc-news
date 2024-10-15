const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const request = require("supertest")
const app = require("../app")
const endpoints = require("../endpoints.json")

beforeAll(() => seed(data));

afterAll(() => db.end());

describe("Express Server", () => {
    it("GET 404: responds with an error message when given an invalid endpoint", () => {
        return request(app)
        .get("/api/news")
        .expect(404)
        .then((response) => {
            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("Endpoint Does Not Exist")
        });
    });
});

describe("/api/topics", () => {
    it("GET 200: returns an array of all available topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            expect(body.topics.length).toBe(3)
            body.topics.forEach(topic => {
                expect(typeof topic.description).toBe("string");
                expect(typeof topic.slug).toBe("string")
            });
        });
    });
});

describe("/api", () => {
    it("GET 200: returns an object detailing all available API endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints);
        });
    });
});

describe("/api/articles/:article_id", () => {
    it("GET 200: returns a single article object when given a valid and existing article id", () => {
        return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
            expect(body.article.article_id).toBe(5) 
            expect(typeof body.article.article_id).toBe("number")
            expect(typeof body.article.author).toBe("string")
            expect(typeof body.article.title).toBe("string")
            expect(typeof body.article.body).toBe("string")
            expect(typeof body.article.topic).toBe("string")
            expect(typeof body.article.created_at).toBe("string")
            expect(typeof body.article.votes).toBe("number")
            expect(typeof body.article.article_img_url).toBe("string")
        });
    });
    it("GET 404: responds with an error message when given a valid but non-existent article_id", () => {
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("Article Does Not Exist");
        });
    });
    it("GET 400: responds with an error message when given an invalid article_id", () => {
        return request(app)
        .get("/api/articles/five")
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        });
    });
});

describe("/api/articles", () => {
    it("GET 200: returns an array of all available articles in the correct format", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13)
            body.articles.forEach(article => {
                expect(typeof article.author).toBe("string")
                expect(typeof article.title).toBe("string")
                expect(typeof article.article_id).toBe("number")
                expect(typeof article.topic).toBe("string")
                expect(typeof article.created_at).toBe("string")
                expect(typeof article.votes).toBe("number")
                expect(typeof article.article_img_url).toBe("string")
                expect(typeof article.comment_count).toBe("number")
                expect(article).not.toHaveProperty("body")
            });
        });
    })
    it("GET 200: returned array should be sorted by date in descending order", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at", { descending: true, })
        });
    });
})

describe("/api/articles/:article_id/comments", () => {
    it("GET 200: returns an array of comments for the given article_id when given a valid and present article_id", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(11)
            body.comments.forEach(comment => {
                expect(comment).toHaveProperty("comment_id", "votes", "created_at", "author", "body")
                expect(comment.article_id).toBe(1)
                expect(typeof comment.comment_id).toBe("number")
            });
        });
    });
    it("GET 200: responds with an empty array when given an article_id which is present in the database but has no associated comments", () => {
        return request(app)
        .get("/api/articles/12/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(0)
            expect(Array.isArray(body.comments)).toBe(true)
        });
    });
    it("GET 200: returned array should be sorted by date in descending order", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toBeSortedBy("created_at", { descending: true, })
        });
    });
    it("GET 400: responds with an error message when given an invalid article_id", () => {
        return request(app)
        .get("/api/articles/not-an-article/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
    it("GET 404: responds with an error message when given a valid but non-existent article_id", () => {
        return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Article Does Not Exist")
        });
    });
})