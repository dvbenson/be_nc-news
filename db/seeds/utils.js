const db = require("../connection.js");
const { sort } = require("../data/test-data/articles.js");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkArticleId = (article_id) => {
  //console.log(article_id, "<---entering");
  if (/[^\d]/g.test(article_id)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid Article ID: please try again`,
    });
  }
  //console.log(article_id, "<---returning");
  return article_id;
};

exports.checkNewComment = (newComment) => {
  //console.log(newComment, "<---- entering");
  if (
    !newComment.hasOwnProperty("username") &&
    !newComment.hasOwnProperty("body")
  ) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Comment Format",
    });
  } else {
    //console.log(newComment, "<---- returning");
    return newComment;
  }
};

exports.checkVotes = (votes) => {
  //console.log(votes, "<--- entered");
  if (!votes.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "The request body must be structured as follows: { inc_votes: number_of_votes }",
    });
  } else if (!Number.isInteger(votes.inc_votes)) {
    return Promise.reject({
      status: 422,
      msg: "Votes must be a number!",
    });
  } else if (Object.keys(votes).length > 1) {
    return Promise.reject({
      status: 422,
      msg: "The request body must be structured as follows: { inc_votes: number_of_votes }",
    });
  }
  //console.log(votes, "<--- returned");
  return votes;
};

exports.validateComment = (comment_id) => {
  if (/[^\d]/g.test(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: `Comment ID can only be in number format!`,
    });
  }
  return comment_id;
};
