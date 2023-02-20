const { fetchTopics, addNewTopic } = require("../models/topics-models");

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

exports.postTopic = (request, response, next) => {
  const newTopic = request.body;

  addNewTopic(newTopic)
    .then((topic) => {
      response.status(201).send(topic);
    })
    .catch((error) => {
      next(error);
    });
};
