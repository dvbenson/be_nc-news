const request = require("supertest");
const app = require("../app.js");
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
          expect(article).toHaveProperty("article_img_url", expect.any(String));
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
});

describe("GET: /api/articles (QUERIES)", () => {
  test("200: get request can take a query which filters articles by a single topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("200: get request can take a query which groups articles by sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const articles = body;

        expect(articles[0].title).toBe("Z");
        expect(articles[articles.length - 1].title).toBe("A");
      });
  });
  test("200: get request can take a query which organises articles in order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body;
        expect(articles[0].created_at).toBe("2020-01-07T14:08:00.000Z");
        expect(articles[articles.length - 1].created_at).toBe(
          "2020-11-03T09:12:00.000Z"
        );
        expect(articles[0].created_at).not.toBe("2020-11-03T09:12:00.000Z");
        expect(articles[articles.length - 1].created_at).not.toBe(
          "2020-01-04T00:24:00.000Z"
        );
      });
  });

  describe("ERROR: article queries", () => {
    test("400: sort_by doesn't exist", () => {
      return request(app)
        .get("/api/articles?sort_by=my_favourite_thing")
        .expect(400);
    });
    test("400: order doesn't exist", () => {
      return request(app).get("/api/articles?order=longwise").expect(400);
    });
  });
});

describe("GET: /api/articles/:article_id", () => {
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
  describe("ERROR: /api/articles/:article_id", () => {
    test("404: returns an error for a article_id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article ID not found");
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

describe("GET: /api/articles/:article_id/comments", () => {
  test("200: received array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body;

        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        });
        expect(comments[0].created_at).toBe("2020-11-03T21:00:00.000Z");
        expect(comments[comments.length - 1].created_at).toBe(
          "2020-01-01T03:08:00.000Z"
        );
      });
  });

  describe("ERROR: /api/articles/:article_id/comments", () => {
    test("404: no comments found for article_id", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("This article has no comments yet");
        });
    });
  });
});

// add two new tests: articleId is valid && username exists(below)
describe("PATCH: api/articles/:article_id (VOTES)", () => {
  test("200: request accepts an object that modifies the vote property in the database positively", () => {
    const articleId = 2;
    const votes = { inc_votes: 2 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(votes)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.article_id).toBe(2);
        expect(response.body.votes).toBe(2);
        expect(response.body.updatedArticleInfo).not.toBe(
          testData.articleData[articleId - 1]
        );
      });
  });
  test("200: request accepts an object that modifies the vote property in the database negatively", () => {
    const articleId = 1;
    const votes = { inc_votes: -50 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(votes)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.article_id).toBe(1);
        expect(response.body.votes).toBe(50);
        expect(response.body.updatedArticleInfo).not.toBe(
          testData.articleData[articleId - 1]
        );
      });
  });
  describe("ERROR: /api/articles/:article_id (VOTES)", () => {
    test("400: throws an error if request body does not have inc_votes property", () => {
      const articleId = 2;
      const newVote = { votes: 2 };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVote)
        .expect(400);
    });
    test("400: throws an error if request body is empty", () => {
      const articleId = 2;
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send()
        .expect(400);
    });
    test("422: throws an error if the value of inc_votes is invalid", () => {
      const articleId = 2;
      const newVote = { inc_votes: "string" };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVote)
        .expect(422);
    });
    test("422: throws an error if there is another property in the request body", () => {
      const articleId = 2;
      const newVote = { inc_votes: 2, name: "Doggo" };
      return request(app)
        .patch(`/api/articles/${articleId}`)
        .send(newVote)
        .expect(422);
    });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: request accepts an object with username and body properties, responds with the posted comment", () => {
    const articleId = 1;
    const newComment = { username: "icellusedkars", body: "im bob" };
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toMatchObject({
          comment_id: expect.any(Number),
          body: newComment.body,
          article_id: articleId,
          author: newComment.username,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  describe("ERROR: /api/articles/:article_id/comments", () => {
    test("400: bad body/missing required fields", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid Comment Format");
        });
    });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: content deleted under specified id number, returns an empty object", () => {
    return request(app)
      .delete(`/api/comments/1`)
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  describe("ERROR: /api/comments/:comment_id", () => {
    test("404: no comments exist with that identifier", () => {
      return request(app)
        .delete("/api/comments/22")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No comments exist with that comment ID");
        });
    });
    test("400: incorrect comment ID format inputted", () => {
      return request(app)
        .delete("/api/comments/string")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment ID can only be in number format!");
        });
    });
  });
});

describe("ERRORS: universal", () => {
  test("404: incorrect pathway", () => {
    return request(app).get("/api/this-is-incorrect").expect(404);
  });
});
