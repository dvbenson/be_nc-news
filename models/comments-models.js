const { validateComment, checkVotes } = require("../db/seeds/utils.js");

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
          .then((result) => {
            return result.rows[0];
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
          .then((result) => {
            return result.rows[0];
          });
      }
    }
  );
};
