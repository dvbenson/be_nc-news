const {
  getArticles,
  getArticleComments,
  getArticleById,
  patchArticleVotes,
  postComments,
} = require("../controllers/articles-controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.patch("/:article_id", patchArticleVotes);

articlesRouter.get("/:article_id/comments", getArticleComments);

articlesRouter.post("/:article_id/comments", postComments);

module.exports = articlesRouter;
