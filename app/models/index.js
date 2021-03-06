const { fetchCategories } = require("./categories-model");
const {
  fetchReview,
  fetchAllReviews,
  changeVotesProperty,
  createReview,
} = require("./review-model");
const { fetchUsers, fetchUser } = require("./users-model");
const {
  fetchComments,
  addNewComment,
  removeComment,
  updateComment,
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
  fetchUser,
  updateComment,
  createReview,
};
