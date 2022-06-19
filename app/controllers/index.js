const { getCategories } = require("./categories-controller");
const { getUsers } = require("./users-controller");
const {
  getReview,
  getAllReviews,
  alterVotesCount,
} = require("./review-controller");
const {
  getComments,
  createComment,
  deleteComment,
} = require("./comments-controller");

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
