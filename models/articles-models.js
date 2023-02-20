const {
  checkArticleId,
  checkNewComment,
  checkVotes,
  checkNewArticle,
} = require("../db/seeds/utils.js");

const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p = 0
) => {
  const validSortBys = [
    "title",
    "topic",
    "author",
    "body",
    "votes",
    "created_at",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (
    !validSortBys.includes(sort_by) ||
    !validOrder.includes(order) ||
    !typeof limit === "number" ||
    !typeof p === "number"
  ) {
    return Promise.reject({
      status: 400,
      msg: "Query not accepted, please try again",
    });
  }
  let selectQuery = ` 
    SELECT articles.*,
    COUNT (comments.article_id) as comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    `;
  const queryParams = [];

  if (topic) {
    queryParams.push(topic);
    selectQuery += `
      WHERE topic LIKE $1
      GROUP BY (articles.article_id)
      ORDER BY ${sort_by} ${order}
      LIMIT ${limit}
      OFFSET ${p}
      `;
  } else {
    selectQuery += `
      GROUP BY (articles.article_id)
      ORDER BY ${sort_by} ${order}
      LIMIT ${limit}
      OFFSET ${p}
      `;
  }

  return db.query(selectQuery, queryParams).then((results) => {
    return { articles: results.rows, article_count: results.rows.length };
  });
};

exports.addNewArticle = (newArticle) => {
  const { author } = newArticle;
  const { title } = newArticle;
  const { body } = newArticle;
  const { topic } = newArticle;
  const { article_img_url } = newArticle;

  const queryStr1 = format(`SELECT * FROM topics WHERE slug = $1;`);
  const queryStr2 = format(`SELECT * FROM users WHERE username = $1;`);

  return Promise.all([
    db.query(queryStr1, [topic]),
    db.query(queryStr2, [author]),
    checkNewArticle(newArticle),
  ])
    .then(([topicsResult, usersResult]) => {
      const topicExists = topicsResult.rowCount > 0;
      const userExists = usersResult.rowCount > 0;

      if (!topicExists || !userExists) {
        return Promise.reject({
          status: 404,
          msg: "Topic or Author doesn't exist",
        });
      }

      if (!article_img_url) {
        const queryStr = format(
          `INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *;`
        );
        return db.query(queryStr, [author, title, body, topic]);
      } else {
        const queryStr = format(
          `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`
        );
        return db.query(queryStr, [
          author,
          title,
          body,
          topic,
          article_img_url,
        ]);
      }
    })
    .then((results) => {
      const { article_id } = results.rows[0];

      const queryStr = format(
        `SELECT articles.*, 
         COUNT (comments.article_id) as comment_count
         FROM articles 
         LEFT JOIN comments
         ON articles.article_id = comments.article_id
         WHERE articles.article_id = $1
         GROUP BY (articles.article_id);`
      );

      return db.query(queryStr, [article_id]);
    })
    .then((results) => {
      return results.rows[0];
    });
};

exports.fetchArticleById = (article_id) => {
  const queryStr = format(`
  SELECT articles.* ,
  COUNT(comments.article_id) as comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY (articles.article_id)
    `);
  return db.query(queryStr, [article_id]).then(({ rowCount, rows }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Article ID not found" });
    } else {
      return rows[0];
    }
  });
};

exports.removeArticleById = (article_id) => {
  return Promise.resolve(checkArticleId(article_id))
    .then((returnedArticleId) => {
      const queryStr = format(`SELECT * FROM articles WHERE article_id = $1;`);
      return db.query(queryStr, [returnedArticleId]);
    })
    .then(({ rowCount, returnedArticleId }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article doesn't exist, check the article_id",
        });
      } else {
        const queryStr = format(`DELETE FROM articles WHERE article_id = $1`);
        return db.query(queryStr, [returnedArticleId]);
      }
    })
    .then(() => {
      return { msg: "message deleted" };
    });
};

exports.addNewComment = (article_id, newComment) => {
  return Promise.all([
    checkArticleId(article_id),
    checkNewComment(newComment),
  ]).then(([resultArticleId, resultBody]) => {
    const queryStr = format(`SELECT * FROM users WHERE username = $1;`);
    return db
      .query(queryStr, [resultBody.username])
      .then(({ rowCount, rows }) => {
        if (rowCount === 0) {
          return Promise.reject({
            status: 404,
            msg: "Username doesn't exist",
          });
        }

        const queryStr = format(`INSERT INTO comments
      (author, article_id, body)
      VALUES ($1, $2, $3)
      RETURNING *;`);

        return db
          .query(queryStr, [
            resultBody.username,
            resultArticleId,
            resultBody.body,
          ])
          .then((result) => {
            return result.rows[0];
          });
      });
  });
};

exports.fetchArticleComments = (article_id, limit, p) => {
  if (!typeof limit === "number" || !typeof p === "number") {
    return Promise.reject({
      status: 400,
      msg: "Query not accepted, please try again",
    });
  }
  const queryStr = format(`
      SELECT *
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC
      LIMIT $2
      OFFSET $3
      `);

  return db
    .query(queryStr, [article_id, limit, p])
    .then(({ rowCount, rows }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "This article has no comments yet",
        });
      } else {
        return rows;
      }
    });
};

exports.updateArticleVotes = (article_id, votes) => {
  return Promise.all([checkArticleId(article_id), checkVotes(votes)]).then(
    ([checkedArticleId, checkedVotes]) => {
      if (checkedVotes.inc_votes < 0) {
        let newVoteNum = Math.abs(checkedVotes.inc_votes);
        return db
          .query(
            `
      UPDATE articles
      SET votes = votes - $1
      WHERE article_id = $2
      RETURNING *;`,
            [newVoteNum, checkedArticleId]
          )
          .then(({ rowCount, rows }) => {
            if (rowCount === 0) {
              return Promise.reject({
                status: 404,
                msg: "This article doesn't exist ",
              });
            } else {
              return rows[0];
            }
          });
      } else {
        return db
          .query(
            `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `,
            [checkedVotes.inc_votes, checkedArticleId]
          )
          .then(({ rowCount, rows }) => {
            if (rowCount === 0) {
              return Promise.reject({
                status: 404,
                msg: "This article doesn't exist ",
              });
            } else {
              return rows[0];
            }
          });
      }
    }
  );
};
