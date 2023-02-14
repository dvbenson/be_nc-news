const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");

exports.fetchTopics = () => {
  const queryStr = format(`SELECT * 
       FROM topics;`);

  return db.query(queryStr);
};
