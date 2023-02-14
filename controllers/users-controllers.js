const { fetchUsers } = require("../models/users-models");

const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");

exports.getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send(users.rows);
    })
    .catch((error) => {
      next(error);
    });
};

// exports.getUserName = (request)
