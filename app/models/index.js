const { fetchCategories } = require("./fetch-categories-model");
const { fetchReview } = require("./fetch-review-model");
const { changeVotesProperty } = require("./patch-review-model");

module.exports = { fetchCategories, fetchReview, changeVotesProperty };
