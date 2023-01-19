const request = require("supertest");
const { app } = require("../app.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const query = require("express");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("APP", () => {
  describe("GET: /api/users", () => {
    test("200: responds with an array of objects, with the specified properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const users = response.body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
  describe("GET: /api/topics", () => {
    test("200: responds with array of topic objects, each with the properties 'slug' and 'description'", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topics = response.body;
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug", expect.any(String));
            expect(topic).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("GET: /api/articles", () => {
    test("200: responds with array of article objects, each with correct properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articles = response.body;
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
          });
        });
    });
    test("200: query adds a comment_count, showing all comments linked to article_id", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articles = response.body;
          articles.forEach((article) => {
            expect(article).toHaveProperty("comment_count", expect.any(String));
          });
        });
    });
    test("200: query sends all articles sorted by date, in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const articles = response.body;

          expect(articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(articles[0].created_at).not.toBe("2020-01-04T00:24:00.000Z");
          expect(articles[articles.length - 1].created_at).toBe(
            "2020-01-07T14:08:00.000Z"
          );
          expect(articles[articles.length - 1].created_at).not.toBe(
            "2020-11-03T09:12:00.000Z"
          );
        });
    });
    test("200: query sends an article object using the specific article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const article = response.body;

          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
    });
  });
});

describe("ERRORS", () => {
  describe("Error Handling", () => {
    test("404: incorrect route", () => {
      return request(app).get("/api/this-is-incorrect").expect(404);
    });
    test("404: returns an error for a article_id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article_id not found");
        });
    });
    test("400: bad request: responds with an error when passed a bad article_id", () => {
      return request(app)
        .get("/api/articles/ten")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});
