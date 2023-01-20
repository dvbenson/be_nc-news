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

exports.checkArticleId = (articleId) => {
  if (/[^\d]/g.test(articleId)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid Article ID: please try again`,
    });
  }
  return articleId;
};

exports.checkNewComment = (newComment) => {
  if (
    !newComment.hasOwnProperty("username") &&
    !newComment.hasOwnProperty("body")
  ) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Comment Format",
    });
  } else {
    return newComment;
  }
};

exports.checkTopic = (topic) => {
  let correctTopic = topic;
  return db
    .query(`SELECT * FROM articles WHERE topic = $1;`, [topic])
    .then((topic) => {
      if (topic.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "This topic does not exist",
        });
      } else {
        return correctTopic;
      }
    });
};

exports.checkSortBy = (sort_by) => {
  if (
    !sort_by ||
    ["article_id", "title", "votes", "topic", "author"].includes(sort_by)
  ) {
    return sort_by;
  } else if (
    !["article_id", "title", "votes", "topic", "author"].includes(sort_by)
  ) {
    return Promise.reject({
      status: 400,
      msg: `Accepted sort_by queries: article_id, title, votes, topic, author`,
    });
  }
};

exports.checkOrder = (order) => {
  if (
    !order ||
    order.toUpperCase() === "ASC" ||
    order.toUpperCase() === "DESC"
  ) {
    return order;
  } else if (order.toUpperCase() !== "ASC" || order.toUpperCase() !== "DESC") {
    return Promise.reject({
      status: 400,
      msg: `Accepted order queries: asc = ascending or desc = descending`,
    });
  }
};
