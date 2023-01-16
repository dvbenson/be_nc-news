const { fetchTopics } = require("../models/model.js");

const getTopics = (request, response, next) => {
  console.log("hello world");
  fetchTopics()
    .then((topics) => {
      console.log(topics);
      response.status(200).send(topics.rows);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};

module.exports = { getTopics };
