const { getCategories } = require("./get-categories-controller");
const {
  getReview,
  getAllReviews,
  alterVotesCount,
} = require("./review-controller");
const { getUsers } = require("./get-users-controller");
const {
  getComments,
  createComment,
  deleteComment,
} = require("./get-comments-controller");

module.exports = {
  getCategories,
  getReview,
  alterVotesCount,
  getUsers,
  getAllReviews,
  createComment,
  deleteComment,
  getComments,
};
