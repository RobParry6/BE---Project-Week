const { fetchCategories } = require("./get-categories-model");
const { fetchReview } = require("./get-review-model");
const { changeVotesProperty } = require("./patch-review-model");
const { fetchUsers } = require("./get-users-model");
const { addNewComment } = require("./post-comment-model");
const { fetchAllReviews } = require("./get-all-reviews");
const { removeComment } = require("./delete-comment-controller");

module.exports = {
  fetchCategories,
  fetchReview,
  changeVotesProperty,
  fetchUsers,
  addNewComment,
  fetchAllReviews,
  removeComment,
};
