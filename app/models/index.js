const { fetchCategories } = require("./categories-model");
const {
  fetchReview,
  fetchAllReviews,
  changeVotesProperty,
} = require("./review-model");
const { fetchUsers, fetchUser } = require("./users-model");
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
  fetchUser,
};
