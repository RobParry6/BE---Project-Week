const express = require("express");
const { getCategories, getReview, alterVotesCount } = require("./controllers");
const {
  invalidEndpoint,
  invalidNumberRequest,
  internalServerError,
  psqlError,
} = require("./controllers/error-handler-controller");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);

app.patch("/api/reviews/:review_id", alterVotesCount);

app.get("/*", invalidEndpoint);
app.use(invalidNumberRequest);
app.use(psqlError);
app.use(internalServerError);

module.exports = app;
