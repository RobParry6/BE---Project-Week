const { fetchCategories } = require("./get-categories-model");
const {
  fetchReview,
  fetchAllReviews,
  changeVotesProperty,
} = require("./review-model");
const { fetchUsers } = require("./get-users-model");
const {
  fetchComments,
  addNewComment,
  removeComment,
} = require("./comments-model");

module.exports = {
  fetchCategories,
  fetchReview,
  changeVotesProperty,
  fetchUsers,
  addNewComment,
  fetchAllReviews,
  removeComment,
  fetchComments,
};
