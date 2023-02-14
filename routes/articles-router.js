const {
  getArticles,
  getArticleComments,
  getArticleById,
  patchArticleVotes,
  postComments,
} = require("../controllers/articles-controllers");
const articlesRouter = require("express").Router();

articlesRouter.get("/api/articles", getArticles);

articlesRouter.get("/api/articles/:article_id", getArticleById);

articlesRouter.patch("/api/articles/:article_id", patchArticleVotes);

articlesRouter.get("/api/articles/:article_id/comments", getArticleComments);

articlesRouter.post("/api/articles/:article_id/comments", postComments);

module.exports = articlesRouter;
