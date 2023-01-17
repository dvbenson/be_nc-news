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
    // test("200: received array of comments for the given article_id", () => {
    //   return request(app)
    //     .get("/api/articles/1/comments")
    //     .expect(200)
    //     .then((response) => {
    //       const comments = response.body;

    //       comments.forEach((comment) => {
    //         expect(comment).toHaveProperty("comment_id", expect.any(Number));
    //         expect(comment).toHaveProperty("votes", expect.any(Number));
    //         expect(comment).toHaveProperty("created_at", expect.any(String));
    //         expect(comment).toHaveProperty("author", expect.any(String));
    //         expect(comment).toHaveProperty("body", expect.any(String));
    //         expect(comment).toHaveProperty("article_id", expect.any(Number));
    //       });
    //       expect(comments[0].created_at).toBe();
    //       expect(comments[comments.length - 1].created_at).toBe();
    //     });
    // });
  });
});

describe("ERRORS", () => {
  describe("Error Handling", () => {
    test("404: not a route", () => {
      return request(app).get("/api/this-is-incorrect").expect(404);
    });
    // test("404: no comments found for article_id", () => {
    //   return request(app)
    //     .get("/api/articles/4/comments")
    //     .expect(404)
    //     .then(({ body }) => {
    //       expect(body.msg).toBe("This article has no comments");
    //     });
    // });
  });
});
