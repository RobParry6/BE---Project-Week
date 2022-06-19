const reviewRouter = require("express").Router();
const {
  getComments,
  getReview,
  getAllReviews,
  alterVotesCount,
  createComment,
} = require("../controllers");

reviewRouter.get("/:review_id/comments", getComments);
reviewRouter.get("/:review_id", getReview);
reviewRouter.get("/", getAllReviews);

reviewRouter.patch("/:review_id", alterVotesCount);

reviewRouter.post("/:review_id/comments", createComment);

module.exports = reviewRouter;
