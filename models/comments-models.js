const { validateComment, checkVotes } = require('../db/seeds/utils.js');

const db = require('../db/connection.js');
const format = require('pg-format');
const query = require('express');

exports.removeCommentById = (comment_id) => {
  return Promise.resolve(validateComment(comment_id))
    .then((validCommentId) => {
      const queryStr = format(`SELECT * FROM comments WHERE comment_id = $1;`);
      return db.query(queryStr, [validCommentId]);
    })
    .then(({ rows, rowCount }) => {
      if (rowCount === 0 || rows === []) {
        return Promise.reject({
          status: 404,
          msg: "Comment doesn't exist, check the comment_id",
        });
      } else {
        const commentIdToDelete = rows[0].comment_id;
        const queryStr = format(`
        DELETE FROM comments WHERE comment_id = $1;
        `);
        return db.query(queryStr, [commentIdToDelete]);
      }
    });
};

exports.updateCommentVotes = (comment_id, votes) => {
  return Promise.all([validateComment(comment_id), checkVotes(votes)]).then(
    ([checkedCommentId, checkedVotes]) => {
      if (checkedVotes.inc_votes < 0) {
        let newVoteNum = Math.abs(checkedVotes.inc_votes);
        return db
          .query(
            `
      UPDATE comments
      SET votes = votes - $1
      WHERE comment_id = $2
      RETURNING *;`,
            [newVoteNum, checkedCommentId]
          )
          .then(({ rowCount, rows }) => {
            if (rowCount === 0) {
              return Promise.reject({
                status: 404,
                msg: "This comment doesn't exist ",
              });
            } else {
              return rows[0];
            }
          });
      } else {
        return db
          .query(
            `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;
        `,
            [checkedVotes.inc_votes, checkedCommentId]
          )
          .then(({ rowCount, rows }) => {
            if (rowCount === 0) {
              return Promise.reject({
                status: 404,
                msg: "This comment doesn't exist ",
              });
            } else {
              return rows[0];
            }
          });
      }
    }
  );
};
