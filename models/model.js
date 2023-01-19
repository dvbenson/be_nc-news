const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");
const { createRef, formatComments } = require("../db/seeds/utils.js");
const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");

const fetchTopics = () => {
  const queryStr = format(`SELECT * 
     FROM topics;`);

  return db.query(queryStr);
};

const fetchArticles = () => {
  const queryStr = format(
    `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.article_id) 
    AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`
  );
  return db.query(queryStr);
};

const fetchArticleById = (article_id) => {
  const queryStr = format(`
       SELECT *
       FROM articles
       WHERE article_id = $1;
  `);
  return db.query(queryStr, [article_id]).then(({ rowCount, rows }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: "article_id not found" });
    } else {
      return rows[0];
    }
  });
};

const addNewComment = (article_id, newComment) => {
  return Promise.all([article_id, newComment]).then(
    ([article_id, newComment]) => {
      const articleIdLookup = createRef(articleData, "title", "article_id");
      const formattedCommentData = formatComments(newComment, articleIdLookup);
      return db
        .query(
          `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L RETURNING*;`,
          formattedCommentData.map(
            ({ body, author, article_id, votes = 0, created_at }) => [
              body,
              author,
              article_id,
              votes,
              created_at,
            ]
          )
        )
        .then(() => {
          return db.query(
            `
        SELECT * FROM comments
     WHERE comments.author = $1
    AND comments.article_id = $2
    AND comments.body = $3;`,
            [newComment.username, article_id, newComment.body]
          );
        })
        .then((results) => {
          return results.rows[0];
        });
    }
  );
};

// const addNewComment = (article_id, newComment) => {
//   return db
//     .query(
//       `
//   INSERT INTO comments
//   (author, article_id, body)
//   VALUES
//   ($1, $2, $3);`,
//       [newComment.username, article_id, newComment.body]
//     )
//     .then(() => {
//       return db
//         .query(
//           `
//     SELECT * FROM comments
//     WHERE comments.author = $1
//     AND comments.article_id = $2
//     AND comments.body = $3;`,
//           [newComment.username, article_id, newComment.body]
//         )
//         .then((results) => {
//           return results.rows[0];
//         });
//     });
// };

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  addNewComment,
};
