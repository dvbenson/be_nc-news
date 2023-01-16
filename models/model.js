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

module.exports = { fetchTopics };
