const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");

exports.fetchUsers = () => {
  const queryStr = format(`
      SELECT * 
      FROM users;
      `);

  return db.query(queryStr).then((rows) => {
    if (rows === 0) {
      return Promise.reject({ status: 404, msg: "Unable to find: Users" });
    } else {
      return rows;
    }
  });
};
