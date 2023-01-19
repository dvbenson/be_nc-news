const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");
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

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  updateArticleVotes,
};
