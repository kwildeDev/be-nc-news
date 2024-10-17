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
        .then(({ body }) => {
            expect(body.msg).toBe("Article Does Not Exist");
        });
    });
    it("GET 400: responds with an error message when given an invalid article_id", () => {
        return request(app)
        .get("/api/articles/five")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
    it("PATCH 200: returns an existing single article object with the votes property correctly incremented by the given number", () => {
        const originalArticle = {
            "article_id": 5,
            "title": "UNCOVERED: catspiracy to bring down democracy",
            "topic": "cats",
            "author": "rogersop",
            "body": "Bastet walks amongst us, and the cats are taking arms!",
            "created_at": "2020-08-03T13:14:00.000Z",
            "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }
        const input = { inc_votes: -10 }
        return request(app)
        .patch("/api/articles/5")
        .send(input)
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject(originalArticle)
            expect(body.article.votes).not.toBe(0)
            expect(body.article.votes).toBe(input.inc_votes)
        })
    });
    it("PATCH 400: responds with an error message if trying to update an invalid article_id", () => {
        const input = { inc_votes: 5 }
        return request(app)
        .patch("/api/articles/five")
        .send(input)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    });
    it("PATCH 404: responds with an error message if trying to update a valid but non-existent article_id", () => {
        const input = { inc_votes: -1}
        return request(app)
        .patch("/api/articles/99999")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Article Does Not Exist");
        });
    });
    it("PATCH 400: responds with an error message on an attempt to update the votes with an incorrect data type", () => {
        const input = { inc_votes: "some votes" }
        return request(app)
        .patch("/api/articles/4")
        .send(input)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
    it("PATCH 400: responds with an error message if the votes increment number is missing", () => {
        const input = {}
        return request(app)
        .patch("/api/articles/5")
        .send(input)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
})

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
            expect(Array.isArray(body.comments)).toBe(true);
            body.comments.forEach(comment => {
                expect(comment).toHaveProperty("comment_id", expect.any(Number))
                expect(comment).toHaveProperty("votes", expect.any(Number))
                expect(comment).toHaveProperty("created_at", expect.any(String))
                expect(comment).toHaveProperty("author", expect.any(String))
                expect(comment).toHaveProperty("body", expect.any(String))
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
    it("POST 201: inserts a new comment to the article and sends it back to the client", () => {
        const input = {
            author: "butter_bridge",
            body: "This is literally the funniest story I've heard all year!!!"
        };
        const expectedComment = {
            comment_id: 19,
            body: "This is literally the funniest story I've heard all year!!!",
            article_id: 1,
            author: "butter_bridge",
            votes: 0
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(input)
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toMatchObject(expectedComment)
            expect(body.comment).toMatchObject({
                created_at: expect.any(String)
            })
        });
    });
    it("POST 201: ignores unnecessary properties", () => {
        const input = {
            author: "rogersop",
            body: "Life is beautiful lol",
            favColour: "purple"
        };
        const expectedComment = {
            comment_id: 20,
            body: input.body,
            article_id: 3,
            author: input.author,
            votes: 0
        }
        return request(app)
        .post("/api/articles/3/comments")
        .send(input)
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toMatchObject(expectedComment)
            expect(body.comment).toMatchObject({
                created_at: expect.any(String)
            })
            expect(body.comment).not.toHaveProperty("favColour")
        });
    })
    it("POST 400: responds with an error message on an attempt to post to an invalid article_id", () => {
        const input = {
            author: "rogersop",
            body: "idk i've never been blocked",
        };
        return request(app)
        .post("/api/articles/not-an-article/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
    it("POST 404: responds with an error message on an attempt to post to a valid but non-existent article_id", () => {
        const input = {
            author: "butter_bridge",
            body: "Hello world, welcome to the universe.",
        };
        return request(app)
        .post("/api/articles/999/comments")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Article Does Not Exist")
        });
    });
    it("POST 400: responds with an error message if the body field is missing", () => {
        const input = {
            author: "rogersop",
        };
        return request(app)
        .post("/api/articles/1/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    })
    it("POST 400: responds with an error message if the author field is missing", () => {
        const input = {
            body: "there is no user here",
        };
        return request(app)
        .post("/api/articles/3/comments")
        .send(input)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    })
    it("POST 400: responds with an error message if the user does not exist", () => {
        const input = {
            author: "peanut_butter",
            body: "spread it on toast",
        };
        return request(app)
        .post("/api/articles/3/comments")
        .send(input)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("User Does Not Exist")
        });
    })
})

describe("/api/comments/:comment_id", () => {
    it("DELETE 204: deletes the comment specified by comment_id and returns no body", () => {
        return request(app)
        .delete("/api/comments/7")
        .expect(204)
    });
    it("DELETE 400: responds with an error message if given an invalid comment_id", () => {
        return request(app)
        .delete("/api/comments/not-a-comment")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
    it("DELETE 404: responds with an error message if given a valid but non-existent comment_id", () => {
        return request(app)
        .delete("/api/comments/100000")
        .then(({ body }) => {
            expect(body.msg).toBe("Comment Does Not Exist")
        });
    });
});

describe("/api/users", () => {
    it("GET 200: returns an array of correctly formatted user objects", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.users)).toBe(true)
            expect(body.users).toHaveLength(4)
            body.users.forEach((user) => {
                expect(user).toHaveProperty("username", expect.any(String))
                expect(user).toHaveProperty("name", expect.any(String))
                expect(user).toHaveProperty("avatar_url", expect.any(String))
            });
        });
    });

});
