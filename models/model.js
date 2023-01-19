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

const fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const acceptedSortBys = [
    "title",
    "author",
    "body",
    "created_at",
    "aricle_img_url",
  ];
  const queryValues = [topic];

  if (topic) {
    let queryStr = `
      SELECT articles.$1
      COUNT(comments.article_id) 
      AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id
  
      `;
    queryStr += `ORDER BY ${sort_by} ${order.toUpperCase()};`;

    if (!acceptedSortBys.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        msg: "That sort category does not exist!",
      });
    }
    return db.query(queryStr, queryValues);
  } else {
    let queryStr = `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
      COUNT(comments.article_id) 
      AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id
  
      `;
    queryStr += `ORDER BY ${sort_by} ${order.toUpperCase()};`;

    if (!acceptedSortBys.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        msg: "That sort category does not exist!",
      });
    }
    return db.query(queryStr, queryValues);
  }
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

module.exports = { fetchTopics, fetchArticles, fetchArticleById };

// `
//     SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
//     COUNT(comments.article_id)
//     AS comment_count
//     FROM articles
//     LEFT JOIN comments
//     ON articles.article_id = comments.article_id
//     GROUP BY articles.article_id
//     ORDER BY created_at DESC;`
//comment_count query ^^^
