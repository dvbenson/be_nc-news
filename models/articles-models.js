const {
  checkArticleId,
  checkNewComment,
  checkVotes,
} = require("../db/seeds/utils.js");

const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
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

  if (!validSortBys.includes(sort_by) || !validOrder.includes(order)) {
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
      `;
  } else {
    selectQuery += `
      GROUP BY (articles.article_id)
      ORDER BY ${sort_by} ${order}
      `;
  }

  return db.query(selectQuery, queryParams).then((results) => {
    return results.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  const queryStr = format(`
    SELECT *
    FROM articles
    WHERE article_id = $1;
    `);
  return db.query(queryStr, [article_id]).then(({ rowCount, rows }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Article ID not found" });
    } else {
      return rows[0];
    }
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

exports.fetchArticleComments = (article_id) => {
  const queryStr = format(`
      SELECT *
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC
      `);

  return db.query(queryStr, [article_id]).then(({ rowCount, rows }) => {
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
          .then((result) => {
            return result.rows[0];
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
          .then((result) => {
            return result.rows[0];
          });
      }
    }
  );
};