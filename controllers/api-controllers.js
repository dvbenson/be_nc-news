const allEndPoints = require("../endpoints.json");

exports.getAllEndPoints = (request, response, next) => {
  response.status(200).send({ allEndPoints });
};
