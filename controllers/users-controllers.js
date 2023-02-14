const { fetchUsers, fetchUserById } = require("../models/users-models");

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

exports.getUserName = (request, response, next) => {
  const { username } = request.params;

  fetchUserById(username)
    .then((user) => {
      response.status(200).send(user);
    })
    .catch((error) => {
      next(error);
    });
};
