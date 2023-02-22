const { checkNewTopic } = require("../db/seeds/utils");
const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");

exports.fetchTopics = () => {
  const queryStr = format(`SELECT * 
       FROM topics;`);

  return db.query(queryStr);
};

exports.addNewTopic = (newTopic) => {
  return Promise.all([checkNewTopic(newTopic)])
    .then(([returnedNewTopic]) => {
      const { slug } = returnedNewTopic;
      const { description } = returnedNewTopic;
      const queryStr = format(
        `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`
      );
      return db.query(queryStr, [slug, description]);
    })
    .then((results) => {
      return results.rows[0];
    });
};
