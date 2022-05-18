const { fetchReview } = require("../models");

exports.getAllReviews = (request, response, next) => {
  fetchReview().then((reviews) => {
    response.status(200).send({ reviews });
  });
};
