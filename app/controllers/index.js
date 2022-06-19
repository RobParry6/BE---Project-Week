const { getCategories } = require("./categories-controller");
const { getUsers, getUser } = require("./users-controller");
const {
  getReview,
  getAllReviews,
  alterVotesCount,
  postReview,
} = require("./review-controller");
const {
  getComments,
  createComment,
  deleteComment,
  patchComment,
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
  getUser,
  patchComment,
  postReview,
};
