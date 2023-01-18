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

const addNewComment = (article_id, newCommentData) => {
  const newComment = {
    body: body,
    votes: 0,
    author: author,
    article_id: article_id,
    created_at: 0,
  };
  const { body } = newCommentData;
  const { username: author } = newCommentData;
  const articleIdLookup = createRef(articleData, "title", "article_id");
  console.log(articleIdLookup);
  const formattedCommentData = formatComments(newComment, articleIdLookup);
  console.log(formattedCommentData);

  const queryStr = format(
    `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;`,
    formattedCommentData.map(
      ({ body, author, article_id, votes = 0, created_at }) => [
        body,
        author,
        article_id,
        votes,
        created_at,
      ]
    )
  );
  return db.query(queryStr);
};
// if (!newCommentData.username && !newCommentData.username) {
//   return Promise.reject({ status: 400, msg: "Missing fields on comment" });
// } else {
//   console.log(rows);
// }

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  addNewComment,
};
