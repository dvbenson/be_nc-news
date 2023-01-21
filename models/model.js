const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");
const {
  checkArticleId,
  checkNewComment,
  checkCommentExists,
} = require("../db/seeds/utils.js");
const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");
const { checkTopic, checkSortBy, checkOrder } = require("../db/seeds/utils.js");

const fetchTopics = () => {
  const queryStr = format(`SELECT * 
     FROM topics;`);

  return db.query(queryStr);
};

const fetchArticles = () => {
  return db
    .query(
      `
     SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.article_id)
    AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`
    )
    .then((results) => {
      return results.rows;
    });
};

const fetchArticleById = (article_id) => {
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
//move checkId and checkNewComment to here
const addNewComment = (articleId, newComment) => {
  return db
    .query(
      `INSERT INTO comments
    (author, article_id, body)
    VALUES ($1, $2, $3)
    RETURNING *;`,
      [newComment.username, articleId, newComment.body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const fetchArticleComments = (article_id) => {
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

const updateArticleVotes = (articleId, votes) => {
  if (votes.inc_votes < 0) {
    let newVoteNum = Math.abs(votes.inc_votes);
    return db
      .query(
        `
    UPDATE articles
    SET votes = votes - $1
    WHERE article_id = $2
    RETURNING *;`,
        [newVoteNum, articleId]
      )
      .then((result) => {
        return result.rows[0];
      });
  } else if (votes.inc_votes > 0) {
    return db
      .query(
        `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `,
        [votes.inc_votes, articleId]
      )
      .then((result) => {
        return result.rows[0];
      });
  }
};

const fetchUsers = () => {
  const queryStr = format(`
  SELECT * 
  FROM users;
  `);

  return db.query(queryStr).then((rows) => {
    if (rows === 0) {
      return Promise.reject({ status: 404, msg: "Unable to find: Users" });
    } else {
      return rows;
    }
  });
};

const deleteComments = (comment_id) => {
  return validateComment(comment_id).then((comment_id) => {
    return checkCommentExists(comment_id).then((comment_id) => {
      return db
        .query(
          `
    DELETE FROM comments WHERE comment_id = $1;
    `,
          [comment_id]
        )
        .then((comment_id) => {
          return db
            .query(
              `
    SELECT * FROM comments WHERE comment_id = $1
    `,
              [comment_id]
            )
            .then((results) => {
              if (results.rows > 0) {
                return Promise.reject({
                  status: 404,
                  msg: "This article was unsuccessfully deleted",
                });
              } else {
                return results.rows[0];
              }
            });
        });
    });
  });
};

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchUsers,
  addNewComment,
  checkArticleId,
  checkNewComment,
  fetchArticleComments,
  updateArticleVotes,
  deleteComments,
};
