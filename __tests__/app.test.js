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

describe("GET: /api", () => {
  test("200: responds with correct status code", () => {
    return request(app).get("/api").expect(200);
  });
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

describe("GET: /api/users/:username", () => {
  test("200: responds with an object, with the specified properties", () => {
    const testUserName = "icellusedkars";
    return request(app)
      .get(`/api/users/${testUserName}`)
      .expect(200)
      .then((response) => {
        const testUser = response.body;
        expect(Object.keys(testUser).length).toBe(3);
        expect(testUser).toHaveProperty("username", testUserName);
        expect(testUser).toHaveProperty("name", expect.any(String));
        expect(testUser).toHaveProperty("avatar_url", expect.any(String));
        expect(typeof testUser).toBe("object");
      });
  });

  describe("ERROR: /api/users/:username", () => {
    test("404: returns an error for a username that doesn't exist", () => {
      const testUserName = "jeffroray";
      return request(app)
        .get(`/api/users/${testUserName}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found");
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
        const articles = response.body.articles;
        expect(articles.length).toBe(10);
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
        const articles = response.body.articles;
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
        const articles = response.body.articles;

        expect(articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(articles[0].created_at).not.toBe("2020-01-04T00:24:00.000Z");
        expect(articles[articles.length - 1].created_at).toBe(
          "2020-04-17T01:08:00.000Z"
        );
        expect(articles[articles.length - 1].created_at).not.toBe(
          "2020-11-03T09:12:00.000Z"
        );
      });
  });
});

describe("GET: QUERIES: /api/articles", () => {
  test("200: get request can take a query which filters articles by a single topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
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
        const articles = body.articles;

        expect(articles[0].title).toBe("Z");
        expect(articles[articles.length - 1].title).toBe(
          "Does Mitch predate civilisation?"
        );
      });
  });
  test("200: get request takes a query that can organise articles in order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles[0].created_at).toBe("2020-01-07T14:08:00.000Z");
        expect(articles[articles.length - 1].created_at).toBe(
          "2020-10-16T05:03:00.000Z"
        );
        expect(articles[0].created_at).not.toBe("2020-11-03T09:12:00.000Z");
        expect(articles[articles.length - 1].created_at).not.toBe(
          "2020-01-04T00:24:00.000Z"
        );
      });
  });
  test("200: accepts the limit query", () => {
    return request(app)
      .get("/api/articles?limit=6")
      .then((response) => {
        expect(response.body.articles.length).toBe(6);
      });
  });
  test("200: accepts the page query", () => {
    return request(app)
      .get("/api/articles?p=1")
      .then((response) => {
        expect(response.body.articles[0].article_id).toBe(6);
      });
  });
  test("200: checks for the article_count property", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        expect(response.body.article_count).toBe(10);
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
    //400: check for topic test
    //404: incorrect pathway
  });
});

describe("POST: /api/articles", () => {
  test("201: article receives correct request input and outputs with comment_count and default img url", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "I love celling used kars",
      body: "I just do, get over it",
      topic: "cats",
    };
    return request(app)
      .post(`/api/articles`)
      .send(newArticle)
      .expect(201)
      .expect((response) => {
        const newReturnArticle = response.body;
        expect(Object.keys(newReturnArticle).length).toBe(9);
        expect(newReturnArticle).toBeInstanceOf(Object);
        expect(newReturnArticle).toMatchObject({
          author: newReturnArticle.author,
          title: newReturnArticle.title,
          body: newReturnArticle.body,
          topic: newReturnArticle.topic,
          article_img_url: `https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700`,
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          comment_count: expect.any(String),
        });
      });
  });
  test("201: article receives correct request input and outputs with specific img url", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "I love celling used kars",
      body: "I just do, get over it",
      topic: "cats",
      article_img_url: "https://www.example.com/image.jpg",
    };
    return request(app)
      .post(`/api/articles`)
      .send(newArticle)
      .expect(201)
      .expect((response) => {
        const newReturnArticle = response.body;
        expect(Object.keys(newReturnArticle).length).toBe(9);
        expect(newReturnArticle).toBeInstanceOf(Object);
        expect(newReturnArticle).toMatchObject({
          author: newReturnArticle.author,
          title: newReturnArticle.title,
          body: newReturnArticle.body,
          topic: newReturnArticle.topic,
          article_img_url: "https://www.example.com/image.jpg",
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          comment_count: expect.any(String),
        });
      });
  });
  describe("ERROR: /api/articles", () => {
    describe("ERROR: /api/articles", () => {
      test("404: author doesn't exist", () => {
        const newArticle = {
          title: "New Article",
          body: "This is a new article",
          topic: "cats",
          author: "invalid_author",
          article_img_url: "https://www.example.com/image.jpg",
        };

        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Topic or Author doesn't exist");
          });
      });

      test("404: topic doesn't exist", () => {
        const newArticle = {
          title: "New Article",
          body: "This is a new article",
          topic: "invalid_topic",
          author: "icellusedkars",
          article_img_url: "https://www.example.com/image.jpg",
        };

        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Topic or Author doesn't exist");
          });
      });

      test("400: request has incorrect properties", () => {
        const newArticle = {
          titlegood: "New Article",
          body: "This is a new article",
          authorbad: "valid_author",
          article_img_url: "https://www.example.com/image.jpg",
        };

        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "Article missing required information, or information inputted incorrectly"
            );
          });
      });
    });
  });
});

describe("POST: /api/topics", () => {
  test("201: receives the correct post request format and creates topic", () => {
    const newTopic = {
      slug: "pets",
      description: "All things pets; cats, dogs, stick-insects",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then((response) => {
        const postedTopic = response.body;
        expect(Object.keys(postedTopic).length).toBe(2);
        expect(postedTopic).toBeInstanceOf(Object);
        expect(postedTopic).toMatchObject({
          slug: newTopic.slug,
          description: newTopic.description,
        });
      });
  });
  describe("ERRORS: /api/topics", () => {
    test("404: rejects empty object", () => {
      const newTopic = {};
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Topic missing required fields, empty or incorrect"
          );
        });
    });
    test("404: doesn't have slug or description properties", () => {
      const newTopic = {
        topic: "Insects",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Topic missing required fields, empty or incorrect"
          );
        });
    });
    test("404: has too many properties", () => {
      const newTopic = {
        slug: "Insects",
        description: "A bug's life",
        creator: "breaking_bugs",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Topic missing required fields, empty or incorrect"
          );
        });
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
        expect(article).toHaveProperty("comment_count", expect.any(String));
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
  test("200: takes the limit query", () => {
    return request(app)
      .get("/api/articles/3/comments/?limit=2")
      .then((response) => {
        expect(response.body.length).toBe(2);
      });
  });
  test("200: takes the p query", () => {
    return request(app)
      .get("/api/articles/3/comments?p=1")
      .then((response) => {
        expect(response.body[0].article_id).toBe(3);
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

describe("PATCH: VOTES: api/articles/:article_id", () => {
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
    test("404: article_id doesn't exist", () => {
      const article_id = 256789;
      const newVote = { inc_votes: 3 };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(newVote)
        .expect(404);
    });
  });
});

describe("PATCH: VOTES: api/comments/:comment_id", () => {
  test("200: request accepts an object that modifies the vote property in the database positively", () => {
    const comment_id = 1;
    const votes = { inc_votes: 5 };
    return request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(votes)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.comment_id).toBe(1);
        expect(response.body.votes).toBe(21);
        expect(response.body.updatedCommentInfo).not.toBe(
          testData.commentData[comment_id - 1]
        );
      });
  });
  test("200: request accepts an object that modifies the vote property in the database negatively", () => {
    const comment_id = 1;
    const votes = { inc_votes: -5 };
    return request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(votes)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.comment_id).toBe(1);
        expect(response.body.votes).toBe(11);
        expect(response.body.updatedCommentInfo).not.toBe(
          testData.commentData[comment_id - 1]
        );
      });
  });
  describe("ERROR: /api/comments/:comment_id (VOTES)", () => {
    test("400: throws an error if request body does not have inc_votes property", () => {
      const comment_id = 2;
      const newVote = { votes: 2 };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(newVote)
        .expect(400);
    });
    test("400: throws an error if request body is empty", () => {
      const comment_id = 2;
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send()
        .expect(400);
    });
    test("422: throws an error if the value of inc_votes is invalid", () => {
      const comment_id = 2;
      const newVote = { inc_votes: "string" };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(newVote)
        .expect(422);
    });
    test("422: throws an error if there is another property in the request body", () => {
      const comment_id = 2;
      const newVote = { inc_votes: 2, name: "Doggo" };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(newVote)
        .expect(422);
    });
    test("404: comment_id doesn't exist", () => {
      const comment_id = 2569876;
      const newVote = { inc_votes: 3 };
      return request(app)
        .patch(`/api/comments/${comment_id}`)
        .send(newVote)
        .expect(404);
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
