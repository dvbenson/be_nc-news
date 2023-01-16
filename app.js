const { getTopics } = require("./controllers/controller.js");
const express = require("express");
const app = express();
const db = require("./db/connection");

app.use(express.json());

app.get("/api/topics", getTopics);

module.exports = { app };
