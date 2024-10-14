const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const request = require("supertest")
const app = require("../app")
const endpoints = require("../endpoints.json")

beforeAll(() => seed(data));

afterAll(() => db.end());

describe("Express Server", () => {
    it("404 - responds with status 404 when given an invalid endpoint", () => {
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
    it("200 - responds with status 200 and returns an array of all topics", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
            if (body.topics.length > 0) {
                body.topics.forEach(topic => {
                    expect(typeof topic.description).toBe("string");
                    expect(typeof topic.slug).toBe("string")
                });
            }
        });
    });
});
describe("GET /api", () => {
    it("200 - responds with status 200 and returns an object detailing all available API endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body.endpoints).toEqual(endpoints);
        });
    });
});


