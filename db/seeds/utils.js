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
  if (/[^\d]/g.test(article_id)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid Article ID: please try again`,
    });
  }
  return article_id;
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

exports.checkVotes = (votes) => {
  if (!votes.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "The request body must be structured as follows: { inc_votes: number_of_votes }",
    });
  } else if (!Number.isInteger(votes.inc_votes)) {
    return Promise.reject({
      status: 422,
      msg: "Votes must be an number!",
    });
  } else if (Object.keys(votes).length > 1) {
    return Promise.reject({
      status: 422,
      msg: "The request body must be structured as follows: { inc_votes: number_of_votes }",
    });
  }
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

exports.checkNewArticle = (newArticle) => {
  const requiredProperties = ["author", "title", "body", "topic"];
  const optionalProperties = [
    "author",
    "title",
    "body",
    "topic",
    "article_img_url",
  ];

  const actualProperties = Object.keys(newArticle);

  // Check that all required properties are present
  const missingProperties = requiredProperties.filter(
    (prop) => !actualProperties.includes(prop)
  );
  if (missingProperties.length > 0) {
    return Promise.reject({
      status: 400,
      msg: "Article missing required information, or information inputted incorrectly",
    });
  }

  // Check that there are no additional properties except optional img url
  const extraProperties = actualProperties.filter(
    (prop) => !optionalProperties.includes(prop)
  );
  if (extraProperties.length > 0) {
    return Promise.reject({
      status: 400,
      msg: "Article missing required information, or information inputted incorrectly",
    });
  }

  return newArticle;
};
