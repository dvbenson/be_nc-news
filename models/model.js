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

const fetchArticleComments = (article_id) => {
  const queryStr = format(`
  SELECT *
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC
  `);

  return db.query(queryStr, [article_id]).then((rows) => {
    return rows;
  });
};

module.exports = { fetchTopics, fetchArticles, fetchArticleComments };
