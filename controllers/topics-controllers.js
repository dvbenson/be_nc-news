const { fetchTopics } = require("../models/topics-models");

const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");

exports.getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      response.status(200).send(topics.rows);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};
