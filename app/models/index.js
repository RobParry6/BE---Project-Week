const { fetchCategories } = require("./get-categories-model");
const { fetchReview } = require("./get-review-model");
const { changeVotesProperty } = require("./patch-review-model");
const { fetchUsers } = require("./get-users-model");
const { fetchComments } = require("./get-comments-model");

module.exports = {
  fetchCategories,
  fetchReview,
  changeVotesProperty,
  fetchUsers,
  fetchComments,
};
