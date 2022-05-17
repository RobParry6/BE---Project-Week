const { getCategories } = require("./get-categories-controller");
const { getReview } = require("./get-review-controller");
const { alterVotesCount } = require("./patch-review-controller");

module.exports = { getCategories, getReview, alterVotesCount };
