const { validateComment } = require("../db/seeds/utils.js");

const db = require("../db/connection.js");
const format = require("pg-format");
const query = require("express");

exports.deleteComments = (comment_id) => {
  return Promise.all([validateComment(comment_id)]).then(([comment_id]) => {
    return db.query(
      `
      DELETE FROM comments WHERE comment_id = $1;
      `,
      [comment_id]
    );
  });
};
