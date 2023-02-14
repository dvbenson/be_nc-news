const { getAllEndPoints } = require("../controllers/api-controllers");
const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
  res.status(200).send("All OK from API Router");
});

apiRouter.use("/api", getAllEndPoints);

module.exports = apiRouter;
