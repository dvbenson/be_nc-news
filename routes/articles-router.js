const {
  getArticles,
  getArticleComments,
  getArticleById,
  patchArticleVotes,
  postComments,
} = require("../controllers/articles-controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComments);

module.exports = articlesRouter;
