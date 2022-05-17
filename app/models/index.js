const { fetchCategories } = require("./get-categories-model");
const { fetchReview } = require("./get-review-model");
const { changeVotesProperty } = require("./patch-review-model");
const { fetchUsers } = require("./get-users-model");

module.exports = {
  fetchCategories,
  fetchReview,
  changeVotesProperty,
  fetchUsers,
};
