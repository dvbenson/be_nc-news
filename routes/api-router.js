const { getAllEndPoints } = require("../controllers/api-controllers");
const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send("All OK from API Router");
});

apiRouter.get("/api", getAllEndPoints);

module.exports = apiRouter;
