const { getCategories } = require("./get-categories-controller");
const { getReview } = require("./get-review-controller");
const { alterVotesCount } = require("./patch-review-controller");
const { getUsers } = require("./get-users-controller");
const { getAllReviews } = require("./get-all-reviews");
const { createComment } = require("./post-comment-controller");
const { getComments } = require("./get-comments-controller");


module.exports = {
  getCategories,
  getReview,
  alterVotesCount,
  getUsers,
  getAllReviews,
  createComment,
  getComments,
};
