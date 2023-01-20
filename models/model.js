const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");
const { checkArticleId, checkNewComment } = require("../db/seeds/utils.js");
const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");
const { checkTopic, checkSortBy, checkOrder } = require("../db/seeds/utils.js");

const fetchTopics = () => {
  const queryStr = format(`SELECT * 
     FROM topics;`);

  return db.query(queryStr);
};

const fetchArticles = (queries) => {
  console.log(queries);

  let query = `SELECT articles.*, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id `;
  let byTopic = ``;
  let groupBy = `GROUP BY articles.article_id `;
  let sortBy = ``;
  let orderBy = ``;

  if (!checkSortBy(sort_by)) {
    sortBy = `ORDER BY articles.created_at `;
  } else if (
    ["article_id", "title", "votes", "topic", "author"].includes(sort_by)
  ) {
    sortBy = `ORDER BY articles.${sort_by} `;
  }

  if (!checkOrder(order)) {
    orderBy = `ASC;`;
  } else if (order.toUpperCase() === "ASC" || order.toUpperCase() === "DESC") {
    orderBy = `${order.toUpperCase()};`;
  }

  if (checkTopic(topic)) {
    byTopic = `WHERE articles.topic = '${topic}' `;
    query = query + byTopic;
  }

  return db.query(query + groupBy + sortBy + orderBy).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `This topic does not exist`,
      });
    }
    return result.rows;
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

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  addNewComment,
  checkArticleId,
  checkNewComment,
  fetchArticleComments,
};

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

// const queryValues = [topic];

// if (topic) {
//   let queryStr = `
//     SELECT articles.$1
//     COUNT(comments.article_id)
//     AS comment_count
//     FROM articles
//     LEFT JOIN comments
//     ON articles.article_id = comments.article_id
//     GROUP BY articles.article_id

//     `;
//   queryStr += `ORDER BY ${sort_by} ${order.toUpperCase()};`;

//   if (!acceptedSortBys.includes(sort_by)) {
//     return Promise.reject({
//       status: 400,
//       msg: "That sort category does not exist!",
//     });
//   }
//   return db.query(queryStr, queryValues);
// } else {
//   let queryStr = `
//     SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
//     COUNT(comments.article_id)
//     AS comment_count
//     FROM articles
//     LEFT JOIN comments
//     ON articles.article_id = comments.article_id
//     GROUP BY articles.article_id

//     `;
//   queryStr += `ORDER BY ${sort_by} ${order.toUpperCase()};`;

//   if (!acceptedSortBys.includes(sort_by)) {
//     return Promise.reject({
//       status: 400,
//       msg: "That sort category does not exist!",
//     });
//   }
//   return db.query(queryStr, queryValues);
// }
