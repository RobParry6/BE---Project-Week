const express = require("express");
const {
  getCategories,
  getReview,
  alterVotesCount,
  getUsers,
  getAllReviews,
  createComment,
} = require("./controllers");
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
app.get("/api/reviews", getAllReviews);
app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", alterVotesCount);

app.post("/api/reviews/:review_id/comments", createComment);

app.get("/*", invalidEndpoint);
app.use(invalidNumberRequest);
app.use(psqlError);
app.use(internalServerError);

module.exports = app;
